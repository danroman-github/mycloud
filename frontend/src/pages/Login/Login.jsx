import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import './Login.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        const result = await dispatch(login(formData));

        if (login.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Вход в систему</h2>

                {error && (
                    <div className="error-message">
                        {error.detail?.detail || error.detail?.non_field_errors?.[0] || 'Ошибка входа'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Логин</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p className="login-footer">
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;