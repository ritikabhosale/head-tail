const isIntegrated = option => option.length > 2;

const extractValue = args => args.slice(2);

const isOption = args => args.startsWith('-');

const extractFlag = args => args.slice(0, 2);

const isOptionLegal = ({ flag }, arg) => flag === extractFlag(arg);

const parseOption = function (args) {
  const option = args[0];
  if (isIntegrated(option)) {
    return { value: extractValue(option), newArgs: args.slice(1) };
  }
  return { value: args[1], newArgs: args.slice(2) };
};

const parseStandAlone = function (args) {
  const option = args[0];
  const newArgs = [];
  if (isIntegrated(option)) {
    newArgs.push(`-${extractValue(option)}`);
  }
  return { value: false, newArgs: newArgs.concat(args.slice(1)) };
};

const validateCount = function ({ validate }, value) {
  if (validate(value)) {
    throw { message: 'illegal offset' };
  }
};

const validateConflict = function ({ conflictsWith }, { options }) {
  const parsedFlags = options.map(option => option.flag);
  const doesExists = conflictsWith.some(flag => parsedFlags.includes(flag));
  if (doesExists) {
    throw { message: 'usage error' };
  }
};

const headParseConfig = [
  {
    flag: '-n',
    validate: value => isNaN(value),
    parse: parseOption,
    conflictsWith: ['-n', '-c']
  },
  {
    flag: '-c',
    validate: value => isNaN(value),
    parse: parseOption,
    conflictsWith: ['-n', '-c']
  },
  {
    flag: '-q',
    parse: parseStandAlone,
    conflictsWith: []
  },
  {
    flag: '-r',
    parse: parseStandAlone,
    conflictsWith: []
  }
];

const parseArgs = function (args, parseOptions) {
  const parsedArgs = { options: [], files: [] };
  while (isOption(args[0])) {
    const option = parseOptions.find(option => isOptionLegal(option, args[0]));
    if (!option) {
      throw { message: 'illegal option' };
    }
    const { value, newArgs } = option.parse(args);
    if (option.validate) {
      validateCount(option, value);
    }
    validateConflict(option, parsedArgs);
    parsedArgs.options.push({ flag: option.flag, value });
    args = newArgs;
  }
  parsedArgs.files = args;
  return parsedArgs;
};

console.log(parseArgs(['-qrn5', 'abc.txt', '-n5'], headParseConfig));
