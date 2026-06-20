/**
 * bill-generator.js — Rathi Seeds Bill Generator
 *
 * Generates formatted bill text for a party using dynamic data extracted
 * by the ExcelParser.
 */

const BillGenerator = (() => {
  'use strict';

  function formatCurrency(num) {
    if (!num && num !== 0) return '₹0';
    const n = Number(num);
    if (isNaN(n)) return '₹0';

    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);

    const parts = abs.toFixed(2).split('.');
    let intPart = parts[0];
    const decPart = parts[1] === '00' ? '' : '.' + parts[1];

    if (intPart.length > 3) {
      const last3 = intPart.slice(-3);
      const rest = intPart.slice(0, -3);
      intPart = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
    }

    return sign + '₹' + intPart + decPart;
  }

  function formatNumber(num) {
    if (!num && num !== 0) return '0';
    const n = Number(num);
    if (isNaN(n)) return '0';
    return n.toLocaleString('en-IN');
  }

  /**
   * Generate plain text bill (WhatsApp-ready)
   */
  function generateBillText(party) {
    const sep = '━'.repeat(32);
    const sepThin = '─'.repeat(32);
    
    let text = '';
    let hasHeader = false;

    // Header logic (usually the first static item)
    if (party.dynamicData.length > 0 && party.dynamicData[0].isHeader) {
      const headerTitle = party.dynamicData[0].label || party.dynamicData[0].staticVal;
      text += `🌾 *${headerTitle}*\n`;
      text += sep + '\n';
      hasHeader = true;
    } else {
      text += `🌾 *Rathi Seeds Allotment*\n`;
      text += sep + '\n';
    }

    text += `📋 *Party:* ${party.name}\n`;
    if (party.center) text += `📍 *Center:* ${party.center}\n`;
    text += sepThin + '\n\n';

    let footerText = '';

    party.dynamicData.forEach((item, idx) => {
      // Skip the first item if it was used as header
      if (idx === 0 && hasHeader) return;

      if (item.isStatic) {
        // Collect static fields for footer (e.g. Bank details)
        if (item.label) footerText += `🏛️ ${item.label}\n`;
        return;
      }

      if (item.value === null || item.value === '') return; // Skip empty rows

      const isTotal = item.isCurrency && item.label.toLowerCase().includes('total');
      const isBalance = item.isCurrency && item.label.toLowerCase().includes('balance');
      const isBooking = item.isCurrency && item.label.toLowerCase().includes('booking');

      const valStr = item.isCurrency ? formatCurrency(item.value) : formatNumber(item.value) + ' bags';

      if (isTotal) {
        text += sepThin + '\n';
        text += `💰 *${item.label}:* ${valStr}\n`;
        text += sepThin + '\n';
      } else if (isBalance) {
        text += sep + '\n';
        text += `🏦 *${item.label}:*\n`;
        text += `   *${valStr}*\n`;
        text += sep + '\n';
      } else if (isBooking) {
        text += `✅ *${item.label}:* ${valStr}\n`;
      } else {
        text += `  ${item.label}: ${valStr}\n`;
      }
    });

    if (footerText) {
      text += '\n' + footerText;
    }
    
    text += '\n— *Rathi Seeds* 🌱';

    return text;
  }

  /**
   * Generate HTML bill card
   */
  function generateBillHTML(party) {
    let hasHeader = false;
    let headerTitle = party.name;
    
    if (party.dynamicData.length > 0 && party.dynamicData[0].isHeader) {
      headerTitle = party.dynamicData[0].label || party.dynamicData[0].staticVal;
      hasHeader = true;
    }

    let linesHTML = '';
    let footerHTML = '';

    party.dynamicData.forEach((item, idx) => {
      if (idx === 0 && hasHeader) return;

      if (item.isStatic) {
        if (item.label) {
          const text = item.label.includes(';') ? 
                       item.label.replace(';', '<br>') : item.label;
          footerHTML += `<div>${text}</div>`;
        }
        return;
      }

      if (item.value === null || item.value === '') return;

      const isTotal = item.isCurrency && item.label.toLowerCase().includes('total');
      const isBalance = item.isCurrency && item.label.toLowerCase().includes('balance');
      const isBooking = item.isCurrency && item.label.toLowerCase().includes('booking');

      const valStr = item.isCurrency ? formatCurrency(item.value) : formatNumber(item.value) + (item.isCurrency ? '' : ' bags');

      let cls = 'bill-line';
      if (isTotal)     cls += ' bill-line--total';
      if (isBooking)   cls += ' bill-line--highlight';
      if (isBalance)   cls += ' bill-line--balance';

      linesHTML += `
        <div class="${cls}">
          <span class="bill-line__label">${item.label}</span>
          <span class="bill-line__value">${valStr}</span>
        </div>`;
    });

    if (!footerHTML) {
      footerHTML = `<strong>🏛️ Rathi Seeds</strong>`;
    }

    return `
      <div class="bill-container" data-party-id="${party.id}">
        <div class="bill-header">
          <div>
            <div class="bill-header__party">${party.name}</div>
            ${party.center ? `<div class="text-dim" style="font-size:.75rem;margin-top:2px">📍 ${party.center}</div>` : ''}
          </div>
          <span class="bill-header__badge">Bill</span>
        </div>
        <div class="bill-body">
          ${linesHTML}
        </div>
        <div class="bill-footer">
          ${footerHTML}
        </div>
        <div class="bill-actions">
          <button class="btn btn--outline btn--sm" onclick="App.downloadBillPDF(${party.id})">
            📄 Download PDF
          </button>
          <button class="btn btn--primary btn--sm" onclick="App.shareBillWhatsApp(${party.id})">
            💬 Share PDF
          </button>
        </div>
      </div>`;
  }

  /* ---- Public API ---- */
  return {
    generateBillText,
    generateBillHTML,
    formatCurrency,
    formatNumber,
  };
})();
