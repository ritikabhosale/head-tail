const head = function (content, countOfLines) {
  const lines = content.split('\n');
  return lines[0];
};

exports.head = head;
