const isEmpty = object => Object.keys(object).length === 0;

const parseArgs = function (args) {
  const keys = { '-n': 'lineCount', '-c': 'byteCount' };
  let options = {};
  const fileName = args[args.length - 1];

  for (let index = 0; index < args.length - 1; index += 2) {
    const key = keys[args[index]];
    options[key] = +args[index + 1];
  }
  options = isEmpty(options) ? { lineCount: 10 } : options;
  return { fileName, options };
};

exports.parseArgs = parseArgs;
