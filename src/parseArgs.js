const isAnOption = str => str.startsWith('-');

const isFollowedByValue = str => str.length > 2;

const isInvalidFlag = (option, flags) => !Object.keys(flags).includes(option);

const isInvalidCount = count => isNaN(count) || count < 1;

const getLastOption = options => {
  const keys = { 'n': 'lineCount', 'c': 'byteCount' };
  if (options.length === 0) {
    return { option: 'lineCount', count: 10 };
  }
  const [option, count] = options[options.length - 1];
  return { option: keys[option], count };
};

const validateFlag = function (flag, options) {
  if (isInvalidFlag(flag, options)) {
    let message = `head: illegal option --  ${flag}\n`;
    message += 'usage: head [-n lines | -c bytes] [file ...]';
    throw { message };
  }
};

const validateCount = function (flag, count, options) {
  if (isInvalidCount(count)) {
    throw { message: `head: illegal ${options[flag]} -- ${count}` };
  }
};

const areOptionsMerged = function (options) {
  const optionsAsString = options.toString();
  return /n/.test(optionsAsString) && /c/.test(optionsAsString);
};

const validateOptions = function (options) {
  const keys = { 'n': 'lineCount', 'c': 'byteCount' };
  for (let index = 0; index < options.length; index++) {
    const [flag, count] = options[index];
    validateFlag(flag, keys);
    validateCount(flag, count, keys);
  }
  if (areOptionsMerged(options)) {
    throw { message: 'head: can\'t combine line and byte counts' };
  }
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
  validateOptions(options);
  const validOptions = getLastOption(options);
  validOptions.files = files;
  return validOptions;
};

exports.parseArgs = parseArgs;
exports.parseOptions = parseOptions;
exports.validateOptions = validateOptions;
exports.areOptionsMerged = areOptionsMerged;
