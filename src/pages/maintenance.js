// pages/maintenance.js
import React from 'react';
import Head from 'next/head';

const Maintenance = () => {
  return (
    <>
      <Head>
        <title>Site Under Maintenance</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">We'll be back soon!</h1>
        <p className="text-xl text-gray-600 mb-6">
          Sorry for the inconvenience but we're performing some maintenance at the moment. We'll
          be back online shortly!
        </p>
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </>
  );
};

export default Maintenance;
