// --------------------------------------------------
//   Class
// --------------------------------------------------

/**
 * CustomError
 * https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
class CustomError extends Error {
  constructor({ level = "error", errorsArr = [] }, ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    // Custom debugging information
    this.level = level;
    this.errorsArr = errorsArr;
  }
}

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = {
  CustomError,
};
