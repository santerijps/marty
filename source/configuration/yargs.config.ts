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
    default: './out',
    description: 'The output path of the compiled directory',
  })
  .option('c', {
      alias: 'component-dir',
      default: '+components',
      description: 'Where to look for art-template component/partial files.',
  })
  .parseSync()
);
