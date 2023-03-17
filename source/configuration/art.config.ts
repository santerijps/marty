import $art from 'art-template';

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
  extname: '.html',
  ignore: [],
  imports: $art.defaults.imports,
};
