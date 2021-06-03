import repl from 'repl';
import ApiHandler from './ApiHandler';
import { isFunction } from '@polkadot/util';
import { red, yellow, cyan } from './colors';

class CLI {
  private _endpoint: string;
  private _handler: ApiHandler;
  private _repl;
  private _api;
  private _methods: string[];

  constructor(handler: ApiHandler, endpoint: string) {
    this._endpoint = endpoint;
    this._handler = handler;
    this._repl = null;
    this._api = null;
    this._methods = [];
  }

  async start() {
    try {
      this._api = await this._handler.getApi();
      console.log(`${this._api.libraryInfo} is loaded`);
      this._retriveMethod();
      this._repl = repl.start({
        prompt: `api-cli (${this._endpoint}) > `,
        eval: this._interpret.bind(this),
        completer: this._completer.bind(this),
      });
      this._repl.context.api = this._api;
      

    } catch (e) {
      console.log(e);
    }
  }

  private async _interpret(cmd, context, filename, callback) {
    try {
      // remove newline token
      cmd = cmd.replace(/\r?\n|\r/g, '');

      const [fn, cmd2, params, err] = this._validateMethod(cmd);

      if (err) {
        callback(null, );
      } else {
        const result = await fn(...params);

        // TODO: config this
        callback(null, result?.toJSON());
        // callback(null, result?.toHuman());
      }
    } catch (e) {
      callback(null, e);
    }
  }

  private _completer(linePartial) {
    const hits = this._methods.filter((m) => {
      return m.startsWith(linePartial);
    })
    return [hits.length? hits: null, linePartial];
  }

  private _retriveMethod() {
    const types = ['rpc', 'consts', 'query', 'tx', 'derive'];
    let modules = Object.getOwnPropertyNames(this._api.query);

    for (let i=0; i < modules.length; i++) {
      const module = modules[i];
      const methods = Object.getOwnPropertyNames(this._api.query[module]);

      for (let j=0; j < methods.length; j++) {
        const method = methods[j];
        this._methods.push(`api.query.${module}.${method}`);
      }

    }

    // modules = Object.keys(this._api.derive);
    // for (let m of modules) {
    //   const methods = Object.keys(this._api.derive[m]);
    //   for (let e of methods) {
    //     this._methods.push(`api.derive.${m}.${e}`);
    //   }
    // }
  }

  private _validateMethod(cmd): [any, string, string[], string] {
    cmd = cmd.trim();
    if (!cmd || !cmd.includes('.')) {
      return [null, null, null, 'You have to call a command, ex: api.query.staking.activeEra'];
    }

    // retrive params
    let data: string[] = cmd.split(' ');
    cmd = data[0];
    let params = [];
    for (let i=1; i < data.length; i++) {
      params.push(data[i]);
    }
    
    const [prefix, type, module, method] = cmd.split('.') as [string, string, string, string];
    
    if (!this._api[type]) {
      console.log(`Cannot find ${prefix}.${yellow(type)} type`);
      return [null, cmd, params, `Cannot find ${prefix}.${type} type`]
    }

    if (!this._api[type][module]) {
      console.log(`Cannot find ${prefix}.${type}.${yellow(module)} module`);
      return [null, cmd, params, `Cannot find ${prefix}.${type}.${module} module`];
    }

    if (!this._api[type][module][method]) {
      console.log(`Cannot find ${prefix}.${type}.${module}.${yellow(method)} method`);
      return [null, cmd, params, `Cannot find ${prefix}.${type}.${module}.${method} method`];
    }
    
    const fn = this._api[type][module][method];

    if (!isFunction(fn)) {
      console.log(`${yellow(cmd)} is not a function`);
      return [null, cmd, params, `${cmd} is not a function`];
    }
    
    if (fn.meta.type.isPlain && params.length !== 0) {
      console.log(`${cmd}${yellow('()')}: require ${red('0')} argument, ${params.length} found`);
      console.log(`${cyan('API summary:')} ${fn.meta.documentation[0].toString()}`);
      return [null, cmd, params, `require 0 argument`];
    }

    if (fn.meta.type.isMap && params.length !== 1) {
      const { key } = fn.meta.type.asMap;
      console.log(`${cmd}(${yellow(key.toString())}): require ${red('1')} argument, ${params.length} found.`);
      console.log(`${cyan('API summary:')} ${fn.meta.documentation[0].toString()}`);
      return [null, cmd, params, `${cmd}(${ red(key) }) : require 1 argument, ${params.length} found.`];
    }
    
    if (fn.meta.type.isDoubleMap && params.length !== 2) {
      const { key1, key2 } = fn.meta.type.asDoubleMap;
      console.log(`${cmd}(${yellow(key1.toString())}, ${yellow(key2.toString())}): require ${red('2')} argument, ${params.length} found.`)
      console.log(`${cyan('API summary:')} ${fn.meta.documentation[0].toString()}`);
      return [null, cmd, params, `${cmd}(${key1}, ${key2}) : require 2 arguments, ${params.length} found.`];
    }

    if (fn.meta.type.isNMap) {
      console.log(`todo: validate this type of method`);
    }

    return [fn, cmd, params, null];
  }
}

export default CLI;