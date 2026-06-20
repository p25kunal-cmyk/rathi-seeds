const fs = require('fs');
const XLSX = require('xlsx');
global.XLSX = XLSX;

let code = fs.readFileSync('js/excel-parser.js', 'utf8');
code = code.replace('const ExcelParser', 'global.ExcelParser');
eval(code);

const buffer = fs.readFileSync('/Users/kunaljakhotiya/Downloads/Unnati & Samrudhi 2026.xlsx');
const arrayBuffer = new Uint8Array(buffer).buffer;

const result = global.ExcelParser.parseFile(arrayBuffer, 'Unnati & Samrudhi 2026.xlsx');

console.log("Template Lines:");
console.log(result.billTemplate);

console.log("\nSample Party Data (First 1):");
console.log(JSON.stringify(result.parties.slice(0, 1), null, 2));
