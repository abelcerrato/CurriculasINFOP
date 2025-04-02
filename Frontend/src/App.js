
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Login/Sign-in';
import Dashboard from './Dashboard/Dashboard';
import Departamentos from './Mantenimientos/Departamentos';
import Municipios from './Mantenimientos/Municipios';
import Aldeas from './Mantenimientos/Aldeas';
import Usuarios from './Seguridad/Usuarios';
import { UserProvider } from './Components/UserContext';


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useState } from 'react';
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated"); // Ahora verificamos sessionStorage

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("user"); // Borra datos si la sesión es inválida
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};



function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/Departamentos" element={<ProtectedRoute><Departamentos /></ProtectedRoute>} />
          <Route path="/Municipios" element={<ProtectedRoute><Municipios /></ProtectedRoute>} />
          <Route path="/Aldeas" element={<ProtectedRoute><Aldeas /></ProtectedRoute>} />
          <Route path="/Usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>

    </UserProvider>

  );
}

export default App;
