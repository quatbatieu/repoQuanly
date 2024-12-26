import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { messages_en, messages_vi } from "./index";

const messages = {
  en: messages_en,
  vi: messages_vi
};

i18next
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: "vi",                              // language to use
    resources: {
      vi: {
        translation: messages.vi
      },
      en: {
        translation: messages.en               // 'common' is our custom namespace
      }
    },
    debug: process.env.NODE_ENV !== "production",
    fallbackLng: "vi"
  });


export default i18next;
