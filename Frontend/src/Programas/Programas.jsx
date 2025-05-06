import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from "../Components/UserContext";
import { color } from '../Components/style/Color';
import Dashboard from '../Dashboard/Dashboard';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';



// Material-UI
import {
    Paper, Box, Typography, TextField, Button, IconButton,
    FormControl, Select, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, InputLabel, Tooltip, TextareaAutosize, FormLabel,
    Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { EditOutlined as EditOutlinedIcon, Add as AddIcon } from '@mui/icons-material';


const DataTable = () => {
    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editRowData, setEditRowData] = useState({
        programa: '',
        objetivo: '',
        fechainicio: '',
        fechafinal: '',
    });
    const [isAdding, setIsAdding] = useState(false);






    // Obtener lista de usuarios
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/programas`);
            const data = Array.isArray(response.data) ? response.data : [];

            // Suponiendo que cada item ya tiene las propiedades que necesitás
            setRows(data);

            console.log(data);
        } catch (error) {
            console.error("Hubo un error al obtener los datos:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setEditRowData({
            programa: '',
            objetivo: '',
            fechainicio: '',
            fechafinal: '',
        });
        setEditRowId('temp');
        setIsAdding(true);
        setOpenModal(true);
    };

    const formatearFechaParaInput = (fecha) => {
        if (!fecha) return '';

        const partes = fecha.split('/');
        if (partes.length !== 3) return '';

        const [dia, mes, anio] = partes;
        return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    };


    const handleEditClick = (id) => {
        const rowToEdit = rows.find((row) => row.id === id);

        setEditRowData({

            programa: rowToEdit.programa || '',
            objetivo: rowToEdit.objetivo || '',
            fechainicio: formatearFechaParaInput(rowToEdit.fechainicio) || '',
            fechafinal: formatearFechaParaInput(rowToEdit.fechafinal) || '',


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
            // Prepara el payload base (compartido entre INSERT y UPDATE)
            const payload = {

                programa: editRowData.programa || null,
                objetivo: editRowData.objetivo || null,
                fechainicio: editRowData.fechainicio || null,
                fechafinal: editRowData.fechafinal || null,
            };

            if (isAdding) {
                // INSERT: Agrega 'creadopor'

                await axios.post(`${process.env.REACT_APP_API_URL}/programas`, {
                    ...payload,
                    creadopor: user?.id, // Asegúrate de que 'user' esté definido
                });
            } else {
                // UPDATE: Agrega 'modificadopor'
                await axios.put(`${process.env.REACT_APP_API_URL}/programas/${editRowId}`, {
                    ...payload,
                    modificadopor: user?.id,
                });
            }

            // Éxito
            Swal.fire({
                title: isAdding ? "Registro Creado" : "Registro Actualizado",
                text: `El Programa ha sido ${isAdding ? "creado" : "actualizado"} exitosamente.`,
                icon: "success",
                timer: 6000,
            });

            fetchData(); // Recarga los datos
            handleCloseModal(); // Cierra el modal
        } catch (error) {
            console.error("Error al guardar:", error);
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
                <>
                    <Tooltip title="Editar" arrow>
                        <IconButton
                            onClick={() => handleEditClick(params.id)}
                            sx={{ color: color.azul }}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </>

            ),
        },
        { field: 'id', headerName: 'ID' },
        { field: 'programa', headerName: 'Programa', width: 300 },
        { field: 'objetivo', headerName: 'Objetivo', width: 300 },
        { field: 'fechainicio', headerName: 'Fecha de Inicio', width: 170 },
        { field: 'fechafinal', headerName: 'Fecha de Final', width: 170 },
    ];


    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                        Programas
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
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ backgroundColor: color.azul, color: 'white' }}>
                        {isAdding ? 'Nuevo Programa' : 'Actualizar Programa'}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pl: 5, pr: 5 }}>


                            <TextField
                                label="Programa"
                                name="programa"
                                value={editRowData.programa || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                label="Objetivo"
                                name="objetivo"
                                value={editRowData.objetivo || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />

                            <Grid item size={6}>
                                <TextField
                                    label="Fecha de Inicio"
                                    name="fechainicio"
                                    value={editRowData.fechainicio || ''}
                                    onChange={handleEditRowChange}
                                    fullWidth
                                    variant="standard"
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid item size={6}>
                                <TextField
                                    label="Fecha de Final"
                                    name="fechafinal"
                                    value={editRowData.fechafinal || ''}
                                    onChange={handleEditRowChange}
                                    fullWidth
                                    variant="standard"
                                    type='date'
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>



                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="error">
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveClick} sx={{ background: color.azul }} variant="contained">
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Dashboard>
    );
};

export default DataTable;