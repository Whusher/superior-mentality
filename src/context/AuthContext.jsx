// src/context/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import {AuthEndpoint} from '../utils/EndpointExporter'
const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay una sesión activa al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      const userData = localStorage.getItem('userData');
      if (token && userData) {
        try {
          // Opcional: Verificar token con el backend
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: JSON.parse(userData)
          });
        } catch (error) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          dispatch({ 
            type: 'AUTH_FAILURE', 
            payload: 'Sesión expirada' 
          });
          console.log(error);
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, []);

  // Función de login mejorada
  const login = async (credentials) => {
    dispatch({ type: 'AUTH_LOADING' });

    try {
      const response = await fetch(`${AuthEndpoint}/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // credentials: 'include',
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error en el inicio de sesión');
      }

      const data = await response.json();

      // Guardar datos en localStorage
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify({
        email: data.user.email,
        name: data.user.name,
        id: data.user.id
      }));

      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: data.user 
      });

      return { success: true };
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: error.message 
      });
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Opcional: Llamar al endpoint de logout en el backend
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      localStorage.clear()
      dispatch({ type: 'LOGOUT' });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};