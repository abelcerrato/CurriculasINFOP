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
              `${process.env.REACT_APP_API_URL}/verificarUsuario`,
              formData
          );
  
          if (response.status === 200) {
              // Si la autenticación es exitosa
              const { id, usuario } = response.data.user;
              
              // Guarda el usuario en el contexto global
              setUser({ id, usuario });
  
              // Guarda en localStorage
              localStorage.setItem("user", JSON.stringify({ id, usuario }));
  
              // Indica que la sesión está activa
              sessionStorage.setItem("isAuthenticated", "true");
  
              // Redirige al dashboard
              navigate("/dashboard");
          } else {
              Swal.fire({
                  title: "Error",
                  text: "Error en la autenticación. Verifique sus credenciales.",
                  icon: "error",
                  timer: 6000,
              });
          }
      } catch (error) {
          console.error("Error en la autenticación:", error);
  
          if (error.response) {
              if (error.response.status === 401) {
                  Swal.fire({
                      title: "Error",
                      text: error.response.data.message,
                      icon: "error",
                      timer: 6000,
                  });
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
            backgroundColor: "#E53935",
            p: 4,
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
              variant="h4"
              color="white"
              fontWeight="bold"
              align="center"
              mb={5}
            >
              Inicio de Sesión
            </Typography>

            {/* Campo de email */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="usuario"
              placeholder="Usuario"
              name="usuario"
              autoComplete="usuario"
              autoFocus
              value={formData.usuario}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Person />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: "white", borderRadius: "10px" }}
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
              sx={{ backgroundColor: "white", borderRadius: "10px" }}
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
                backgroundColor: "white",
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
            backgroundColor: "white",
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
