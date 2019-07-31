import getXmlTexts from './getXmlTexts';

export default async (volPath) => {
  const xmls = await getXmlTexts(volPath);

  const volText = xmls.reduce((volText, xml) => {
    const cleanXml = xml.replace(/<(?!pb)[^>]+?>/g, '').trim();
    return volText + '\n' + cleanXml;
  }, '');

  return volText.replace(/\u0f0c/g, '\u0f0b');
};

