import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

const FlagGame3 = () => {
    const{ t, language } = useLanguage();
    const { user } = useAuth();
    const getCountryName = (country) => {
        if(language !== 'pl'){
            const rawName = country.name_en || country.name;
            return rawName.split(',')[0].trim();
        }
        return country.name.split(',')[0].trim();
    }

    const [allCountries, setAllCountries] = useState([]);
    const [gameState, setGameState] = useState('menu');
    
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(100);
    const [selectedRegion, setSelectedRegion] = useState('');
    
    const [userAnswer, setUserAnswer] = useState('');
    const [feedbackStatus, setFeedbackStatus] = useState('neutral');
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [usedIds, setUsedIds] = useState([]); 
    const inputRef = useRef(null);

    const normalizeText = (text) => {
        if (!text) return "";
        return text
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ł/g, "l");
    };

    useEffect(() => {
        fetch('http://localhost:8081/api/countries')
            .then(res => res.json())
            .then(data => setAllCountries(data))
            .catch(err => console.error("Błąd API: ", err));
    }, []);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0 && !isProcessing) {
            timer = setInterval(() => {
                setTimeLeft((prev) => Math.max(0, prev - 0.5));
            }, 50);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, isProcessing]);

    useEffect(() => {
        if (timeLeft === 0 && gameState === 'playing' && !isProcessing) {
            handleTimeUp();
        }
    }, [timeLeft, gameState, isProcessing]);

    useEffect(() => {
        if (gameState === 'playing' && !isProcessing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentQuestion, isProcessing, gameState]);

    const startGame = (region) => {
        let filtered = [];
        if (region === 'World') {
            filtered = [...allCountries];
        } else {
            filtered = allCountries.filter(c => 
                c.continent && c.continent.trim().toLowerCase() === region.toLowerCase()
            );
        }

        if (filtered.length < 4) {
            alert(`Za mało krajów w regionie ${region} (min. 4)!`);
            return;
        }

        setSelectedRegion(region);
        setUsedIds([]); 
        setScore(0);
        setGameState('playing');
        generateQuestion(filtered, []); 
    };

    const generateQuestion = (pool, currentUsedIds) => {
        const availableForQuestion = pool.filter(c => !currentUsedIds.includes(c.id));

        if (availableForQuestion.length === 0) {
            finishGame();
            return;
        }

        setIsProcessing(false);
        setFeedbackStatus('neutral');
        setUserAnswer('');
        setTimeLeft(100);

        const correctIndex = Math.floor(Math.random() * availableForQuestion.length);
        const correctCountry = availableForQuestion[correctIndex];

        setCurrentQuestion({
            correct: correctCountry,
            pool: pool
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isProcessing) return;
        if (!userAnswer.trim()) return;

        setIsProcessing(true);

        const normalizedUser = normalizeText(userAnswer);
        let possibleAnswers = [];

        if(language === 'pl'){
            possibleAnswers = currentQuestion.correct.name.split(',')
        } else {
            const rawEn = currentQuestion.correct.name_en || currentQuestion.correct.name;
            possibleAnswers = rawEn.split(',');
        }

        const isCorrect = possibleAnswers.some(answer => normalizeText(answer) === normalizedUser);
        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedbackStatus('correct');
        } else {
            setFeedbackStatus('wrong');
        }

        const newUsedIds = [...usedIds, currentQuestion.correct.id];
        setUsedIds(newUsedIds);

        setTimeout(() => {
            generateQuestion(currentQuestion.pool, newUsedIds);
        }, 1000);
    };

    const handleTimeUp = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setFeedbackStatus('wrong');

        const newUsedIds = [...usedIds, currentQuestion.correct.id];
        setUsedIds(newUsedIds);

        setTimeout(() => {
            generateQuestion(currentQuestion.pool, newUsedIds);
        }, 900);
    };

    const finishGame = () => {
        setGameState('finished');
        setCurrentQuestion(null);

        let maxPoints = 0;
        if (selectedRegion === 'World') {
            maxPoints = allCountries.length;
        } else {
            maxPoints = allCountries.filter(c => 
                c.continent && c.continent.trim().toLowerCase() === selectedRegion.toLowerCase()).length;
        }

        if (user) {
            const gameData = {
                points: score,
                maxPoints: maxPoints,
                region: selectedRegion,
                gameMode: "3",
                user: { id: user.id }
            };

            fetch('http://localhost:8081/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)

            }).then(() => console.log("Score saved"));
        }
    };

    const getInputStyle = () => {
        let style = {
            padding: '15px',
            fontSize: '1.2rem',
            borderRadius: '8px',
            borderColor: '#7AB2B2',
            borderStyle: 'solid',
            width: '80%',
            textAlign: 'center',
            outline: 'none',
            transition: 'border-color 0.3s, background-color 0.3s'
        };

        if (feedbackStatus === 'correct') {
            style.borderColor = '#4CAF50';
            style.backgroundColor = '#E8F5E9';
            style.color = '#2E7D32';
        } else if (feedbackStatus === 'wrong') {
            style.borderColor = '#FF5252';
            style.backgroundColor = '#FFEBEE';
            style.color = '#C62828';
        }

        return style;
    };

    if (gameState === 'menu') {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h3>{t('chooseRegion')}</h3>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
                    <button onClick={() => startGame('Europa')} style={btnStyle}>{t('europe')}</button>
                    <button onClick={() => startGame('Azja')} style={btnStyle}>{t('asia')}</button>
                    <button onClick={() => startGame('Ameryki')} style={btnStyle}>{t('americas')}</button>
                    <button onClick={() => startGame('Afryka')} style={btnStyle}>{t('africa')}</button>
                    <button onClick={() => startGame('Oceania')} style={btnStyle}>{t('oceania')}</button>
                    <button onClick={() => startGame('World')} style={{ ...btnStyle, backgroundColor: '#2196F3' }}>{t('world')}</button>
                </div>
            </div>
        );
    }

    if (gameState === 'playing') {
        if (!currentQuestion) return <p>{t('loading')}</p>;

        return (
            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>{t('score')} {score} / {usedIds.length}</h3>
                    <button onClick={finishGame} style={{ background: '#333', color: 'white', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
                        {t('endGameFaster')}
                    </button>
                </div>

                <div style={{ width: '100%', height: '10px', backgroundColor: '#e0e0e0', borderRadius: '5px', marginBottom: '20px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${timeLeft}%`,
                        height: '100%',
                        backgroundColor: timeLeft > 30 ? '#4CAF50' : '#ff4444',
                        transition: 'width 0.1s linear'
                    }}></div>
                </div>

                <div style={{ 
                    marginBottom: '20px', height: '220px', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center' 
                }}>
                    <img
                        src={currentQuestion.correct.flagUrl}
                        alt="Flaga"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))' }}
                    />
                </div>

                <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={t('typePlaceholder')}
                        disabled={isProcessing}
                        style={getInputStyle()}
                        autoComplete="off"
                    />
                    <br />
                    <button 
                        type="submit" 
                        disabled={isProcessing || !userAnswer.trim()}
                        style={{ marginTop: '15px', padding: '10px 30px', fontSize: '1rem', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', opacity: isProcessing ? 0.5 : 1 }}
                    >
                        {t('check')}
                    </button>
                </form>

                {feedbackStatus === 'wrong' && (
                    <div style={{ marginTop: '10px', color: '#D32F2F', fontWeight: 'bold', fontSize: '1.2rem', animation: 'fadeIn 0.5s' }}>
                        {t('correctAnswer')} {getCountryName(currentQuestion.correct)}
                    </div>
                )}
                 {feedbackStatus === 'correct' && (
                    <div style={{ marginTop: '10px', color: '#2E7D32', fontWeight: 'bold', fontSize: '1.2rem', animation: 'fadeIn 0.5s' }}>
                        {t('goodJob')}
                    </div>
                )}
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
                justifyContent: 'center', alignItems: 'center', zIndex: 1000 
            }}>
                <div style={{ 
                    backgroundColor: 'white', padding: '40px', borderRadius: '15px', 
                    textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    maxWidth: '400px', width: '90%'
                }}>
                    <h1 style={{ color: '#d32f2f', marginTop: 0 }}>{t('endGame')}</h1>
                    <div style={{ fontSize: '1.2rem', margin: '20px 0' }}>
                        <p>{t('yourScore')}</p>
                        <strong style={{ fontSize: '2rem', color: '#333' }}>{score}</strong>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>{t('howMany')} {usedIds.length} {t('questions')}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button onClick={() => startGame(selectedRegion)} style={btnStyle}>{t('playAgain')}</button>
                        <button onClick={() => setGameState('menu')} style={{...btnStyle, background: '#555'}}>{t('changeRegion')}</button>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <button style={{...btnStyle, background: '#333', width: '100%'}}>{t('backHome')}</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

const btnStyle = { padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', border: 'none', borderRadius: '5px', background: '#4CAF50', color: 'white' };

export default FlagGame3;