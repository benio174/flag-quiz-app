import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const [scores, setScores] = useState([]);
    const [activeTab, setActiveTab] = useState('Europa');
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const getRegionDisplayName = (regionKey) => {
        switch (regionKey) {
            case 'Europa': return t('europe');
            case 'Azja' : return t('asia');
            case 'Afryka' : return t('africa');
            case 'Ameryki' : return t('americas');
            case 'Oceania' : return t('oceania');
            default : return regionKey;
        }
    };

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:8081/api/scores/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    const sorted = data.sort((a, b) => {
                        if (b.points !== a.points) {
                            return b.points - a.points;
                        }
                        return new Date(b.date) - new Date(a.date);
                    });
                    setScores(sorted);
                })
                .catch(err => console.error(err));
            }

    }, [user]);

    if (!user) return <p>{t('alert3')}</p>;

    const regionScores = scores.filter(s => s.region === activeTab);
    const top10Scores = regionScores.slice(0, 10);

    const maxScoreInRegion = regionScores.length > 0 ? Math.max(...regionScores.map(s => s.points)) : 0;
    const getTabStyle = (regionName) => ({
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        background: activeTab === regionName ? '#2196F3' : '#ddd',
        color: activeTab === regionName ? 'white' : '#333',
        borderRadius: '5px',
        fontWeight: 'bold',
        transition: '0.3s'
    });

  return (
        <div className="page" style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>{t('user')}👤{user.username}</h2>
                <button onClick={handleLogout} className="nav-btn" style={{ background: '#FF5252', fontSize: '0.9rem' }}>
                    {t('log_out')}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
                <button onClick={() => setActiveTab('Europa')} style={getTabStyle('Europa')}>{t('europe')}</button>
                <button onClick={() => setActiveTab('Azja')} style={getTabStyle('Azja')}>{t('asia')}</button>
                <button onClick={() => setActiveTab('Afryka')} style={getTabStyle('Afryka')}>{t('africa')}</button>
                <button onClick={() => setActiveTab('Ameryki')} style={getTabStyle('Ameryki')}>{t('americas')}</button>
                <button onClick={() => setActiveTab('Oceania')} style={getTabStyle('Oceania')}>{t('oceania')}</button>
                <button onClick={() => setActiveTab('World')} style={getTabStyle('World')}>{t('world')}</button>
                
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#444' }}>{t('history')} {getRegionDisplayName(activeTab)}</h3>
                
                {regionScores.length === 0 ? (
                    <p style={{ color: '#888', fontStyle: 'italic' }}>{t('noGames')}</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', color: '#666' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>{t('mode')}</th>
                                <th style={{ padding: '10px', textAlign: 'center' }}>{t('score')}</th>
                                <th style={{ padding: '10px', textAlign: 'right' }}>{t('date')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top10Scores.map(s => {
                                const isBest = s.points === maxScoreInRegion && s.points > 0;
                                
                                return (
                                    <tr key={s.id} style={{ 
                                        borderBottom: '1px solid #f0f0f0',
                                        backgroundColor: isBest ? '#E8F5E9' : 'transparent',
                                        fontWeight: isBest ? 'bold' : 'normal',
                                        color: isBest ? '#2E7D32' : 'black'
                                    }}>
                                        <td style={{ padding: '12px 10px' }}>{s.gameMode}</td>
                                        
                                        <td style={{ padding: '12px 10px', textAlign: 'center', fontSize: '1.1rem' }}>
                                            {s.points} / {s.maxPoints || '?'} 
                                            {isBest && <span style={{ marginLeft: '10px' }}>🏆</span>}
                                        </td>
                                        
                                        <td style={{ padding: '12px 10px', textAlign: 'right', fontSize: '0.9rem', color: isBest ? '#2E7D32' : '#888' }}>
                                            {new Date(s.date).toLocaleDateString()} {new Date(s.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Profile;