'use client';
import { useMageStore, useStore } from '@ui/store';
import { useEffect } from 'react';
import Licensed from './components/Galleries/Licensed';
import Overview from './components/Galleries/Overview';
import SubLicenced from './components/Galleries/SubLicenced';
import Transactions from './components/Galleries/Transactions';
import Upload from './components/Galleries/Upload';

export default function App() {
  const store = useStore(useMageStore, (state) => state);
  useEffect(() => {
    addEventListener('arweaveWalletLoaded', async () => {
      console.log(`You are using the ${window.arweaveWallet.walletName} wallet.`);
      const permissions = await window.arweaveWallet.getPermissions();
      if (permissions.length > 0) {
        store?.setConnected(true);
      }
    });
  }, []);

  const renderActiveTab = () => {
    switch (store?.activeTab) {
      case 'upload':
        return <Upload />;
      case 'licensed':
        return <Licensed />;
      case 'transactions':
        return <Transactions />;
      case 'sub-licensed':
        return <SubLicenced />;
      default:
        return <Overview />;
    }
  };
  return <div className="h-screen">{renderActiveTab()}</div>;
}
