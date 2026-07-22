// A single shared secret key used to encrypt/decrypt.
// NOTE: anyone who reads this file can see this key — see explanation above.
const SECRET_KEY = "kasi2campus-change-this-to-something-long-and-random-123!";

export function encryptPassword(plainText) {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
}

export function decryptPassword(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}