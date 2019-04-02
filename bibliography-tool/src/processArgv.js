export function getAction() {
  let actions = process.argv.filter((argv) => {
    return /^-[^-]/.test(argv);
  });

  if (1 === actions.length) {
    return actions[0].slice(1);
  }
  else {
    return '';
  }
}

export function getProps() {
  let props = process.argv.filter((argv) => {
    return /^--/.test(argv);
  });

  if (props.length > 0) {
    return props;
  }
  else {
    throw 'node index.js -renewprop --[props]';
  }
}