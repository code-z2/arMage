'use client';
import { useStore, useMageStore } from '@ui/store';
import Empty from '../Skeletons/Empty';

const Overview = ({ images }: { images?: any[] }) => {
  const edge = useStore(useMageStore, (state) => state.edge);
  const handleCopyLink = (image: string) => {
    navigator.clipboard.writeText(image);
  };

  const handleDownload = (image: string, name: string) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = name;
    link.click();
  };

  if (images?.length === 0) {
    return <Empty />;
  }

  return (
    <div className="columns-1 gap-5 md:columns-2 lg:columns-4 max-w-screen-xl mx-auto p-10">
      {images?.map((image, i) => {
        return (
          <div className="group relative break-inside-avoid mb-5" key={i}>
            <img className="h-auto max-w-full rounded-lg" src={`https://arweave.net/${image.node.id}`} alt="" />
            <div className="absolute inset-0 bg-black bg-opacity-50 items-center hidden group-hover:flex flex-col justify-around">
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 duration-150 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 opacity-70"
                onClick={() => handleCopyLink(`${edge}?img=${image.node.id}`)}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-4 h-4"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10.5 3A1.501 1.501 0 009 4.5h6A1.5 1.5 0 0013.5 3h-3zm-2.693.178A3 3 0 0110.5 1.5h3a3 3 0 012.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 01-3 3H6.75a3 3 0 01-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15z"
                  ></path>
                </svg>
                copy link
              </button>
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 duration-150 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 opacity-70"
                onClick={() =>
                  handleDownload(
                    `https://arweave.net/${image.node.id}`,
                    image.node.id + image.node.data.type.split('/')[1],
                  )
                }
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-4 h-4"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.25 6a.75.75 0 00-1.5 0v4.94l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V9.75z"
                  ></path>
                </svg>
                download
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Overview;
