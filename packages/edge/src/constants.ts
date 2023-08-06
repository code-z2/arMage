import { createHash } from 'crypto';
import { EdgeNode } from './gossip.js';

export const PORT = process.env.PORT || 3000;
export const HOST = process.env.HOST || '127.0.0.1';
export const BOOTSTRAP = process.env.BOOTSTRAP || 'ws://127.0.0.1:3001';
export const GOSSIP_INTERVAL = parseInt(process.env.GOSSIP_INTERVAL || `${60000 * 30}`); // 30 minutes
export const EDGE_ID = '0x' + createHash('sha256').update(`${HOST}:${PORT}`).digest('hex');
export const SELF = (timestamp: number, location: [number, number]): EdgeNode => {
  return {
    id: EDGE_ID,
    location,
    url: `${HOST}:${PORT}`,
    wsUrl: `${HOST}:${PORT}`.startsWith('http') ? `${HOST}:${PORT}`.replace('http', 'ws') : `ws://${HOST}:${PORT}`,
    timestamp,
  };
};
