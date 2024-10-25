// index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

//AuthProvider y el hook useAuth
import {AuthProvider, useAuth} from './context/AuthContext'

// Layouts y páginas
import MainPageL from './layouts/MainPageL';
import Error404 from './pages/Error404';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Schedule from './user/Schedule';

// Componente para rutas protegidas
function ProtectedRoute({ element }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" />;
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter basename="/">
                <Routes>
                    {/* Public Access */}
                    <Route path="/" element={<MainPageL />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    {/* ERROR 404 handler */}
                    <Route path="*" element={<Error404 />} />
                    {/* Protected Route */}
                    <Route path="/schedule" element={<ProtectedRoute element={<Schedule />} />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>
);
