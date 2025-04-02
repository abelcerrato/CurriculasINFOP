import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Dashboard from '../../Dashboard/Dashboard';
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
import { color } from '../style/Color';
import Swal from 'sweetalert2'


const DataTable = () => {
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({ aldea: '', idmunicipio: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [municipio, setmunicipio] = useState([]);

    // Obtener lista de municipio para el Select
    useEffect(() => {
        const obtenermunicipio = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/municipios`);
                setmunicipio(response.data);
            } catch (error) {
                console.error("Error al obtener los municipio", error);
            }
        };
        obtenermunicipio();
    }, []);

    // Obtener lista de aldeas
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/aldeas`);
                const data = Array.isArray(response.data) ? response.data : [];

                // Mapear los datos para incluir el nombre del departamento
                const formattedData = data.map(item => ({
                    id: item.id,
                    aldea: item.aldea,
                    municipio: item.municipio,
                    idmunicipio: item.idmunicipio
                }));
                setRows(formattedData);
            } catch (error) {
                console.error("Hubo un error al obtener los datos:", error);
            }
        };
        fetchData();
    }, [municipio]); // Se ejecuta cuando cambian los municipio

    const handleAddClick = () => {
        setEditRowData({ aldea: '', idmunicipio: '' });
        setEditRowId('temp');
        setIsAdding(true);
    };

    const handleEditClick = (id) => {
        const rowToEdit = rows.find((row) => row.id === id);
        setEditRowData({
            id: rowToEdit.id,
            aldea: rowToEdit.aldea,
            municipio: rowToEdit.idmunicipio
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
                    `${process.env.REACT_APP_API_URL}/aldeas`,
                    {
                        aldea: editRowData.aldea,
                        idmunicipio: editRowData.idmunicipio
                    }
                );



                // Agregar el nuevo registro a la tabla
                setRows([...rows, {
                    id: response.data.id,
                    aldea: editRowData.aldea,
                    idmunicipio: editRowData.idmunicipio,

                }]);
                Swal.fire({
                    title: "Registro Creado",
                    text: "El aldea ha sido creado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            } else {
                // Lógica para UPDATE
                const payload = {
                    aldea: editRowData.aldea,
                    idmunicipio: editRowData.idmunicipio
                };

                await axios.put(
                    `${process.env.REACT_APP_API_URL}/aldeas/${editRowId}`,
                    payload
                );

                // Obtener el departamento seleccionado
                const muniseleccionado = municipio.find(dep => dep.id === editRowData.idmunicipio);

                // Actualizar el registro existente
                setRows(rows.map(row =>
                    row.id === editRowId ? {
                        ...row,
                        aldea: editRowData.aldea,
                        idmunicipio: muniseleccionado?.municipio || ''
                    } : row
                ));

                Swal.fire({
                    title: "Registro Actualizado",
                    text: "El aldea ha sido actualizado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            }

            setEditRowId(null);
            setIsAdding(false);
        } catch (error) {
            console.error("Error al guardar el aldea:", error);
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
                            <IconButton onClick={handleSaveClick} sx={{ color: color.primary.azul }}>
                                <CheckIcon />
                            </IconButton>
                            <IconButton onClick={handleCancelClick} sx={{ color: color.primary.rojo }}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    );
                } else if (params.id !== 'temp') {
                    return (
                        <IconButton
                            onClick={() => handleEditClick(params.id)}
                            sx={{ color: color.primary.azul }}
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
            field: 'aldea',
            headerName: 'Aldea',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="aldea"
                            value={editRowData.aldea || ''}
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
            field: 'municipio',
            headerName: 'Municipio',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <FormControl fullWidth variant="standard">
                            <Select
                                name="idmunicipio"
                                value={editRowData.idmunicipio || ''}
                                onChange={handleEditRowChange}
                            >
                                <MenuItem value="">Seleccionar municipio</MenuItem>
                                {municipio.map(dep => (
                                    <MenuItem key={dep.id} value={dep.id}>
                                        {dep.municipio}
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
    const gridRows = isAdding ? [{ id: 'temp', aldea: '', municipio: '' }, ...rows] : rows;

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.primary.azul }}>
                        Aldeas
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        disabled={editRowId !== null}
                        sx={{
                            color: color.primary.contrastText,
                            backgroundColor: color.primary.azul,
                            '&:hover': {
                                backgroundColor: color.primary.dark
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