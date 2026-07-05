import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, forceLogout } from '../../store/slices/authSlice';
import './Navigation.css';

const Navigation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            const result = await dispatch(logout());
            navigate('/');
        } catch (error) {
            dispatch(forceLogout());
            navigate('/');
        }
    };

    return (
        <nav className="navigation">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    My Cloud
                </Link>

                <ul className="nav-menu">
                    {!isAuthenticated ? (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link">
                                    Вход
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link">
                                    Регистрация
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-link">
                                    Мои файлы
                                </Link>
                            </li>
                            {user?.is_admin && (
                                <li className="nav-item">
                                    <Link to="/admin" className="nav-link">
                                        Админ-панель
                                    </Link>
                                </li>
                            )}
                            <li className="nav-item">
                                <span className="nav-user">
                                    👤 {user?.username}
                                </span>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-link nav-logout">
                                    Выход
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;