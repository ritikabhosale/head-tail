const fs = require('fs');
const { tailMain } = require('./src/tailLib.js');

const main = function () {
  try {
    const args = [...process.argv.slice(2)];
    console.log(tailMain(fs.readFileSync, args));
  } catch (error) {
    console.log('usage: tail [-c # | -n #] [file ...]');
  }
};

main();
