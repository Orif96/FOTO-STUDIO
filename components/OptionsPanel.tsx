import React from 'react';
import { ImageSize, BackgroundOption, ClothingGender } from '../types';
import ImageUploader from './ImageUploader';
import { MALE_CLOTHING_STYLES, FEMALE_CLOTHING_STYLES } from '../clothingStyles';


interface OptionsPanelProps {
  mainPrompt: string;
  setMainPrompt: (prompt: string) => void;
  backgroundOption: BackgroundOption;
  setBackgroundOption: (option: BackgroundOption) => void;
  customBackgroundPrompt: string;
  setCustomBackgroundPrompt: (prompt: string) => void;
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
  onGenerate: () => void;
  isLoading: boolean;
  setMainImage: (file: File | null) => void;
  setPoseImage: (file: File | null) => void;
  clothingGender: ClothingGender | null;
  setClothingGender: (gender: ClothingGender | null) => void;
  clothingStyle: string;
  setClothingStyle: (style: string) => void;
  isGenerateDisabled: boolean;
  enhanceClarity: boolean;
  setEnhanceClarity: (value: boolean) => void;
}

const OptionsPanel: React.FC<OptionsPanelProps> = ({
  mainPrompt,
  setMainPrompt,
  backgroundOption,
  setBackgroundOption,
  customBackgroundPrompt,
  setCustomBackgroundPrompt,
  imageSize,
  setImageSize,
  onGenerate,
  isLoading,
  setMainImage,
  setPoseImage,
  clothingGender,
  setClothingGender,
  clothingStyle,
  setClothingStyle,
  isGenerateDisabled,
  enhanceClarity,
  setEnhanceClarity
}) => {

    const handleGenderSelect = (gender: ClothingGender) => {
        if (clothingGender === gender) {
            setClothingGender(null); 
            setClothingStyle('');
        } else {
            setClothingGender(gender);
            setClothingStyle(''); 
        }
    };

    const currentClothingStyles = clothingGender === 'male' ? MALE_CLOTHING_STYLES : FEMALE_CLOTHING_STYLES;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-neutral-900 rounded-lg">
      <div>
        <h2 className="text-xl font-semibold text-green-500 mb-3">1. Suratlarni yuklang</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploader 
                id="main-image-upload"
                onImageUpload={(file) => setMainImage(file)}
                title="Asosiy Surat"
                subtitle="O'zgartirish uchun suratni tanlang"
            />
            <ImageUploader 
                id="pose-image-upload"
                onImageUpload={(file) => setPoseImage(file)}
                title="Poza Uchun Surat (Ixtiyoriy)"
                subtitle="Namuna sifatida pozani tanlang"
            />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-green-500 mb-3">2. Kiyim uslubini tanlang (Ixtiyoriy)</h2>
        <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => handleGenderSelect('male')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${clothingGender === 'male' ? 'bg-green-500 text-neutral-900 font-semibold' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
            >
              Erkaklar
            </button>
            <button
              onClick={() => handleGenderSelect('female')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${clothingGender === 'female' ? 'bg-green-500 text-neutral-900 font-semibold' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
            >
              Ayollar
            </button>
        </div>
        {clothingGender && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
               <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
               </style>
                <select
                  value={clothingStyle}
                  onChange={(e) => setClothingStyle(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-3 text-neutral-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  aria-label="Kiyim uslubini tanlang"
                >
                  <option value="">Uslubni tanlang...</option>
                  {currentClothingStyles.map(style => (
                    <option key={style.key} value={style.name}>
                      {style.name}
                    </option>
                  ))}
                </select>
            </div>
        )}
      </div>

      <div>
        <label htmlFor="main-prompt" className="block text-xl font-semibold text-green-500 mb-2">3. Prompt kiriting</label>
        <textarea
          id="main-prompt"
          rows={3}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          placeholder="Masalan: retro uslubda, qora va oq ranglarda..."
          value={mainPrompt}
          onChange={(e) => setMainPrompt(e.target.value)}
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-green-500 mb-3">4. Orqa fonni tanlang</h3>
        <div className="grid grid-cols-3 gap-2">
          {['studio', 'nature', 'custom'].map((opt) => (
            <button
              key={opt}
              onClick={() => setBackgroundOption(opt as BackgroundOption)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${backgroundOption === opt ? 'bg-green-500 text-neutral-900 font-semibold' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
            >
              {opt === 'studio' ? 'Foto Studio' : opt === 'nature' ? 'Tabiat' : 'Boshqa'}
            </button>
          ))}
        </div>
        {backgroundOption === 'custom' && (
          <input
            type="text"
            className="w-full mt-3 bg-neutral-800 border border-neutral-700 rounded-md p-2 text-neutral-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            placeholder="Orqa fon uchun prompt kiriting (masalan, futuristik shahar)"
            value={customBackgroundPrompt}
            onChange={(e) => setCustomBackgroundPrompt(e.target.value)}
          />
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-green-500 mb-3">5. Surat o'lchamini tanlang</h3>
        <div className="grid grid-cols-3 gap-2">
            {(['1920x1080', '1080x1080', '1080x1920'] as ImageSize[]).map(size => (
                 <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition ${imageSize === size ? 'bg-green-500 text-neutral-900 font-semibold' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
                 >
                    {size === '1920x1080' ? 'Peyzaj' : size === '1080x1080' ? 'Kvadrat' : 'Portret'}
                </button>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-green-500 mb-3">6. Qo'shimcha sozlamalar</h3>
        <label htmlFor="enhance-clarity" className="flex items-center justify-between cursor-pointer bg-neutral-800 p-3 rounded-lg hover:bg-neutral-700/50 transition-colors">
          <span className="text-neutral-200 font-medium">Tasvir tiniqligini oshirish</span>
          <div className="relative">
            <input 
              id="enhance-clarity" 
              type="checkbox" 
              className="sr-only peer" 
              checked={enhanceClarity} 
              onChange={(e) => setEnhanceClarity(e.target.checked)} 
            />
            <div className="block w-14 h-8 bg-neutral-700 rounded-full transition peer-checked:bg-green-500"></div>
            <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:transform peer-checked:translate-x-6"></div>
          </div>
        </label>
      </div>
      
      <button
        onClick={onGenerate}
        disabled={isGenerateDisabled || isLoading}
        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yaratilmoqda...
            </>
        ) : 'Yaratish'}
      </button>
    </div>
  );
};

export default OptionsPanel;