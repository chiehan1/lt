import glob from 'glob';
import { resolve as resolvePath, sep } from 'path';
import naturalSort from 'javascript-natural-sort';

export default async dbNames => {
  const globPromises = await Promise.all(dbNames.map(promiseGlob));
  return globPromises.reduce((totalRoutes, curRoutes) => totalRoutes.concat(curRoutes));
};

async function promiseGlob([ dbName, firstVol, lastVol ]) {
  return new Promise((res, rej) => {
    const dir = resolvePath(__dirname, `../../../${dbName}/${dbName}*/${dbName}*.xml`);
    glob(dir, (err, routes) => {
      if (err) {
        rej(err);
        return;
      }

      const volRegex = new RegExp(`${dbName}(\\d+)`);

      routes = routes.filter(route => {
        const routeParts = route.split(sep);
        const volPart = routeParts[routeParts.length - 2];
        const volN = Number(volRegex.exec(volPart)[1]);

        if (firstVol && volN < firstVol) {
          return false;
        }

        if (lastVol && volN > lastVol) {
          return false;
        }

        return true;
      }).sort(naturalSort);

      res(routes);
    });
  });
}

