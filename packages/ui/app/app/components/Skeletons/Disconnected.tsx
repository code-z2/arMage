import Connect from '../Connect';

const Disconnected = () => {
  return (
    <section className="py-4 overflow-hidden max-w-screen-xl h-[75vh] mx-auto p-10">
      <div className="container px-4 flex justify-center items-center h-full bg-neutral-50">
        <div className="max-w-md m-auto text-center">
          <img
            className="m-auto animate-pulse"
            src="/no-wifi.png"
            alt="https://www.flaticon.com"
            width={75}
            height={75}
          />
          <h2 className="font-heading mb-3 text-2xl font-semibold">Unable to reach your wallet</h2>
          <p className="mb-7 text-neutral-500">
            Connect an Arweave wallet first, then you can continue. I would suggest{' '}
            <a href="https://arconnect.io" target="_blank" className="text-blue-600 underline">
              Arconnect
            </a>{' '}
            for a seamless experience.
          </p>
          <Connect />
        </div>
      </div>
    </section>
  );
};

export default Disconnected;
