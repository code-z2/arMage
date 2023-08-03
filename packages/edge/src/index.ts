import express from 'express';
import Point from 'kdbush';
import KdTree from 'kdbush';
import { open } from 'lmdb';
import fetch from 'node-fetch';

type EdgeNode = {
  id: number;
  location: [number, number];
  url: string;
};

const app = express();
const port = 3000;
const EDGE_ID = 1;

// Example edge nodes data
const edgeNodes: EdgeNode[] = [
  { id: 1, location: [40.712776, -74.005974], url: 'https://edge1.example.com' }, // New York, NY, USA
  { id: 2, location: [34.052235, -118.243683], url: 'https://edge2.example.com' }, // Los Angeles, CA, USA
  { id: 3, location: [51.507351, -0.127758], url: 'https://edge3.example.com' }, // London, UK
];

// Function to build a k-d tree from a set of edge nodes
function buildKdTree(edgeNodes: EdgeNode[]) {
  const kd = new KdTree(edgeNodes.length);
  edgeNodes.map((node) => kd.add(node.location[0], node.location[1]));
  kd.finish();
  return kd;
}

// Function to find the closest edge node to a user's location using a k-d tree
function findClosestEdgeNode(userLocation: [number, number], tree: Point) {
  const nearest = tree.within(userLocation[0], userLocation[1], 1);
  const nearestIndex = nearest[0];
  return edgeNodes[nearestIndex];
}

// Build the k-d tree from the set of edge nodes
const kdTree = buildKdTree(edgeNodes);

// Set up LMDB environment and open database
const env = open({ path: './lmdb', mapSize: 2 * 1024 * 1024 * 1024 });
const dbi = env.openDB({ name: 'images', cache: true, compression: true });

app.get('/', async (req, res) => {
  const imageUrl: string = req.query.url;
  let userLocation: [number, number];

  // Define a function to get the user's location based on their IP address
  async function getUserLocation() {
    const ipAddress = req.ip;
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
    const data = (await response.json()) as { latitude: number; longitude: number };
    userLocation = [data.latitude, data.longitude];
  }

  // Determine nearest edge
  let closestNode;
  if (req.query.edgeId === EDGE_ID) {
    // Nearest edge is self
    closestNode = { id: EDGE_ID };
  } else {
    // Determine user's location
    await getUserLocation();

    closestNode = findClosestEdgeNode(userLocation!, kdTree);

    if (closestNode.id !== EDGE_ID) {
      // Redirect to nearest edge node
      res.redirect(`${closestNode.url}?url=${imageUrl}&edgeId=${EDGE_ID}`);
      return;
    }
  }

  let image;
  dbi.transaction(async () => {
    image = dbi.getBinary(imageUrl);
    if (!image) {
      // Image not in cache
      image = await fetch(imageUrl).then((res) => res.arrayBuffer());
      dbi.put(imageUrl, image);
    }
  });

  // Return image
  res.set('Content-Type', 'image/jpeg');
  res.send(image);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
