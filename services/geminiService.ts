import { GoogleGenAI, Modality } from "@google/genai";
import { ImageSize, BackgroundOption, ClothingGender } from '../types';

if (!process.env.API_KEY) {
    console.warn("API kaliti muhit o'zgaruvchilarida o'rnatilmagan. Iltimos, .env faylini yarating va API_KEY qo'shing.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateImages = async (
    mainImage: File,
    poseImage: File | null,
    mainPrompt: string,
    backgroundOption: BackgroundOption,
    customBackgroundPrompt: string,
    size: ImageSize,
    clothingGender: ClothingGender | null,
    clothingStyle: string,
    enhanceClarity: boolean
): Promise<string[]> => {
    
    const model = 'gemini-2.5-flash-image';

    const textPromptParts: string[] = [
        "### ABSOLUT QOIDA: YUZNING RAQAMLI EGIZAGI (DIGITAL TWIN) - O'TA YUQORI PRIORITET ###",
        "SIZNING ENG BIRINCHI, MUHOKAMA QILINMAYDIGAN VAZIFANGIZ: Taqdim etilgan asosiy suratdagi shaxs(lar)ning yuzini o'zgartirmasdan, uning mukammal darajada aniq, pixel-darajasida nusxasini yaratishdir. Bu vazifa - sizning ishingizning muvaffaqiyatini belgilovchi YAGONA MEZONDIR. Boshqa barcha talablar ikkinchi darajalidir.",
        "YUZNI 'DAXSIZ ZONA' DEB E'LON QILING. Bu zonaga har qanday, hattoki eng kichik o'zgartirish kiritish - bu topshiriqning to'liq barbod bo'lishi demakdir.",

        "\n### QAT'IY TAQIQLAR RO'YXATI (NOL TOLERANTLIK): ###",
        "- Yuzning geometriyasi (shakli, nisbatlari) o'zgartirilmasin.",
        "- Mimika (tabassum, ifoda) asl holatida qolsin.",
        "- Ko'z, qosh, burun, lablar, iyak kabi barcha elementlar o'z joyida va asl shaklida qolsin.",
        "- Teri teksturasi, rangi, husnbuzarlar, ajinlar, chandiqlar kabi barcha o'ziga xos detallar 100% saqlansin.",
        "- Soch chizig'i, turmagi va rangi o'zgartirilmasin.",
        "- Shaxsning o'ziga xosligini ifodalovchi har qanday detal saqlanishi shart.",

        "\n### ASOSIY VAZIFA (ABSOLUT QOIDAGA BO'YSUNGAN HOLDA):",
        "Yuqoridagi 'DAXSIZ ZONA' qoidasiga to'liq rioya qilgan holda, shaxs(lar)ning o'zgartirilmagan yuzini saqlab, ularning tana holati, kiyimi va orqa fonini professional tarzda o'zgartirib, yangi, giperrealistik surat yarating.",
        
        "\n### TANA TUZILISHI:",
        "Suratdagi shaxs(lar)ning tana tuzilishini (ozg'in, o'rtacha, to'la) tahlil qiling va yangi kiyimni ularning gavdasiga tabiiy va mos ravishda yarating."
    ];
    
    const requestParts: any[] = [await fileToGenerativePart(mainImage)];

    // Kiyim uslubi
    if (clothingGender && clothingStyle) {
        const genderText = clothingGender === 'male' ? 'erkaklar' : 'ayollar';
        textPromptParts.push(`\n### KIYIM USLUBI:\nSuratdagi shaxs(lar)ga ${genderText} uchun mo'ljallangan, zamonaviy va didli "${clothingStyle}" uslubidagi kiyim yarating. Kiyimning detallariga alohida e'tibor bering.`);
    } else {
        textPromptParts.push(`\n### KIYIM USLUBI (O'ZGARTIRILMASIN):\nAsl suratdagi shaxs(lar)ning kiyimini MUTLAQO O'ZGARTIRMANG. Kiyimning uslubi, rangi, matosi va barcha detallarini 100% saqlab qoling. Sizning vazifangiz faqat tana holati (agar poza surati berilgan bo'lsa) va orqa fonni o'zgartirishdir, kiyimga esa TEGILMASIN.`);
    }

    // Poza
    if (poseImage) {
        textPromptParts.push("\n### POZA:\nIkkinchi rasmda ko'rsatilgan pozadan namuna sifatida foydalaning.");
        requestParts.push(await fileToGenerativePart(poseImage));
    }
    
    // Orqa fon
    let backgroundPromptPart = "\n### ORQA FON:\n";
    if (backgroundOption === 'studio') {
        backgroundPromptPart += "Orqa fon sifatida zamonaviy, minimalist professional foto studiya yarating.";
    } else if (backgroundOption === 'nature') {
        backgroundPromptPart += "Orqa fon sifatida go'zal va sokin tabiat manzarasi (masalan, tog'lar, o'rmon yoki dengiz bo'yi) yarating.";
    } else if(customBackgroundPrompt) {
        backgroundPromptPart += `Orqa fon sifatida quyidagini yarating: ${customBackgroundPrompt}.`;
    }
    textPromptParts.push(backgroundPromptPart);

    // Qo'shimcha ko'rsatmalar
    if (mainPrompt) {
        textPromptParts.push(`\n### QO'SHIMCHA KO'RSATMALAR:\n${mainPrompt}.`);
    }
    
    // Sifat va o'lcham
    const aspectRatio = size === '1920x1080' ? '16:9' : (size === '1080x1920' ? '9:16' : '1:1');
    textPromptParts.push("\n### SIFAT TALABLARI:");
    textPromptParts.push("Yoritish professional studiya darajasida bo'lsin, soya va yorug'lik tabiiy ko'rinsin.");
    textPromptParts.push(`Natijaviy surat o'ta yuqori sifatli, tiniq, detallarga boy va fotorealistik bo'lsin. Rasm nisbati ${aspectRatio} bo'lsin.`);
    
    if (enhanceClarity) {
        textPromptParts.push("TASVIRNI TINIQLASHTIRISH: Generatsiya qilingan tasvirning tiniqligini, detallarini va keskinligini maksimal darajada oshiring. Kichik detallar ham aniq ko'rinishi kerak.");
    }
    
    textPromptParts.push("\n### YAKUNIY, O'TA MUHIM TEKSHIRUV: ###");
    textPromptParts.push("Generatsiya jarayoni tugagandan so'ng, natijaviy yuzni asl yuz bilan solishtiring. Agar 1% bo'lsa ham farq topsangiz, bu mutlaq muvaffaqiyatsizlikdir. Natija asl yuzning 'raqamli egizagi' bo'lishi shart. Agar bu shart bajarilmasa, butun natija yaroqsiz deb hisoblanadi.");

    const finalPromptText = textPromptParts.join('\n');
    requestParts.push({ text: finalPromptText });

    const contents = { parts: requestParts };

    const generatePromises = Array(4).fill(0).map(async () => {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response?.candidates?.[0];
        if (candidate && candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        // Agar rasm topilmasa, sababini aniqlashga harakat qilamiz
        if (candidate?.finishReason) {
            const reason = candidate.finishReason;
            if (reason === 'SAFETY') {
                 throw new Error("SAFETY_POLICY_VIOLATION");
            }
            throw new Error(`Rasm yaratilmadi. Sabab: ${reason}`);
        }
        
        throw new Error("Noma'lum sababga ko'ra rasm yaratilmadi.");
    });

    const results = await Promise.allSettled(generatePromises);
    
    const successfulImages: string[] = [];
    const errorMessages: string[] = [];
    let hasSafetyError = false;

    results.forEach(result => {
        if (result.status === 'fulfilled') {
            successfulImages.push(result.value);
        } else {
            console.error("Variant yaratishda xatolik:", result.reason);
            if (result.reason?.message === "SAFETY_POLICY_VIOLATION") {
                hasSafetyError = true;
            }
            errorMessages.push(result.reason?.message || 'Noma\'lum xato');
        }
    });

    if (successfulImages.length === 0) {
        if (hasSafetyError) {
            throw new Error("Surat yaratishning iloji bo'lmadi. Bu Googlening xavfsizlik siyosati tufayli bo'lishi mumkin. Iltimos, boshqa surat yoki so'rov bilan harakat qilib ko'ring.");
        }
        throw new Error(`Barcha suratlarni yaratishda xatolik yuz berdi. Asosiy sabab: ${errorMessages[0]}`);
    }

    return successfulImages;
};