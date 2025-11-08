import React, { useState } from 'react';
import Loader from './Loader';
import { PngIcon, JpgIcon } from './IconComponents';
import ImageModal from './ImageModal';

interface ResultDisplayProps {
  images: string[];
  isLoading: boolean;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, isLoading, error }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const downloadImage = (base64Data: string, format: 'png' | 'jpeg') => {
        const link = document.createElement('a');
        
        if (format === 'png') {
            link.href = `data:image/png;base64,${base64Data}`;
            link.download = `ai_studio_result.png`;
        } else {
            const img = new Image();
            img.src = `data:image/png;base64,${base64Data}`;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    link.href = canvas.toDataURL('image/jpeg');
                    link.download = `ai_studio_result.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            };
            return;
        }
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Xatolik yuz berdi</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (images.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((imgSrc, index) => (
            <div key={index} className="group relative rounded-lg overflow-hidden border-2 border-gray-700 cursor-pointer" onClick={() => setSelectedImage(imgSrc)}>
              <img src={`data:image/png;base64,${imgSrc}`} alt={`Yaratilgan variant ${index + 1}`} className="w-full h-full object-contain aspect-video" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-lg font-bold">Kattalashtirish</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={(e) => { e.stopPropagation(); downloadImage(imgSrc, 'png'); }} className="bg-gray-700 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-md flex items-center space-x-1 transition-colors">
                    <PngIcon />
                    <span>PNG</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); downloadImage(imgSrc, 'jpeg'); }} className="bg-gray-700 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-md flex items-center space-x-1 transition-colors">
                    <JpgIcon />
                    <span>JPG</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-gray-500 h-full">
        <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 className="text-2xl font-semibold text-gray-400">Natijalar shu yerda ko'rinadi</h3>
        <p className="mt-1">Boshlash uchun so'zlamalarni to'ldiring va "Yaratish" tugmasini bosing.</p>
      </div>
    );
  };

  return (
    <>
      <div className="bg-gray-800/50 rounded-lg p-4 md:p-6 min-h-[50vh] flex items-center justify-center">
        {renderContent()}
      </div>
      {selectedImage && <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
};

export default ResultDisplay;