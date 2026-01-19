import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setUser({ username });
            apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiClient.post('login/', { username, password });
            const { token, username: user_name } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', user_name);
            apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
            setUser({ username: user_name });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            const response = await apiClient.post('register/', { username, password });
            const { token, username: user_name } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('username', user_name);
            apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
            setUser({ username: user_name });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        delete apiClient.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
