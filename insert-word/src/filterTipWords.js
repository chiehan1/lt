const commonWords = [
  'ཀྱི་', 'གི་', 'གྱི་', 'ཡི་',
  'ཀྱིས་', 'གིས་', 'གྱིས་', 'ཡིས་',
  'ཀྱང་', 'ཡང་',
  'སྟེ་', 'ཏེ་', 'དེ་',
  'ཞེ་ན་', 'ཅེ་ན་', 'ཤེ་ན་',
  'ཞེའོ་', 'ཅེའོ་', 'ཤེའོ་',
  'ཀྱིན་', 'གིན་', 'གྱིན་', 'ཡིན་',
  'མ་', 'མི་', 'མིན་', 'མེད་',
  'ང་', 'ང་ཚོ་', 'ང་རང་གཉིས་', 'ཁྱེ་རང་', 'ཁྱེ་རང་ཚོ་', 'ཁོང་', 'ཁོང་ཚོ་', 'མོ་རང་', 'འདི་', 'འདི་ཚོ་', 'དེ་', 'དེ་ཚོ་',
  'ཡིན་', 'མིན་', 'རེད་',
  'ཡོད་', 'མེད་',
  'གཅིག་', 'གཉིས་', 'གསུམ་', 'བཞི་', 'ལྔ་', 'དྲུག་', 'བདུན་', 'བརྒྱད་', 'དགུ་', 'བཅུ་',
  'དང་པོ་', 'གཉིས་པ་', 'གསུམ་པ་'
];

// Head marks \u0f01-\u0f07
// Marks and signs \u0f08-\u0f0a \u0f0b\u0f0c \u0f0d-\u0f14
// Paired punctuation \u0f3a-\u0f3d
// Marks \u0fd0-\u0fd2
// Head marks \u0fd3 \u0fd4
// Annotation marks \u0fd9 \u0fda
const tibDelimRegex = /[ \u0f01-\u0f14\u0f3a-\u0f3d\u0fd0-\u0fd4\u0fd9\u0fda]/g;

export default tipWords => {
  return tipWords.filter(tipWord => {
    if (commonWords.includes(tipWord + '\u0f0b')) {
      return false;
    }

    const letters = tipWord.replace(tibDelimRegex, '')
      .replace(/\s/g, '');

    if (letters.normalize('NFKD').length > 2) {
      return true;
    }

    return false;
  });
};

