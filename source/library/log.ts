import $chalk         from 'chalk';
import $process       from 'process';
import YARGS_CONFIG   from '../configuration/yargs.config';

export function error(...args: any) {
  console.error($chalk.red(...args));
}

export function fatal(...args: any) {
  error(...args);
  $process.exit(1);
}

export function info(...args: any) {
  if (YARGS_CONFIG.v) console.log($chalk.blue(...args));
}

export function warn(...args: any) {
  if (YARGS_CONFIG.v) console.log($chalk.yellow(...args));
}

export function rejoice(...args: any) {
  if (YARGS_CONFIG.v) console.log($chalk.green(...args));
}

export default {
  error,
  fatal,
  info,
  warn,
  rejoice,
};
