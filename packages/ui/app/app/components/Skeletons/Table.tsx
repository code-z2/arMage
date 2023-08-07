const Table = () => {
  return (
    <div className="p-10 mx-auto">
      <div
        role="status"
        className="mx-auto max-w-screen-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded animate-pulse"
      >
        {[...Array(7)].map((_, i) => (
          <div className="flex items-center justify-between p-3">
            <div>
              <div className="h-2.5 bg-gray-300 rounded-full  w-72 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full "></div>
            </div>
            <div className="h-2.5 bg-gray-300 rounded-full  w-36"></div>
          </div>
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Table;
