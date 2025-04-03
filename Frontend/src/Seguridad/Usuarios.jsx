import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from "../Components/UserContext";
import { color } from '../Components/style/Color';
import Dashboard from '../Dashboard/Dashboard';

// Material-UI
import {
    Paper, Box, Typography, TextField, Button, IconButton,
    FormControl, Select, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, InputLabel
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';


const DataTable = () => {
    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editRowData, setEditRowData] = useState({
        nombre: '',
        cecap: '',
        correo: '',
        iddepartamento: '',
        idmunicipio: '',
        contraseña: '',
        estado: '',
        usuario: '',
        idrol: '',
    });
    const [isAdding, setIsAdding] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [roles, setRoles] = useState([]);

    // Obtener lista de departamentos para el Select
    useEffect(() => {
        const obtenerDepartamentos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/departamentos`);
                setDepartamentos(response.data);
            } catch (error) {
                console.error("Error al obtener los departamentos", error);
            }
        };
        obtenerDepartamentos();
    }, []);

    // Obtener lista de municipios segun el departamento selecionado para el Select
    useEffect(() => {
        const obtenerMunicipios = async () => {
            if (!editRowData.iddepartamento) return;

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/municipios/${editRowData.iddepartamento}`);
                setMunicipios(response.data);
            } catch (error) {
                console.error("Error al obtener los Municipios", error);
            }
        };

        obtenerMunicipios();
    }, [editRowData.iddepartamento]);



    // Obtener lista de roles para el Select
    useEffect(() => {
        const obtenerRoles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/roles`);
                setRoles(response.data);
            } catch (error) {
                console.error("Error al obtener los roles", error);
            }
        };
        obtenerRoles();
    }, []);

    // Obtener lista de usuarios
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
            const data = Array.isArray(response.data) ? response.data : [];

            const formattedData = data.map(item => ({
                id: item.id,
                nombre: item.nombre,
                cecap: item.cecap,
                correo: item.correo,
                rol: item.rol,
                iddepartamento: item.iddepartamento,
                idmunicipio: item.idmunicipio,
                departamento: item.departamento,
                municipio: item.municipio,
                estado: item.estado,
                usuario: item.usuario,
                contraseña: item.contraseña
            }));

            setRows(formattedData);
        } catch (error) {
            console.error("Hubo un error al obtener los datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setEditRowData({
            nombre: '',
            cecap: '',
            correo: '',
            iddepartamento: '',
            idmunicipio: '',
            contraseña: '',
            estado: '',
            usuario: '',
            idrol: '',
        });
        setEditRowId('temp');
        setIsAdding(true);
        setOpenModal(true);
    };

    const handleEditClick = (id) => {
        const rowToEdit = rows.find((row) => row.id === id);
        setEditRowData({
            id: rowToEdit.id,
            nombre: rowToEdit.nombre || '',
            cecap: rowToEdit.cecap || '',
            correo: rowToEdit.correo || '',
            iddepartamento: rowToEdit.iddepartamento || '',
            idmunicipio: rowToEdit.idmunicipio || '',
            contraseña: rowToEdit.contraseña || '',
            estado: rowToEdit.estado || '',
            usuario: rowToEdit.usuario || '',
            idrol: rowToEdit.idrol || '',
        });
        setEditRowId(id);
        setIsAdding(false);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditRowId(null);
    };

    const handleSaveClick = async () => {
        try {
            if (isAdding) {
                // Lógica para INSERT
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/postUsers`,
                    {
                        nombre: editRowData.nombre,
                        cecap: editRowData.cecap,
                        correo: editRowData.correo,
                        idrol: editRowData.idrol,
                        iddepartamento: editRowData.iddepartamento,
                        idmunicipio: editRowData.idmunicipio,
                        contraseña: editRowData.contraseña,
                        estado: editRowData.estado,
                        usuario: editRowData.usuario,
                        creadopor: user?.id,
                    }
                );

                fetchData();
                Swal.fire({
                    title: "Registro Creado",
                    text: "El usuario ha sido creado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            } else {
                // Lógica para UPDATE
                const payload = {
                    nombre: editRowData.nombre || null,
                    cecap: editRowData.cecap || null,
                    correo: editRowData.correo || null,
                    idrol: editRowData.idrol || null,
                    iddepartamento: editRowData.iddepartamento || null,
                    idmunicipio: editRowData.idmunicipio || null,
                    //contraseña: editRowData.contraseña || null,
                    estado: editRowData.estado || null,
                    usuario: editRowData.usuario || null,
                    modificadopor: user?.id,
                };

                await axios.put(
                    `${process.env.REACT_APP_API_URL}/users/${editRowId}`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                fetchData();
                Swal.fire({
                    title: "Registro Actualizado",
                    text: "El usuario ha sido actualizado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            }

            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al guardar los datos.",
                icon: "error",
                timer: 6000,
            });
        }
    };

    const handleEditRowChange = (e) => {
        const { name, value } = e.target;
        setEditRowData(prev => ({ ...prev, [name]: value }));
    };

    const columns = [
        {
            field: 'actions',
            headerName: 'Acción',
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleEditClick(params.id)}
                    sx={{ color: color.azul }}
                >
                    <EditIcon />
                </IconButton>
            ),
        },
        { field: 'id', headerName: 'ID' },
        { field: 'cecap', headerName: 'CECAP', width: 300 },
        { field: 'nombre', headerName: 'Nombre', width: 250 },
        { field: 'correo', headerName: 'Correo Electrónico', width: 250 },
        { field: 'usuario', headerName: 'Usuario' },
        { field: 'contraseña', headerName: 'Contraseña' },
        { field: 'idrol', headerName: 'Rol' }, { field: 'departamento', headerName: 'Departamento de Residencia', width: 250 },
        { field: 'municipio', headerName: 'Municipio de Residencia', width: 250 },
        { field: 'estado', headerName: 'Estado' },
    ];

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                        Usuarios
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        sx={{
                            color: color.contrastText,
                            backgroundColor: color.azul,
                            '&:hover': {
                                backgroundColor: color.dark
                            }
                        }}
                    >
                        Nuevo
                    </Button>
                </Box>

                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                    autoHeight
                />

                {/* Modal para edición/creación */}
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                    <DialogTitle>
                        {isAdding ? 'Nuevo Usuario' : 'Editar Usuario'}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 5 }}>

                            <TextField
                                label="CECAP"
                                name="cecap"
                                value={editRowData.cecap || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                label="Nombre"
                                name="nombre"
                                value={editRowData.nombre || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                label="Correo Electrónico"
                                name="correo"
                                value={editRowData.correo || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                label="Usuario"
                                name="usuario"
                                value={editRowData.usuario || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                label="Contraseña"
                                name="contraseña"
                                type="password"
                                value={editRowData.contraseña || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                <Select
                                    name="idrol"
                                    value={editRowData.idrol || ''}
                                    onChange={handleEditRowChange}
                                    label="Departamento"
                                >
                                    <MenuItem value="">Seleccionar rol</MenuItem>
                                    {roles.map(dep => (
                                        <MenuItem key={dep.id} value={dep.id}>
                                            {dep.rol}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                <Select
                                    name="iddepartamento"
                                    value={editRowData.iddepartamento || ''}
                                    onChange={handleEditRowChange}
                                    label="Departamento"
                                >
                                    <MenuItem value="">Seleccionar departamento</MenuItem>
                                    {departamentos.map(dep => (
                                        <MenuItem key={dep.id} value={dep.id}>
                                            {dep.departamento}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Municipio</InputLabel>
                                <Select
                                    name="idmunicipio"
                                    value={editRowData.idmunicipio || ''}
                                    onChange={handleEditRowChange}
                                    label="Municipio"
                                    disabled={!municipios.length}
                                >
                                    <MenuItem value="">Seleccionar municipio</MenuItem>
                                    {municipios.map(muni => (
                                        <MenuItem key={muni.id} value={muni.id}>
                                            {muni.municipio}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                                <Select
                                    name="estado"
                                    value={editRowData.estado || ''}
                                    onChange={handleEditRowChange}
                                    label="Estado"
                                >
                                    <MenuItem value="">Seleccionar estado</MenuItem>
                                    <MenuItem value="Activo">Activo</MenuItem>
                                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="error">
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveClick} color="primary" variant="contained">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Dashboard>
    );
};

export default DataTable;