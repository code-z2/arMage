import Header from './components/Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      <Header />
      {children}
    </div>
  );
}
