const fs = require('fs');
const { headMain } = require('./src/headLib.js');

const main = function () {
  try {
    const args = process.argv.slice(2);
    const stream = { stdout: console.log, stderr: console.error };
    process.exitCode = headMain(fs.readFileSync, stream, args);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
};

main();
