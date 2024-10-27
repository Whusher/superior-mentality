import { createRoot } from 'react-dom/client';
import './index.css';

//AuthProvider y el hook useAuth
import {AuthProvider} from './context/AuthContext'
import App from './App';

createRoot(document.getElementById('root')).render(
        <AuthProvider>
            <App/>
        </AuthProvider>
);
