export const foColumns = {
  '佛學辭典': [ 'source-entry-bo' ],
  '翻譯名集': [ 'source-entry-bo', 'target-entry-bo' ]
};

export const targetKdbs = [ // kdbName, 非佛教術語前幾個百分比的權重 等於 佛教術語前幾個百分比
  [ 'jiangkangyur', 10, 90 ],
  [ 'degekangyur', 10, 90],
  [ 'degetengyur', 10, 90 ],
  [ 'gampopa', 10, 90 ],
  [ '8thkarmapa', 10, 90 ],
  [ 'mipam', 10, 90 ],
  [ 'gorampa', 10, 90 ],
  [ 'tsongkhapa', 10, 90 ],
  [ 'taranatha', 10, 90 ],
  [ 'bonpokangyur', 10, 90 ]
].filter((item, index) => {
  return true;
});

