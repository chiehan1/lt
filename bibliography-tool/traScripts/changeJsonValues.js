const divisionPropContrasts = {
/*
  'འདུལ་བ། Vinaya 律部': 'འདུལ་བ། Vinaya 律部',
  'ཤེར་ཕྱིན། འབུམ། Śatasāhasrikāprajñāpāramitā 大般若經': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེར་ཕྱིན། ཉི་ཁྲི། Pañcaviṃśatisāhasrikāprajñāpāramitā 第二般若兩萬五千頌': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེར་ཕྱིན། ཁྲི་བརྒྱད་སྟོང་པ། Aṣṭādaśasāhasrikāprajñāpāramitā 第二大般若經(八萬頌)': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེར་ཕྱིན། ཁྲི་པ། Daśasāhasrikāprajñāpāramitā 第四般若經萬頌一部': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེར་ཕྱིན། བརྒྱད་སྟོང་པ། Aṣṭasāhasrikāprajñāpāramitā 第五般若經八千頌一部': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེར་ཕྱིན། ཤེས་རབ་སྣ་ཚོགས། Prajñāpāramitā 諸般若經部': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'མདོ་སྡེ། Sūtram 經部': 'མདོ་སྡེ། Sūtra 經部',
  'ཕལ་པོ་ཆེ། Buddhāvataṃsaka 華嚴部': 'ཕལ་ཆེན། Mahā-vaipulya-buddhâvataṃsaka 華嚴部',
  'དཀོན་བརྩེགས། Ratnakūṭa 寶積部': 'དཀོན་བརྩེགས། Mahā ratnakūṭa 寶積部',
  'རྒྱུད་འབུམ། Tantra 密續部': 'རྒྱུད་འབུམ། Tantra 十萬怛特羅部',
  'དྲི་མེད་འོད། Vimalaprabhā 時輪經疏': 'དུས་འཁོར་འགྲེལ་པ། Vimalaprabhā 時輪經疏'
*/
  'འདུལ་བ། Vinaya 律部': 'འདུལ་བ། Vinaya 律部',
  'ཤེས་ཕྱིན། འབུམ། Prajnaparamita 十萬頌般若': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེས་ཕྱིན། ཉི་ཁྲི། Pañcaviṃśatisāhasrikāprajñāpāramitā 二萬頌般若': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེས་ཕྱིན། ཁྲི་བརྒྱད་སྟོང་པ། Aṣṭādaśasāhasrikāprajñāpāramitā 一萬八千頌般若': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེས་ཕྱིན། ཁྲི་པ། Daśasāhasrikāprajñāpāramitā 一萬頌般若': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེས་ཕྱིན། བརྒྱད་སྟོང་པ། Aṣṭasāhasrikāprajñāpāramitā 八千頌般若': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཤེས་ཕྱིན། ཤེས་རབ་སྣ་ཚོགས། Prajñāpāramitā 撮要頌般若': 'ཤེར་ཕྱིན། Prajñā 般若部',
  'ཕལ་་ཆེན། Buddhāvataṃsaka 華嚴部': 'ཕལ་ཆེན། Mahā-vaipulya-buddhâvataṃsaka 華嚴部',
  'དཀོན་བརྩེགས། Ratnakūṭa 寶積部': 'དཀོན་བརྩེགས། Mahā ratnakūṭa 寶積部',
  'མདོ་སྡེ། Sūtra 經部': 'མདོ་སྡེ། Sūtra 經部',
  'རྒྱུད་འབུམ། Tantra 密部': 'རྒྱུད་འབུམ། Tantra 十萬怛特羅部',
  'རྙིང་རྒྱུད། Nyingma Tantra 寧瑪密部': 'རྙིང་རྒྱུད། Nyingma Tantra 古怛特羅部',
  'དྲི་མེད་འོད། Vimalaprabhā 時輪經疏': 'དུས་འཁོར་འགྲེལ་པ། Vimalaprabhā 時輪經疏',
  'གཟུངས་འདུས། dharaṇīs 陀羅尼經': 'གཟུངས་འདུས། dharaṇīs 陀羅尼集'
}

import fs from 'fs';

let json = require('../srcJson/dbcid.json');
let partialJson = require('../resultJson/dbp.json');
changeJsonValues(json);

function changeJsonValues(json) {
  json.divisions.forEach((division) => {
    let divisionName = division.divisionName;
    division.sutras.forEach((sutra) => {
      sutra.topic = divisionPropContrasts[divisionName];
    });
  });

  json.divisions.forEach((division) => {
    division.sutras.forEach((sutra) => {
      sutra.age = '500 B.C. ~ 1 B.C.';
    });
  });

  json.divisions.forEach((division) => {
    division.sutras.forEach((sutra) => {
      let sutraid = sutra.sutraid;
      let partialSutra = partialJson[sutraid];
      sutra.repeat = partialSutra.repeat;
//      sutra.subject = partialSutra.subject;  
//      sutra.yana = partialSutra.yana;
//      sutra.chakra = partialSutra.chakra;
    });
  });

  fs.writeFileSync('./resultJson.json', JSON.stringify(json, '', '  '), 'utf8');
}