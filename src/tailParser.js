const isOption = str => str.startsWith('-');
const isIntegrated = arg => arg.length > 2;
const splitArg = arg => [arg.slice(0, 2), arg.slice(2)];

const isOptionsPresent = (args, index) =>
  index < args.length && isOption(args[index]);

const getStandAloneOptions = function (config) {
  const options = config.filter(option => option.takesValue === false);
  return options.map(option => option.flag);
};

const validateFlag = function (option) {
  if (!option) {
    throw { message: 'usage: tail [-r] [-q] [-c # | -n #] [file ...]' };
  }
};

const validateCount = function (option, value) {
  if (option.validate(value)) {
    throw { message: `tail: illegal offset -- ${value}` };
  }
};

const validateConflict = function (option, options) {
  const conflictingOption = option.conflictsWith[0];
  if (options.some((option) => option.option === conflictingOption)) {
    throw { message: 'usage: tail [-r] [-q] [-c # | -n #] [file ...]' };
  }
};

const validateFilesExist = files => {
  if (files.length === 0) {
    throw { message: 'usage: tail [-r] [-q] [-c # | -n #] [file ...]' };
  }
};

const splitArgs = (args, headConfig) => {
  const standAlone = getStandAloneOptions(headConfig);
  let index = 0;
  const flattenArgs = [];

  while (isOption(args[index])) {
    let [option, value] = splitArg(args[index]);

    if (!isIntegrated(args[index])) {
      option = args[index];
      value = '';

      if (!standAlone.includes(args[index])) {
        value = args[index + 1];
        index++;
      }
    }
    flattenArgs.push(option, value);
    index++;
  }
  return flattenArgs.concat(args.slice(index)).filter(arg => arg);
};

const tailOptionsConfig = [
  {
    flag: '-n',
    takesValue: true,
    validate: (arg) => isNaN(arg) || arg === 0,
    parse: (arg) => +arg,
    conflictsWith: ['-c']
  },
  {
    flag: '-c',
    takesValue: true,
    validate: (arg) => isNaN(arg) || arg === 0,
    parse: (arg) => +arg,
    conflictsWith: ['-n']
  },
  {
    flag: '-q',
    takesValue: false
  },
  {
    flag: '-r',
    takesValue: false
  }
];

const parseTailOptions = function (tailOptionsConfig, cmdLineArgs) {
  const args = splitArgs(cmdLineArgs, tailOptionsConfig);
  const options = [];
  let index = 0;

  while (isOptionsPresent(args, index)) {
    const option = tailOptionsConfig.find(arg => arg.flag === args[index]);
    validateFlag(option);
    let value = false;

    if (option.takesValue) {
      validateCount(option, args[++index]);
      value = option.parse(args[index]);
    }
    if (option.conflictsWith) {
      validateConflict(option, options);
    }
    options.push({ option: option.flag, count: value });
    index++;
  }
  return { options, restArgs: args.slice(index) };
};

exports.parseArgs = parseTailOptions.bind(null, tailOptionsConfig);
exports.validateFilesExist = validateFilesExist;
