import React from 'react';

interface ClothingItemProps {
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}

const ClothingItem: React.FC<ClothingItemProps> = ({ name, imageUrl, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${isSelected ? 'border-green-500 scale-105 shadow-lg shadow-green-500/20' : 'border-gray-700 hover:border-green-400'}`}
      aria-label={name}
      role="button"
      aria-pressed={isSelected}
    >
      <img src={imageUrl} alt={name} className="w-full h-32 object-cover aspect-square" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold leading-tight">{name}</p>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-900">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
      )}
    </div>
  );
};

export default ClothingItem;
