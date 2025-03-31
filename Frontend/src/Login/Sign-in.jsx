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
import { Visibility, VisibilityOff, Email } from "@mui/icons-material";
import { useState } from "react";
import LogoCONED from "../Components/img/logos_CONED.png";
import LogoDGDP from "../Components/img/LogoINFOP.png";
import Dashboard from "../Dashboard/Dashboard";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
              fullWidth
              label="Correo Electrónico"
              variant="outlined"
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Email />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: "white", borderRadius: "10px" }}
            />

            {/* Campo de contraseña */}
            <TextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              margin="normal"
              type={showPassword ? "text" : "password"}
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
