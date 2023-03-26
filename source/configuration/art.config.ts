import $art     from 'art-template';
import $fs      from 'fs';
import $path    from 'path';
import $util    from '../library/util';

const config = {
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
  imports: { ...$art.defaults.imports, $: { ...$util.art, ...$() } },
  srcDirPath: '',
  dstDirPath: '',
};

/**
 * Built-in functions for art-template engine.
 */
function $(): object {
  return {

    glob(path: string): object[] {
      return $fs
        .readdirSync($path.join(config.srcDirPath, path), { encoding: 'utf8' })
        .map(fileName => ({
          name: fileName.replace(/\.md$/, ''),
          ext: $path.extname(fileName),
          title: $util.art.title(fileName.replace(/\.md$/, '')),
          href: './' + $path.join(path, $path.extname(fileName) === '.md' ? $util.path.replaceExt(fileName, ".html") : fileName),
          dirPath: path.split('/').filter(x => x.length > 0),
          dirName: $path.basename(path),
        }));
    },

    pages(path: string): object[] {
      return $fs
        .readdirSync($path.join(config.srcDirPath, path),{ encoding: 'utf8' })
        .filter($util.path.isMarkdownFile)
        .map(fileName => ({
          name: fileName.replace(/\.md$/, ''),
          title: $util.art.title(fileName.replace(/\.md$/, '')),
          href: './' + $path.join(path, $util.path.replaceExt(fileName, ".html")),
          dirPath: path.split('/').filter(x => x.length > 0),
          dirName: $path.basename(path),
          meta: $util.path.readMarkdownMeta($path.join(config.srcDirPath, path, fileName)),
        }));
    },

  };
};

export default config;
