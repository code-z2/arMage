'use client';
import React, { useEffect, useState } from 'react';
import Arweave from 'arweave';

const arweave = new Arweave({
  host: 'ar-io.net',
  port: 443,
  protocol: 'https',
});

const Upload = ({ callback }: { callback: () => void }) => {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [imageType, setImageType] = useState<string>('image/png');
  const [tags, setTags] = useState<{ [key: string]: any }>();
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    setImageType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    file && reader.readAsArrayBuffer(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    setImageType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    file && reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleLicense = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value);
  };

  const upload = async () => {
    if (!image) return;
    setUploading(true);
    try {
      const transaction = await arweave.createTransaction({
        data: image,
      });
      transaction.addTag('Content-Type', imageType);
      transaction.addTag('App-Name', 'ArMage');
      transaction.addTag('App-Version', '0.0.1');
      transaction.addTag('License', 'yRj4a5KMctX_uOmKWCFJIjmY8DeJcusVk6-HzLiM_t8');
      const signedTx = await window.arweaveWallet.sign(transaction);
      signedTx.data = transaction.data;

      const response = await arweave.transactions.post(signedTx);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setUploading(false);
    setUploaded(true);
    setTimeout(() => {
      setImage(null);
      setUploaded(false);
    }, 3000);
    callback();
  };

  const replicate = () => {
    if (!image) return;
    console.log(image, typeof image);
    setImage(null);
  };

  useEffect(() => {
    if (typeof image === 'string') {
      replicate();
    } else {
      upload();
    }
  }, [image]);

  return (
    <div className="max-w-screen-xl mx-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-5">
      <div
        className={`w-full h-[65vh] rounded-lg border-2 border-dashed col-span-2 ${
          dragging || image ? 'border-green-500' : ''
        } flex items-center justify-center z-10`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <label htmlFor="file" className="cursor-pointer text-center p-4 md:p-8">
          {uploaded ? (
            <svg
              className="w-10 h-10 mx-auto text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M9 1.5H5.625c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5zm6.61 10.936a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 14.47a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              ></path>
              <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z"></path>
            </svg>
          ) : uploading ? (
            <svg
              aria-hidden="true"
              className="w-8 h-8 mx-auto text-gray-200 animate-spin dark:text-yellow-600 fill-yellow-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            <svg
              className="w-10 h-10 mx-auto text-teal-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              ></path>
            </svg>
          )}
          {uploading ? (
            <p className="mt-3 text-yellow-700 max-w-xs mx-auto">Uploading... please wait!</p>
          ) : uploaded ? (
            <p className="mt-3 text-green-700 max-w-xs mx-auto">Done!</p>
          ) : (
            <div>
              <p className="mt-3 text-gray-700 max-w-xs mx-auto">
                Click to <span className="font-medium text-teal-600">Upload your file</span> or drag and drop your file
                here
              </p>
              <p className="mt-3 text-gray-700 max-w-xs mx-auto">OR</p>
              <input
                type="text"
                placeholder="import from txID"
                className="w-full mt-3 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-teal-600 shadow-sm rounded-lg"
              />
            </div>
          )}
        </label>
        <input id="file" type="file" className="hidden" accept="image/*" onChange={handleUpload} />
      </div>
      <div className="p-5 col-span-1 max-w-md mx-auto border border-dashed rounded-md duration-300 w-full">
        <div>
          <p className="text-gray-700 text-2xl font-medium opacity-70 border-b p-2">Edit License</p>
        </div>
        <div className="py-3">
          <form action="">{/* udl editor */}</form>
        </div>
      </div>
    </div>
  );
};

export default Upload;
