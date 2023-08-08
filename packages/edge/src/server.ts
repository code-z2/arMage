import axios from 'axios';
import Jimp from 'jimp';
import { asBinary, open } from 'lmdb';
import WebSocket from 'ws';
import { blur, crop, greyscale, opacity, resize, rotate } from './actions.js';
import { BOOTSTRAP, EDGE_ID, GOSSIP_INTERVAL, SELF } from './constants.js';
import { findClosest } from './haversine.js';
import { Edge, Edges, IResponse } from './types.js';

export const edges: Edges = new Map();
export const sockets = new Map<string, WebSocket>();

// Set up LMDB environment and open database
const env = open({ path: './lmdb', mapSize: 2 * 1024 * 1024 * 1024 });
const edgeDB = env.openDB({ name: 'images', cache: true, compression: true });

// function to get the user's location based on their IP address
export const getLocation = async (ipAddress: string) =>
  await fetch(`http://api.ipapi.com/api/${ipAddress}?access_key=${process.env.IPAPI}&fields=latitude,longitude`)
    .then((res) => res.json())
    .then<[number, number]>((data) => [data.latitude, data.longitude])
    .catch<[number, number]>(() => [0, 0]);

// returns the closest edge node to a specified ip address
export const getClosestEdge = async (ipAddress: string) => {
  const userLocation = await getLocation(ipAddress);
  return findClosest(userLocation, getEdges());
};

// get peers active in the last epoch
export function getEdges(epoch = GOSSIP_INTERVAL * 2): Edge[] {
  return Array.from(edges.values()).filter((edge) => edge.timestamp! > Date.now() - epoch - 1000);
}

// purge peers inactive for more than 3 epochs
export function purge(epoch = GOSSIP_INTERVAL * 3): void {
  for (const [id, edge] of edges) {
    if (edge.timestamp! <= Date.now() - epoch) {
      edges.delete(id);
      sockets.get(id)?.close();
      sockets.delete(id);
    }
  }
}

// redirect request to the closest edge node
export const redirectRequest = async (req: any, res: any, url: string) => {
  if (req.query.edgeId !== EDGE_ID) {
    const closestEdge = await getClosestEdge(req.ip);
    if (closestEdge && closestEdge.id !== EDGE_ID) {
      res.redirect(`${closestEdge.url}${url}&edgeId=${closestEdge.id}`);
      return;
    }
  }
};

const fetchArweaveImage = async (transactionId) => {
  const response = await axios.get(`https://arweave.net/${transactionId}`, {
    responseType: 'arraybuffer',
  });
  return response.data;
};

// parses the image back to the user, an caches it
export const getImage = async (query, key: string) => {
  let image;
  await edgeDB.transaction(async () => {
    image = edgeDB.getBinary(key);
    if (!image) {
      try {
        const binary = await fetchArweaveImage(query.img);
        let modifiedImage: Jimp = await Jimp.read(binary);

        if (query.resize) {
          const [width, height] = query.resize.split(',');
          modifiedImage = await resize(modifiedImage, parseInt(width), parseInt(height));
        } else if (query.blur) {
          modifiedImage = await blur(modifiedImage, parseInt(query.blur));
        } else if (query.greyscale) {
          modifiedImage = await greyscale(modifiedImage);
        } else if (query.opacity) {
          modifiedImage = await opacity(modifiedImage, parseInt(query.opacity));
        } else if (query.rotate) {
          modifiedImage = await rotate(modifiedImage, parseInt(query.rotate));
        } else if (query.crop)
          modifiedImage = await crop(
            modifiedImage,
            parseInt(query.x),
            parseInt(query.y),
            parseInt(query.w),
            parseInt(query.h),
          );

        modifiedImage.quality(50);

        modifiedImage.getBuffer(modifiedImage.getMIME(), (_, buffer) => {
          image = buffer;
          edgeDB.put(key, asBinary(buffer));
        });
      } catch (error) {
        image = undefined;
      }
    }
  });
  return image;
};

// creates a new websocket connection with an external edge
const connect = async (edge: Edge, message: IResponse) => {
  const socket = sockets.get(edge.id);
  if (socket) {
    socket.send(JSON.stringify(message));
    return;
  }
  const newSocket = new WebSocket(edge.wsUrl);
  sockets.set(edge.id, newSocket);

  newSocket.on('message', (data) => {
    const response: IResponse = JSON.parse(data.toString());

    if (response.type === 'handshake-response') {
      response.edges?.forEach((edge: Edge) => {
        if (edge.id !== EDGE_ID) edges.set(edge.id, edge);
      });
    }
  });
  newSocket.on('error', (err) => {
    console.error('socket client error', err);
  });
  newSocket.on('open', () => {
    newSocket.send(JSON.stringify(message));
  });
};

// checks if the specified bootstrap node is active
export const checkBootstrap = async () => {
  try {
    const response = await fetch(`${BOOTSTRAP.replace('ws', 'http')}/health`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// bootstrap edge from an existing known node
const bootstrap = async () => {
  if (await checkBootstrap()) {
    const bsWS = new WebSocket(BOOTSTRAP);

    bsWS.on('open', async () => {
      const message: IResponse = {
        type: 'handshake',
        edge: SELF,
      };

      bsWS.send(JSON.stringify(message));
    });

    bsWS.on('message', (data) => {
      const response: IResponse = JSON.parse(data.toString());

      if (response.type === 'handshake-response') {
        response.edges?.forEach((edge: Edge) => {
          edges.set(edge.id, edge);
        });
        bsWS.close();
      }
    });
  } else {
    console.log('Skipping Bootstrap');
  }
};

export function initialize() {
  bootstrap().then(() =>
    setInterval(async () => {
      const _edges = await getEdges();
      console.log('active peers', _edges.length);
      for (const edge of _edges) {
        const message: IResponse = {
          type: 'handshake',
          edge: SELF,
        };
        await connect(edge, message);
      }
      purge();
    }, GOSSIP_INTERVAL),
  );
}
