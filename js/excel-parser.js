/**
 * excel-parser.js — Rathi Seeds Excel Parser
 *
 * Reads .xlsx files using SheetJS, detects "Final Booking" style sheets,
 * and dynamically extracts both structured party data and the Bill Template.
 */

const ExcelParser = (() => {
  'use strict';

  /* ---- Known sheet-name patterns ---- */
  const SHEET_PATTERNS = [
    { pattern: /final\s*booking/i,    product: 'Unnati & Samrudhi' },
    { pattern: /final\s*booking\s*skb/i, product: 'SKB' },
    { pattern: /soya\s*final/i,       product: 'Soya' },
  ];

  /**
   * Guess if a label represents a Currency/Amount
   */
  function isCurrencyLabel(label) {
    const l = label.toLowerCase();
    return l.includes('rate') || l.includes('amount') || l.includes('total') || 
           l.includes('balance') || l.includes('rs') || l.includes('₹') || l.includes('amt');
  }

  /**
   * Guess if a label represents a Quantity/Bags
   */
  function isQuantityLabel(label) {
    const l = label.toLowerCase();
    return l.includes('bag') || l.includes('qty') || l.includes('quantity') || l.includes('no of');
  }

  /**
   * Parse an uploaded Excel file (ArrayBuffer)
   */
  function parseFile(arrayBuffer, fileName) {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetNames = workbook.SheetNames;

    // Detect the right sheet
    let targetSheet = null;
    let product = 'Unknown';

    for (const sp of SHEET_PATTERNS) {
      const found = sheetNames.find(name => sp.pattern.test(name));
      if (found) {
        targetSheet = found;
        product = sp.product;
        break;
      }
    }

    if (!targetSheet) {
      targetSheet = sheetNames[0];
      product = fileName.replace(/\.xlsx?$/i, '');
    }

    const ws = workbook.Sheets[targetSheet];
    if (!ws['!ref']) throw new Error("Empty sheet");
    
    const range = XLSX.utils.decode_range(ws['!ref']);
    
    // 1. Extract Dynamic Bill Template
    const template = extractDynamicTemplate(ws, range);
    
    // 2. Read Party Data Rows (assuming row 3 onwards, r=2)
    const parties = [];
    
    for (let r = 2; r <= range.e.r; r++) {
      const partyName = getCellValue(ws, r, 2); // Column C
      if (!partyName) continue; // Skip empty rows

      const party = {
        id: parties.length + 1,
        srNo:   getCellValue(ws, r, 0), // Col A
        center: getCellValue(ws, r, 1), // Col B
        name:   partyName,              // Col C
        phone:  getCellValue(ws, r, 3), // Col D
        dynamicData: [],
        dynamicTags: [],
        totalAmt: 0,
        totalBags: 0,
      };

      // Process template for this party
      template.forEach(t => {
        if (t.sourceCol !== null) {
          const val = getCellValue(ws, r, t.sourceCol);
          const isCurr = isCurrencyLabel(t.label);
          const isQty = isQuantityLabel(t.label);
          
          party.dynamicData.push({
            label: t.label,
            value: val,
            isCurrency: isCurr,
            isHeader: t.isHeader
          });

          // Accumulate totals
          if (isCurr && t.label.toLowerCase().includes('total')) {
            party.totalAmt = Number(val) || 0;
          }
          if (isQty && !isCurr && typeof val === 'number') {
            party.totalBags += val;
            
            // Build dynamic tag for UI
            if (party.dynamicTags.length < 2) {
              // Extract a short label (e.g. "Unnati" from "No of bags Unnati Alloted")
              let short = t.label.replace(/no of bags/i, '').replace(/allot.*$/i, '').trim();
              if (short.length > 8) short = short.substring(0, 8);
              party.dynamicTags.push({
                shortLabel: short || 'Bags',
                value: val
              });
            }
          }
        } else if (t.staticVal) {
          party.dynamicData.push({
            label: t.staticVal,
            isStatic: true,
            isHeader: t.isHeader
          });
        }
      });

      parties.push(party);
    }

    return {
      fileName,
      product,
      sheetName: targetSheet,
      parties,
      billTemplate: template, // Save for reference
      uploadedAt: new Date().toISOString(),
    };
  }

  /**
   * Scans the sheet to find the Bill Template by looking for a column 
   * of labels adjacent to a column of cell references (e.g. =$X26).
   */
  function extractDynamicTemplate(ws, range) {
    const maxScanCol = Math.min(range.e.c, 100);
    const maxScanRow = Math.min(range.e.r, 150);
    
    let bestValCol = -1;
    let bestLabelCol = -1;
    let maxFormulas = 0;

    // Scan all columns to find the one with the most simple reference formulas
    for (let c = 5; c <= maxScanCol; c++) {
      let formulaCount = 0;
      for (let r = 0; r <= maxScanRow; r++) {
        const cell = ws[XLSX.utils.encode_cell({r, c})];
        if (cell && cell.f && cell.f.match(/^\$?([A-Z]+)\$?\d+$/)) {
          formulaCount++;
        }
      }
      if (formulaCount > maxFormulas) {
        maxFormulas = formulaCount;
        bestValCol = c;
      }
    }

    // If we couldn't find a dynamic block, fallback to hardcoded
    if (bestValCol === -1) {
      console.warn("Could not dynamically detect Bill Template. Using fallback.");
      return getFallbackTemplate();
    }

    bestLabelCol = bestValCol - 1; // Labels are typically the column to the left

    const rawTemplateLines = [];

    // Extract lines
    let isFirst = true;
    for (let r = 0; r <= maxScanRow; r++) {
      const labelCell = ws[XLSX.utils.encode_cell({r, c: bestLabelCol})];
      const valCell = ws[XLSX.utils.encode_cell({r, c: bestValCol})];
      
      if (!labelCell && !valCell) continue;
      
      const label = labelCell ? String(labelCell.v || '').trim() : '';
      let sourceCol = null;
      let staticVal = null;

      if (valCell && valCell.f) {
        const match = valCell.f.match(/^\$?([A-Z]+)\$?\d+$/);
        if (match) {
          sourceCol = XLSX.utils.decode_col(match[1]); // 0-indexed column integer
        }
      } else if (label && (!valCell || !valCell.v)) {
        staticVal = label;
      }

      if (label || sourceCol !== null || staticVal) {
        rawTemplateLines.push({
          label: label,
          sourceCol: sourceCol,
          staticVal: staticVal,
          isHeader: isFirst
        });
        isFirst = false;
      }
    }

    // Deduplicate: The Excel file copies the template for every row. We only need the first block.
    const uniqueLabels = new Set();
    const templateLines = [];
    
    for (const t of rawTemplateLines) {
      if (t.label) {
        // If we see a label we've already seen, we've hit the next block
        if (uniqueLabels.has(t.label)) break;
        uniqueLabels.add(t.label);
      }
      templateLines.push(t);
    }

    return templateLines;
  }

  function getFallbackTemplate() {
    return [
      { staticVal: 'Rathi Seeds Allotment', isHeader: true },
      { label: 'Unnati Bags', sourceCol: 23 }, // X
      { label: 'Samrudhi Bags', sourceCol: 24 }, // Y
      { label: 'Total Amount', sourceCol: 28 }, // AC
      { label: 'Booking Amount', sourceCol: 22 }, // W
      { label: 'Balance', sourceCol: 32 }, // AG
      { staticVal: 'Rathi Seeds Company, Wardha; HDFC Bank' }
    ];
  }

  function getCellValue(ws, row, col) {
    const addr = XLSX.utils.encode_cell({ r: row, c: col });
    const cell = ws[addr];
    if (!cell) return null;
    return cell.v !== undefined ? cell.v : null;
  }

  function getCenters(parsedData) {
    const centers = new Set();
    parsedData.parties.forEach(p => {
      if (p.center) centers.add(String(p.center).trim());
    });
    return Array.from(centers).filter(Boolean).sort();
  }

  /* ---- Public API ---- */
  return { parseFile, getCenters };
})();
