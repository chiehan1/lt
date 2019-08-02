import { uncompleteWordRegex, lineStartTshegRegex, uncompleteWordEndRegex } from './constants';

export default oldResultText => {
  return oldResultText.replace(/^ +/mg, '')
    .replace(/ +$/mg, '')
    .replace(uncompleteWordRegex, '$2$1')
    .replace(lineStartTshegRegex, '$2$1')
    .replace(uncompleteWordEndRegex, '$2$1')
    .replace(/^ +/mg, '')
    .replace(/ +$/mg, '')
    .replace(/\n{2,}/g, '');
};

