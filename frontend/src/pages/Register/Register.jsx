import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import './Register.css';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        password_confirm: '',
    });

    const [validationErrors, setValidationErrors] = useState({});

    const validateForm = () => {
        const errors = {};

        if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(formData.username)) {
            errors.username = 'Логин: 4-20 символов, начинается с буквы, только латиница и цифры';
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            errors.email = 'Некорректный формат email';
        }

        if (formData.password.length < 6) {
            errors.password = 'Пароль должен содержать минимум 6 символов';
        } else if (!/[A-ZА-Я]/.test(formData.password)) {
            errors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
        } else if (!/\d/.test(formData.password)) {
            errors.password = 'Пароль должен содержать хотя бы одну цифру';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
            errors.password = 'Пароль должен содержать хотя бы один специальный символ';
        }

        if (formData.password !== formData.password_confirm) {
            errors.password_confirm = 'Пароли не совпадают';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: null,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        if (!validateForm()) {
            return;
        }

        const result = await dispatch(register(formData));

        if (register.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <h2>Регистрация</h2>

                {error && (
                    <div className="error-message">
                        {typeof error.detail === 'string'
                            ? error.detail
                            : Object.values(error.detail || {}).flat().join(', ')}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Логин *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.username && (
                            <span className="field-error">{validationErrors.username}</span>
                        )}
                        <small>4-20 символов, начинается с буквы, только латиница и цифры</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="full_name">Полное имя *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.email && (
                            <span className="field-error">{validationErrors.email}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.password && (
                            <span className="field-error">{validationErrors.password}</span>
                        )}
                        <small>Минимум 6 символов, заглавная буква, цифра, спецсимвол</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirm">Подтверждение пароля *</label>
                        <input
                            type="password"
                            id="password_confirm"
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.password_confirm && (
                            <span className="field-error">{validationErrors.password_confirm}</span>
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className="register-footer">
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;