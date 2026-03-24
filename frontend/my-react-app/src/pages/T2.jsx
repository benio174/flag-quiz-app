import {useState} from 'react';
//import FlagGame from '../components/FlagGame';
import FlagQuiz2 from '../components/FlagQuiz2';
import { useLanguage } from '../context/LanguageContext';


const T2 = () => {
        const [isPlaying, setIsPlaying] = useState(false);
        const { t } = useLanguage();

    if (!isPlaying) {
        return (
            <div className='page'>
                <h2>{t('mode2Desc')}</h2>
                <div style={{ margin: '20px 0'}}>
                    <p>{t('firstRule')}</p>
                    <p>{t('rules2_1')}</p>
                    <p>{t('rules2_2')}</p>
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
      <h2>{t('mode2Desc')}</h2>    
      <FlagQuiz2 />
    </div>
  );
}

export default T2;