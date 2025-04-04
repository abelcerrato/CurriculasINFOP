import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import { useUser } from "../Components/UserContext";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const CambiarContraModal = ({ open, onClose, mandatory = false, onSuccess }) => {
    const { user } = useUser();
    const [showPassword, setShowPassword] = useState({
        new: false,
        confirm: false,
    });
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTogglePassword = (field) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (passwords.newPassword !== passwords.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (passwords.newPassword.length < 5) {
            setError("La contraseña debe tener al menos 5 caracteres");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/actualizarContra/${user?.usuario}`,
                {
                    nuevaContraseña: passwords.newPassword,
                }

            );

            if (response.status === 200) {
                Swal.fire("¡Éxito!", "Contraseña cambiada correctamente", "success");
                if (onSuccess) onSuccess(); // Esto cerrará el modal
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={mandatory ? undefined : onClose}
            disableEscapeKeyDown={mandatory}
        >
            <Box sx={style}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {mandatory ? "Cambio de contraseña obligatorio" : "Cambiar Contraseña"}
                </Typography>

                {mandatory && (
                    <Typography color="error" gutterBottom>
                        Por motivos de seguridad, debes cambiar tu contraseña para continuar.
                        {user?.usuario}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Nueva Contraseña"
                        name="newPassword"
                        type={showPassword.new ? "text" : "password"}
                        value={passwords.newPassword}
                        onChange={handleChange}
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePassword("new")}
                                        edge="end"
                                        disabled={loading}
                                    >
                                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Confirmar Nueva Contraseña"
                        name="confirmPassword"
                        type={showPassword.confirm ? "text" : "password"}
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        error={!!error}
                        helperText={error}
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => handleTogglePassword("confirm")}
                                        edge="end"
                                        disabled={loading}
                                    >
                                        {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                        {!mandatory && (
                            <Button
                                onClick={onClose}
                                variant="outlined"
                                sx={{ mr: 1 }}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                "Cambiar Contraseña"
                            )}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default CambiarContraModal;