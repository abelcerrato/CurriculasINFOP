import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "../Components/UserContext";
import { color } from '../Components/style/Color';
import Dashboard from '../Dashboard/Dashboard';
import {
    Paper, Box, Typography,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Collapse, IconButton, Button,
    Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, Checkbox,
    FormControlLabel, Accordion, AccordionSummary,
    AccordionDetails, FormControl, InputLabel,
    Select, MenuItem
} from '@mui/material';
import {
    KeyboardArrowDown, KeyboardArrowUp,
    Add as AddIcon, Edit as EditOutlined,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


const DataTable = () => {
    const { user } = useUser();
    const [roles, setRoles] = useState([]);
    const [modulos, setModulos] = useState([]);
    const [objetos, setObjetos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [formData, setFormData] = useState({
        rol: '',
        descripcion: '',
        estado: true,
        permisos: []
    });

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/permisos`)
            setRoles(response.data.map(role => ({
                ...role,
                isExpanded: false
            })));


        } catch (error) {
            console.error("Error al obtener datos", error);
        }
    };

    // Obtener datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rolesRes, modulosRes, objetosRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/permisos`),
                    axios.get(`${process.env.REACT_APP_API_URL}/modulos`),
                    axios.get(`${process.env.REACT_APP_API_URL}/objetos`)
                ]);

                setRoles(rolesRes.data.map(role => ({
                    ...role,
                    isExpanded: false
                })));
                setModulos(modulosRes.data);
                setObjetos(objetosRes.data);
            } catch (error) {
                console.error("Error al obtener datos", error);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            const isEditing = Boolean(currentRole);
            const endpoint = isEditing
                ? `${process.env.REACT_APP_API_URL}/permisos`
                : `${process.env.REACT_APP_API_URL}/permisos`;

            const method = isEditing ? 'put' : 'post';

            // Convertir permisos al formato requerido por el backend
            const permisosFormateados = formData.permisos.reduce((acc, permiso) => {
                acc[permiso.idobjeto] = {
                    consultar: permiso.consultar ? true : false,
                    insertar: permiso.insertar ? true : false,
                    actualizar: permiso.actualizar ? true : false
                };
                return acc;
            }, {});

            // Armar datos a enviar, con creadopor o modificadopor según corresponda
            const dataToSend = {
                rol: formData.rol,
                descripcion: formData.descripcion,
                estado: formData.estado,
                permisos: permisosFormateados,

                ...(isEditing ? { modificadopor: user.id, idrol: currentRole.idrol } : { creadopor: user.id })
            };

            const response = await axios[method](endpoint, dataToSend);

            // Armar datos actualizados para el estado local
            const updatedRole = {
                ...response.data,
                isExpanded: false,
                permisos: formData.permisos.map(p => ({
                    idobjeto: p.idobjeto,
                    objeto: objetos.find(o => o.id === p.idobjeto)?.objeto || '',
                    modulo: modulos.find(m => m.id === objetos.find(o => o.id === p.idobjeto)?.idmodulo)?.modulo || '',
                    consultar: p.consultar,
                    insertar: p.insertar,
                    actualizar: p.actualizar
                }))
            };

            const updatedRoles = isEditing
                ? roles.map(r => r.idrol === currentRole.idrol ? updatedRole : r)
                : [...roles, updatedRole];

            setRoles(updatedRoles);
            handleCloseModal();

            Swal.fire({
                title: '¡Éxito!',
                text: isEditing ? 'Perfil actualizado correctamente' : 'Perfil creado correctamente',
                icon: 'success',
                confirmButtonColor: color.azul
            });

            fetchData();
        } catch (error) {
            console.error("Error al guardar", error);

            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Ocurrió un error al guardar',
                icon: 'error',
                confirmButtonColor: color.azul
            });
        }
    };



    // Función para alternar la expansión
    const toggleExpand = (idrol) => {
        setRoles(roles.map(role =>
            role.idrol === idrol
                ? { ...role, isExpanded: !role.isExpanded }
                : role
        ));
    };

    // Manejar apertura/cierre del modal
    const handleOpenModal = (role = null) => {
        if (role) {
            setCurrentRole(role);
            setFormData({
                rol: role.rol,
                descripcion: role.descripcion,
                estado: role.estado,
                permisos: [...role.permisos]
            });
        } else {
            setCurrentRole(null);
            setFormData({
                rol: '',
                descripcion: '',
                estado: true,
                permisos: objetos.map(obj => ({
                    idobjeto: obj.id,
                    objeto: obj.objeto,
                    idmodulo: obj.idmodulo,
                    modulo: obj.modulo,
                    consultar: false,
                    insertar: false,
                    actualizar: false
                }))
            });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // Manejar cambios en los permisos
    const handlePermissionChange = (idobjeto, tipo) => {
        setFormData(prev => {
            const updatedPermisos = prev.permisos.map(permiso => {
                if (permiso.idobjeto === idobjeto) {
                    const newValue = !permiso[tipo];

                    // Si estamos activando insertar o actualizar, activar también consultar
                    const shouldActivateConsultar =
                        (tipo === 'insertar' || tipo === 'actualizar') &&
                        newValue &&
                        !permiso.consultar;

                    return {
                        ...permiso,
                        [tipo]: newValue,
                        consultar: shouldActivateConsultar ? true : permiso.consultar
                    };
                }
                return permiso;
            });

            return { ...prev, permisos: updatedPermisos };
        });
    };


    // Agrupar objetos por módulo
    const objetosPorModulo = modulos.reduce((acc, modulo) => {
        const objetosModulo = objetos.filter(obj => obj.idmodulo === modulo.id);
        if (objetosModulo.length > 0) {
            acc.push({
                idmodulo: modulo.id,
                modulo: modulo.modulo,
                objetos: objetosModulo
            });
        }
        return acc;
    }, []);

    // Columnas principales
    const columns = [
        {
            field: "actions",
            headerName: "Acciones",
            width: 120,
            renderCell: (params) => (
                <>
                    <IconButton
                        sx={{ color: color.azul }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(params.row);
                        }}
                    >
                        <EditOutlined />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(params.row.idrol);
                        }}
                    >
                        {params.row.isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </>

            )
        },
        { field: "idrol", headerName: "ID", width: 70 },
        { field: "rol", headerName: "Perfil", width: 180 },
        { field: "descripcion", headerName: "Descripción", width: 300 },
        {
            field: "estado",
            headerName: "Estado",
            width: 100,
            renderCell: (params) => (

                <span style={{ color: params.row.estado ? 'green' : 'red' }}>
                    {params.row.estado ? "Activo" : "Inactivo"}
                </span>
            )
        },
        { field: "creadopor", headerName: "Creado por", width: 150 },

    ];

    // Componente personalizado para las filas
    const CustomRow = ({ row }) => {
        return (
            <>
                <TableRow>
                    {columns.map((column) => {
                        const value = row[column.field];
                        return (
                            <TableCell key={column.field}>
                                {column.renderCell
                                    ? column.renderCell({ row, value })
                                    : value}
                            </TableCell>
                        );
                    })}
                </TableRow>
                <TableRow>
                    <TableCell style={{ padding: 0 }} colSpan={columns.length}>
                        <Collapse in={row.isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    Permisos
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: color.azul }}>
                                                <TableCell sx={{ color: 'white' }}>Objeto</TableCell>
                                                <TableCell sx={{ color: 'white' }}>Módulo</TableCell>
                                                <TableCell sx={{ color: 'white' }} align="center">Consultar</TableCell>
                                                <TableCell sx={{ color: 'white' }} align="center">Insertar</TableCell>
                                                <TableCell sx={{ color: 'white' }} align="center">Actualizar</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {row.permisos?.map((permiso, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{permiso.objeto}</TableCell>
                                                    <TableCell>{permiso.modulo}</TableCell>
                                                    <TableCell align="center">
                                                        <span style={{
                                                            color: permiso.consultar ? 'green' : 'red',
                                                        }}>
                                                            {permiso.consultar ? "SI" : "NO"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <span style={{
                                                            color: permiso.consultar ? 'green' : 'red',
                                                        }}>
                                                            {permiso.insertar ? "SI" : "NO"}
                                                        </span>

                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <span style={{
                                                            color: permiso.consultar ? 'green' : 'red',
                                                        }}>
                                                            {permiso.actualizar ? "SI" : "NO"}
                                                        </span>

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };



    // Verifica si todos los permisos están activos
    const allPermissionsActive = () => {
        return formData.permisos.length > 0 &&
            formData.permisos.every(p => p.consultar && p.insertar && p.actualizar);
    };

    // Verifica si todos los permisos de un tipo están activos
    const allPermissionsOfTypeActive = (type) => {
        return formData.permisos.length > 0 &&
            formData.permisos.every(p => p[type]);
    };

    // Verifica si todos los permisos de un módulo están activos
    const moduleAllPermissionsActive = (moduleId) => {
        const moduleObjects = objetos.filter(o => o.idmodulo === moduleId);
        return moduleObjects.length > 0 &&
            moduleObjects.every(obj => {
                const permiso = formData.permisos.find(p => p.idobjeto === obj.id);
                return permiso?.consultar && permiso?.insertar && permiso?.actualizar;
            });
    };

    // Verifica si todos los permisos de un tipo en un módulo están activos
    const modulePermissionTypeActive = (moduleId, type) => {
        const moduleObjects = objetos.filter(o => o.idmodulo === moduleId);
        return moduleObjects.length > 0 &&
            moduleObjects.every(obj => {
                const permiso = formData.permisos.find(p => p.idobjeto === obj.id);
                return permiso?.[type];
            });
    };

    // Funciones toggle actualizadas
    const handleToggleAllPermissions = () => {
        const shouldActivate = !allPermissionsActive();
        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => ({
                ...permiso,
                consultar: shouldActivate,
                insertar: shouldActivate,
                actualizar: shouldActivate
            }))
        }));
    };

    const handleTogglePermissionType = (tipo) => {
        const shouldActivate = !allPermissionsOfTypeActive(tipo);

        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => ({
                ...permiso,
                [tipo]: shouldActivate,
                // Si estamos activando insertar o actualizar, activar también consultar
                consultar: ((tipo === 'insertar' || tipo === 'actualizar') && shouldActivate)
                    ? true
                    : permiso.consultar
            }))
        }));
    };

    const handleToggleModulePermissions = (moduleId) => {
        const shouldActivate = !moduleAllPermissionsActive(moduleId);

        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => {
                const obj = objetos.find(o => o.id === permiso.idobjeto);
                if (obj && obj.idmodulo === moduleId) {
                    return {
                        ...permiso,
                        consultar: shouldActivate,
                        insertar: shouldActivate,
                        actualizar: shouldActivate
                    };
                }
                return permiso;
            })
        }));
    };

    const handleToggleModulePermissionType = (moduleId, tipo) => {
        const shouldActivate = !modulePermissionTypeActive(moduleId, tipo);

        setFormData(prev => ({
            ...prev,
            permisos: prev.permisos.map(permiso => {
                const obj = objetos.find(o => o.id === permiso.idobjeto);
                if (obj && obj.idmodulo === moduleId) {
                    return {
                        ...permiso,
                        [tipo]: shouldActivate,
                        // Si estamos activando insertar o actualizar, activar también consultar
                        consultar: ((tipo === 'insertar' || tipo === 'actualizar') && shouldActivate)
                            ? true
                            : permiso.consultar
                    };
                }
                return permiso;
            })
        }));
    };
    return (
        <Dashboard>
            <Box component={Paper} sx={{ p: 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: color.azul }}>
                        Roles y Permisos
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenModal()}
                        sx={{
                            backgroundColor: color.azul,
                        }}
                    >
                        Nuevo
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
                                        {column.headerName}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {roles.map((row) => (
                                <CustomRow key={row.idrol} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Modal para agregar/editar */}
                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle sx={{ backgroundColor: color.azul, color: 'white' }}>
                        {currentRole ? 'Editar Perfil y Permisos' : 'Nuevo Perfil y Permisos'}
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box sx={{ mb: 3, mt: 2 }}>
                            <TextField
                                variant="standard"
                                fullWidth
                                label="Rol"
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                variant="standard"
                                fullWidth
                                label="Descripción"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                margin="normal"
                            />

                            <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    label="Estado"
                                >
                                    <MenuItem value={true}>Activo</MenuItem>
                                    <MenuItem value={false}>Inactivo</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Asignación de Permisos
                        </Typography>

                        {/* Controles masivos de permisos */}
                        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button
                                variant="text"
                                onClick={() => handleToggleAllPermissions()}
                                startIcon={allPermissionsActive() ? <CancelIcon /> : <CheckCircleIcon />}
                                sx={{
                                    color: allPermissionsActive() ? color.rojo : color.azul,

                                }}

                            >
                                {allPermissionsActive() ? 'Desactivar Todos' : 'Activar Todos'}
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => handleTogglePermissionType('consultar')}
                                startIcon={allPermissionsOfTypeActive('consultar') ? <CancelIcon /> : <CheckCircleIcon />}

                                sx={{
                                    color: allPermissionsOfTypeActive('consultar') ? color.rojo : color.azul,

                                }}
                            >
                                {allPermissionsOfTypeActive('consultar') ? 'Desactivar Consultar' : 'Activar Consultar'}
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => handleTogglePermissionType('insertar')}
                                startIcon={allPermissionsOfTypeActive('insertar') ? <CancelIcon /> : <CheckCircleIcon />}
                                sx={{
                                    color: allPermissionsOfTypeActive('insertar') ? color.rojo : color.azul,

                                }}
                            >
                                {allPermissionsOfTypeActive('insertar') ? 'Desactivar Insertar' : 'Activar Insertar'}
                            </Button>

                            <Button
                                variant="text"
                                onClick={() => handleTogglePermissionType('actualizar')}
                                startIcon={allPermissionsOfTypeActive('actualizar') ? <CancelIcon /> : <CheckCircleIcon />}
                                sx={{
                                    color: allPermissionsOfTypeActive('actualizar') ? color.rojo : color.azul,

                                }}
                            >
                                {allPermissionsOfTypeActive('actualizar') ? 'Desactivar Actualizar' : 'Activar Actualizar'}
                            </Button>
                        </Box>

                        {objetosPorModulo.map((grupo) => (
                            <Accordion key={grupo.idmodulo}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Typography sx={{ fontWeight: 'bold', flexGrow: 1 }}>{grupo.modulo}</Typography>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleModulePermissions(grupo.idmodulo);
                                            }}
                                            title={moduleAllPermissionsActive(grupo.idmodulo) ? 'Desactivar todos' : 'Activar todos'}
                                            sx={{
                                                color: moduleAllPermissionsActive(grupo.idmodulo) ? color.rojo : color.azul,
                                                borderColor: moduleAllPermissionsActive(grupo.idmodulo) ? color.rojo : color.azul,
                                            }}

                                        >
                                            {moduleAllPermissionsActive(grupo.idmodulo) ? <CancelIcon /> : <CheckCircleIcon />}
                                        </IconButton>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer component={Paper}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Objeto</TableCell>
                                                    {['consultar', 'insertar', 'actualizar'].map((tipo) => (
                                                        <TableCell key={tipo} align="center" sx={{ fontWeight: 'bold' }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <span style={{ textTransform: 'capitalize' }}>{tipo}</span>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleToggleModulePermissionType(grupo.idmodulo, tipo)}
                                                                    title={modulePermissionTypeActive(grupo.idmodulo, tipo) ?
                                                                        `Desactivar todos ${tipo}` : `Activar todos ${tipo}`}
                                                                    sx={{
                                                                        color: modulePermissionTypeActive(grupo.idmodulo, tipo) ? color.rojo : color.azul,
                                                                        borderColor: modulePermissionTypeActive(grupo.idmodulo, tipo) ? color.rojo : color.azul,
                                                                    }}
                                                                >
                                                                    {modulePermissionTypeActive(grupo.idmodulo, tipo) ?
                                                                        <CancelIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                                                </IconButton>
                                                            </Box>
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {grupo.objetos.map((obj) => {
                                                    const permiso = formData.permisos.find(p => p.idobjeto === obj.id) || {};
                                                    return (
                                                        <TableRow key={obj.id}>
                                                            <TableCell>{obj.objeto}</TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    checked={permiso.consultar || false}
                                                                    onChange={() => handlePermissionChange(obj.id, 'consultar')}
                                                                    sx={{
                                                                        color: color.gris,
                                                                        '&.Mui-checked': {
                                                                            color: color.azul,
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    checked={permiso.insertar || false}
                                                                    onChange={() => {
                                                                        handlePermissionChange(obj.id, 'insertar');
                                                                        // Mostrar notificación si se activó consultar automáticamente
                                                                        if (!permiso.consultar && !permiso.insertar) {
                                                                            setTimeout(() => {
                                                                                const updatedPermiso = formData.permisos.find(p => p.idobjeto === obj.id);
                                                                                if (updatedPermiso?.consultar) {
                                                                                    Swal.fire({
                                                                                        title: 'Permiso de consulta activado',
                                                                                        text: 'Para poder insertar, se requiere permiso de consulta',
                                                                                        icon: 'info',
                                                                                        confirmButtonColor: color.azul,
                                                                                        timer: 2000
                                                                                    });
                                                                                }
                                                                            }, 100);
                                                                        }
                                                                    }}
                                                                    sx={{
                                                                        color: color.gris,
                                                                        '&.Mui-checked': {
                                                                            color: color.azul,
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Checkbox
                                                                    checked={permiso.actualizar || false}
                                                                    onChange={() => {
                                                                        handlePermissionChange(obj.id, 'actualizar');
                                                                        // Mostrar notificación si se activó consultar automáticamente
                                                                        if (!permiso.consultar && !permiso.actualizar) {
                                                                            setTimeout(() => {
                                                                                const updatedPermiso = formData.permisos.find(p => p.idobjeto === obj.id);
                                                                                if (updatedPermiso?.consultar) {
                                                                                    Swal.fire({
                                                                                        title: 'Permiso de consulta activado',
                                                                                        text: 'Para poder actualizar, se requiere permiso de consulta',
                                                                                        icon: 'info',
                                                                                        confirmButtonColor: color.azul,
                                                                                        timer: 2000
                                                                                    });
                                                                                }
                                                                            }, 100);
                                                                        }
                                                                    }}
                                                                    sx={{
                                                                        color: color.gris,
                                                                        '&.Mui-checked': {
                                                                            color: color.azul,
                                                                        },
                                                                    }}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} sx={{ color: color.rojo }}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            sx={{
                                backgroundColor: color.azul,

                            }}
                        >
                            Guardar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Dashboard>
    );
};

export default DataTable;