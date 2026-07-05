import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="home">
            <div className="home-content">
                <h1>Добро пожаловать в My Cloud</h1>
                <p className="home-description">
                    Безопасное облачное хранилище для ваших файлов. Загружайте, управляйте и делитесь файлами легко.
                </p>

                {!isAuthenticated && (
                    <div className="home-actions">
                        <Link to="/register" className="btn btn-primary">
                            Начать работу
                        </Link>
                        <Link to="/login" className="btn btn-secondary">
                            Войти
                        </Link>
                    </div>
                )}

                {isAuthenticated && (
                    <div className="home-actions">
                        <Link to="/dashboard" className="btn btn-primary">
                            Перейти к файлам
                        </Link>
                    </div>
                )}

                <div className="home-features">
                    <div className="feature">
                        <h3>🔒 Безопасность</h3>
                        <p>Ваши файлы защищены современными технологиями шифрования</p>
                    </div>
                    <div className="feature">
                        <h3>⚡ Быстрый доступ</h3>
                        <p>Загружайте и скачивайте файлы с высокой скоростью</p>
                    </div>
                    <div className="feature">
                        <h3>🔗 Общий доступ</h3>
                        <p>Делитесь файлами с помощью уникальных ссылок</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;