import { program } from 'commander';
import ApiHandler from './ApiHandler';
import CLI from './CLI';

const main = async (endpoint = 'wss://kusama-rpc.polkadot.io/') => {
  const handler = await ApiHandler.create([endpoint]);
  const cli = new CLI(handler, endpoint);
  await cli.start();
}

program
  .version('0.1.0')
  .option('-w, --ws <endpoint>', 'choose a wss endpoint to execute this program, ex., wss://kusama-rpc.polkadot.io/')
  .parse(process.argv)

main(program.opts().ws);
