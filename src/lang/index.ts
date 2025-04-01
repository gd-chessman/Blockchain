import en from '../locales/en.json';
import vi from '../locales/vi.json';
import kr from '../locales/kr.json';
import jp from '../locales/jp.json';
import { useLang } from '@/lang/useLang';

type LangCodes = 'en' | 'vi' | 'kr' | 'jp';

// Định nghĩa kiểu dữ liệu có thể chứa object lồng nhau
type Translations = { [key: string]: string | Translations };

export const langConfig: { 
  listLangs: { id: number; name: string; code: LangCodes }[];
  langsApp: Partial<Record<LangCodes, Translations>>;
} = {
  listLangs: [
    { id: 1, name: "English", code: "en" },
    { id: 2, name: "Vietnamese", code: "vi" },
    { id: 3, name: "Korea", code: "kr" },
    { id: 4, name: "Japan", code: "jp" },
  ],
  langsApp: {
    en,
    vi,
    kr,
    jp,
  }
};

// Hàm hỗ trợ lấy dữ liệu từ object lồng nhau
const getNestedTranslation = (translations: Translations, key: string): string => {
  return key.split('.').reduce((obj: any, k) => {
    if (typeof obj === 'object' && obj !== null && k in obj) {
      return obj[k] as Translations;
    }
    return undefined;
  }, translations as Translations) as string || key;
};

export const t = (key: string) => {
  const { lang } = useLang();  
  const translations = langConfig.langsApp[lang as LangCodes] || {}; 
  return getNestedTranslation(translations, key);
};
