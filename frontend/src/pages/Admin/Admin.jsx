import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usersAPI } from '../../api/client';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log('Текущий пользователь:', user);
        console.log('is_admin:', user?.is_admin);
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await usersAPI.getAll();
            console.log('Получены пользователи:', response.data);
            setUsers(response.data);
        } catch (err) {
            console.error('Ошибка загрузки пользователей:', err);
            const errorMsg = err.response?.data?.detail?.detail
                || err.response?.data?.detail
                || err.message
                || 'Ошибка загрузки пользователей';
            setError(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleAdmin = async (userId, currentStatus) => {
        try {
            await usersAPI.update(userId, { is_admin: !currentStatus });
            await fetchUsers();
        } catch (err) {
            console.error('Ошибка обновления:', err);
            setError('Ошибка обновления пользователя');
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Удалить пользователя ${username}?`)) {
            try {
                await usersAPI.delete(userId);
                await fetchUsers();
            } catch (err) {
                console.error('Ошибка удаления:', err);
                setError('Ошибка удаления пользователя');
            }
        }
    };

    if (isLoading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="admin-page">
            <h1>Админ-панель</h1>

            <div className="admin-info">
                <p>Ваш статус: <strong>{user?.is_admin ? 'Администратор' : 'Обычный пользователь'}</strong></p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Логин</th>
                            <th>Полное имя</th>
                            <th>Email</th>
                            <th>Админ</th>
                            <th>Файлов</th>
                            <th>Размер</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.full_name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={u.is_admin}
                                        onChange={() => handleToggleAdmin(u.id, u.is_admin)}
                                    />
                                </td>
                                <td>{u.files_count}</td>
                                <td>{formatFileSize(u.files_total_size)}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn btn-small btn-danger"
                                            onClick={() => handleDeleteUser(u.id, u.username)}
                                            disabled={u.id === user?.id}
                                            title={u.id === user?.id ? 'Нельзя удалить себя' : ''}
                                        >
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !error && (
                    <p className="empty-state">Пользователи не найдены</p>
                )}
            </div>
        </div>
    );
};

const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export default Admin;