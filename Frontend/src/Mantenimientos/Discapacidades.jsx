import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Dashboard from '../Dashboard/Dashboard';
import axios from 'axios';
import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


import { color } from '../Components/style/Color';
import Swal from 'sweetalert2'
import { EditOutlined as EditOutlinedIcon, Add as AddIcon } from '@mui/icons-material';
import { useUser } from "../Components/UserContext";


const DataTable = () => {
    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({});
    const [isAdding, setIsAdding] = useState(false);


    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/discapacidades`);
            setRows(response.data)
        } catch (error) {
            console.error("Hubo un error al obtener los datos:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setEditRowData({ id: 'temp', discapacidad: '' });
        setEditRowId('temp');
        setIsAdding(true);
    };

    const handleEditClick = (id) => {
        const rowToEdit = rows.find((row) => row.id === id);
        setEditRowData(rowToEdit);
        setEditRowId(id);
        setIsAdding(false);
    };

    const handleCancelClick = () => {
        setEditRowId(null);
        setIsAdding(false);
    };


    const handleSaveClick = async () => {
        try {
            // Prepara el payload base (compartido entre INSERT y UPDATE)
            const payload = {
                id: editRowData.id,
                discapacidad: editRowData.discapacidad
            };

            if (isAdding) {
                // INSERT: Agrega 'creadopor'

                await axios.post(`${process.env.REACT_APP_API_URL}/discapacidades`, {
                    ...payload,
                    creadopor: user?.id, // Asegúrate de que 'user' esté definido
                });
            } else {
                // UPDATE: Agrega 'modificadopor'
                await axios.put(`${process.env.REACT_APP_API_URL}/discapacidades/${editRowId}`, {
                    ...payload,
                    modificadopor: user?.id,
                });
            }

            // Éxito
            Swal.fire({
                title: isAdding ? "Registro Creado" : "Registro Actualizado",
                text: `La discapacidad ha sido ${isAdding ? "creada" : "actualizada"} exitosamente.`,
                icon: "success",
                timer: 6000,
            });

            fetchData(); // Recarga los datos
            setEditRowId(null);
            setIsAdding(false);
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
        setEditRowData({ ...editRowData, [name]: value });
    };

    const columns = [
        {
            field: 'actions',
            headerName: 'Acción',
            width: 150,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <>
                            <IconButton onClick={handleSaveClick} sx={{
                                color: color
                                    .azul
                            }}>
                                <CheckIcon />
                            </IconButton>
                            <IconButton onClick={handleCancelClick} sx={{
                                color: color
                                    .rojo
                            }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    );
                } else if (params.id !== 'temp') {
                    return (
                        <IconButton
                            onClick={() => handleEditClick(params.id)}
                            sx={{
                                color: color
                                    .azul
                            }}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    );
                }
                return null;
            },
        },
        {
            field: 'id',
            headerName: 'ID',
            width: 90,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="id"
                            value={params.id === 'temp' ? 'Nuevo' : editRowData.id}
                            onChange={handleEditRowChange}
                            disabled
                        />
                    );
                }
                return params.value;
            }
        },
        {
            field: 'discapacidad',
            headerName: 'Discapacidad',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="discapacidad"
                            value={editRowData.discapacidad || ''}
                            onChange={handleEditRowChange}
                            fullWidth
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === ' ') {
                                    e.stopPropagation(); // Evita que el DataGrid maneje el espacio
                                }
                            }}
                        />
                    );
                }
                return params.value;
            }
        },
    ];

    // Filas para el DataGrid (incluyendo la temporal si está en modo añadir)
    const gridRows = isAdding ? [{ id: 'temp', discapacidad: '' }, ...rows] : rows;

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontWeight: 'bold', color: color.azul
                    }}>
                        Discapacidades
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        disabled={editRowId !== null}
                        sx={{
                            color: color
                                .contrastText, backgroundColor: color
                                    .azul
                        }}
                    >
                        Nuevo
                    </Button>
                </Box>

                <DataGrid
                    rows={gridRows}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                />
            </Box>
        </Dashboard>
    );
};

export default DataTable;