import CryptoJS from "crypto-js";
import numeral from "numeral";
const crypto = require('crypto');



export const formatAmountWithCommas = (amount) => {
  return numeral(amount).format('0,0');
}





// generate request id
export const generateRequestId = () => {
  /*  const apiHeader = generateHeader(); */
  const newId = (
    Date.now().toString(36).substr(2, 9) +
    Math.random().toString(36).substr(2, 10)
  ).toUpperCase();
  return newId;
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* Search Filter logic */

function matchesAnyPropValue(obj, search) {
  return Object.values(obj).some(value =>
      Array.isArray(value)
      ? value.some(v => matchesAnyPropValue(v, search))
      : String(value).toLocaleLowerCase().includes(search)
  );
}

function applySearch(arr, filters) {
  const search = filters.toLocaleLowerCase();
  return arr.filter(entry => matchesAnyPropValue(entry, search));
}


export const filterHelper = (data, value) => {
  if (value === '' || !data) return data
  return applySearch(data, value)
}

/* Search Filter logic */


/* AES ECB MODE ALGORITHM */


export function encryptEcb(plainText, key) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.AES.encrypt(plainText, keyUtf8, {
    mode: CryptoJS.mode.ECB,
  });

  return encrypted.toString();
}



export function decryptEcb(cipherText, key) {
  const keyUtf8 = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(cipherText, keyUtf8, {
    mode: CryptoJS.mode.ECB,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
