# @armage/edge

## Getting Started

```sh
# install dependencies

pnpm install

# run edge
 GOSSIP_INTERVAL=60000 BOOTSTRAP='ws://127.0.0.1:<port-a1>' PORT=<port-a2>  ts-node-esm ./src/index.ts  

 # in another terminal
 GOSSIP_INTERVAL=60000 BOOTSTRAP='ws://127.0.0.1:<port-a2>' PORT=<port-a1>  ts-node-esm ./src/index.ts  

# run as many instance as you can
```

## env variables

```sh
IPAPI = ipapi secret key <get from http://api.ipapi.com>
GOSSIP_INTERVAL = time before next peer exchange default is 30mins
BOOTSTRAP = initial edge server to retrieve peers from
PORT = e.g 3001
HOST = e.g 127.0.0.1

```
