import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useUser } from "../Components/UserContext";
import { color } from '../Components/style/Color';
import Dashboard from '../Dashboard/Dashboard';




// Material-UI
import {
    Paper, Box, Typography, TextField, Button, IconButton,
    FormControl, Select, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, InputLabel, Tooltip, TextareaAutosize, FormLabel,
    Grid, FormControlLabel, Checkbox, Chip, OutlinedInput,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { EditOutlined as EditOutlinedIcon, Add as AddIcon } from '@mui/icons-material';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const DataTable = () => {
    const { user } = useUser();
    const [rows, setRows] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [editRowData, setEditRowData] = useState({
        identificacion: '',
        nombre: '',
        fechanacimiento: '',
        edad: '',
        genero: '',
        idnacionalidad: '',
        idetnia: '',
        telefono: '',

        estadocivil: '',
        idniveleducativo: '',
        idgradoacademico: '',
        estudianoformal: '',
        trabajaactualmente: '',

        iddiscapacidad: '',
        detallediscapacidad: '',
        iddepartamento: '',
        idmunicipio: '',
        idaldea: '',
        caserio: '',

        direccion: '',
        sabecomputacion: '',
        manejaprogramas: '',
        dispositivostecnologicos: '',
        plataformasvirtuales: '',

        estudioencasa: '',
        pasarsindistraccion: '',
        migranteretornado: '',
        motivomigracion: '',
        otromotivomigracion: '',

        llegousa: '',
        familiarmigranteretornado: '',
        miembrosalioynoregreso: '',
        volveriaamigrar: '',

    });
    const [isAdding, setIsAdding] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [aldeas, setAldeas] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const [grados, setGrados] = useState([]);
    const [etnia, setEtnia] = useState([]);
    const [nacionalidad, setNacionalidad] = useState([]);
    const [discapacidad, setDiscapacidad] = useState([]);


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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/etnias`);
                setEtnia(response.data);
            } catch (error) {
                console.error("Error al obtener los tipo educador", error);
            }
        };
        obtenerTEducador();
    }, []);

    // Obtener lista de nacionalidad para el Select
    useEffect(() => {
        const obtenerNacionalidad = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/nacionalidades`);
                setNacionalidad(response.data);
            } catch (error) {
                console.error("Error al obtener los nacionalidad", error);
            }
        };
        obtenerNacionalidad();
    }, []);

    // Obtener lista de discapacidades para el Select
    useEffect(() => {
        const obtenerDiscapacidad = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/discapacidades`);
                setDiscapacidad(response.data);
            } catch (error) {
                console.error("Error al obtener los Discapacidad", error);
            }
        };
        obtenerDiscapacidad();
    }, []);


    // Obtener lista de usuarios
    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/estudiantes`);
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
            identificacion: '',
            nombre: '',
            fechanacimiento: '',
            edad: '',
            genero: '',
            idnacionalidad: '',
            idetnia: '',
            telefono: '',

            estadocivil: '',
            idniveleducativo: '',
            idgradoacademico: '',
            estudianoformal: '',
            trabajaactualmente: '',

            iddiscapacidad: '',
            detallediscapacidad: '',
            iddepartamento: '',
            idmunicipio: '',
            idaldea: '',
            caserio: '',

            direccion: '',
            sabecomputacion: '',
            manejaprogramas: '',
            dispositivostecnologicos: '',
            plataformasvirtuales: '',

            estudioencasa: '',
            pasarsindistraccion: '',
            migranteretornado: '',
            motivomigracion: '',
            otromotivomigracion: '',

            llegousa: '',
            familiarmigranteretornado: '',
            miembrosalioynoregreso: '',
            volveriaamigrar: '',
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
        console.log("Fecha original:", rowToEdit.fechanacimiento);

        setEditRowData({
            identificacion: rowToEdit.identificacion || null,
            nombre: rowToEdit.nombre || null,
            fechanacimiento: formatearFechaParaInput(rowToEdit.fechanacimiento) || '',
            edad: rowToEdit.edad || null,
            genero: rowToEdit.genero || null,
            idnacionalidad: rowToEdit.idnacionalidad || null,
            idetnia: rowToEdit.idetnia || null,
            telefono: rowToEdit.telefono || null,

            estadocivil: rowToEdit.estadocivil || null,
            idniveleducativo: rowToEdit.idniveleducativo || null,
            idgradoacademico: rowToEdit.idgradoacademico || null,
            estudianoformal: rowToEdit.estudianoformal || null,
            educacionnoformal: rowToEdit.educacionnoformal || null,
            trabajaactualmente: rowToEdit.trabajaactualmente || null,

            iddiscapacidad: rowToEdit.iddiscapacidad || null,
            detallediscapacidad: rowToEdit.detallediscapacidad || null,
            iddepartamento: rowToEdit.iddepartamento || null,
            idmunicipio: rowToEdit.idmunicipio || null,
            idaldea: rowToEdit.idaldea || null,
            caserio: rowToEdit.caserio || null,

            direccion: rowToEdit.direccion || null,
            sabecomputacion: rowToEdit.sabecomputacion || null,
            manejaprogramas: rowToEdit.manejaprogramas || null,
            dispositivostecnologicos: rowToEdit.dispositivostecnologicos || null,
            plataformasvirtuales: rowToEdit.plataformasvirtuales || null,

            estudioencasa: rowToEdit.estudioencasa || null,
            pasarsindistraccion: rowToEdit.pasarsindistraccion || null,
            migranteretornado: rowToEdit.imigranteretornadod || null,
            motivomigracion: rowToEdit.motivomigracion || null,
            otromotivomigracion: rowToEdit.otromotivomigracion || null,

            llegousa: rowToEdit.llegousa || null,
            familiarmigranteretornado: rowToEdit.familiarmigranteretornado || null,
            miembrosalioynoregreso: rowToEdit.miembrosalioynoregreso || null,
            volveriaamigrar: rowToEdit.volveriaamigrar || null,

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
                identificacion: editRowData.identificacion || null,
                nombre: editRowData.nombre || null,
                fechanacimiento: editRowData.fechanacimiento || null,
                edad: editRowData.edad || null,
                genero: editRowData.genero || null,
                idnacionalidad: editRowData.idnacionalidad || null,
                idetnia: editRowData.idetnia || null,
                telefono: editRowData.telefono || null,
                estadocivil: editRowData.estadocivil || null,
                idniveleducativo: editRowData.idniveleducativo || null,
                idgradoacademico: editRowData.idgradoacademico || null,
                estudianoformal: editRowData.estudianoformal || false,
                trabajaactualmente: editRowData.trabajaactualmente || false,
                iddiscapacidad: editRowData.iddiscapacidad || null,
                detallediscapacidad: editRowData.detallediscapacidad || null,
                iddepartamento: editRowData.iddepartamento || null,
                idmunicipio: editRowData.idmunicipio || null,
                idaldea: editRowData.idaldea || null,
                caserio: editRowData.caserio || null,
                direccion: editRowData.direccion || null,
                sabecomputacion: editRowData.sabecomputacion || null,
                manejaprogramas: editRowData.manejaprogramas || null,
                dispositivostecnologicos: Array.isArray(editRowData.dispositivostecnologicos)
                    ? editRowData.dispositivostecnologicos.join(', ')
                    : editRowData.dispositivostecnologicos || null,
                plataformasvirtuales: Array.isArray(editRowData.plataformasvirtuales)
                    ? editRowData.plataformasvirtuales.join(', ')
                    : editRowData.plataformasvirtuales || null,
                estudioencasa: editRowData.estudioencasa || false,
                pasarsindistraccion: editRowData.pasarsindistraccion || false,
                migranteretornado: editRowData.migranteretornado || false,
                motivomigracion: editRowData.motivomigracion || null,
                otromotivomigracion: editRowData.otromotivomigracion || null,
                llegousa: editRowData.llegousa || null,
                familiarmigranteretornado: editRowData.familiaretornado || null, // Corregido el nombre del campo
                miembrosalioynoregreso: editRowData.miembrosalioynoregreso || null,
                volveriaamigrar: editRowData.volveriaamigrar || null,
                // Convierte el texto del textarea en un array
                educacionnoformal: editRowData.educacionnoformal
                    ? editRowData.educacionnoformal.split(/[\n,]+/).map(item => item.trim()).filter(item => item)
                    : [],
            };

            if (isAdding) {
                // INSERT: Agrega 'creadopor'

                await axios.post(`${process.env.REACT_APP_API_URL}/estudiantes`, {
                    ...payload,
                    creadopor: user?.id, // Asegúrate de que 'user' esté definido
                });
            } else {
                // UPDATE: Agrega 'modificadopor'
                await axios.put(`${process.env.REACT_APP_API_URL}/estudiante/${editRowId}`, {
                    ...payload,
                    modificadopor: user?.id,
                });
            }

            // Éxito
            Swal.fire({
                title: isAdding ? "Registro Creado" : "Registro Actualizado",
                text: `El estudiante ha sido ${isAdding ? "creado" : "actualizado"} exitosamente.`,
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

    const handleEditRowChange = (event) => {
        const { name, value, type, checked } = event.target;

        // Si es un checkbox, usa "checked"; de lo contrario, usa "value"
        const newValue = type === 'checkbox' ? checked : value;

        // Caso 1: Limpiar campos relacionados si se desmarca "migranteretornado"
        if (name === 'migranteretornado' && !newValue) {
            setEditRowData({
                ...editRowData,
                migranteretornado: false,
                motivomigracion: '',
                otromotivomigracion: '',
                llegousa: '',
                familiaretornado: '',
                miembrosalioynoregreso: '',
                volveriaamigrar: '',
            });
        }

        else {
            setEditRowData({
                ...editRowData,
                [name]: newValue,
            });
        }
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
        { field: 'identificacion', headerName: 'DNI', width: 200 },
        { field: 'fechanacimiento', headerName: 'Fecha de Nacimiento', width: 170 },
        { field: 'edad', headerName: 'Edad' },
        { field: 'telefono', headerName: 'Teléfono' },
        { field: 'genero', headerName: 'Genero' },
        { field: 'nacionalidad', headerName: 'Nacionalidad', width: 200 },
        { field: 'departamento', headerName: 'Departamento de Residencia', width: 300 },
        { field: 'municipio', headerName: 'Municipio de Residencia', width: 300 },
        { field: 'aldea', headerName: 'Aldea de Residencia', width: 200 },
        { field: 'caserio', headerName: 'Caserio de Residencia', width: 300 },
        { field: 'direccion', headerName: 'Dirección de Residencia', width: 300 },
        { field: 'estadocivil', headerName: 'Estado Civil', width: 200 },
        { field: 'nivelacademico', headerName: 'Nivel Educativo', width: 200 },
        { field: 'gradoacademico', headerName: 'Grado Académico', width: 200 },
        { field: 'etnia', headerName: 'Etnia' },
        {
            field: 'estudianoformal',
            headerName: 'Estudia en Educación No Formal',
            width: 250,
            renderCell: (params) => (
                <span style={{ color: params.value ? 'green' : 'red' }}>
                    {params.value ? 'SÍ' : 'NO'}
                </span>
            )
        },

        { field: 'educacionnoformal', headerName: 'Educación No Formal', width: 170 },
        {
            field: 'trabajaactualmente',
            headerName: 'Trabaja Actualmente',
            width: 150,
            renderCell: (params) => (
                <span style={{ color: params.value ? 'green' : 'red' }}>
                    {params.value ? 'SÍ' : 'NO'}
                </span>
            )
        },
        { field: 'discapacidad', headerName: 'Discapacidad', width: 110 },
        { field: 'detallediscapacidad', headerName: 'Detalle de Discapacidad', width: 180 },
        { field: 'sabecomputacion', headerName: 'Sabe Computación', width: 150 },
        { field: 'manejaprogramas', headerName: 'Manejo de Programas', width: 400 },
        { field: 'dispositivostecnologicos', headerName: 'Dispositivos Tecnológicos', width: 400 },
        { field: 'plataformasvirtuales', headerName: 'Plataformas Virtuales', width: 400 },
        {
            field: 'estudioencasa',
            headerName: 'Estudia en Casa',
            width: 170,
            renderCell: (params) => (
                <span style={{ color: params.value ? 'green' : 'red' }}>
                    {params.value ? 'SÍ' : 'NO'}
                </span>
            )
        },
        {
            field: 'pasarsindistraccion',
            headerName: 'Pasar sin Distracción',
            width: 170,
            renderCell: (params) => (
                <span style={{ color: params.value ? 'green' : 'red' }}>
                    {params.value ? 'SÍ' : 'NO'}
                </span>
            )
        },
        {
            field: 'migranteretornado',
            headerName: 'Migrante Retornado',
            width: 150,
            renderCell: (params) => (
                <span style={{ color: params.value ? 'green' : 'red' }}>
                    {params.value ? 'SÍ' : 'NO'}
                </span>
            )
        },
        { field: 'motivomigracion', headerName: '¿Qué lo motivóa migrar de su país', width: 150 },
        { field: 'otromotivomigracion', headerName: 'Otro Motivo de Migración', width: 200 },
        { field: 'llegousa', headerName: 'En su experiencia migratoria, puede indicar si llegó a:', width: 150 },
        { field: 'familiaretornado', headerName: '¿Tiene familiares que se identifican como migrantes retornados?', width: 250 },
        { field: 'miembrosalioynoregreso', headerName: '¿Algún miembro de su hogar salió de Honduras y no regreso?', width: 250 },
        { field: 'volveriaamigrar', headerName: 'Volvería a Migrar', width: 150 },
    ];


    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                        Estudiantes
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
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg" fullWidth>
                    <DialogTitle sx={{ backgroundColor: color.azul, color: 'white' }}>
                        {isAdding ? 'Nuevo Estudiante' : 'Actualizar Estudiante'}
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
                                <Grid item size={6}>
                                    <TextField
                                        label="Teléfono"
                                        name="telefono"
                                        value={editRowData.telefono || ''}
                                        onChange={handleEditRowChange}
                                        fullWidth
                                        variant="standard"
                                    />
                                </Grid>

                                <Grid item size={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-label">Estado Civil</InputLabel>
                                        <Select
                                            name="estadocivil"
                                            value={editRowData.estadocivil || ''}
                                            onChange={handleEditRowChange}
                                            label="Estado Civil"
                                        >
                                            <MenuItem value="">Seleccionar genero</MenuItem>
                                            <MenuItem value="Soltero">Soltero</MenuItem>
                                            <MenuItem value="Casado">Casado</MenuItem>
                                            <MenuItem value="Viudo">Viudo</MenuItem>
                                            <MenuItem value="Unión Libre">Unión Libre</MenuItem>
                                            <MenuItem value="Divorciado">Divorciado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <Grid container spacing={5}>
                                <Grid item size={6}>
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
                                </Grid>
                                <Grid item size={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-label">Nacionalidad</InputLabel>
                                        <Select
                                            name="idnacionalidad"
                                            value={editRowData.idnacionalidad || ''}
                                            onChange={handleEditRowChange}
                                            label="Nivel Educativo"
                                        >
                                            <MenuItem value="">Seleccionar nacionalidad</MenuItem>
                                            {nacionalidad.map(niv => (
                                                <MenuItem key={niv.id} value={niv.id}>
                                                    {niv.nacionalidad}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={5}>
                                <Grid item size={6}>
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
                                </Grid>
                                <Grid item size={6}>
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
                                </Grid>
                            </Grid>


                            <Grid container spacing={5}>
                                <Grid item size={6}>
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
                                </Grid>

                                <Grid item size={6}>
                                    <TextField
                                        label="Caserio de Residencia"
                                        name="caserio"
                                        value={editRowData.caserio || ''}
                                        onChange={handleEditRowChange}
                                        fullWidth
                                        variant="standard"
                                    />
                                </Grid>
                            </Grid>
                            <FormControl fullWidth variant="standard">
                                <FormLabel component="label">Dirección</FormLabel>
                                <TextareaAutosize
                                    name="direccion"
                                    value={editRowData.direccion || ''}
                                    onChange={handleEditRowChange}
                                    aria-label="Dirección"
                                    minRows={3}
                                    style={{ padding: '8px' }}
                                //placeholder="Escribe algo aquí..."
                                />
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
                                <InputLabel id="demo-simple-select-label">Etnia</InputLabel>
                                <Select
                                    name="idetnia"
                                    value={editRowData.idetnia || ''}
                                    onChange={handleEditRowChange}
                                    label="Etnia"
                                >
                                    <MenuItem value="">Seleccionar Etnia</MenuItem>
                                    {etnia.map(e => (
                                        <MenuItem key={e.id} value={e.id}>
                                            {e.etnia}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Grid container spacing={5}>
                                <Grid item size={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="estudianoformal"
                                                checked={Boolean(editRowData.estudianoformal)}
                                                onChange={handleEditRowChange}
                                            />
                                        }
                                        label="Estudia en Educación No Formal"
                                    />
                                </Grid>
                                {editRowData.estudianoformal && (
                                    <Grid item size={6}>

                                        <FormControl fullWidth variant="standard">
                                            <FormLabel component="label">Educación No Formal</FormLabel>

                                            <TextareaAutosize
                                                minRows={3}
                                                style={{ padding: '8px', width: "95%" }}
                                                name="educacionnoformal"
                                                value={editRowData.educacionnoformal || ""}
                                                onChange={handleEditRowChange}
                                                placeholder="Ej: Curso de inglés, Taller de Excel"
                                            />
                                        </FormControl>


                                    </Grid>)}
                                <Grid item size={6}>
                                    <FormControlLabel
                                        label="Trabaja Actualmente"
                                        control={
                                            <Checkbox
                                                name="trabajaactualmente"
                                                checked={Boolean(editRowData.trabajaactualmente)}
                                                onChange={handleEditRowChange}
                                            />}
                                    />
                                </Grid>

                                <Grid item size={editRowData.iddiscapacidad === 1 ? 6 : 12}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-label">Discapacidad</InputLabel>
                                        <Select
                                            name="iddiscapacidad"
                                            value={editRowData.iddiscapacidad || ''}
                                            onChange={handleEditRowChange}
                                            label="Discapacidad"
                                        >
                                            <MenuItem value="">Seleccionar discapacidad</MenuItem>
                                            {discapacidad.map(e => (
                                                <MenuItem key={e.id} value={e.id}>
                                                    {e.discapacidad}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {editRowData.iddiscapacidad === 1 && (
                                    <Grid item size={6}>
                                        <TextField
                                            label="Detalle de discapacidad"
                                            name="detallediscapacidad"
                                            value={editRowData.detallediscapacidad || ''}
                                            onChange={handleEditRowChange}
                                            fullWidth
                                            variant="standard"
                                        />
                                    </Grid>
                                )}
                                <Grid item size={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-label">Sabe Computación</InputLabel>
                                        <Select
                                            name="sabecomputacion"
                                            value={editRowData.sabecomputacion || ''}
                                            onChange={handleEditRowChange}
                                            label="Sabe Computación"
                                        >
                                            <MenuItem value="Básico">Básico </MenuItem>
                                            <MenuItem value="Intermedio">Intermedio</MenuItem>
                                            <MenuItem value="Avanzado">Avanzado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item size={6}>
                                    <FormControl fullWidth variant="standard">
                                        <FormLabel component="label">Manejo de Programas</FormLabel>
                                        <TextareaAutosize
                                            name="manejaprogramas"
                                            value={editRowData.manejaprogramas || ''}
                                            onChange={handleEditRowChange}
                                            aria-label="Manejo de Programas"
                                            minRows={3}
                                            style={{ padding: '8px' }}
                                        //placeholder="Escribe algo aquí..."
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item size={6}>
                                    <FormControl fullWidth variant="standard">
                                        <InputLabel id="demo-simple-select-label">Dispositivos Tecnológicos</InputLabel>
                                        <Select
                                            value={
                                                typeof editRowData.dispositivostecnologicos === 'string'
                                                    ? editRowData.dispositivostecnologicos
                                                        .split(',')
                                                        .map(v => v.trim())
                                                        .filter(v => v !== '')
                                                    : editRowData.dispositivostecnologicos || []
                                            }
                                            name="dispositivostecnologicos"
                                            onChange={handleEditRowChange}
                                            labelId="demo-multiple-chip-label"
                                            id="demo-multiple-chip"
                                            multiple
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            <MenuItem value="Teléfono inteligente">Teléfono inteligente</MenuItem>
                                            <MenuItem value="Computadora">Computadora</MenuItem>
                                            <MenuItem value="Tablet">Tablet</MenuItem>
                                            <MenuItem value="Smartwatch">Smartwatch</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item size={6}>

                                    <FormControl fullWidth variant="standard" >
                                        <InputLabel id="demo-multiple-chip-label">Plataformas Virtuales</InputLabel>
                                        <Select
                                            name="plataformasvirtuales"
                                            value={
                                                typeof editRowData.plataformasvirtuales === 'string'
                                                    ? editRowData.plataformasvirtuales
                                                        .split(',')
                                                        .map(v => v.trim())
                                                        .filter(v => v !== '')
                                                    : editRowData.plataformasvirtuales || []
                                            }

                                            onChange={handleEditRowChange}
                                            label="Plataformas Virtuales"
                                            labelId="demo-multiple-chip-label"
                                            id="demo-multiple-chip"
                                            multiple
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            <MenuItem value="Whatsapp">Whatsapp</MenuItem>
                                            <MenuItem value="Facebook">Facebook</MenuItem>
                                            <MenuItem value="Instagram">Instagram</MenuItem>
                                            <MenuItem value="X">X</MenuItem>
                                            <MenuItem value="Correo Eletrónico">Correo Eletrónico</MenuItem>
                                            <MenuItem value="Zoom">Zoom</MenuItem>
                                            <MenuItem value="Microsoft Teams">Microsoft Teams</MenuItem>
                                            <MenuItem value="Google Meets">Google Meets</MenuItem>
                                        </Select>

                                    </FormControl>

                                </Grid>
                                <Grid item size={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="estudioencasa"
                                                checked={Boolean(editRowData.estudioencasa)}
                                                onChange={handleEditRowChange}
                                            />}
                                        label="Estudia en Casa"
                                    />
                                </Grid>
                                <Grid item size={6}>
                                    <FormControlLabel
                                        label="Puede Recibir Clases Sin Distraciones en Casa"
                                        control={
                                            <Checkbox
                                                name="pasarsindistraccion"
                                                checked={Boolean(editRowData.pasarsindistraccion)}
                                                onChange={handleEditRowChange}
                                            />}
                                    />
                                </Grid>


                                <Grid item size={6}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="migranteretornado"
                                                checked={Boolean(editRowData.migranteretornado)}
                                                onChange={handleEditRowChange}
                                            />}
                                        label="¿Es migrante retornado?"
                                    />
                                </Grid>
                                {editRowData.migranteretornado && (
                                    <Grid item size={6}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel id="demo-simple-select-label">¿Qué le motivó a migrar de su país?</InputLabel>
                                            <Select
                                                name="motivomigracion"
                                                value={editRowData.motivomigracion || ''}
                                                onChange={handleEditRowChange}
                                            >
                                                <MenuItem value="Falta de empleo">Falta de empleo</MenuItem>
                                                <MenuItem value="Inseguridad">Inseguridad</MenuItem>
                                                <MenuItem value="Falta de acceso a educación">Falta de acceso a educación</MenuItem>
                                                <MenuItem value="Problemas de Salud">Problemas de Salud</MenuItem>
                                                <MenuItem value="Otro">Otro</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}

                                {editRowData.motivomigracion === "Otro" && (
                                    <Grid item size={6}>
                                        <TextField
                                            label="Otro Motivo de Migración"
                                            name="otromotivomigracion"
                                            value={editRowData.otromotivomigracion || ''}
                                            onChange={handleEditRowChange}
                                            fullWidth
                                            variant="standard"
                                        />
                                    </Grid>
                                )}
                                {editRowData.migranteretornado && (
                                    <Grid item size={6}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel id="demo-simple-select-label">En su experiencia migratoria, puede indicar si llegó a:</InputLabel>
                                            <Select
                                                name="llegousa"
                                                value={editRowData.llegousa || ''}
                                                onChange={handleEditRowChange}

                                            >
                                                <MenuItem value="LLegó a México">LLegó a México</MenuItem>
                                                <MenuItem value="LLegó a Estados Unidos">LLegó a Estados Unidos</MenuItem>
                                                <MenuItem value="Fue retornado(a) en Tránsito">Fue retornado(a) en Tránsito</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                                {editRowData.migranteretornado && (
                                    <Grid item size={6}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel id="demo-simple-select-label">¿Tiene familiares que se identifican como migrantes retornados?</InputLabel>
                                            <Select
                                                name="familiaretornado"
                                                value={editRowData.familiaretornado || ''}
                                                onChange={handleEditRowChange}

                                            >
                                                <MenuItem value="Sí">Sí</MenuItem>
                                                <MenuItem value="No">No</MenuItem>
                                                <MenuItem value="No Sabe / No Responde">No Sabe / No Responde</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                                {editRowData.familiaretornado === "Sí" && (
                                    <Grid item size={6}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel id="demo-simple-select-label">¿Algún miembro de su hogar salió de Honduras y no regreso?</InputLabel>
                                            <Select
                                                name="miembrosalioynoregreso"
                                                value={editRowData.miembrosalioynoregreso || ''}
                                                onChange={handleEditRowChange}
                                            >
                                                <MenuItem value="Sí">Sí</MenuItem>
                                                <MenuItem value="No">No</MenuItem>
                                                <MenuItem value="No Sabe / No Responde">No Sabe / No Responde</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                                {editRowData.migranteretornado && (
                                    <Grid item size={6}>
                                        <FormControl fullWidth variant="standard">
                                            <InputLabel id="demo-simple-select-label">Volvería a Migrar</InputLabel>
                                            <Select
                                                name="volveriaamigrar"
                                                value={editRowData.volveriaamigrar || ''}
                                                onChange={handleEditRowChange}
                                            >
                                                <MenuItem value="Sí">Sí</MenuItem>
                                                <MenuItem value="No">No</MenuItem>
                                                <MenuItem value="No Sabe / No Responde">No Sabe / No Responde</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )}
                            </Grid>
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
                </Dialog >
            </Box >
        </Dashboard >
    );
};

export default DataTable;