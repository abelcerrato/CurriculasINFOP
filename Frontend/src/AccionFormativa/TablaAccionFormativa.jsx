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







export default function TablaActividad() {


    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });


    const [rows, setRows] = useState([]);


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/accform`)
            .then((response) => {
                setRows(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error("Hubo un error al obtener los datos:", error);
            });
    }, []);




    const handleAddClick = () => {
        navigate("/Acción-Formativa/Registro");
    };


    const columns = [
        {
            field: 'actions',
            headerName: 'Acción',
            renderCell: (params) => (
                <>
                    <Tooltip title="Editar" arrow>
                        <IconButton
                            //onClick={() => handleEditClick(params.row.idcurricula)}
                            sx={{ color: color.azul }}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
        { field: "id", headerName: "ID", width: 90 },
        { field: "accionformatica", headerName: "Acción Formativa ", width: 230 },
        {
            field: "fechainicio",
            headerName: "Fecha Inicio ",
            width: 200,
            renderCell: (params) => {
                if (!params.value) return "";
                const date = new Date(params.value);
                return date.toLocaleDateString('es-ES');
            },
        },
        {
            field: "fechafinal",
            headerName: "Fecha Final",
            width: 350,
            renderCell: (params) => {
                if (!params.value) return ""; 
                const date = new Date(params.value);
                return date.toLocaleDateString('es-ES');
            },
        },
        { field: "departamento", headerName: "Departamento", width: 190 },
        { field: "municipio", headerName: "Municipio ", width: 120 },
    ];

    return (
        <>
            <Dashboard>
                <Paper sx={{ padding: 3, marginBottom: 3 }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                            Acciones Formativas
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
