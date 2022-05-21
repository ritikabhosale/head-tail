const isEmpty = object => Object.keys(object).length === 0;

const isAnOption = str => str.startsWith('-');

const isFollowedByValue = str => str.length > 2;

const validateArgs = function (options) {
  const keys = { '-n': 'lineCount', '-c': 'byteCount' };
  let validOptions = {};

  for (let index = 0; index < options.length; index++) {
    validOptions.option = keys[options[index][0]];
    validOptions.value = options[index][1];
  }
  validOptions = isEmpty(validOptions) ? { option: 'lineCount', value: 10 } : validOptions;
  return validOptions;
};

// eslint-disable-next-line max-statements
const optionsAndFiles = function (args) {
  let options = [];
  let option = [];
  let index = 0;
  while (index < args.length && isAnOption(args[index])) {
    if (isFollowedByValue(args[index])) {
      option = [args[index][1], +args[index].slice(2)];
    }
    else {
      option = [args[index], +args[index + 1]];
      index++;
    }
    index++;
    options.push(option);
  }
  const files = args.slice(index);
  return { options, files };
};

const parseArgs = function (args) {
  const { options, files } = optionsAndFiles(args);
  const validatedOptions = validateArgs(options);
  validatedOptions.files = files;
  return validatedOptions;
};

exports.parseArgs = parseArgs;
