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
        nombre: '',
        identificacion: '',
        correo: '',
        telefono: '',
        genero: '',
        fechanacimiento: '',
        edad: '',
        idniveleducativo: '',
        idgradoacademico: '',
        iddepartamento: '',
        idmunicipio: '',
        idaldea: '',
        caserio: '',
        direccion: '',
        idtipoeducador: '',
    });
    const [isAdding, setIsAdding] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [aldeas, setAldeas] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [grados, setGrados] = useState([]);
    const [educador, setEducador] = useState([]);


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

    // Obtener lista de municipios segun el departamento selecionado para el Select
    useEffect(() => {
        const obtenerMunicipios = async () => {
            if (!editRowData.iddepartamento) return;

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/municipios/${editRowData.iddepartamento}`);
                setMunicipios(response.data);
            } catch (error) {
                console.error("Error al obtener los Municipios", error);
            }
        };

        obtenerMunicipios();
    }, [editRowData.iddepartamento]);

    // Obtener lista de aldeas segun el municipio selecionado para el Select
    useEffect(() => {
        const obtenerAldeas = async () => {
            if (!editRowData.idmunicipio) return;

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/aldea/${editRowData.idmunicipio}`);
                setAldeas(response.data);
            } catch (error) {
                console.error("Error al obtener los Aldeas", error);
            }
        };

        obtenerAldeas();
    }, [editRowData.idmunicipio]);

    // Obtener lista de niveles educativo para el Select
    useEffect(() => {
        const obtenerNiveles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/nivelesAcademicos`);
                setNiveles(response.data);
            } catch (error) {
                console.error("Error al obtener los Niveles", error);
            }
        };
        obtenerNiveles();
    }, []);

    // Obtener lista de gradoas académicos segun el nivel educativo selecionado para el Select
    useEffect(() => {
        const obtenerGrados = async () => {
            if (!editRowData.idniveleducativo) return;

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/gradoAcademicoNivel/${editRowData.idniveleducativo}`);
                setGrados(response.data);
            } catch (error) {
                console.error("Error al obtener los Grados", error);
            }
        };

        obtenerGrados();
    }, [editRowData.idniveleducativo]);

    // Obtener lista de tipo de educador para el Select
    useEffect(() => {
        const obtenerTEducador = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/tipoEducador`);
                setEducador(response.data);
            } catch (error) {
                console.error("Error al obtener los tipo educador", error);
            }
        };
        obtenerTEducador();
    }, []);



    // Obtener lista de usuarios
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/maestros`);
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
            nombre: '',
            identificacion: '',
            correo: '',
            telefono: '',
            genero: '',
            fechanacimiento: '',
            edad: '',
            idniveleducativo: '',
            idgradoacademico: '',
            iddepartamento: '',
            idmunicipio: '',
            idaldea: '',
            caserio: '',
            direccion: '',
            idtipoeducador: '',
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
            nombre: rowToEdit.nombre || '',
            identificacion: rowToEdit.identificacion || '',
            correo: rowToEdit.correo || '',
            telefono: rowToEdit.telefono || '',
            genero: rowToEdit.genero || '',
            fechanacimiento: formatearFechaParaInput(rowToEdit.fechanacimiento) || '',
            edad: rowToEdit.edad || '',
            idniveleducativo: rowToEdit.idniveleducativo || '',
            idgradoacademico: rowToEdit.idgradoacademico || '',
            iddepartamento: rowToEdit.iddepartamento || '',
            idmunicipio: rowToEdit.idmunicipio || '',
            idaldea: rowToEdit.idaldea || '',
            caserio: rowToEdit.caserio || '',
            direccion: rowToEdit.direccion || '',
            idtipoeducador: rowToEdit.idtipoeducador || '',
            id: rowToEdit.id || '',

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
                nombre: editRowData.nombre || null,
                identificacion: editRowData.identificacion || null,
                correo: editRowData.correo || null,
                telefono: editRowData.telefono || null,
                genero: editRowData.genero || null,
                fechanacimiento: editRowData.fechanacimiento || null,
                edad: editRowData.edad || null,
                idniveleducativo: editRowData.idniveleducativo || null,
                idgradoacademico: editRowData.idgradoacademico || null,
                iddepartamento: editRowData.iddepartamento || null,
                idmunicipio: editRowData.idmunicipio || null,
                idaldea: editRowData.idaldea || null,
                caserio: editRowData.caserio || null,
                direccion: editRowData.direccion || null,
                idtipoeducador: editRowData.idtipoeducador || null,
            };

            if (isAdding) {
                // INSERT: Agrega 'creadopor'

                await axios.post(`${process.env.REACT_APP_API_URL}/maestros`, {
                    ...payload,
                    creadopor: user?.id, // Asegúrate de que 'user' esté definido
                });
            } else {
                // UPDATE: Agrega 'modificadopor'
                await axios.put(`${process.env.REACT_APP_API_URL}/maestro/${editRowId}`, {
                    ...payload,
                    modificadopor: user?.id,
                });
            }

            // Éxito
            Swal.fire({
                title: isAdding ? "Registro Creado" : "Registro Actualizado",
                text: `El maestro ha sido ${isAdding ? "creado" : "actualizado"} exitosamente.`,
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


    useEffect(() => {
        if (editRowData.fechanacimiento) {
            const edad = calcularEdad(editRowData.fechanacimiento);
            setEditRowData(prev => ({
                ...prev,
                edad: edad
            }));
        }
    }, [editRowData.fechanacimiento]);

    const calcularEdad = (fechaStr) => {
        if (!fechaStr) return '';

        // Asegura el formato correcto yyyy-mm-dd
        const [year, month, day] = fechaStr.split('-').map(Number);
        const nacimiento = new Date(year, month - 1, day); // mes va de 0 a 11

        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
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
        { field: 'nombre', headerName: 'Nombre', width: 300 },
        { field: 'identificacion', headerName: 'DNI', width: 300 },
        { field: 'fechanacimiento', headerName: 'Fecha de Nacimiento', width: 170 },
        { field: 'edad', headerName: 'Edad' },
        { field: 'correo', headerName: 'Correo Electrónico', width: 300 },
        { field: 'telefono', headerName: 'Teléfono' },
        { field: 'genero', headerName: 'Genero' },
        { field: 'niveleducativo', headerName: 'Nivel Educativo', width: 300 },
        { field: 'gradoacademico', headerName: 'Grado Académico', width: 300 },
        { field: 'departamento', headerName: 'Departamento de Residencia', width: 300 },
        { field: 'municipio', headerName: 'Municipio de Residencia', width: 300 },
        { field: 'aldea', headerName: 'Aldea de Residencia', width: 300 },
        { field: 'caserio', headerName: 'Caserio de Residencia', width: 300 },
        { field: 'direccion', headerName: 'Dirección de Residencia', width: 300 },
        { field: 'tipoeducador', headerName: 'Tipo Educador', width: 300 },

    ];


    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                        Instructores
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
                        {isAdding ? 'Nuevo Instructor' : 'Actualizar Instructor'}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pl: 5, pr: 5 }}>


                            <TextField
                                label="Nombre"
                                name="nombre"
                                value={editRowData.nombre || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                label="DNI"
                                name="identificacion"
                                value={editRowData.identificacion || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <Grid container spacing={5}>
                                <Grid item size={6}>
                                    <TextField
                                        label="Fecha de Nacimiento"
                                        name="fechanacimiento"
                                        value={editRowData.fechanacimiento || ''}
                                        onChange={handleEditRowChange}
                                        fullWidth
                                        variant="standard"
                                        type='date'
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item size={6}>
                                    <TextField
                                        label="Edad"
                                        name="edad"
                                        value={editRowData.edad || ''}
                                        fullWidth
                                        variant="standard"
                                        type='number'
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                            </Grid>


                            <TextField
                                label="Correo Electrónico"
                                name="correo"
                                value={editRowData.correo || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                                type='email'
                            />
                            <TextField
                                label="Teléfono"
                                name="telefono"
                                value={editRowData.telefono || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Genero</InputLabel>
                                <Select
                                    name="genero"
                                    value={editRowData.genero || ''}
                                    onChange={handleEditRowChange}
                                    label="Genero"
                                >
                                    <MenuItem value="">Seleccionar genero</MenuItem>
                                    <MenuItem value="Femenino">Femenino</MenuItem>
                                    <MenuItem value="Masculino">Masculino</MenuItem>
                                </Select>
                            </FormControl>
                            <Grid container spacing={5}>
                                <Grid item size={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-label">Nivel Educativo</InputLabel>
                                        <Select
                                            name="idniveleducativo"
                                            value={editRowData.idniveleducativo || ''}
                                            onChange={handleEditRowChange}
                                            label="Nivel Educativo"
                                        >
                                            <MenuItem value="">Seleccionar nivel educativo</MenuItem>
                                            {niveles.map(niv => (
                                                <MenuItem key={niv.id} value={niv.id}>
                                                    {niv.nivelacademico}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item size={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-label">Grado Académicos</InputLabel>
                                        <Select
                                            name="idgradoacademico"
                                            value={editRowData.idgradoacademico || ''}
                                            onChange={handleEditRowChange}
                                            label="Grado Académicos"
                                            disabled={!grados.length}
                                        >
                                            <MenuItem value="">Seleccionar grado académico</MenuItem>
                                            {grados.map(gra => (
                                                <MenuItem key={gra.id} value={gra.id}>
                                                    {gra.gradoacademico}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                <Select
                                    name="iddepartamento"
                                    value={editRowData.iddepartamento || ''}
                                    onChange={handleEditRowChange}
                                    label="Departamento"
                                >
                                    <MenuItem value="">Seleccionar departamento</MenuItem>
                                    {departamentos.map(dep => (
                                        <MenuItem key={dep.id} value={dep.id}>
                                            {dep.departamento}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Municipio</InputLabel>
                                <Select
                                    name="idmunicipio"
                                    value={editRowData.idmunicipio || ''}
                                    onChange={handleEditRowChange}
                                    label="Municipio"
                                    disabled={!municipios.length}
                                >
                                    <MenuItem value="">Seleccionar municipio</MenuItem>
                                    {municipios.map(muni => (
                                        <MenuItem key={muni.id} value={muni.id}>
                                            {muni.municipio}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Aldea</InputLabel>
                                <Select
                                    name="idaldea"
                                    value={editRowData.idaldea || ''}
                                    onChange={handleEditRowChange}
                                    label="Aldea"
                                    disabled={!aldeas.length}
                                >
                                    <MenuItem value="">Seleccionar aldea</MenuItem>
                                    {aldeas.map(a => (
                                        <MenuItem key={a.id} value={a.id}>
                                            {a.aldea}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Caserio de Residencia"
                                name="caserio"
                                value={editRowData.caserio || ''}
                                onChange={handleEditRowChange}
                                fullWidth
                                variant="standard"
                            />

                            <FormControl fullWidth variant="standard">
                                <FormLabel component="label">Dirección</FormLabel>
                                <TextareaAutosize
                                    name="direccion"
                                    value={editRowData.direccion || ''}
                                    onChange={handleEditRowChange}
                                    aria-label="Dirección"
                                    minRows={3}
                                    //placeholder="Escribe algo aquí..."
                                    style={{ padding: '8px' }}
                                />
                            </FormControl>

                            <FormControl fullWidth variant="standard">
                                <InputLabel id="demo-simple-select-label">Tipo Educador</InputLabel>
                                <Select
                                    name="idtipoeducador"
                                    value={editRowData.idtipoeducador || ''}
                                    onChange={handleEditRowChange}
                                    label="Tipo Educador"
                                >
                                    <MenuItem value="">Seleccionar Tipo Educador</MenuItem>
                                    {educador.map(dep => (
                                        <MenuItem key={dep.id} value={dep.id}>
                                            {dep.tipoeducador}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

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