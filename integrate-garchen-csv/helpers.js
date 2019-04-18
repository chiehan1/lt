const flatten = (...arrs) => arrs.reduce((a, b) => a.concat(b));

const uniq = arr => [...new Set(arr)];

export const union = (...arrs) => {
  const flattenedArr = flatten(...arrs);
  return uniq(flattenedArr);
};

export const asyncWrap = asyncFn => (...args) => {
  return new Promise((resolve, reject) => {
    asyncFn(...args, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    }); 
  });
};
