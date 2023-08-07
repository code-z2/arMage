import React from 'react';

const Gallery = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-screen-xl mx-auto p-10">
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((item, index) => {
          const height = Math.floor(Math.random() * (365 - 192 + 1)) + 192;
          return (
            <div role="status" className="animate-pulse" key={index}>
              <div
                className="flex items-center justify-center w-full bg-gray-300 rounded sm:w-72"
                style={{ height: `${height}px` }}
              >
                <svg
                  className="w-10 h-10 text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          );
        })}
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((item, index) => {
          const height = Math.floor(Math.random() * (365 - 192 + 1)) + 192;
          return (
            <div role="status" className="animate-pulse" key={index}>
              <div
                className="flex items-center justify-center w-full bg-gray-300 rounded sm:w-72"
                style={{ height: `${height}px` }}
              >
                <svg
                  className="w-10 h-10 text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          );
        })}
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((item, index) => {
          const height = Math.floor(Math.random() * (396 - 192 + 1)) + 192;
          return (
            <div role="status" className="animate-pulse" key={index}>
              <div
                className="flex items-center justify-center w-full bg-gray-300 rounded sm:w-72"
                style={{ height: `${height}px` }}
              >
                <svg
                  className="w-10 h-10 text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          );
        })}
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((item, index) => {
          const height = Math.floor(Math.random() * (365 - 192 + 1)) + 192;
          return (
            <div role="status" className="animate-pulse" key={index}>
              <div
                className="flex items-center justify-center w-full bg-gray-300 rounded sm:w-72"
                style={{ height: `${height}px` }}
              >
                <svg
                  className="w-10 h-10 text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                </svg>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
