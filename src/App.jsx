import { BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";

//AuthProvider y el hook useAuth
import { useAuth } from "./context/AuthContext";

// Layouts y páginas
import MainPageL from "./layouts/MainPageL";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Schedule from "./user/Schedule";
import ActividadesList from "./user/actividades/ActividadesList"
import ColorSequence from "./user/actividades/ColorSequence"
import DrawingGame from "./user/actividades/DrawingGame"
import FruitCatcher from "./user/actividades/FruitCatcher"
import MemoryGame from "./user/actividades/MemoryGame"
import SimonSays from "./user/actividades/SimonSays"

function App() {
  const { state } = useAuth();
  return (
    <BrowserRouter basename="/">
      <Routes>
        {/* Public Access */}
        <Route path="/" element={<MainPageL />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* ERROR 404 handler */}
        <Route path="*" element={<Error404 />} />
        {/* Protected Route */}
        {state.emailUser && (
          <>
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/actividades/Actividades" element={<ActividadesList />} />
            <Route path="/actividades/ColorSequence" element={<ColorSequence />} />
            <Route path="/actividades/DrawingGame" element={<DrawingGame />} />
            <Route path="/actividades/FruitCatcher" element={<FruitCatcher />} />
            <Route path="/actividades/MemoryGame" element={<MemoryGame />} />
            <Route path="/actividades/SimonSays" element={<SimonSays />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
