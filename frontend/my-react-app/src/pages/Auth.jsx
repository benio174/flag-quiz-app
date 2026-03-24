import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Auth = () => {

    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';

        try {
            const res = await fetch(`http://localhost:8081/api${endpoint}`, {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({username, password})
            });

            if (res.ok) {
                if (isLogin){
                    const data = await res.json();
                    login(data);
                    navigate('/');
                } else {
                    alert(t('alert1'))
                    setIsLogin(true);
                }
            } else {
                if (isLogin) {
                    alert(t('alert2'))
                } else {
                alert(t('alert4'))
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

return (
        <div className="page" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2>{isLogin ? t('login') : t('register')}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input placeholder="Login" value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '10px' }} />
                <input type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px' }} />
                <button type="submit" className="nav-btn">{isLogin ? t('log_in') : t('sign_in')}</button>
            </form>
            <p style={{ marginTop: '20px', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? t('registerInfo') : t('loginInfo')}
            </p>
        </div>
    );
};
export default Auth;