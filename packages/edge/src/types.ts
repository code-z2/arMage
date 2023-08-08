export type Edge = {
  id: string;
  address?: string;
  port?: number;
  location?: [number, number]; // [latitude, longitude]
  url: string;
  wsUrl: string;
  timestamp?: number;
};

export type Edges = Map<string, Edge>;

export interface IPINFO {
  ip: string;
  country_code: string;
  region_code: string;
  lat: number;
  lon: number;
}

export type Response = 'handshake' | 'handshake-response';

export interface IResponse {
  type: Response;
  edge?: Edge;
  edges?: Edge[];
}
