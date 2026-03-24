import { useLanguage } from "../context/LanguageContext";

const LanguageSwitcher = () => {
    const { language, toggleLanguage } = useLanguage();

    return(
        <button
            onClick={toggleLanguage}
            title="Zmień język / Change language"
            style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: '1100',
                background: 'transparent',
                border: 'none',
                fontSize: '1.0rem',
                cursor: 'pointer',
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))',
                transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1.0)'}
        >
            <img
                src={language === 'pl' ? 'https://flagcdn.com/w80/gb.png' : 'https://flagcdn.com/w80/pl.png'}
                alt={language === 'pl' ? 'English' : 'Polski'}
                style={{
                    width : '40px',
                    height: 'auto',
                    display: 'block',
                    filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.3))',
                    borderRadius: '4px'
                }}
                />
        </button>
    );
};

export default LanguageSwitcher;