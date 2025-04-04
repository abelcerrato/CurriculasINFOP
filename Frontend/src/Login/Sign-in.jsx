import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Card,
  Typography,
  InputAdornment,
  IconButton,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff, Person } from "@mui/icons-material";
import LogoCONED from "../Components/img/logos_CONED.png";
import LogoDGDP from "../Components/img/LogoINFOP.png";
import Swal from "sweetalert2";
import { useUser } from "../Components/UserContext"
import { color } from "../Components/style/Color";

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ usuario: "", contraseña: "" });
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{5,}$/;


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "contraseña") {
      if (!passwordRegex.test(value)) {
        setError("La contraseña debe tener al menos 5 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");
      } else {
        setError(""); // Elimina el error si la contraseña es válida
      }
    }
  };




  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        formData
      );

      if (response.status === 200) {
        const { id, usuario, sesionactiva } = response.data.user;
        const { token, message } = response.data;

        // Si la sesión ya está activa, mostrar alerta y cerrar otras sesiones
        if (sesionactiva) {
          await Swal.fire({
            icon: 'info',
            title: 'Inicio de sesión',
            text: message,
            confirmButtonText: 'OK'
          });

          // Cerrar otras sesiones llamando al endpoint de logout
          await axios.put(`${process.env.REACT_APP_API_URL}/logout/${id}`);
        }

        // Guardar el usuario en el contexto global
        setUser({ id, usuario, sesionactiva: true }); // Forzar a true porque ahora es la sesión activa

        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify({
          id,
          usuario,
        }));
        localStorage.setItem("token", token);

        // Mostrar mensaje de éxito (si no es caso de sesión activa)
        if (!sesionactiva) {
          Swal.fire({
            icon: 'success',
            title: 'Inicio de sesión',
            text: message
          });
        }

        // Indicar que la sesión está activa
        sessionStorage.setItem("isAuthenticated", "true");

        // Redirigir al dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      // Manejo de errores existente...
      if (error.response) {
        if (error.response.status === 401) {
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            timer: 6000,
          });
        } else if (error.response.status === 402) {
          const { id, usuario } = error.response.data.user;

          setUser({ id, usuario, changePasswordRequired: true });

          localStorage.setItem("user", JSON.stringify({
            id,
            usuario,
            requiresPasswordChange: true
          }));

          sessionStorage.setItem("isAuthenticated", "true");

          navigate("/dashboard");
        } else {
          alert("Error en la autenticación. Inténtelo de nuevo.");
        }
      } else if (error.request) {
        alert("Error en la conexión con el servidor.");
      } else {
        alert("Hubo un problema con la solicitud. Inténtelo de nuevo.");
      }
    }
  };

  return (

    <Container
      fixed
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Grid
        container
        sx={{
          minHeight: "50vh",
          boxShadow: 3,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Sección del formulario */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: color.rojo,
            p: 4,
            width: "55%",
          }}
        >
          <Card
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 3,
              width: "70%",
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <Typography
              sx={{
                color: color.blanco,
                fontWeight: "bold",
                mb: 5,
                textAlign: "center"
              }}
              variant="h4"
            >
              Inicio de Sesión
            </Typography>

            {/* Campo de email */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              id="usuario"
              placeholder="Usuario"
              name="usuario"
              autoComplete="usuario"
              autoFocus
              value={formData.usuario}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment sx={{ mr: 1, ml: 1 }} position="end">
                    <Person />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: color.blanco, borderRadius: "10px", width: "400px" }}
            />

            {/* Campo de contraseña */}
            <TextField
              required
              fullWidth
              placeholder="Contraseña"
              variant="outlined"
              margin="normal"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              error={!!error}
              helperText={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: color.blanco, borderRadius: "10px", width: "400px" }}
            />

            {/* Enlace "Olvidé mi contraseña" */}
            <Typography
              variant="body2"
              color="white"
              align="right"
              sx={{ mt: 1, mb: 3, cursor: "pointer" }}
            >
              ¿Olvidaste tu contraseña?
            </Typography>

            {/* Botón de inicio de sesión */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: color.blanco,
                color: "#E53935",
                fontWeight: "bold",
                borderRadius: "30px",
                py: 1.5,
              }}
            >
              Ingresar →
            </Button>

            {/*  {/* Enlace para registrarse
            <Typography
              variant="body2"
              color="white"
              align="center"
              sx={{ mt: 2 }}
            >
              Not a member?{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                Sign up
              </span>
            </Typography> */}
          </Card>
        </Grid>

        {/* Sección de las imágenes */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: color.blanco,
            p: 4,
          }}
        >
          <img
            src={LogoDGDP}
            alt="Logo DGDP"
            style={{ width: "90%", maxWidth: "400px", marginTop: "50px" }}
          />
          <img
            src={LogoCONED}
            alt="Logo CONED"
            style={{ width: "90%", maxWidth: "400px" }}
          />
        </Grid>
      </Grid>
    </Container>

  );
}
