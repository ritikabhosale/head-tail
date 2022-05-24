const startFrom = (char, count) => char.length - count;

const extractLastBytes = (text, count) => text.slice(startFrom(text, count));
const extractLastLines = (lines, count) => lines.slice(startFrom(lines, count));

exports.extractLastLines = extractLastLines;
exports.extractLastBytes = extractLastBytes;
