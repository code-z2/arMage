import WebSocket from 'ws';
import { BOOTSTRAP, EDGE_ID, GOSSIP_INTERVAL, SELF } from './constants.js';
import { geo } from './index.js';

export type EdgeNode = {
  id: string;
  location: [number, number];
  url: string; // host:port
  wsUrl: string; // ws://host:port
  timestamp: number;
};

export type EdgeNodes = Map<string, EdgeNode>;

export const edges: EdgeNodes = new Map();
const sockets = new Map<string, WebSocket>();

async function updateEdges() {
  edges.set('BOOTSTRAP', {
    id: 'BOOTSTRAP', // initial edge is known as the bootstrap node
    location: [0, 0],
    url: BOOTSTRAP,
    wsUrl: BOOTSTRAP.replace('http', 'ws'),
    timestamp: Date.now(),
  });
  console.log(`Added bootstrap node ${BOOTSTRAP}`, edges.get('BOOTSTRAP'));
}

// get peers active in the last epoch
// 1 epoch == 30minutes default.
// if the epoch is higher than default interval * 2
// you will be out of sync with other nodes.
export function getEdges(epoch = GOSSIP_INTERVAL * 2): EdgeNode[] {
  return Array.from(edges.values()).filter((edge) => edge.timestamp > Date.now() - epoch - 1000);
}

// purge peers inactive for more than 3 epochs
export function purgeEdges(epoch = GOSSIP_INTERVAL * 3): void {
  for (const [id, edge] of edges) {
    if (edge.timestamp! <= Date.now() - epoch) {
      edges.delete(id);
      purgeSocket(id);
    }
  }
}

// Purge the socket associated with an edge
export function purgeSocket(id: string): void {
  const socket = sockets.get(id);
  if (socket) {
    socket.close();
    sockets.delete(id);
    console.log(`Purged socket for ${id}`);
  }
}

// create  a new socket connection to the edge if not existing
function createSocketConnection(edge: EdgeNode) {
  const socket = sockets.get(edge.id);
  if (socket) {
    socket.send(JSON.stringify({ edge: SELF(Date.now(), geo !== null ? [geo.lat, geo.lon] : [0, 0]) }));
    return;
  }
  const newSocket = new WebSocket(edge.wsUrl);
  sockets.set(edge.id, newSocket);
  newSocket.on('open', () => {
    console.log(`connected to ${edge.wsUrl}`, 'with socket url of', newSocket.url);
    newSocket.send(JSON.stringify({ edge: SELF(Date.now(), geo !== null ? [geo.lat, geo.lon] : [0, 0]) }));
  });
  // Handle incoming data from the other edge
  newSocket.on('message', (data) => {
    const newData = JSON.parse((data as unknown) as string) as { edges: EdgeNode[] };
    const newEdges = newData.edges;

    for (const newEdge of newEdges) {
      if (newEdge.id === EDGE_ID) continue;
      const existingEdge = edges.get(newEdge.id);
      if (!existingEdge || newEdge.timestamp! > existingEdge.timestamp!) {
        edges.set(newEdge.id, newEdge);
      }
    }
    purgeSocket('BOOTSTRAP');
  });

  // Handle socket errors gracefully
  newSocket.on('error', (err) => {
    console.error('socket client error', err);
  });
}

export function initializeEdge(): void {
  updateEdges().then(() =>
    // Set up periodic gossiping
    setInterval(async () => {
      const activeEdges = getEdges();
      console.log(`Active edges: ${activeEdges.length}`);

      // Exchange information with other edges
      for (const edge of activeEdges) {
        try {
          createSocketConnection(edge);
        } catch (error) {
          console.error(error);
        }
      }

      // Purge inactive edges
      purgeEdges();
    }, GOSSIP_INTERVAL),
  );
  console.log('Initialized edge', EDGE_ID);
}
