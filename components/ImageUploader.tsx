
import React, { useState, useRef } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  id: string;
  onImageUpload: (file: File) => void;
  title: string;
  subtitle: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, onImageUpload, title, subtitle }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center text-center p-4 cursor-pointer hover:border-green-500 hover:bg-gray-800 transition-colors duration-300 relative overflow-hidden group"
      onClick={handleClick}
    >
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {preview ? (
        <>
          <img src={preview} alt="Yuklangan surat" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <p className="text-white font-semibold">O'zgartirish</p>
          </div>
        </>
      ) : (
        <div className="text-gray-400">
          <UploadIcon className="w-10 h-10 mx-auto mb-2 text-gray-500" />
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm">{subtitle}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
