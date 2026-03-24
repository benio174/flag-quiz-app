import { useLanguage } from "../context/LanguageContext";

const Home = () => {

    const { t } = useLanguage();
    
    return (
        <div className='page'>
            <h2>{t('mainText')}</h2>
            <div style={{ margin: '20px 0'}}>
                    <p>{t('home1')}</p>
                    <p>{t('home2')}</p>
                    <p>{t('home3')}</p>
                    <p>{t('home4')}</p>
                    <p>{t('home5')}</p>
                </div>
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '20px',
                fontSize: '0.75rem',
                color: '#b6b3b3',
                fontStyle: 'italic',
                fontFamily: 'sans-serif'
            }}>
                {t('info')}
            </div>

            <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '20px',
                fontSize: '0.75rem',
                color: '#b6b3b3',
                fontStyle: 'italic',
                fontFamily: 'sans-serif'
            }}>
                {t('author')}
            </div>
        </div>
    );
}

export default Home;