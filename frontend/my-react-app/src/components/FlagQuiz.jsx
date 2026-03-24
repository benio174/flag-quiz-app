import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const FlagQuiz = () => {
    const {t, language} = useLanguage();
    const { user } = useAuth();
    const getCountryName = (country) => {
        if (!country) return "";
        if (language !== 'pl'){
            const rawName = country.name_en || country.name;
            return rawName.split(',')[0].trim();
        }
        return country.name.split(',')[0].trim();
    }

    const [allCountries, setAllCountries] = useState([]);
    const [gameState, setGameState] = useState('menu');
    
    const [score, setScore] = useState(0);
    const[currentQuestion, setCurrentQuestion] = useState(null);
    const[timeLeft, setTimeLeft] = useState(100);
    const[selectedRegion, setSelectedRegion] = useState('');

    const [usedIds, setUsedIds] = useState([]);
    const [regionCountries, setRegionCountries] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [feedback, setFeedback] = useState({ selectedID: null, correctId: null});

    useEffect(() => {
        fetch('http://localhost:8081/api/countries')
        .then(res => res.json())
        .then(data => setAllCountries(data))
        .catch(err => console.error("Błąd API: ", err));
    }, [])

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0 && !isProcessing){
            timer = setInterval(() => {
                setTimeLeft((prev) => Math.max(0, prev - 1.0));
            }, 50);
        } 
        return () => clearInterval(timer);
    }, [timeLeft, gameState, isProcessing]);

    useEffect(() => {
        if (timeLeft === 0 && gameState === 'playing' && !isProcessing) {
            handleTimeUp();
        }
    }, [timeLeft, gameState, isProcessing]);

    const startGame = (region) => {
        let filteredCountries =[];

        if (region === 'World') {
            filteredCountries = [...allCountries]
        } else {
            filteredCountries = allCountries.filter(c => 
                c.continent && c.continent.trim().toLowerCase() === region.toLowerCase()
            );
        }
        if (filteredCountries.length < 4) {
            alert(`Not enough countries in region ${region}`);
            return;
        }

        setSelectedRegion(region);
        setRegionCountries(filteredCountries);
        setUsedIds([]);
        setScore(0);
        setGameState('playing');
        generateQuestion(filteredCountries, []);
    };

    const generateQuestion = (pool, currentUsedIds) => {
        const availableForQuestion = pool.filter(c => !currentUsedIds.includes(c.id));
        if(availableForQuestion.length === 0){
            finishGame();
            return;
        } 

        setIsProcessing(false);
        setFeedback({selectedID: null, correctId: null});
        setTimeLeft(100);

        const correctIndex = Math.floor(Math.random() * availableForQuestion.length);
        const correctCountry = availableForQuestion[correctIndex];

        const distractors = pool.filter(c => c.id !== correctCountry.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

        const options = [correctCountry, ...distractors].sort(() => 0.5 - Math.random());

        setCurrentQuestion({
            correct: correctCountry,
            options: options
        });
    };

    const handleAnswer = (selectedCountry) => {
        if (isProcessing) return;
        setIsProcessing(true);

        const isCorrect = selectedCountry.id === currentQuestion.correct.id;

        setFeedback({
            selectedId: selectedCountry.id,
            correctId: currentQuestion.correct.id
        });

        if (isCorrect){
            setScore(prev => prev + 1);
        }

        const newUsedIds = [...usedIds, currentQuestion.correct.id];
        setUsedIds(newUsedIds);

        setTimeout(() => {
            generateQuestion(regionCountries, newUsedIds);
        }, 800);
    };

    const handleTimeUp = () => {
        if (isProcessing) return;
        setIsProcessing(true);

        setFeedback({
            selectedId: null,
            correctId: currentQuestion.correct.id
        });

        const newUsedIds = [...usedIds, currentQuestion.correct.id];
        setUsedIds(newUsedIds);

        setTimeout(() => {
            generateQuestion(regionCountries, newUsedIds);
        }, 800);
    }

    const finishGame = () => {
        setGameState('finished');
        setCurrentQuestion(null);

        if (user) {
            const gameData = {
                points: score,
                maxPoints: regionCountries.length,
                region: selectedRegion,
                gameMode: "1",
                user: { id: user.id }
            };

            fetch('http://localhost:8081/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)

            }).then(() => console.log("Score saved"));
        }
    };

    const getButtonStyle = (option) => {
        let baseStyle = { 
            padding: '15px', 
            fontSize: '1.1rem', 
            cursor: 'pointer', 
            borderRadius: '8px', 
            border: '2px solid #ccc', 
            background: '#7AB2B2',
            transition: 'background 0.3s'
        };

        if (isProcessing) {
            baseStyle.cursor = 'default';
            
            if (option.id === feedback.correctId) {
                baseStyle.background = '#4CAF50';
                baseStyle.color = 'white';
                baseStyle.border = '2px solid #2E7D32';
            }
            else if (option.id === feedback.selectedId && option.id !== feedback.correctId) {
                baseStyle.background = '#FF5252';
                baseStyle.color = 'white';
                baseStyle.border = '2px solid #D32F2F';
            }
        } else {
            baseStyle[':hover'] = { background: '#000000' };
        }
        return baseStyle;
    };

    if (gameState === 'menu') {
        return(
        <div style={{ textAlign: 'center', marginTop: '20px'}}>
            <h3>{t('chooseRegion')}</h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button onClick={() => startGame('Europa')} style={btnStyle}>{t('europe')}</button>
                <button onClick={() => startGame('Azja')} style={btnStyle}>{t('asia')}</button>
                <button onClick={() => startGame('Ameryki')} style={btnStyle}>{t('americas')}</button>
                <button onClick={() => startGame('Afryka')} style={btnStyle}>{t('africa')}</button>
                <button onClick={() => startGame('Oceania')} style={btnStyle}>{t('oceania')}</button>
                <button onClick={() => startGame('World')} style={{...btnStyle, backgroundColor: '#2196F3'}}>{t('world')}</button>
            </div>
        </div>
        );
    }

    if (gameState === 'playing') {
        if (!currentQuestion || !currentQuestion.correct) return <p>{t('loading')}</p>;

        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>{t('score')} {score} / {usedIds.length}</h3>
                    <button onClick={finishGame} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
                        {t('endGameFaster')}
                    </button>
                </div>

                <div style={{ width: '100%', height: '10px', backgroundColor: '#ffffff', borderRadius: '5px', marginBottom: '20px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${timeLeft}%`,
                        height: '100%',
                        backgroundColor: timeLeft > 30 ? '#4CAF50' : '#ff4444',
                        transition: 'width 0.1s linear'
                    }}></div>
                </div>

                <div style={{ 
                    marginBottom: '20px', 
                    height: '260px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={currentQuestion.correct.flagUrl}
                        alt="Flaga"
                        style={{ 
                            maxWidth: '100%', 
                            maxHeight: '100%', 
                            objectFit: 'contain',
                            filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))'
                        }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleAnswer(option)}
                            disabled={isProcessing}
                            style={getButtonStyle(option)}>
                            {getCountryName(option)}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000 
            }}>
                <div style={{ 
                    backgroundColor: 'white', 
                    padding: '40px', 
                    borderRadius: '15px', 
                    textAlign: 'center',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    maxWidth: '400px',
                    width: '90%'
                }}>
                    <h1 style={{ color: '#d32f2f', marginTop: 0 }}>{t('endGame')}</h1>
                    
                    <div style={{ fontSize: '1.2rem', margin: '20px 0' }}>
                        <p>{t('yourScore')}</p>
                        <strong style={{ fontSize: '2rem', color: '#333' }}>{score}</strong>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                           {t('howMany')} {usedIds.length} {t('questions')}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => startGame(selectedRegion)} style={actionBtnStyle}>
                            {t('playAgain')}
                        </button>
                        
                        <button onClick={() => setGameState('menu')} style={{...actionBtnStyle, background: '#555'}}>
                            {t('changeRegion')}
                        </button>
                        
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <button style={{...actionBtnStyle, background: '#333', width: '100%'}}>
                                {t('backHome')}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const btnStyle = { padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', border: 'none', borderRadius: '5px', background: '#4CAF50', color: 'white' };
const actionBtnStyle = { padding: '12px 20px', fontSize: '1rem', cursor: 'pointer', border: 'none', borderRadius: '5px', background: '#2196F3', color: 'white', width: '100%' };

export default FlagQuiz;
