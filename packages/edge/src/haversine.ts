import { Edge } from './types.js';

function haversineDistance(coord1: [number, number], coord2: [number, number]) {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

export function findClosest(target: [number, number], candidates: Edge[]) {
  let closestDistance = Infinity;
  let closestCoordinates: Edge[] = [];

  candidates.forEach((candidate) => {
    const distance = haversineDistance(target, candidate.location || [0, 0]);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCoordinates = [candidate];
    } else if (distance === closestDistance) {
      closestCoordinates.push(candidate);
    }
  });

  return closestCoordinates[0];
}
