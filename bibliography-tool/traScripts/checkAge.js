var json = require('../1-50 DT Bibliography.json');

json.divisions.forEach(function(division) {
  division.sutras.forEach(function(sutra) {
    var age = sutra.age;
    let bc = /^\d+? B.C. ~ \d+? B.C.$/.test(age);
    let ad = /^A.D. \d+? ~ \d+$/.test(age);
    let empty = age === '';
    if (! bc && ! ad && ! empty) {
      console.log(sutra.sutraid);
    }
  });
});