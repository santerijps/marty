import $converter from './library/converter';
import $log       from './library/log';
import $util      from './library/util';

if ($util.yargs.noPositionalArgsProvided()) {
  $log.fatal('No input directory provided!');
}

const srcDirPath = $util.path.toAbsolute($util.yargs.getSrcDir());
const dstDirPath = $util.path.toAbsolute($util.yargs.getDstDir());

if (!$util.path.exists(srcDirPath)) {
  $log.fatal(`Directory doesn't exist: ${srcDirPath}`);
}

$converter.setDstDirPath(dstDirPath);
$converter.convertDir(srcDirPath);
