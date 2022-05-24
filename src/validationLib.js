const isInvalidOption = (option, legalOptions) =>
  !Object.keys(legalOptions).includes(option);

const isInvalidCount = count => count === 0 || isNaN(count);

const validateOption = function (option, legalOptions) {
  if (isInvalidOption(option, legalOptions)) {
    let message = `head: illegal option --  ${option}\n`;
    message += 'usage: head [-n lines | -c bytes] [file ...]';
    throw { message };
  }
};

const validateCount = function (option, count, legalOptions) {
  if (isInvalidCount(count)) {
    throw { message: `head: illegal ${legalOptions[option]} count -- ${count}` };
  }
};

const areOptionsMerged = function (optionValuePairs) {
  const argsPairs = optionValuePairs.toString();
  return /n/.test(argsPairs) && /c/.test(argsPairs);
};

const validateOptionValuePair = function ([option, count], legalOptions) {
  validateOption(option, legalOptions);
  validateCount(option, count, legalOptions);
};

const validateCombinedOptions = function (optionValuePairs) {
  if (areOptionsMerged(optionValuePairs)) {
    throw { message: 'head: can\'t combine line and byte counts' };
  }
};

const validateFilesExist = files => {
  if (files.length === 0) {
    throw { message: 'usage: head [-n lines | -c bytes] [file ...]' };
  }
};

exports.validateOptionValuePair = validateOptionValuePair;
exports.validateCombinedOptions = validateCombinedOptions;
exports.areOptionsMerged = areOptionsMerged;
exports.validateFilesExist = validateFilesExist;
