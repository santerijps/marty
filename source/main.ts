import $converter from './library/converter';
import $log       from './library/log';
import $util      from './library/util';

async function main() {

  if ($util.yargs.noPositionalArgsProvided()) {
    $log.fatal('No input directory provided!');
  }

  const srcDirPath = $util.path.toAbsolute($util.yargs.getSrcDir());
  const dstDirPath = $util.path.toAbsolute($util.yargs.getDstDir());
  const componentsDir = $util.yargs.getComponentDir();

  if (!$util.path.exists(srcDirPath)) {
    $log.fatal(`Directory doesn't exist: ${srcDirPath}`);
  }

  await $converter.initialize(srcDirPath, dstDirPath, componentsDir);
  $converter.convertDir(srcDirPath);

}

main();
