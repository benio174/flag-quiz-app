import { createContext, useState, useContext } from "react";
import { translations } from "../translations";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('pl');
    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'pl' ? 'en' : 'pl'));
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value ={{ language, toggleLanguage, t}}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);