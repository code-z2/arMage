import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { PORT } from './constants.js';
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

const server = createServer(app);
const wss = new WebSocketServer({ server });

app.get('/edge', async (req, res) => {
  // '197.210.85.59'
  const closestEdge = await getClosestEdge(req.ip);
  res.json(closestEdge);
});

app.get('/edges', (req, res) => {
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
  redirectRequest(req, res, image.toString());
  // Get image from cache or serve from origin
  const imageBinary = getImage(req.query, cacheKey);

  res.set('Content-Type', 'image/png');
  res.send(imageBinary);
});

wss.on('connection', (ws, req) => {
  ws.on('message', async (data) => {
    const message = JSON.parse(data.toString()) as { edge: Edge; type: string };

    if (message.type === 'handshake') {
      const _edge: Edge = {
        ...message.edge,
        address: req.socket.remoteAddress,
        port: req.socket.remotePort,
        timestamp: Date.now(),
        location: await getLocation(req.socket.remoteAddress || ''),
      };
      edges.set(_edge.id, _edge);

      const response: IResponse = {
        type: 'handshake-response',
        edges: getEdges(),
      };

      ws.send(JSON.stringify(response));
    }
  });

  ws.on('close', () => {
    for (const [id, socket] of sockets.entries()) {
      if (socket === ws) {
        sockets.delete(id);
        edges.delete(id);
        break;
      }
    }
  });
  ws.on('error', (err) => console.error(err));
});

server.listen(PORT, () => {
  initialize();
  console.log(`Express server listening at http://localhost:${PORT}`);
});
