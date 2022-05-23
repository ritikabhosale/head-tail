const fs = require('fs');
const { printContent } = require('./src/headLib.js');

const main = function () {
  try {
    printContent(fs.readFileSync, ...process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
  }
};

main();
