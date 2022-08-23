import pt from "../langs/pt.json";
import en from "../langs/en.json";
import { useEffect, useState } from "react";

const languages = { pt, en };

const useLanguage = (): typeof pt => {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (
      navigator?.language &&
      Object.keys(languages).includes(navigator.language)
    )
      setLang(navigator?.language);
  }, []);

  return languages[lang];
};

export default useLanguage;
