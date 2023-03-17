import $art       from 'art-template';
import $fs        from 'fs';
import $log       from './log';
import $marked    from 'marked';
import $path      from 'path';
import $util      from './util';
import $yaml      from 'yaml';

import ART_CONFIG     from '../configuration/art.config';
import MARKED_CONFIG  from '../configuration/marked.config';

let dstDirPath: string;

export function setDstDirPath(path: string) {
  dstDirPath = path;
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

  if (configFilePath !== undefined) {
    data = { ...data, ...$yaml.parse($util.path.readFile(configFilePath)) };
    dirFiles.splice(dirFiles.indexOf(configFilePath), 1);
  }

  if (layoutFilePath !== undefined) {
    layout = wrapWithLayout($util.path.readFile(layoutFilePath), layout);
    dirFiles.splice(dirFiles.indexOf(layoutFilePath), 1);
  }

  for (const filePath of dirFiles) {

    if ($path.basename(filePath).startsWith('.')) {
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
  data = { ...data, ...meta };
  const child = $marked.marked(body, MARKED_CONFIG);
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
  setDstDirPath,
};
