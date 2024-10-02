import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import App from './App.jsx'
import './index.css'

//Layouts to preview
import MainPageL from './layouts/MainPageL.jsx'
import Error404 from './pages/Error404.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename='/'>
      <Routes>
        <Route path="/" element={<MainPageL/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        {/**ERROR 404 handler */}
        <Route path="*" element={<Error404/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
