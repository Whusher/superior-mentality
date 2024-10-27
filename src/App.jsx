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
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
