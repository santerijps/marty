import $art from 'art-template';

namespace imports {

  export function lower(x: string) {
    return x.toLowerCase();
  }

  export function upper(x: string) {
    return x.toUpperCase();
  }

  // TODO: Add more import functions!
  // TODO: Make it possible for the user to define their own functions!

}

export default {
  filename: null,
  rules: $art.defaults.rules,
  escape: true,
  debug: $art.defaults.debug,
  bail: true,
  cache: true,
  minimize: true,
  compileDebug: false,
  resolveFilename: $art.defaults.resolveFilename,
  include: $art.defaults.include,
  htmlMinifier: $art.defaults.htmlMinifier,
  htmlMinifierOptions: $art.defaults.htmlMinifierOptions,
  onerror: $art.defaults.onerror,
  loader: $art.defaults.loader,
  caches: $art.defaults.caches,
  root: '/',
  extname: '.md',
  ignore: [],
  imports: {
    ...$art.defaults.imports,
    ...imports,
  },
};
