import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 text-center border-b border-gray-700">
      <h1 className="text-3xl md:text-4xl font-bold text-green-500">
        AI Foto Studio
      </h1>
      <p className="text-gray-400 mt-2">Oddiy suratlarni ajoyib asarlarga aylantiring</p>
    </header>
  );
};

export default Header;
