import $process from 'process';
import $yargs   from 'yargs/yargs';

export default ($yargs($process.argv.slice(2))
  .scriptName('marty')
  .usage('$0 <path> [options]')
  .positional('path', {
    description: 'Path to project directory',
    type: 'string',
  })
  .option('o', {
    alias: 'out',
    type: 'string',
    default: './out',
    description: 'The output path of the compiled directory',
  })
  .parseSync()
);
