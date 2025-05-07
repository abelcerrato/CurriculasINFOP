import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Typography,
    Paper,
    Box,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import Dashboard from "../Dashboard/Dashboard";
import { color } from "../Components/style/Color";
import { EditOutlined as EditOutlinedIcon, Add as AddIcon } from '@mui/icons-material';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { DataGrid } from '@mui/x-data-grid';
import CurriculumCreator from './Curriculas';





export default function TablaActividad() {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });


    const [rows, setRows] = useState([]);


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/curriculas`) // Cambia esta URL a la de tu API
            .then((response) => {
                setRows(response.data); // Suponiendo que los datos se encuentran en response.data
                console.log(response.data);

            })
            .catch((error) => {
                console.error("Hubo un error al obtener los datos:", error);
            });
    }, []);




    const handleEditClick = async (id) => {
        setCurrentEditId(id);
        setModalOpen(true);
    };

    const handleAddClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
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
        { field: "id", headerName: "ID", width: 90 },
        { field: "curricula", headerName: "Currícula ", width: 230 },
        { field: "sector", headerName: "Sector ", width: 200 },

        {
            field: "duraciontotal",
            headerName: "Duración Total",
            width: 150,
            renderCell: (params) => {
                const duraciontotal = params.row.duraciontotal;
                return `${duraciontotal.hours ?? 0}h ${duraciontotal.minutes ?? 0}m`;

            }
        },
        { field: "objetivo", headerName: "Objetivo", width: 320 },
        { field: "versioncurricula", headerName: "Versión Currícula", width: 120 },
        // { field: "areaformacion", headerName: "Área Formación", width: 120 },
    ];

    return (
        <>
            <Dashboard>
                <Paper sx={{ padding: 3, marginBottom: 3 }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                            Currículas
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
                    <CurriculumCreator
                        open={modalOpen}
                        onClose={() => {
                            setModalOpen(false);
                            setCurrentEditId(null);
                        }}
                        editId={currentEditId}
                    />
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        autoHeight
                    />
                </Paper>

            </Dashboard>
        </>
    );
}
