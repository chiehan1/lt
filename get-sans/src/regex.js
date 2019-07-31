const om = '\u0f00';
const xHa = '\u0f43\u0f4d\u0f52\u0f57\u0f5c';
const subHa = '\u0fb7';
const inver = '\u0f4a-\u0f4c\u0f4e\u0f65';
const otherSan = '\u0f6a-\u0f6c';
const kaInverSha = '\u0f69';
const sanVowel = '\u0f71\u0f73\u0f75-\u0f79\u0f7b\u0f7d-\u0f81';
const sanSign = '\u0f82-\u0f8f';
const subXHa = '\u0f93\u0f9d\u0fa2\u0fa7\u0fac';
const subInver = '\u0f9a-\u0f9c\u0f9e\u0fb5';
const subR = '\u0fb0';
const subKaInverSha = '\u0fb9';
const otherSanSub = '\u0fb8\u0fba-\u0fbc';

const stackReg = /[\u0f90-\u0f92\u0f94-\u0f99\u0f9f-\u0fa1\u0fa3-\u0fa6\u0fa8-\u0fab\u0fae\u0faf\u0fb3\u0fb4\u0fb6]{2}/;

export const hasStack = (str) => {
  return stackReg.test(str);
};

export const sanReg = new RegExp(`[${om}${xHa}${subHa}${inver}${otherSan}${kaInverSha}${sanVowel}${sanSign}${subXHa}${subInver}${subR}${subKaInverSha}${otherSanSub}]`);

export const hasSan = (str) => {
  return sanReg.test(str) || hasStack.test(str);
};

// Head marks \u0f01-\u0f07
// Marks and signs \u0f08-\u0f0a \u0f0d-\u0f14
// Paired punctuation \u0f3a-\u0f3d
// Marks \u0fd0-\u0fd2
// Head marks \u0fd3 \u0fd4
// Annotation marks \u0fd9 \u0fda
export const tibStopReg = new RegExp(`[ \u0f01-\u0f0a\u0f0d-\u0f14\u0f3a-\u0f3d\u0fd0-\u0fd4\u0fd9\u0fda]+`);

