import { useSelector } from "react-redux";
import { translations } from "./translations";

export const useTranslation = () => {
  const currentLanguage = useSelector(
    (state) =>
      state.language?.currentLanguage ||
      state.profile?.user?.language ||
      state.auth?.user?.language ||
      "en"
  );

  const langCode = currentLanguage === "hi" ? "hi" : "en";
  const dict = translations[langCode] || translations.en;

  const t = (key, fallback = "") => {
    if (dict && dict[key]) {
      return dict[key];
    }
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  return {
    t,
    currentLanguage: langCode,
    isHindi: langCode === "hi",
  };
};

export default useTranslation;
