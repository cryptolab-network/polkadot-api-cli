# polkadot-api-cli

This project provides a developer tool for exploring the [Polkadot JS API](https://polkadot.js.org/docs/) in a much more effortless way.

![demo4](https://user-images.githubusercontent.com/3665658/120153997-f7152700-c221-11eb-99c6-8541cff9d6ad.gif)

> Only support ```api.query.<module>.<method>``` right now. 

## Getting Started

### Install and Run

```sh
$ git clone https://github.com/cryptolab-network/polkadot-api-cli.git
$ cd polkadot-api-cli
$ npm install
$ npm run build && npm run start

api-cli (wss://kusama-rpc.polkadot.io/) >
```

### Explore Polkadot Apis

```sh
## Usage: api <...params>

## ex: api.query.staking.activeEra
api-cli (wss://kusama-rpc.polkadot.io/) > api.query.staking.activeEra
{ index: 2316, start: 1622438874002 }

## ex: api.query.staking.erasTotalStake 2316
api-cli (wss://kusama-rpc.polkadot.io/) > api.query.staking.erasTotalStake 2316
'0x00000000000000004d4ad5e593a16553'
```

### How to migrate to another network?

```sh
## Usage: -w, --ws <endpoint>, choose a wss endpoint to execute this program, ex., wss://kusama-rpc.polkadot.io/
$ node ./dist/index.js -w wss://rpc.polkadot.io/

api-cli (wss://rpc.polkadot.io/) >
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
