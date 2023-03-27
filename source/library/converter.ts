import $art       from 'art-template';
import $fs        from 'fs';
import $log       from './log';
import $marked    from 'marked';
import $path      from 'path';
import $util      from './util';
import $yaml      from 'yaml';

import ART_CONFIG     from '../configuration/art.config';
import MARKED_CONFIG  from '../configuration/marked.config';

let srcDirPath: string;
let dstDirPath: string;
let functionsFilePath: string;

export async function initialize(_srcDirPath: string, _dstDirPath: string, componentsDir: string) {

  functionsFilePath = '';
  srcDirPath = _srcDirPath;
  dstDirPath = _dstDirPath;
  ART_CONFIG.root = $path.join(srcDirPath, componentsDir);
  ART_CONFIG.srcDirPath = srcDirPath;
  ART_CONFIG.dstDirPath = dstDirPath;

  const functionsFileJsPath = $path.join(srcDirPath, '+functions.js');

  if ($util.path.exists(functionsFileJsPath)) {
    // TODO: Fix & implement custom +functions.js files
    // const functions = await import(functionsFileJsPath);
    // ART_CONFIG.imports = { ...ART_CONFIG.imports, ...functions };
    functionsFilePath = functionsFileJsPath;
  }

}

export function convertDir(dirPath: string, relativePath: string = './', parentData: object = {}, parentLayout: string = '{{ $child }}') {

  const outputDirPath = $path.join(dstDirPath, relativePath);
  $util.path.writeDir(outputDirPath);
  $log.rejoice('CREATE:', outputDirPath);

  let data = { ...parentData };
  let layout = parentLayout;

  const dirFiles = $util.path.readDir(dirPath);
  const configFilePath = dirFiles.find($util.path.isConfigFile);
  const layoutFilePath = dirFiles.find($util.path.isLayoutFile);
  const layoutResetFilePath = dirFiles.find($util.path.isLayoutResetFile);

  if (configFilePath !== undefined) {
    data = { ...data, ...$yaml.parse($util.path.readFile(configFilePath)) };
    dirFiles.splice(dirFiles.indexOf(configFilePath), 1);
  }

  if (layoutResetFilePath !== undefined) {
    layout = $util.path.readFile(layoutResetFilePath);
    dirFiles.splice(dirFiles.indexOf(layoutResetFilePath), 1);
  }

  if (layoutFilePath !== undefined) {
    layout = wrapWithLayout($util.path.readFile(layoutFilePath), layout);
    dirFiles.splice(dirFiles.indexOf(layoutFilePath), 1);
  }

  if (dirFiles.includes(functionsFilePath)) {
    dirFiles.splice(dirFiles.indexOf(functionsFilePath), 1);
  }

  for (const filePath of dirFiles) {

    if ($path.basename(filePath).startsWith('.') || $path.basename(filePath).startsWith('+')) {
      $log.warn('IGNORE:', filePath);
      continue;
    }

    const stats = $fs.statSync(filePath);

    if (stats.isFile()) {
      if ($util.path.isMarkdownFile(filePath)) {
        const outputFilePath = $path.join(outputDirPath, $util.path.replaceExt($path.basename(filePath), '.html'));
        const content = buildHtmlDocument(filePath, layout, data);
        $util.path.writeFile(outputFilePath, content);
        $log.rejoice('CREATE:', outputFilePath);
      } else {
        const outputFilePath = $path.join(outputDirPath, $path.basename(filePath));
        $fs.copyFileSync(filePath, outputFilePath);
        $log.rejoice('  COPY:', outputFilePath);
      }
    }

    else if (stats.isDirectory()) {
      convertDir(filePath, $path.join(relativePath, $path.basename(filePath)), data, layout);
    }

  }

}

export function buildHtmlDocument(path: string, layout: string, data: object): string {
  const { meta, body } = $util.path.readMarkdownDocument(path);
  const fileName = $path.basename(path);
  const relativePath = $path.dirname(path.replace(srcDirPath, ''));
  data = {
    ...data,
    ...meta,
    $page: {
      name: fileName.replace(/\.md$/, ''),
      title: $util.art.title(fileName.replace(/\.md$/, '')),
      href: './' + $path.join(relativePath, $util.path.replaceExt(fileName, '.html')),
      dirPath: relativePath.split('/').filter(x => x.length > 0),
      dirName: $path.basename(relativePath),
      meta,
    },
  };
  const child = (
    $marked.marked(body, MARKED_CONFIG)
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/&amp;/g, '&')
  );
  const html = wrapWithLayout(child, layout);
  return $art.render(replaceLocalPageLinks(html), data, ART_CONFIG);
}

export function wrapWithLayout(content: string, layout: string): string {
  const regex = /\{\{\s*\$child\s*\}\}/;
  return layout.replace(regex, content);
}

export function replaceLocalPageLinks(s: string) {
  // TODO: Make sure that remote URL's are not converted!
  const regex = /\<a(.*?)\s+href="(.+?)\.md"\s*(.*?)>/gm;
  return s.replace(regex, `<a$1 href="$2.html" $3>`);
}

export default {
  convertDir,
  initialize,
};
