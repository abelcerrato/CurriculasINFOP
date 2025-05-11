import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import SignIn from './Login/Sign-in';
import TablaCurriculas from './Curriculas/TablaCurriculas';
import Curriculas from './Curriculas/Curriculas';
import Programas from './Programas/Programas';
import Dashboard from './Dashboard/Dashboard';
import Departamentos from './Mantenimientos/Departamentos';
import Municipios from './Mantenimientos/Municipios';
import Aldeas from './Mantenimientos/Aldeas';
import Etnias from './Mantenimientos/Etnias';
import TipoEducador from './Mantenimientos/TipoEducador';
import AreasFormacion from './Mantenimientos/AreasFormacion';
import Disacapacidad from './Mantenimientos/Discapacidades';
import NivelesAcadémicos from './Mantenimientos/NivelesAcademicos';
import GradosAcademicos from './Mantenimientos/GradosAcademicos';
import Usuarios from './Seguridad/Usuarios';
import RolesyPermisos from './Seguridad/RolesyPermisos';
import Instructores from './Maestros/Maestros';
import Estudiantes from './Estudiantes/Estudiante';
import Nacionalidad from './Mantenimientos/Nacionalidad';
import TablaAccionFormativa from './AccionFormativa/TablaAccionFormativa';
import AccionFormativa from './AccionFormativa/AccionFormativa';
import { UserProvider } from './Components/UserContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  React.useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Verificar validez del token cada 10 segundos
  React.useEffect(() => {
    const checkSessionValidity = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data.valid) {
          logoutAndRedirect();
        }
      } catch (error) {
        logoutAndRedirect();
      }
    };

    const logoutAndRedirect = () => {
      localStorage.clear();
      sessionStorage.clear();
      Swal.fire({
        icon: "info",
        title: "Sesión cerrada",
        text: "Tu sesión ha sido cerrada porque se inició desde otro dispositivo.",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/", { replace: true });
    };

    const interval = setInterval(checkSessionValidity, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

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


            {/* AccionFormativa */}
            <Route path="/Acción-Formativa" element={<TablaAccionFormativa />} />
            <Route path="/Acción-Formativa/Registro" element={<AccionFormativa />} />


            {/* Curriculas */}
            <Route path="/Currículas" element={<TablaCurriculas />} />
            <Route path="/Currículas/Registro" element={<Curriculas />} />

            {/* Programas */}
            <Route path="/Programas" element={<Programas />} />

            {/* Instructores */}
            <Route path="/Instructores" element={<Instructores />} />

            {/* Estudiantes */}
            <Route path="/Estudiantes" element={<Estudiantes />} />


            {/* Mantenimientos */}
            <Route path="/Mantenimiento/Departamentos" element={<Departamentos />} />
            <Route path="/Mantenimiento/Municipios" element={<Municipios />} />
            <Route path="/Mantenimiento/Aldeas" element={<Aldeas />} />
            <Route path="/Mantenimiento/Etnias" element={<Etnias />} />
            <Route path="/Mantenimiento/Tipo-Educador" element={<TipoEducador />} />
            <Route path="/Mantenimiento/Área-Formación" element={<AreasFormacion />} />
            <Route path="/Mantenimiento/Discapacidades" element={<Disacapacidad />} />
            <Route path="/Mantenimiento/Niveles-Académicos" element={<NivelesAcadémicos />} />
            <Route path="/Mantenimiento/Grados-Académicos" element={<GradosAcademicos />} />
            <Route path="/Mantenimiento/Nacionalidades" element={<Nacionalidad />} />

            {/* Seguridad */}
            <Route path="/Seguridad/Usuarios" element={<Usuarios />} />
            <Route path="/Seguridad/Roles-y-Permisos" element={<RolesyPermisos />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;