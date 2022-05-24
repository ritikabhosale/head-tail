const extractLastLines = (content, count) => {
  const startFrom = content.length - count;
  return content.slice(startFrom);
};

exports.extractLastLines = extractLastLines;
