import React, { useState } from 'react';
import Header from './components/Header';
import OptionsPanel from './components/OptionsPanel';
import ResultDisplay from './components/ResultDisplay';
import { ImageSize, BackgroundOption, ClothingGender } from './types';
import { generateImages } from './services/geminiService';

const App: React.FC = () => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [poseImage, setPoseImage] = useState<File | null>(null);
  const [mainPrompt, setMainPrompt] = useState('');
  const [backgroundOption, setBackgroundOption] = useState<BackgroundOption>('studio');
  const [customBackgroundPrompt, setCustomBackgroundPrompt] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1920x1080');
  const [clothingGender, setClothingGender] = useState<ClothingGender | null>(null);
  const [clothingStyle, setClothingStyle] = useState<string>('');
  const [enhanceClarity, setEnhanceClarity] = useState(false);

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!mainImage) {
      setError("Iltimos, asosiy suratni yuklang.");
      return;
    }
    if (backgroundOption === 'custom' && !customBackgroundPrompt) {
      setError("Iltimos, 'Boshqa' fon uchun prompt kiriting.");
      return;
    }
    if (clothingGender && !clothingStyle) {
      setError("Iltimos, kiyim uslubini tanlang.");
      return;
    }


    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateImages(
        mainImage,
        poseImage,
        mainPrompt,
        backgroundOption,
        customBackgroundPrompt,
        imageSize,
        clothingGender,
        clothingStyle,
        enhanceClarity
      );
      setGeneratedImages(images);
    } catch (err: any) {
      console.error(err);
      setError(`Rasm yaratishda xatolik yuz berdi: ${err.message || 'Noma\'lum xato'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = !mainImage || (backgroundOption === 'custom' && !customBackgroundPrompt) || (!!clothingGender && !clothingStyle);

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OptionsPanel
            mainPrompt={mainPrompt}
            setMainPrompt={setMainPrompt}
            backgroundOption={backgroundOption}
            setBackgroundOption={setBackgroundOption}
            customBackgroundPrompt={customBackgroundPrompt}
            setCustomBackgroundPrompt={setCustomBackgroundPrompt}
            imageSize={imageSize}
            setImageSize={setImageSize}
            onGenerate={handleGenerate}
            isLoading={isLoading}
            setMainImage={setMainImage}
            setPoseImage={setPoseImage}
            isGenerateDisabled={isGenerateDisabled}
            clothingGender={clothingGender}
            setClothingGender={setClothingGender}
            clothingStyle={clothingStyle}
            setClothingStyle={setClothingStyle}
            enhanceClarity={enhanceClarity}
            setEnhanceClarity={setEnhanceClarity}
          />
          <ResultDisplay
            images={generatedImages}
            isLoading={isLoading}
            error={error}
          />
        </div>
        <footer className="text-center text-gray-500 mt-12 pb-6">
            <p>&copy; {new Date().getFullYear()} AI Foto Studio. Gemini tomonidan quvvatlantirilgan.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;