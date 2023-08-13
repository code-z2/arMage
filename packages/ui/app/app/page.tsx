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

export default function App() {
  const store = useStore(useMageStore, (state) => state);
  const [address, setAddress] = useState('');
  const [result, reexecuteQuery] = useQuery({
    query: query(address),
  });
  const { data, fetching, error } = result;

  const setNearestEdge = () =>
    axios
      .get(process.env.NEXT_PUBLIC_EDGE_URL || 'http://127.0.0.1:3002/edge')
      .then((res) => store?.setEdge(res.data.url))
      .catch((err) => console.log(err));

  const initApp = async () => {
    setNearestEdge();
    let address: string | undefined;

    const permissions = await window.arweaveWallet.getPermissions();
    if (permissions.length > 0) {
      address = await window.arweaveWallet.getActiveAddress();
      setAddress(address);
      console.log('Wallet address set:', address);
    }

    console.log('Reexecuting with address:', address);
    reexecuteQuery();
  };

  useEffect(() => {
    if (window.arweaveWallet && store?.connected) {
      initApp();
    }
  }, [store?.connected]);

  const renderActiveTab = () => {
    switch (store?.activeTab) {
      case 'upload':
        return <Upload callback={reexecuteQuery} />;
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
  return <div className="h-[75vh]">{renderActiveTab()}</div>;
}
