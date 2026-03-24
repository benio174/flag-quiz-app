import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const FlagList = () => {
    const { t, language } = useLanguage();
    const [allCountries, setAllCountries] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('Europa');

    const getCountryName = (country) => {
        if (!country) return "";
        if (language !== 'pl') {
            const rawName = country.name_en || country.name;
            return rawName.split(',')[0].trim();
        }
        return country.name.split(',')[0].trim();
    };

    useEffect(() => {
        fetch('http://localhost:8081/api/countries')
        .then(res => res.json())
        .then(data => setAllCountries(data))
        .catch(err => console.error(err));
    }, []);
    const filteredCountries = allCountries.filter(c =>
        c.continent && c.continent.trim().toLowerCase() === selectedRegion.toLowerCase()).sort((a, b) => {
            const nameA = getCountryName(a);
            const nameB = getCountryName(b);
            return nameA.localeCompare(nameB, language);
        });

    const regions = ['Europa', 'Azja', 'Afryka', 'Ameryki', 'Oceania'];

    const getRegionLabel = (regionName) => {
        switch (regionName) {
            case 'Europa': return t('europe');
            case 'Azja' : return t('asia');
            case 'Afryka' : return t('africa');
            case 'Ameryki' : return t('americas');
            case 'Oceania' : return t('oceania');
            default : return regionName;
        }
    }

    return (
        <div className="page" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center'}}>
            <h2>{t('flagsListTitle')}</h2>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px'}}>
                {regions.map(region => (
                    <button
                        key={region}
                        onClick={() => setSelectedRegion(region)}
                        style={{
                            padding: '10px 25px',
                            fontSize: ' 1.1rem',
                            cursor: 'pointer',
                            border: 'none',
                            borderRadius: '5px',
                            background: selectedRegion === region ? '#2196F3' : '#ddd',
                            color: selectedRegion === region ? 'white' : '#333',
                            transition: '0.3s'
                        }}
                    >
                        {getRegionLabel(region)}
                    </button>
                ))}
            </div>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px'
            }}>
                {filteredCountries.map(country => (
                    <div key={country.id} style={{
                        border: '1px solid #eee',
                        borderRadius: '10px',
                        padding: '10px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        background: '#418a8a'
                    }}>
                        <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'}}>
                            <img
                                src={country.flagUrl}
                                alt={country.name}
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
                                />
                            </div><p style ={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#f3f3f3'}}>
                                {getCountryName(country)}
                            </p>
                        </div>
                ))}
            </div>
        </div>

    );
};

export default FlagList;