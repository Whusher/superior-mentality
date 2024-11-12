import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
// Layouts y páginas
import MainPageL from "./layouts/MainPageL";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Schedule from "./user/Schedule";
import ActividadesList from "./user/actividades/Actividades"
import ColorSequence from "./user/actividades/ColorSequence"
import DrawingGame from "./user/actividades/DrawingGame"
import FruitCatcher from "./user/actividades/FruitCatcher"
import MemoryGame from "./user/actividades/MemoryGame"
import SimonSays from "./user/actividades/SimonSays"



// src/App.jsx
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPageL />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/actividades/Actividades" element={<ProtectedRoute> <ActividadesList /> </ProtectedRoute>} />
            <Route path="/actividades/ColorSequence" element={<ProtectedRoute> <ColorSequence /> </ProtectedRoute>} />
            <Route path="/actividades/DrawingGame" element={<ProtectedRoute> <DrawingGame /> </ProtectedRoute>} />
            <Route path="/actividades/FruitCatcher" element={<ProtectedRoute> <FruitCatcher /> </ProtectedRoute>} />
            <Route path="/actividades/MemoryGame" element={<ProtectedRoute><MemoryGame /> </ProtectedRoute>} />
            <Route path="/actividades/SimonSays" element={<ProtectedRoute><SimonSays /></ProtectedRoute>} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
      <ToastContainer/>
    </AuthProvider>
  );
}

export default App;
