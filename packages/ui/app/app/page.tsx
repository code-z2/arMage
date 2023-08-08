'use client';
import { useMageStore, useStore } from '@ui/store';
import { useEffect, useState } from 'react';
import Licensed from './components/Galleries/Licensed';
import Overview from './components/Galleries/Overview';
import SubLicenced from './components/Galleries/SubLicenced';
import Transactions from './components/Galleries/Transactions';
import Upload from './components/Galleries/Upload';
import Disconnected from './components/Skeletons/Disconnected';
import axios from 'axios';
import Gallery from './components/Skeletons/Gallery';
import Table from './components/Skeletons/Table';
import query from '@ui/utils/query';
import { useQuery } from 'urql';
import Empty from './components/Skeletons/Empty';

export default function App() {
  const store = useStore(useMageStore, (state) => state);
  const [address, setAddress] = useState('');
  const [result, reexecuteQuery] = useQuery({
    query: query('M6w588ZkR8SVFdPkNXdBy4sqbMN0Y3F8ZJUWm2WCm8M'),
  });
  const { data, fetching, error } = result;

  const setNearestEdge = () => {
    axios
      .get(process.env.EDGE_URL || '')
      .then((res) => store?.setEdge(res.data.url))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    addEventListener('arweaveWalletLoaded', async () => {
      console.log(`You are using the ${window.arweaveWallet.walletName} wallet.`);
      const permissions = await window.arweaveWallet.getPermissions();
      if (permissions.length > 0) {
        store?.setConnected(true);
        const address = await window.arweaveWallet.getActiveAddress();
        setAddress(address);
        if (error) reexecuteQuery();
      }
    });
    setNearestEdge();
  }, []);

  const renderActiveTab = () => {
    switch (store?.activeTab) {
      case 'upload':
        return fetching || error ? <Gallery /> : <Upload />;
      case 'licensed':
        return fetching || error ? <Gallery /> : <Licensed />;
      case 'transactions':
        return fetching || error ? <Table /> : <Transactions tx={data?.transactions?.edges} />;
      case 'sub-licensed':
        return fetching || error ? <Gallery /> : <SubLicenced />;
      default:
        return fetching || error ? <Gallery /> : <Overview images={data?.transactions?.edges} />;
    }
  };

  if (!store?.connected) return <Disconnected />;
  return (
    <div className="h-screen">
      {data?.transactions?.edges?.length <= 0 && !fetching && !error ? <Empty /> : renderActiveTab()}
    </div>
  );
}
