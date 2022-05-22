const isEmpty = object => Object.keys(object).length === 0;

const isAnOption = str => str.startsWith('-');

const isFollowedByValue = str => str.length > 2;

const isInvalidFlag = (option, flags) => !Object.keys(flags).includes(option);

const isInvalidCount = count => isNaN(count) || count < 1;

const areOptionsMerged = function (options) {
  const optionsAsString = options.toString();
  return /n/.test(optionsAsString) && /c/.test(optionsAsString);
};

const validateOptions = function (options) {
  const keys = { 'n': 'lineCount', 'c': 'byteCount' };
  let validOptions = {};

  for (let index = 0; index < options.length; index++) {
    const [flag, count] = options[index];
    if (isInvalidFlag(flag, keys)) {
      throw { message: `head: illegal option --  ${flag}\nusage: head [-n lines | -c bytes] [file ...]` };
    }
    if (isInvalidCount(count)) {
      throw { message: `head: illegal ${keys[flag]} -- ${count}` };
    }
    validOptions.option = keys[flag];
    validOptions.count = count;
  }
  if (areOptionsMerged(options)) {
    throw { message: 'head: can\'t combine line and byte counts' };
  }
  if (isEmpty(validOptions)) {
    validOptions = { option: 'lineCount', count: 10 };
  }
  return validOptions;
};

const parseOptions = function (args) {
  const options = [];
  let index = 0;
  while (index < args.length && isAnOption(args[index])) {
    let option = [args[index][1], +args[index].slice(2)];
    if (!isFollowedByValue(args[index])) {
      option = [args[index][1], +args[index + 1]];
      index++;
    }
    index++;
    options.push(option);
  }
  return { options, files: args.slice(index) };
};

const parseArgs = function (args) {
  const { options, files } = parseOptions(args);
  const validOptions = validateOptions(options);
  validOptions.files = files;
  return validOptions;
};

exports.parseArgs = parseArgs;
exports.parseOptions = parseOptions;
exports.validateOptions = validateOptions;
exports.areOptionsMerged = areOptionsMerged;
