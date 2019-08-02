export const arabic = 'ﺕ';
export const arabicRegex = /ﺕ/;
export const arabicRegexGlobal = /ﺕ/;
export const arabicOnlyRegex = /^ﺕ$/m;
export const arabicOnlyRegexGlobal = /^ﺕ$/mg;

export const pbTagsRegex = /^<pb [^>]*?>$/mg;

export const nonTibAraWhitespaceRegex = /[^ﺕ\u0f00-\u0fff\s]/g;

export const shedRegex = /[\u0f0d-\u0f14]/;

export const uncompleteWordRegex = /([\u0f35\u0f37\u0f39\u0f40-\u0fbc]+?)((?:\n|ﺕ)+)(?=[\u0f35\u0f37\u0f39\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0fbc])/g;
export const lineStartTshegRegex = /([\u0f35\u0f37\u0f39\u0f40-\u0fbc]+?)((?:\n|ﺕ)+)(?=[\u0f0b\u0f0c]\u0f0d?)/g;
export const uncompleteWordEndRegex = /([\u0f35\u0f37\u0f39\u0f40-\u0fbc]*?[\u0f41\u0f43-\u0f63\u0f65-\u0f6c](?:[\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f8d-\u0fbc]*?))((?:\n|ﺕ)+)(?=[\u0f35\u0f37\u0f39\u0f40-\u0fbc]+?[\u0f0b-\u0f14]+)/g;

