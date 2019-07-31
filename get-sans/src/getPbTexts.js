export default (volText) => {
  const delim = '~!@#$%';
  const pbTagReg = /<pb id="(.+?)"\/>/;

  let pbTexts = volText.replace(/<pb/g, `${delim}<pb`)
    .split(delim);

  pbTexts.shift();

  pbTexts = pbTexts.map(pbText => {
    const pbId = pbTagReg.exec(pbText)[1];
    pbText = pbText.replace(/<pb.+?>/, '').trim();
    const lns = pbText.split(/\r?\n/);

    return { pbId, pbText, lns };
  });

  return pbTexts;
};

