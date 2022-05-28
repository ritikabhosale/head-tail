const fs = require('fs');

const createFileNotFoundError = (code, fileName) => {
  const err = { code, fileName, message: };
}

const createFSError = (code, fileName) => {
  switch (code) {
    'ENOENT': return
}
}
const createFsError = function (err, fileName) {
  const error = { errorCode: err.code };

  const toString = function () {
    if (this.errorCode === 'ENOENT') {
      return `head: ${fileName} No such file or directory`;
    }
    return `head: ${fileName} Permissions denied`;
  };

  const type = function () {
    if (this.errorCode === 'ENOENT') {
      return 'NOTFOUND';
    }
    return 'PERMISSIONSDENIED';
  };

  error.toString = toString.bind(error);
  error.type = type.bind(error);
  return error;
};

const content = '';
try {
  content = fs.readFileSync('abc', 'utf8');
} catch (err) {
  const error = createFsError(err, 'abc');
  console.log(error.type);
}
