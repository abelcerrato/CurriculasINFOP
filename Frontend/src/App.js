
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './Login/Sign-in';
import Dashboard from './Dashboard/Dashboard';
import Departamentos from './Components/table/Departamentos';
import Municipios from './Components/table/Municipios';
import Aldeas from './Components/table/Aldeas';
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Departamentos" element={<Departamentos />} />
          <Route path="/Municipios" element={<Municipios />} />
          <Route path="/Aldeas" element={<Aldeas />} />
          <Route path="/Usuarios" element={<Usuarios />} />
        </Routes>
      </BrowserRouter>

    </UserProvider>

  );
}

export default App;
