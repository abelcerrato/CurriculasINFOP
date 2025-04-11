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
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { color } from '../Components/style/Color';
import Swal from 'sweetalert2'
import { EditOutlined as EditOutlinedIcon, Add as AddIcon } from '@mui/icons-material';
import { useUser } from "../Components/UserContext";


const DataTable = () => {
    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({ municipio: '', iddepartamento: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);

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

    // Obtener lista de municipios

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/municipios`);

            setRows(response.data);
        } catch (error) {
            console.error("Hubo un error al obtener los datos:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleAddClick = () => {
        setEditRowData({ municipio: '', iddepartamento: '' });
        setEditRowId('temp');
        setIsAdding(true);
    };

    const handleEditClick = (id) => {
        const rowToEdit = rows.find((row) => row.id === id);
        setEditRowData({
            id: rowToEdit.id,
            municipio: rowToEdit.municipio,
            iddepartamento: rowToEdit.iddepartamento
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
            // Prepara el payload base (compartido entre INSERT y UPDATE)
            const payload = {
                municipio: editRowData.municipio,
                iddepartamento: editRowData.iddepartamento
            };

            if (isAdding) {
                // INSERT: Agrega 'creadopor'

                await axios.post(`${process.env.REACT_APP_API_URL}/municipios`, {
                    ...payload,
                    creadopor: user?.id, // Asegúrate de que 'user' esté definido
                });
            } else {
                // UPDATE: Agrega 'modificadopor'
                await axios.put(`${process.env.REACT_APP_API_URL}/municipios/${editRowId}`, {
                    ...payload,
                    modificadopor: user?.id,
                });
            }

            // Éxito
            Swal.fire({
                title: isAdding ? "Registro Creado" : "Registro Actualizado",
                text: `El municipio ha sido ${isAdding ? "creado" : "actualizado"} exitosamente.`,
                icon: "success",
                timer: 6000,
            });

            fetchData();
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
                            disabled
                            fullWidth
                        />
                    );
                }
                return params.value;
            }
        },
        {
            field: 'municipio',
            headerName: 'Municipio',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="municipio"
                            value={editRowData.municipio || ''}
                            onChange={handleEditRowChange}
                            onKeyDown={(e) => e.stopPropagation()}
                            fullWidth
                            autoFocus
                        />
                    );
                }
                return params.value;
            }
        },
        {
            field: 'departamento',
            headerName: 'Departamento',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <FormControl fullWidth variant="standard">
                            <Select
                                name="iddepartamento"
                                value={editRowData.iddepartamento || ''}
                                onChange={handleEditRowChange}
                            >
                                <MenuItem value="">Seleccionar departamento</MenuItem>
                                {departamentos.map(dep => (
                                    <MenuItem key={dep.id} value={dep.id}>
                                        {dep.departamento}
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
    const gridRows = isAdding ? [{ id: 'temp', municipio: '', departamento: '' }, ...rows] : rows;

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                        Municipios
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