// --------------------------------------------------
//   Import
// --------------------------------------------------

/**
 * _id
 * @param {string} value - ロケール
 */
const validationLocale = (value) => {
  // ---------------------------------------------
  //   Config
  // ---------------------------------------------

  const minLength = 2;
  const maxLength = 5;

  // ---------------------------------------------
  //   Result Object
  // ---------------------------------------------

  const slicedValue = value ? value.slice(0, maxLength) : "";
  const numberOfCharacters = slicedValue ? slicedValue.length : 0;

  let resultObj = {
    value: slicedValue,
    numberOfCharacters,
    error: false,
    errorMessageArr: [],
  };

  // ---------------------------------------------
  //   Validation
  // ---------------------------------------------

  if (slicedValue === "") {
    resultObj.error = true;
  }

  if (slicedValue.match(/^[a-zA-Z\-]+$/) === null) {
    resultObj.error = true;
  }

  if (numberOfCharacters < minLength || numberOfCharacters > maxLength) {
    resultObj.error = true;
  }

  return resultObj;
};

// --------------------------------------------------
//   Export
// --------------------------------------------------

module.exports = validationLocale;
