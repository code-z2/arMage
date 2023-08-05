import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { default as ip } from 'ip-info-finder';
import Jimp from 'jimp';
import { default as KdTree, default as Point } from 'kdbush';
import { open } from 'lmdb';
import { WebSocketServer } from 'ws';
import { resize } from './actions.js';
import { EDGE_ID, PORT } from './constants.js';
import { EdgeNode, edges, getEdges, initializeEdge } from './gossip.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

interface GEO {
  ip: string;
  lat: number;
  lon: number;
  country: string;
  region: string;
}

const server = createServer(app);
const wss = new WebSocketServer({ server });

export let geo: GEO | null = null;

// Set up LMDB environment and open database
const env = open({ path: './lmdb', mapSize: 2 * 1024 * 1024 * 1024 });
const edgeDB = env.openDB({ name: 'images', cache: true, compression: true });

// Function to build a k-d tree from a set of edge nodes
function buildKdTree() {
  const kd = new KdTree(getEdges().length);
  getEdges().map((node) => kd.add(node.location[0], node.location[1]));
  kd.finish();
  return kd;
}

// Function to find the closest edge node to a user's location using a k-d tree
function findClosestEdgeNode(userLocation: [number, number], tree: Point) {
  const nearest = tree.within(userLocation[0], userLocation[1], 1);
  const nearestIndex = nearest[0];
  return getEdges()[nearestIndex];
}

app.get('/', async (req, res) => {
  const imageUrl = req.query.img;

  if (!imageUrl) {
    res.status(404).send('Image not found');
    return;
  }

  let userLocation: [number, number];

  // Define a function to get the user's location based on their IP address
  async function getUserLocation() {
    ip.getIPInfo(req.ip)
      .then((data) => {
        userLocation = [data.lat, data.lon];
      })
      .catch(() => null);
  }

  // Determine nearest edge
  let closestNode;
  if (req.query.edgeId === EDGE_ID) {
    closestNode = { id: EDGE_ID };
  } else {
    await getUserLocation();
    closestNode = findClosestEdgeNode(userLocation!, buildKdTree());
    if (closestNode.id !== EDGE_ID) {
      res.redirect(`${closestNode.url}?img=${imageUrl}&edgeId=${EDGE_ID}`);
      return;
    }
  }

  // Generate a cache key based on the full URL of the request
  const cacheKey = req.originalUrl;

  // Get image from cache or fetch from origin
  let image;
  edgeDB.transaction(async () => {
    image = edgeDB.getBinary(cacheKey);
    if (!image) {
      const d = { h: req.query.h, w: req.query.w };

      image = await resize(
        imageUrl.toString(),
        d.w ? parseInt(d.w.toString()) : undefined,
        d.h ? parseInt(d.h.toString()) : undefined,
      );

      edgeDB.put(cacheKey, await image.getBufferAsync(Jimp.MIME_PNG));
    }
  });

  // resize image

  res.set('Content-Type', 'image/jpeg');
  res.send(image);
});

app.get('/edges', (req, res) => {
  res.json(getEdges());
});

// Handle incoming connections from other nodes
wss.on('connection', (socket, req) => {
  if (!geo) {
    ip.getIPInfo(req.socket.localAddress)
      .then((data) => {
        geo = {
          ip: data.ipAddress,
          lat: data.lat,
          lon: data.lon,
          country: data.Country,
          region: data.Continent,
        };
      })
      .catch(() => null);
  }
  // Handle incoming gossip data from other nodes
  socket.on('error', (err) => console.error(err));
  socket.on('message', (data) => {
    // Get information about the other edge
    const newData = JSON.parse((data as unknown) as string) as { edge: EdgeNode };
    const newEdge = newData.edge;

    // Update the edge map with the new edge data
    const existingEdge = edges.get(newEdge.id);
    if (!existingEdge || newEdge.timestamp! > existingEdge.timestamp!) {
      edges.set(newEdge.id, newEdge);
    }

    // Send information about all known nodes to other edge
    socket.send(JSON.stringify({ edges: getEdges() }));
  });
});

server.listen(PORT, () => {
  initializeEdge();
  console.log(`Express server listening at http://localhost:${PORT}`);
});
