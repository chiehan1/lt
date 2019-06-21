import {readJson, writeFile} from 'fs-extra';
/*
  let tipwords = [
    {bo: 'ཀ་ཀ་'},
    {bo: 'ཁཁ་'},
    {bo: 'རུ་'},
    {bo: 'རེད་'},
    {bo: 'སངས་'},
    {bo: 'ཌ་'}
  ];
*/
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

const sylDelimiterRegex = /[\u0f01-\u0f14\u0f3a-\u0f3d]/g;
const commonTibetanLetterRegex = /[ཀཁགངཅཆཇཉཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤསཧཨ\u0f72\u0f7a\u0f74\u0f7c]/g;
const spaceRegex = /\s/g;

const filterTipword = async () => {
  let tipwords = await readJson('./../../tip-word/tipWords.json', 'utf8');

  tipwords = tipwords.filter(wordObj => {
    const word = wordObj.bo;

    if (commonWords.includes(word)) {
      return false;
    }

    let letters = word.replace(sylDelimiterRegex, '')
      .replace(spaceRegex, '');

    if (letters.normalize('NFKD').length > 2) {
      return true; 
    }

    if (0 === letters.replace(commonTibetanLetterRegex, '').length) {
      return false;
    }

    return true;
  });

  writeFile('./../../tip-word/tipWords.json', JSON.stringify(tipwords, null, ' '), 'utf8');
};

filterTipword();

