# polkadot-api-cli

This project provides a developer tool for exploring the [Polkadot JS API](https://polkadot.js.org/docs/) much more effortless.

## Getting Started

1. Install and Run

```sh
$ git clone https://github.com/cryptolab-network/polkadot-api-cli.git
$ cd polkadot-api-cli
$ npm install
$ npm run build && npm run start

api-cli (wss://kusama-rpc.polkadot.io/) >
```

2. Explore Polkadot Apis

Usage: api <...params>

```sh
api-cli (wss://kusama-rpc.polkadot.io/) > api.query.staking.activeEra
```

3. How to migrate to another network?

```sh
$ node ./dist/index.js -w wss://rpc.polkadot.io/

api-cli (wss://rpc.polkadot.io/) >
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
