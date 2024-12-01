import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
// Layouts y páginas
import MainPageL from "./layouts/MainPageL";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import News from "./pages/News.jsx";
import Schedule from "./user/Schedule";
import ActividadesList from "./user/actividades/Actividades"
import ColorSequence from "./user/actividades/ColorSequence"
import DrawingGame from "./user/actividades/DrawingGame"
import FruitCatcher from "./user/actividades/FruitCatcher"
import MemoryGame from "./user/actividades/MemoryGame"
import SimonSays from "./user/actividades/SimonSays"
import EditProfilePreferences from "./user/EditProfilePreferences.jsx";
import EditProfileMusic from "./user/EditProfileMusic.jsx";
import EditProfileImage from "./user/EditProfileImage.jsx";
import EditProfileColors from "./user/EditProfileColors.jsx";
import Profile from "./user/Profile.jsx";
import Subscription from "./user/Subscription.jsx";
import Thankyou from "./user/Thankyou.jsx";
import Records from "./user/Records.jsx";
import History from "./user/History"
import ViewGraphRecords from "./user/GraphRecords.jsx";
import Failure from "./user/Failure"
import Pending from "./user/Pending"
import Confirmation from "./pages/Confirmation.jsx";


// src/App.jsx
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPageL />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/news" element={<News />} />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <Schedule />
              </ProtectedRoute>
            }
          />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/activities" element={<ProtectedRoute> <ActividadesList /> </ProtectedRoute>} />
            <Route path="/graph" element={<ProtectedRoute> <ViewGraphRecords /> </ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute> <History/> </ProtectedRoute>} />
            <Route path="/actividades/ColorSequence" element={<ProtectedRoute> <ColorSequence /> </ProtectedRoute>} />
            <Route path="/actividades/DrawingGame" element={<ProtectedRoute> <DrawingGame /> </ProtectedRoute>} />
            <Route path="/actividades/FruitCatcher" element={<ProtectedRoute> <FruitCatcher /> </ProtectedRoute>} />
            <Route path="/actividades/MemoryGame" element={<ProtectedRoute><MemoryGame /> </ProtectedRoute>} />
            <Route path="/actividades/SimonSays" element={<ProtectedRoute><SimonSays /></ProtectedRoute>} />
            <Route path="/editProfilePreferences" element={<ProtectedRoute><EditProfilePreferences /></ProtectedRoute>} />
            <Route path="/editProfileMusic" element={<ProtectedRoute><EditProfileMusic /></ProtectedRoute>} />
            <Route path="/editProfileImage" element={<ProtectedRoute><EditProfileImage /></ProtectedRoute>} />
            <Route path="/editProfileColors" element={<ProtectedRoute><EditProfileColors /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
            <Route path="/thankyou" element={<ProtectedRoute><Thankyou /></ProtectedRoute>} />
            <Route path="/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
            <Route path="/failure" element={<ProtectedRoute><Failure /></ProtectedRoute>} />
            <Route path="/pending" element={<ProtectedRoute><Pending /></ProtectedRoute>} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Router>
      <ToastContainer/>
    </AuthProvider>
  );
}

export default App;
