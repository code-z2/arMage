'use client';
import Header from './components/Header';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
  url: 'https://arweave.net/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <Header />
      <Provider value={client}>{children}</Provider>
    </div>
  );
}
