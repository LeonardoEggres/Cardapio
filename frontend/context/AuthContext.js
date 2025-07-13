import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../api/client';
import StorageService from '../services/StorageService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        authenticated: false,
        user: null,
        isLoading: true,
        role: null,
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await StorageService.getItem('authToken');
            if (token) {
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                try {
                    const { data: user } = await apiClient.get('/user');
                    setAuthState({ token, authenticated: true, user, isLoading: false, role: user.role });
                } catch (error) {
                    await StorageService.deleteItem('authToken');
                    setAuthState({ token: null, authenticated: false, user: null, isLoading: false, role: null });
                }
            } else {
                setAuthState({ token: null, authenticated: false, user: null, isLoading: false, role: null });
            }
        };
        loadToken();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/login', { email, password });
            const { user, access_token } = response.data;
            await StorageService.setItem('authToken', access_token);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setAuthState({ token: access_token, authenticated: true, user, isLoading: false });
            return { success: true };
        } catch (e) {
            return { success: false, error: e.response?.data?.error || 'Email ou senha inválidos' };
        }
    };

    const register = async (name, email, password, password_confirmation, role = 'student') => {
        try {
            console.log('Dados enviados para registro:', { name, email, password, password_confirmation, role });
            const response = await apiClient.post('/register', { name, email, password, password_confirmation, role });
            const { user, access_token } = response.data;
            await StorageService.setItem('authToken', access_token);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setAuthState({ token: access_token, authenticated: true, user, isLoading: false });
            return { success: true };
        } catch (e) {
            const errorMsg = e.response?.data?.errors
                ? Object.values(e.response.data.errors).flat().join('\n')
                : e.response?.data?.error || 'Ocorreu um erro no cadastro.';
            return { success: false, error: errorMsg };
        }
    };

    const logout = async () => {
        try {
            await apiClient.post('/logout');
        } catch (e) {
            console.error("Erro ao fazer logout na API:", e.response?.data);
        } finally {
            await StorageService.deleteItem('authToken');
            delete apiClient.defaults.headers.common['Authorization'];
            setAuthState({ token: null, authenticated: false, user: null, isLoading: false });
        }
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};