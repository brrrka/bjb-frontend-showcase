import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import useUserStore from '../data/userStore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);
    const { setUserData } = useUserStore();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('/user');
                setUser(response.data);
                setUserData(response.data);
            } catch (error) {
                console.error('Not authenticated:', error);
                localStorage.removeItem('auth_token');
                setUser(null);
                setUserData(null);
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        };

        if (localStorage.getItem('auth_token')) {
            checkAuth();
        } else {
            setUser(null);
            setLoading(false);
            setInitialized(true);
        }
    }, []);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await api.post('/login', credentials);
            const token = response.data.data.token;
            const userData = response.data.data.user;

            localStorage.setItem('auth_token', token);
            setUser(userData);
            setUserData(userData);

            return true; // Return success status
        } catch (error) {
            console.error("Login error:", error);
            return false; // Return failure status
        } finally {
            setLoading(false);
        }
    };


    const logout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('auth_token');
            setUser(null);
            setUserData(null);
            return true; // Return success status
        } catch (error) {
            console.error('Logout error:', error);
            return false; // Return failure status
        }
    };

    if (!initialized) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);