export default tipWords => {
  return tipWords
    .map(obj => obj.bo.replace(/\u0f0c/, '\u0f0b').replace(/\u0f0b$/, ''))
    .sort((a, b) => {
      return b.split('\u0f0b').length - a.split('\u0f0b').length;
    });
};

