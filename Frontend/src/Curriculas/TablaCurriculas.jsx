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
    const [currentEditData, setCurrentEditData] = useState(null);
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });


    const [rows, setRows] = useState([]);


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/clasesModCurriculas`)
            .then((response) => {
                const transformedData = response.data.map(item => ({
                    ...item,
                    id: item.idcurricula // Renombrar idcurricula a id
                }));
                setRows(transformedData);
            })
            .catch((error) => {
                console.error("Hubo un error al obtener los datos:", error);
            });
    }, []);



    const handleEditClick = async (id) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/clasesMC/${id}`);
            setCurrentEditData(response.data); // Guardar los datos completos
            setCurrentEditId(id);
            setModalOpen(true);
        } catch (error) {
            console.error("Error al obtener los datos para editar:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudieron cargar los datos para editar",
                icon: "error",
            });
        }
    };
    const handleAddClick = () => {
        setModalOpen(true);
    };


    const columns = [
        {
            field: 'actions',
            headerName: 'Acción',
            renderCell: (params) => (
                <>
                    <Tooltip title="Editar" arrow>
                        <IconButton
                            onClick={() => handleEditClick(params.row.idcurricula)}
                            sx={{ color: color.azul }}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
        { field: "idcurricula", headerName: "ID", width: 90 },
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
        { field: "objetivo", headerName: "Objetivo", width: 350 },
        { field: "versioncurricula", headerName: "Versión Currícula", width: 190 },
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
                            setCurrentEditData(null);
                        }}
                        editId={currentEditId}
                        editData={currentEditData} // Pasar los datos a editar
                    />
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        autoHeight
                        getRowId={(row) => row.idcurricula} // Especificar qué campo usar como id
                    />
                </Paper>

            </Dashboard>
        </>
    );
}
