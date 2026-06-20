const XLSX = require('xlsx');
const wb = XLSX.readFile('/Users/kunaljakhotiya/Downloads/Unnati & Samrudhi 2026.xlsx');
const ws = wb.Sheets['Final Booking'];

console.log("SheetJS Formulas:");
for (let r = 25; r <= 39; r++) {
  const ao = ws['AO' + r];
  const ap = ws['AP' + r];
  console.log(`Row ${r} - AO: ${ao ? ao.v : 'null'} | AP formula: ${ap && ap.f ? ap.f : 'None'} | AP val: ${ap ? ap.v : 'None'}`);
}
