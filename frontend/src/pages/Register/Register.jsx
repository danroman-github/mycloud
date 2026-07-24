import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import style from './Register.module.css';

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

    const [touched, setTouched] = useState({})
    const [validationErrors, setValidationErrors] = useState({});

    const validateField = (name, value, allData) => {
        let error = null;

        switch (name) {
            case 'username':
                if (value && !/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(value)) {
                    error = 'Логин: 4-20 символов, начинается с буквы, только латиница и цифры';
                }
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Некорректный формат email';
                }
                break;
            case 'password':
                if (value) {
                    if (value.length < 6) {
                        error = 'Пароль должен содержать минимум 6 символов';
                    } else if (!/[A-Z]/.test(value)) {
                        error = 'Пароль должен содержать хотя бы одну заглавную букву';
                    } else if (!/\d/.test(value)) {
                        error = 'Пароль должен содержать хотя бы одну цифру';
                    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
                        error = 'Пароль должен содержать хотя бы один специальный символ';
                    }
                }
                break;
            case 'password_confirm':
                if (value && value !== allData.password) {
                    error = 'Пароли не совпадают';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const validateAll = () => {
        const errors = {};
        Object.keys(formData).forEach(key => {
            const err = validateField(key, formData[key], formData);
            if (err) errors[key] = err;
        });
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        const newFormData = {
            ...formData,
            [name]: value,
        };
        setFormData(newFormData);

        if (!touched[name]) {
            setTouched(prev => ({ ...prev, [name]: true }));
        }

        if (touched[name] || value.length > 0) {
            const fieldError = validateField(name, value, newFormData);
            setValidationErrors(prev => ({
                ...prev,
                [name]: fieldError,
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        const fieldError = validateField(name, value, formData);
        setValidationErrors(prev => ({
            ...prev,
            [name]: fieldError
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        if (!validateAll()) {
            const allTouched = {};
            Object.keys(formData).forEach(key => allTouched[key] = true);
            setTouched(allTouched);
            return;
        }

        const result = await dispatch(register(formData));

        if (register.fulfilled.match(result)) {
            navigate('/dashboard');
        }
    };

    const hasErrors = Object.values(validationErrors).
        some(err => err !== null && err !== undefined);

    return (
        <div className={styles.page}>
            <div className="styles.container">
                <h2 className={styles.title}>Регистрация</h2>

                {error && (
                    <div className={styles.serverError}>
                        {typeof error.detail === 'string'
                            ? error.detail
                            : Object.values(error.detail || {}).flat().join(', ')}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>Логин *</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${styles.input} ${validationErrors.username ? styles.inputError : ''}`}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.username && (
                            <span className={styles.errorText}>{validationErrors.username}</span>
                        )}
                        {!validationErrors.username && (
                            <small className={styles.hint}>4-20 символов, начинается с буквы, только латиница и цифры</small>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="full_name" className={styles.label}>Полное имя *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={styles.input}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.email && (
                            <span className={styles.errorText}>{validationErrors.email}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Пароль *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${styles.input} ${validationErrors.password ? styles.inputError : ''}`}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.password && (
                            <span className={styles.errorText}>{validationErrors.password}</span>
                        )}
                        {!validationErrors.password && formData.password && (
                            <small style={{ color: 'green' }}>✅ Пароль соответствует требованиям</small>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password_confirm className={styles.label}">Подтверждение пароля *</label>
                        <input
                            type="password"
                            id="password_confirm"
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`${styles.input} ${validationErrors.password_confirm ? styles.inputError : ''}`}
                            required
                            disabled={isLoading}
                        />
                        {validationErrors.password_confirm && (
                            <span className={styles.errorText}>{validationErrors.password_confirm}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading || hasErrors}
                    >
                        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;