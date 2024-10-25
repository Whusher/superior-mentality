import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthEndpoint } from '../utils/EndpointExporter';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Al montar el componente, verificar si el usuario está autenticado
        axios.get(`${AuthEndpoint}/verify-token`,{ withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    setIsAuthenticated(true);
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
