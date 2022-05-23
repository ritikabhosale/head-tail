const fs = require('fs');
const { printContent } = require('./src/headLib.js');

const main = function () {
  try {
    const args = [...process.argv.slice(2)];
    printContent(fs.readFileSync, console.log, console.error, args);
  } catch (error) {
    console.error(error.message);
  }
};

main();
