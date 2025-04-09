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



const DataTable = () => {
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [editRowData, setEditRowData] = useState({});
    const [isAdding, setIsAdding] = useState(false);


    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/tipoEducador`);

            setRows(response.data.map(item => ({
                id: item.id,
                tipoeducador: item.tipoeducador
            })));
        } catch (error) {
            console.error("Hubo un error al obtener los datos:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClick = () => {
        setEditRowData({ id: 'temp', tipoeducador: '' });
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
            if (isAdding) {
                // Lógica para INSERT
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/tipoEducador`,
                    { tipoeducador: editRowData.tipoeducador }
                );
                fetchData();
                Swal.fire({
                    title: "Registro Creado",
                    text: "El tipo educador a sido rigistrado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            } else {
                // Lógica para UPDATE
                const payload = {
                    id: editRowData.id,
                    tipoeducador: editRowData.tipoeducador
                };

                await axios.put(
                    `${process.env.REACT_APP_API_URL}/tipoEducador/${editRowId}`,
                    payload
                );
                fetchData();
                Swal.fire({
                    title: "Registro Actualizado",
                    text: "El tipo educador ha sido actualizado exitosamente.",
                    icon: "success",
                    timer: 6000,
                });
            }

            setEditRowId(null);
            setIsAdding(false);
        } catch (error) {
            console.error("Error al guardar el etnia:", error);
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
            field: 'tipoeducador',
            headerName: 'Tipo Educador',
            width: 250,
            renderCell: (params) => {
                if (editRowId === params.id) {
                    return (
                        <TextField
                            variant="standard"
                            name="tipoeducador"
                            value={editRowData.tipoeducador || ''}
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
    const gridRows = isAdding ? [{ id: 'temp', tipoeducador: '' }, ...rows] : rows;

    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{
                        fontWeight: 'bold', color: color.azul
                    }}>
                        Tipo Educador
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