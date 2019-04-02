import fs from 'fs';

let xml = fs.readFileSync('./degetengyur-biography-age.xml', 'utf8');

const props = [
  "sutraid", "repeat", "classification", "vol", "page",
  "tname", "wylie", "aname", "sname", "roman", "cname", "cid",
  "homage", "subject", "topic", "yana", "lineage", "school", "chakra",
  "location", "audience", "author", "requester", "dharma",
  "purpose", "collect", "bampo", "lehu", "sloka",
  "transmission", "relation", "debate",
  "translator", "reviser", "scribe",
  "age"
];

xml.replace(/<sutra>[\s\S]+?<\/sutra>/g, (sutra) => {
  props.forEach((prop) => {
    let regex = new RegExp('<' + prop + '>', 'g');
    let propMatched = sutra.match(regex);
    let num = propMatched ? propMatched.length : 0;
    if (num > 1) {
      console.log(/<sutraid>(.+?)<\/sutraid>/.exec(sutra)[1], prop);
    }
  });
});