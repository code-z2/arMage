import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { EDGE_ID, PORT } from './constants.js';
import {
  edges,
  getClosestEdge,
  getEdges,
  getImage,
  getLocation,
  initialize,
  redirectRequest,
  sockets,
} from './server.js';
import { Edge, IResponse } from './types.js';
import { hash } from './actions.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use((_, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  next();
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

app.get('/edge', async (req, res) => {
  const closestEdge = await getClosestEdge(req.ip);
  res.json(closestEdge);
});

app.get('/edges', (_, res) => {
  res.json(getEdges());
});

app.get('/', async (req, res) => {
  const image = req.query.img;

  if (!image) {
    res.status(404).send('Image not found');
    return;
  }
  // Generate a cache key based on the full URL of the request
  const cacheKey = hash(req.originalUrl);
  // redirect to low latency edge
  redirectRequest(req, res, req.originalUrl);
  // Get image from cache or serve from origin
  const imageBinary = await getImage(req.query, cacheKey);

  res.set('Content-Type', 'image/jpeg');
  res.send(imageBinary);
});

// health route, for checking if the server is up
app.get('/health', (_, res) => {
  res.send('OK');
});

wss.on('connection', (socket, req) => {
  socket.on('message', async (data) => {
    const message = JSON.parse(data.toString()) as { edge: Edge; type: string };

    if (message.type === 'handshake') {
      const _edge: Edge = {
        ...message.edge,
        address: req.socket.remoteAddress,
        port: req.socket.remotePort,
        timestamp: Date.now(),
        location: await getLocation(req.socket.remoteAddress || ''),
      };

      const response: IResponse = {
        type: 'handshake-response',
        edges: getEdges(),
      };

      socket.send(JSON.stringify(response));
      edges.set(_edge.id, _edge);
    }
  });

  socket.on('close', () => {
    for (const [id, socket] of sockets.entries()) {
      if (socket === socket) {
        sockets.delete(id);
        edges.delete(id);
        console.log(`Edge ${id} disconnected`);
        break;
      }
    }
  });
  socket.on('error', (err) => console.error(err));
});

server.listen(PORT, () => {
  initialize();
  console.log(`Express server listening at http://localhost:${PORT}\n`, `Edge websocket Id: ${EDGE_ID}`);
});
