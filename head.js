const fs = require('fs');
const { headMain } = require('./src/headLib.js');

const main = function () {
  try {
    console.log(headMain(fs.readFileSync, ...process.argv.slice(2)));
  } catch (error) {
    console.error(error.message);
  }
};

main();
