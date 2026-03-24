import {useState} from 'react';
//import FlagGame from '../components/FlagGame';
import FlagQuiz3 from '../components/FlagQuiz3';
import { useLanguage } from '../context/LanguageContext';

const T3 = () => {
    const { t } = useLanguage();
    const [isPlaying, setIsPlaying] = useState(false);

    if (!isPlaying) {
        return (
            <div className='page'>
                <h2>{t('mode3Desc')}</h2>
                <div style={{ margin: '20px 0'}}>
                    <p>{t('firstRule')}</p>
                    <p>{t('rules1_1_and_3_1')}</p>
                    <p>{t('rules3_2')}</p>
                    <p>{t('ending')}</p>
                    <p>{t('fasterEnding')}</p>
                    <p>{t('goodLuck')}</p>
                </div>
                <button
                    onClick={() => setIsPlaying(true)}
                    style={{ padding: '10px 20px', fontSize: '1.2rem', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white'}}
                >
                    {t('playButton')}
                </button>
            </div>
        );
    }
    return (
    <div className='page'>
      <h2>{t('mode3Desc')}</h2>   
      <FlagQuiz3 />
    </div>
  );
};

export default T3;