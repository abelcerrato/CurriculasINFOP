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
    const [editRowData, setEditRowData] = useState({ aldea: '', idmunicipio: '' });
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

    // Obtener lista de aldeas
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
                const data = Array.isArray(response.data) ? response.data : [];

                // Mapear los datos para incluir el nombre del departamento
                const formattedData = data.map(item => ({
                    id: item.id,
                    nombre: item.nombre,
                    cecap: item.cecap,
                    correo: item.correo,
                    rol: item.rol,
                    iddepartamento: item.iddepartamento,
                    idmunicipio: item.idmunicipio,
                    estado: item.estado,
                    idestudiante: item.idestudiante,
                    idmaestros: item.idmaestros,
                }));

                setRows(formattedData);
            } catch (error) {
                console.error("Hubo un error al obtener los datos:", error);
            }
        };
        fetchData();
    }, [departamentos]); // Se ejecuta cuando cambian los departamentos

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
            idmunicipio: rowToEdit.idmunicipio
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
            field: 'nombre',
            headerName: 'Nombre',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="nombre"
                            value={editRowData.nombre || ''}
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
            field: 'correo',
            headerName: 'Correo Electrónico',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="correo"
                            value={editRowData.correo || ''}
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
            field: 'rol',
            headerName: 'Rol',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <FormControl fullWidth variant="standard">
                            <Select
                                name="idrol"
                                value={editRowData.idrol || ''}
                                onChange={handleEditRowChange}
                            >
                                <MenuItem value="">Seleccionar departamento</MenuItem>
                                {departamentos.map(dep => (
                                    <MenuItem key={dep.id} value={dep.id}>
                                        {dep.rol}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
        {
            field: 'contraseña',
            headerName: 'Contraseña',

            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="contraseña"
                            value={editRowData.contraseña || ''}
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
            field: 'estado',
            headerName: 'Estado',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <FormControl fullWidth variant="standard">
                            <Select
                                name="estado"
                                value={editRowData.estado || ''}
                                onChange={handleEditRowChange}
                            >
                                <MenuItem value="">Seleccionar estado</MenuItem>
                                <MenuItem value="activo">Activo</MenuItem>
                                <MenuItem value="inactivo">Inactivo</MenuItem>
                            </Select>
                        </FormControl>
                    );
                }
                return params.value;
            }
        },

    ];

    // Filas para el DataGrid (incluyendo la temporal si está en modo añadir)
    const gridRows = isAdding ? [{ id: 'temp', aldea: '', departamento: '' }, ...rows] : rows;

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.primary.azul }}>
                        Usuarios
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