
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-green-500"></div>
      <p className="text-green-400 text-lg">Tasvirlar yaratilmoqda...</p>
      <p className="text-gray-400 text-sm max-w-sm text-center">Bu bir necha daqiqa vaqt olishi mumkin. Iltimos, sabr qiling.</p>
    </div>
  );
};

export default Loader;
