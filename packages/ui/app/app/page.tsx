'use client';
import Overview from './components/Galleries/Overview';
import { useMageStore, useStore } from '@ui/store';
import Upload from './components/Galleries/Upload';
import SubLicenced from './components/Galleries/SubLicenced';
import Transactions from './components/Galleries/Transactions';
import Licensed from './components/Galleries/Licensed';

export default function App() {
  const activeTab = useStore(useMageStore, (state) => state.activeTab);

  const renderActiveTab = () => {
    switch (activeTab) {
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
