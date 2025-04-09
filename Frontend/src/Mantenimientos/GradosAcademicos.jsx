import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Dashboard from '../Dashboard/Dashboard';
import axios from 'axios';
import { useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { color } from '../Components/style/Color';
import Swal from 'sweetalert2'


const DataTable = () => {
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({ gradoacademico: '', idnivelacademico: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [nivelacademicos, setnivelacademicos] = useState([]);

    // Obtener lista de nivelacademicos para el Select
    useEffect(() => {
        const obtenernivelacademicos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`);
                setnivelacademicos(response.data);
                console.log(response.data);

            } catch (error) {
                console.error("Error al obtener los nivelacademicos", error);
            }
        };
        obtenernivelacademicos();
    }, []);

    // Obtener lista de gradoacademicos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/gradosAcademicos`);
                const data = Array.isArray(response.data) ? response.data : [];

                // Mapear los datos para incluir el nombre del nivelacademico
                const formattedData = data.map(item => ({
                    id: item.id,
                    gradoacademico: item.gradoacademico,
                    idnivelacademico: item.idnivelacademico,
                    nivelacademico: item.nivelacademico,
                }));

                setRows(formattedData);
            } catch (error) {
                console.error("Hubo un error al obtener los datos:", error);
            }
        };
        fetchData();
    }, [nivelacademicos]); // Se ejecuta cuando cambian los nivelacademicos

    const handleAddClick = () => {
        setEditRowData({ gradoacademico: '', idnivelacademico: '' });
        setEditRowId('temp');
        setIsAdding(true);
    };

    const handleEditClick = (id) => {
        const rowToEdit = rows.find((row) => row.id === id);
        setEditRowData({
            id: rowToEdit.id,
            gradoacademico: rowToEdit.gradoacademico,
            idnivelacademico: rowToEdit.idnivelacademico
        });
        setEditRowId(id);
        setIsAdding(false);
    };

    const handleCancelClick = () => {
        setEditRowId(null);
        setIsAdding(false);
    };

    const handleSaveClick = async () => {
        try {
            if (isAdding) {
                // Lógica para INSERT
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/gradoAcademico`,
                    {
                        gradoacademico: editRowData.gradoacademico,
                        idnivelacademico: editRowData.idnivelacademico
                    }
                );


                Swal.fire({
                    title: "Registro Creado",
                    text: "El grado académico ha sido creado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            } else {
                // Lógica para UPDATE
                const payload = {
                    gradoacademico: editRowData.gradoacademico,
                    idnivelacademico: editRowData.idnivelacademico
                };

                await axios.put(
                    `${process.env.REACT_APP_API_URL}/gradoAcademico/${editRowId}`,
                    payload
                );

                // Obtener el nivelacademico seleccionado
                const deptoSeleccionado = nivelacademicos.find(dep => dep.id === editRowData.idnivelacademico);

                // Actualizar el registro existente
                setRows(rows.map(row =>
                    row.id === editRowId ? {
                        ...row,
                        gradoacademico: editRowData.gradoacademico,
                        idnivelacademico: editRowData.idnivelacademico,
                        nivelacademico: deptoSeleccionado?.nivelacademico || ''
                    } : row
                ));

                Swal.fire({
                    title: "Registro Actualizado",
                    text: "El grado académico ha sido actualizado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            }

            setEditRowId(null);
            setIsAdding(false);
        } catch (error) {
            console.error("Error al guardar el gradoacademico:", error);
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
            width: 150,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <>
                            <IconButton onClick={handleSaveClick} sx={{ color: color.azul }}>
                                <CheckIcon />
                            </IconButton>
                            <IconButton onClick={handleCancelClick} sx={{ color: color.rojo }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    );
                } else if (params.id !== 'temp') {
                    return (
                        <IconButton
                            onClick={() => handleEditClick(params.id)}
                            sx={{ color: color.azul }}
                        >
                            <EditIcon />
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
                            disabled
                            fullWidth
                        />
                    );
                }
                return params.value;
            }
        },
        {
            field: 'gradoacademico',
            headerName: 'Grado Académico',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="gradoacademico"
                            value={editRowData.gradoacademico || ''}
                            onChange={handleEditRowChange}
                            fullWidth
                            autoFocus
                        />
                    );
                }
                return params.value;
            }
        },
        {
            field: 'nivelacademico',
            headerName: 'Nivel Académico',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <FormControl fullWidth variant="standard">
                            <Select
                                name="idnivelacademico"
                                value={editRowData.idnivelacademico || ''}
                                onChange={handleEditRowChange}
                            >
                                <MenuItem value="">Seleccionar nivel académico</MenuItem>
                                {nivelacademicos.map(dep => (
                                    <MenuItem key={dep.id} value={dep.id}>
                                        {dep.nivelacademico}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                }
                return params.value;
            }
        },
    ];

    // Filas para el DataGrid (incluyendo la temporal si está en modo añadir)
    const gridRows = isAdding ? [{ id: 'temp', gradoacademico: '', nivelacademico: '' }, ...rows] : rows;

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                        Grado Académicos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        disabled={editRowId !== null}
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
                    rows={gridRows}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                    autoHeight
                />
            </Box>
        </Dashboard>
    );
};

export default DataTable;