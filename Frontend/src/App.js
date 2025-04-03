import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import SignIn from './Login/Sign-in';
import Dashboard from './Dashboard/Dashboard';
import Departamentos from './Mantenimientos/Departamentos';
import Municipios from './Mantenimientos/Municipios';
import Aldeas from './Mantenimientos/Aldeas';
import Etnias from './Mantenimientos/Etnias';
import TipoEducador from './Mantenimientos/TipoEducador';
import AreasFormacion from './Mantenimientos/AreasFormacion';
import Disacapacidad from './Mantenimientos/Discapacidades';
import Usuarios from './Seguridad/Usuarios';
import { UserProvider } from './Components/UserContext';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  React.useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Outlet /> : null;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<SignIn />} />
          
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Mantenimientos */}
            <Route path="/Mantenimiento/Departamentos" element={<Departamentos />} />
            <Route path="/Mantenimiento/Municipios" element={<Municipios />} />
            <Route path="/Mantenimiento/Aldeas" element={<Aldeas />} />
            <Route path="/Mantenimiento/Etnias" element={<Etnias />} />
            <Route path="/Mantenimiento/Tipo-Educador" element={<TipoEducador />} />
            <Route path="/Mantenimiento/Área-Formación" element={<AreasFormacion />} />
            <Route path="/Mantenimiento/Discapacidades" element={<Disacapacidad />} />
            
            <Route path="/Usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;