const validationLib = require('./validationLib.js');
const { validateOptionValuePair, validateCombinedOptions } = validationLib;

const isOption = str => str.startsWith('-');
const isIntegrated = arg => arg.length > 2;
const splitArg = arg => [arg.slice(0, 2), arg.slice(2)];

const splitArgs = args => {
  let index = 0;
  const flattenArgs = [];

  while (isOption(args[index])) {
    let [option, value] = splitArg(args[index]);

    if (!isIntegrated(args[index])) {
      option = args[index];
      value = args[index + 1];
      index++;
    }
    flattenArgs.push(option, value);
    index++;
  }
  return flattenArgs.concat(args.slice(index));
};

const getLastOption = (options, legalOptions) => {
  if (options.length === 0) {
    return { option: 'line', count: 10 };
  }
  const [option, count] = options[options.length - 1];
  return { option: legalOptions[option], count };
};

const isOptionsPresent = (args, index) => {
  return index < args.length && isOption(args[index]);
};

const parseOptions = function (cmdLineArgs, legalOptions) {
  const args = splitArgs(cmdLineArgs);
  const optionValuePairs = [];

  let index = 0;
  while (isOptionsPresent(args, index)) {
    const [option, value] = [args[index][1], args[index + 1]];
    index = index + 2;

    validateOptionValuePair([option, value], legalOptions);
    optionValuePairs.push([option, +value]);
  }
  validateCombinedOptions(optionValuePairs);
  return { options: optionValuePairs, files: args.slice(index) };
};

const parseArgs = function (args) {
  const legalOptions = { 'n': 'line', 'c': 'byte' };
  const { options, files } = parseOptions(args, legalOptions);
  const { option, count } = getLastOption(options, legalOptions);
  return { option, count, files };
};

exports.parseArgs = parseArgs;
exports.parseOptions = parseOptions;
exports.validateOptionValuePair = validateOptionValuePair;
