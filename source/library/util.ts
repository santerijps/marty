import $fs      from 'fs';
import $path    from 'path';
import $process from 'process';
import $yaml    from 'yaml';
import YARGS    from '../configuration/yargs.config';

export namespace path {

  type MarkdownDocument = {
    meta: object;
    body: string;
  };

  export function exists(path: string): boolean {
    return $fs.existsSync(path);
  }

  export function isConfigFile(path: string): boolean {
    return path.match(/\+config\.ya?ml$/) !== null;
  }

  export function isLayoutFile(path: string): boolean {
    return path.match(/\+layout\.html?$/) !== null;
  }

  export function isMarkdownFile(path: string): boolean {
    return path.match(/\w[\w\.]+\.md$/) !== null;
  }

  export function readFile(path: string): string {
    return $fs.readFileSync(path, { encoding: 'utf-8' });
  }

  export function readDir(path: string): string[] {
    const fileNames = $fs.readdirSync(path, { encoding: 'utf-8' })
    return fileNames.map(fileName => $path.join(path, fileName));
  }

  export function writeDir(path: string) {
    if ($fs.existsSync(path)) {
      $fs.rmSync(path, { force: true, recursive: true });
    }
    $fs.mkdirSync(path);
  }

  export function writeFile(path: string, content: string) {
    $fs.writeFileSync(path, content, { encoding: 'utf-8' });
  }

  export function readMarkdownDocument(path: string): MarkdownDocument {
    const fileContent = readFile(path);
    const result = {meta: {}, body: fileContent};
    const m = fileContent.match(/^---(.*?)---/ms);
    if (m !== null && m.index === 0) {
      result.meta = $yaml.parse(m[1]);
      result.body = fileContent.slice(m[0].length);
    }
    return result;
  }

  export function toAbsolute(path: string): string {
    if (!$path.isAbsolute(path)) {
      path = $path.join($process.cwd(), path);
    }
    return path;
  }

  export function replaceExt(path: string, ext: string): string {
    const pos = path.lastIndexOf('.');
    return path.substring(0, pos < 0 ? path.length : pos) + ext;
  }

}

export namespace yargs {

  export function getSrcDir(): string {
    // TODO: Support for multiple project directories?
    return YARGS._[0] as string;
  }

  export function getDstDir(): string {
    return YARGS.o;
  }

  export function getComponentDir(): string {
    return YARGS.c;
  }

  export function noPositionalArgsProvided(): boolean {
    return YARGS._.length === 0;
  }

}

export default {
  path,
  yargs,
};
