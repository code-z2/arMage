import { Edge } from './types.js';
import { hash } from './actions.js';

export const PORT = parseInt(process.env.PORT || '3000');
export const HOST = process.env.HOST || '127.0.0.1';
export const BOOTSTRAP = process.env.BOOTSTRAP || 'ws://127.0.0.1:3001';
export const GOSSIP_INTERVAL = parseInt(process.env.GOSSIP_INTERVAL || `${60000 * 30}`); // 30 minutes
export const EDGE_ID = hash(`${HOST}:${PORT}`);
export const SELF = {
  id: EDGE_ID,
  url: `${HOST}:${PORT}`.startsWith('http') ? `${HOST}:${PORT}` : `http://${HOST}:${PORT}`,
  wsUrl: `${HOST}:${PORT}`.startsWith('http') ? `${HOST}:${PORT}`.replace('http', 'ws') : `ws://${HOST}:${PORT}`,
};
