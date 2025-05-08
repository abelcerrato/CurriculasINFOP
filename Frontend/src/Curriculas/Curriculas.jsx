import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
    Box,
    Typography,
    TextField,
    Divider,
    Button,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Collapse,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    Tooltip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,

} from '@mui/material';
import {
    Add as AddIcon,

    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Class as ClassIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Dashboard from '../Dashboard/Dashboard';
import { color } from '../Components/style/Color';
import { useUser } from "../Components/UserContext";
import Swal from 'sweetalert2';

const CurriculumCreator = ({ open, onClose, editId, editData }) => {
    const { user } = useUser();
    const [areasF, setAreasF] = useState([]);
    const [validationErrors, setValidationErrors] = useState({
        curricula: '',
        versioncurricula: '',
        modules: '',
        moduleClasses: {}
    });

    const [curriculaData, setcurriculaData] = useState({
        curricula: '',
        versioncurricula: '',
        sector: '',
        nombresalida: '',
        idareaformacion: '',
        objetivo: '',
        duracionteoricaCurricula: '00:00',
        duracionpracticaCurricula: '00:00',
        duraciontotalCurricula: '00:00',
        idareaformacion: null,
        creadopor: user.id,
    });

    const [modulosData, setModulosData] = useState([]);

    const [newModule, setNewModule] = useState({
        modulo: '',
        duracionteoricaModulo: 0,
        duracionpracticaModulo: 0,
        duraciontotalModulo: 0,
        clases: []
    });

    const [newClass, setNewClass] = useState({
        clase: '',
        horasTeoricas: 0,
        minutosTeoricos: 0,
        horasPracticas: 0,
        minutosPracticos: 0,
        // Estos se calcularán al agregar la clase
        duracionteoricaClase: 0,
        duracionpracticaClase: 0,
        duraciontotalClase: 0
    });

    const [expandedModule, setExpandedModule] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});


    const [editingClassIndex, setEditingClassIndex] = useState(null);




    // Validar que los minutos estén entre 0 y 59
    const validateMinutes = (minutes) => {
        const mins = parseInt(minutes);
        if (isNaN(mins)) return "Debe ser un número";
        if (mins < 0 || mins > 59) {
            return "Los minutos deben estar entre 0 y 59";
        }
        return "";
    };

    // Convertir minutos a formato HH:MM
    const minutesToHHMMSS = (totalMinutes) => {
        if (!totalMinutes && totalMinutes !== 0) return '00:00:00';

        const minutesNumber = Number(totalMinutes);
        if (isNaN(minutesNumber)) return '00:00:00';

        const hours = Math.floor(minutesNumber / 60);
        const minutes = minutesNumber % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    };

    // Convertir HH:MM a minutos
    const HHMMSSToMinutes = (time) => {
        if (!time) return 0;

        // Si ya es número, retornarlo directamente
        if (typeof time === 'number') return time;

        // Dividir el tiempo en horas, minutos y segundos
        const parts = time.split(':');
        if (parts.length < 2) return 0; // Formato incorrecto

        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;

        return (hours * 60) + minutes;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limpiar error cuando el usuario empieza a escribir
        if (name === 'curricula' && name === 'versioncurricula' && validationErrors.curricula) {
            setValidationErrors(prev => ({
                ...prev,
                curricula: ''
            }));
        }

        setcurriculaData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleModuleInputChange = (e) => {
        const { name, value } = e.target;
        setNewModule(prev => ({ ...prev, [name]: value }));
    };

    const handleClassInputChange = (e) => {
        const { name, value } = e.target;

        // Campos que deben ser numéricos
        const numericFields = ['horasTeoricas', 'minutosTeoricos', 'horasPracticas', 'minutosPracticos'];

        // Validar minutos (solo para campos de minutos)
        if (name === 'minutosTeoricos' || name === 'minutosPracticos') {
            const error = validateMinutes(value);
            setFieldErrors(prev => ({
                ...prev,
                [name]: error
            }));

            // Si hay error, no actualizamos el estado
            if (error) return;
        }

        // Validar que las horas sean números positivos
        if ((name === 'horasTeoricas' || name === 'horasPracticas') && value < 0) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: "Las horas no pueden ser negativas"
            }));
            return;
        }

        // Limpiar errores si el campo es válido
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Actualizar el estado - solo convertir a número los campos numéricos
        setNewClass(prev => ({
            ...prev,
            [name]: numericFields.includes(name)
                ? (value === "" ? "" : parseInt(value) || 0)
                : value
        }));
    };

    const addModule = () => {
        // Validar que el módulo tenga nombre
        if (newModule.modulo.trim() === '') {
            setValidationErrors(prev => ({
                ...prev,
                modules: 'El módulo debe tener un nombre'
            }));
            return;
        }

        const moduleToAdd = {
            ...newModule,
            duracionteoricaModulo: 0,
            duracionpracticaModulo: 0,
            duraciontotalModulo: 0,
            clases: []
        };

        const updatedModules = [...modulosData, moduleToAdd];

        setModulosData(updatedModules);
        setNewModule({
            modulo: '',
            duracionteoricaModulo: 0,
            duracionpracticaModulo: 0,
            duraciontotalModulo: 0,
            clases: []
        });

        // Limpiar error de "no hay módulos" si era el primero
        setValidationErrors(prev => ({
            ...prev,
            modules: '',
            moduleClasses: {
                ...prev.moduleClasses,
                [modulosData.length]: '' // Limpiar error para este nuevo módulo
            }
        }));

        updateCurriculumTotals(updatedModules);
    };

    const addClassToModule = (moduleIndex) => {
        // Validar nombre de la clase
        if (newClass.clase.trim() === '') {
            setFieldErrors({
                ...fieldErrors,
                clase: 'El nombre de la clase es requerido'
            });
            return;
        }

        // Validar minutos
        /*    const errorMinutosTeoricos = validateMinutes(newClass.minutosTeoricos);
          const errorMinutosPracticos = validateMinutes(newClass.minutosPracticos);
  
           // Validar que al menos haya duración (teórica o práctica)
            const hasDuration =
                (parseInt(newClass.horasTeoricas) > 0) ||
                (parseInt(newClass.minutosTeoricos) > 0) ||
                (parseInt(newClass.horasPracticas) > 0) ||
                (parseInt(newClass.minutosPracticos) > 0);
    
            if (errorMinutosTeoricos || errorMinutosPracticos || !hasDuration) {
                setFieldErrors({
                    minutosTeoricos: errorMinutosTeoricos,
                    minutosPracticos: errorMinutosPracticos,
                    duration: !hasDuration ? 'Debe ingresar al menos alguna duración (teórica o práctica)' : ''
                });
                return;
            } */

        // Calcular duraciones totales en minutos
        const duracionteoricaClase = (parseInt(newClass.horasTeoricas) || 0) * 60 +
            (parseInt(newClass.minutosTeoricos) || 0);
        const duracionpracticaClase = (parseInt(newClass.horasPracticas) || 0) * 60 +
            (parseInt(newClass.minutosPracticos) || 0);
        const duraciontotalClase = duracionteoricaClase + duracionpracticaClase;

        const classToAdd = {
            clase: newClass.clase,
            duracionteoricaClase,
            duracionpracticaClase,
            duraciontotalClase
        };

        const updatedModules = [...modulosData];



        if (editingClassIndex !== null &&
            editingClassIndex.moduleIndex === moduleIndex) {
            // Estamos editando una clase existente
            updatedModules[moduleIndex].clases[editingClassIndex.classIndex] = classToAdd;
        } else {
            // Estamos agregando una nueva clase
            updatedModules[moduleIndex].clases = [
                ...updatedModules[moduleIndex].clases,
                classToAdd
            ];
        }

        // Calcular totales del módulo
        const moduleTheoretical = updatedModules[moduleIndex].clases.reduce(
            (sum, cls) => sum + cls.duracionteoricaClase, 0);
        const modulePractical = updatedModules[moduleIndex].clases.reduce(
            (sum, cls) => sum + cls.duracionpracticaClase, 0);
        const moduleTotal = moduleTheoretical + modulePractical;

        updatedModules[moduleIndex].duracionteoricaModulo = moduleTheoretical;
        updatedModules[moduleIndex].duracionpracticaModulo = modulePractical;
        updatedModules[moduleIndex].duraciontotalModulo = moduleTotal;

        setModulosData(updatedModules);
        setNewClass({
            clase: '',
            horasTeoricas: 0,
            minutosTeoricos: 0,
            horasPracticas: 0,
            minutosPracticos: 0,
            duracionteoricaClase: 0,
            duracionpracticaClase: 0,
            duraciontotalClase: 0
        });

        // Limpiar errores de validación para este módulo
        setValidationErrors(prev => {
            const updated = { ...prev };
            delete updated.moduleClasses[moduleIndex];
            return updated;
        });


        setEditingClassIndex(null);
        setFieldErrors({}); // Limpiar todos los errores de campos
        updateCurriculumTotals(updatedModules);
    };

    const removeModule = async (index) => {
        const moduleToRemove = modulosData[index];

        // Si estás en modo edición y el módulo tiene id, llama a la API
        if (editId && moduleToRemove.idmodulo) {
            console.log('editId:', editId, 'idmodulo:', moduleToRemove.idmodulo);

            try {
                await axios.delete(`/moduloscurriculas/${moduleToRemove.idmodulo}`);
                Swal.fire('Eliminado', 'El módulo ha sido eliminado.', 'success');
            } catch (error) {
                console.error('Error al eliminar el módulo:', error);
                Swal.fire('Error', 'No se pudo eliminar el módulo.', error);
                return;
            }
        } else {
            Swal.fire('Eliminado', 'El módulo se ha eliminado localmente.', 'info');
        }
        const updatedModules = modulosData.filter((_, i) => i !== index);
        setModulosData(updatedModules);
        updateCurriculumTotals(updatedModules);
    };


    const removeClass = (moduleIndex, classIndex) => {
        const updatedModules = [...modulosData];
        updatedModules[moduleIndex].clases = updatedModules[moduleIndex].clases.filter((_, i) => i !== classIndex);

        // Recalcular totales del módulo
        const moduleTheoretical = updatedModules[moduleIndex].clases.reduce((sum, cls) => sum + cls.duracionteoricaClase, 0);
        const modulePractical = updatedModules[moduleIndex].clases.reduce((sum, cls) => sum + cls.duracionpracticaClase, 0);
        const moduleTotal = moduleTheoretical + modulePractical;

        updatedModules[moduleIndex].duracionteoricaModulo = moduleTheoretical;
        updatedModules[moduleIndex].duracionpracticaModulo = modulePractical;
        updatedModules[moduleIndex].duraciontotalModulo = moduleTotal;

        setModulosData(updatedModules);
        updateCurriculumTotals(updatedModules);
    };

    const updateCurriculumTotals = (modules) => {
        let totalTheoretical = 0;
        let totalPractical = 0;

        modules.forEach(module => {
            totalTheoretical += module.duracionteoricaModulo;
            totalPractical += module.duracionpracticaModulo;
        });

        const total = totalTheoretical + totalPractical;

        setcurriculaData(prev => ({
            ...prev,
            duracionteoricaCurricula: minutesToHHMMSS(totalTheoretical),
            duracionpracticaCurricula: minutesToHHMMSS(totalPractical),
            duraciontotalCurricula: minutesToHHMMSS(total)
        }));
    };

    const toggleModuleExpand = (index) => {
        setExpandedModule(expandedModule === index ? null : index);
    };

    const resetAllFields = () => {
        // Resetear datos de la currícula
        setcurriculaData({
            curricula: '',
            versioncurricula: '',
            sector: '',
            nombresalida: '',
            objetivo: '',
            duracionteoricaCurricula: '00:00',
            duracionpracticaCurricula: '00:00',
            duraciontotalCurricula: '00:00',
            idareaformacion: null,
            creadopor: user.id,
        });

        // Resetear módulos
        setModulosData([]);

        // Resetear nuevo módulo
        setNewModule({
            modulo: '',
            duracionteoricaModulo: 0,
            duracionpracticaModulo: 0,
            duraciontotalModulo: 0,
            clases: []
        });

        // Resetear nueva clase
        setNewClass({
            clase: '',
            horasTeoricas: 0,
            minutosTeoricos: 0,
            horasPracticas: 0,
            minutosPracticos: 0,
            duracionteoricaClase: 0,
            duracionpracticaClase: 0,
            duraciontotalClase: 0
        });

        // Resetear otros estados
        setExpandedModule(null);
        setFieldErrors({});
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            curricula: '',
            versioncurricula: '',
            modules: '',
            moduleClasses: {}
        };

        // Validar campo currícula
        if (!curriculaData.curricula.trim()) {
            newErrors.curricula = 'El nombre de la currícula es requerido';
            isValid = false;
        }

        if (!curriculaData.versioncurricula.trim()) {
            newErrors.versioncurricula = 'La versión de la currícula es requerido';
            isValid = false;
        }

        // Validar al menos un módulo
        if (modulosData.length === 0) {
            newErrors.modules = 'Debe agregar al menos un módulo';
            isValid = false;
        }

        // Validar que cada módulo tenga al menos una clase
        modulosData.forEach((module, index) => {
            if (module.clases.length === 0) {
                newErrors.moduleClasses[index] = 'Este módulo debe tener al menos una clase';
                isValid = false;
            }
        });

        setValidationErrors(newErrors);
        return isValid;
    };


    const normalizeDurationToMinutes = (duration) => {
        if (!duration) return 0;

        // Si es string (HH:MM:SS)
        if (typeof duration === 'string') {
            const [hours, minutes] = duration.split(':').map(Number);
            return (hours * 60) + (minutes || 0);
        }
        // Si es objeto {hours, minutes}
        else if (typeof duration === 'object') {
            return (duration.hours || 0) * 60 + (duration.minutes || 0);
        }
        // Si ya es número
        else if (typeof duration === 'number') {
            return duration;
        }

        return 0;
    };

    const handleClassClick = (moduleIndex, classIndex) => {
        const selectedClass = modulosData[moduleIndex].clases[classIndex];

        // Convertir las duraciones de minutos a horas/minutos para los campos
        const horasTeoricas = Math.floor(selectedClass.duracionteoricaClase / 60);
        const minutosTeoricos = selectedClass.duracionteoricaClase % 60;
        const horasPracticas = Math.floor(selectedClass.duracionpracticaClase / 60);
        const minutosPracticos = selectedClass.duracionpracticaClase % 60;

        setNewClass({
            clase: selectedClass.clase,
            horasTeoricas,
            minutosTeoricos,
            horasPracticas,
            minutosPracticos,
            duracionteoricaClase: selectedClass.duracionteoricaClase,
            duracionpracticaClase: selectedClass.duracionpracticaClase,
            duraciontotalClase: selectedClass.duraciontotalClase
        });

        setEditingClassIndex({ moduleIndex, classIndex });
    };


    // Obtener lista de discapacidades para el Select
    useEffect(() => {
        const obtenerAreas = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/areasFormacion`);
                setAreasF(response.data);
            } catch (error) {
                console.error("Error al obtener los Discapacidad", error);
            }
        };
        obtenerAreas();
    }, []);


    // Función para normalizar cualquier formato a objeto {horas, minutos}
    const normalizeDurationToHoursMinutes = (duration) => {
        if (!duration) return { horas: 0, minutos: 0 };

        // Si es string (HH:MM:SS)
        if (typeof duration === 'string') {
            const [hours, minutes] = duration.split(':').map(Number);
            return { horas: hours || 0, minutos: minutes || 0 };
        }
        // Si es objeto {hours, minutes}
        else if (typeof duration === 'object') {
            return { horas: duration.hours || 0, minutos: duration.minutes || 0 };
        }

        return { horas: 0, minutos: 0 };
    };

    useEffect(() => {
        if (editData) {
            // Transformar los datos de la API al formato que espera el componente
            const apiData = Array.isArray(editData) ? editData[0] : editData;

            console.log("Datos recibidos de la API:", apiData); // Para depuración

            // Datos básicos de la currícula (que usa formato objeto)

            // Datos básicos de la currícula
            setcurriculaData({
                idcurricula: apiData.idcurricula,
                curricula: apiData.curricula || '',
                versioncurricula: apiData.versioncurricula || '',
                sector: apiData.sector || '',
                nombresalida: apiData.nombresalida || '',
                objetivo: apiData.objetivo || '',
                duracionteoricaCurricula: minutesToHHMMSS(normalizeDurationToMinutes(apiData.duracionteorica)),
                duracionpracticaCurricula: minutesToHHMMSS(normalizeDurationToMinutes(apiData.duracionpractica)),
                duraciontotalCurricula: minutesToHHMMSS(normalizeDurationToMinutes(apiData.duraciontotal)),
                idareaformacion: apiData.idareaformacion || null,

            });

            // Transformar módulos
            if (apiData.modulos && apiData.modulos.length > 0) {
                const transformedModules = apiData.modulos.map(modulo => ({
                    idmodulo: modulo.idmodulo,
                    modulo: modulo.modulo || '',
                    duracionteoricaModulo: normalizeDurationToMinutes(modulo.duracionteorica),
                    duracionpracticaModulo: normalizeDurationToMinutes(modulo.duracionpractica),
                    duraciontotalModulo: normalizeDurationToMinutes(modulo.duraciontotal),
                    clases: modulo.clases?.map(clase => ({
                        idclase: clase.idclase,
                        clase: clase.clase || '',
                        horasTeoricas: normalizeDurationToHoursMinutes(clase.duracionteorica).horas,
                        minutosTeoricos: normalizeDurationToHoursMinutes(clase.duracionteorica).minutos,
                        horasPracticas: normalizeDurationToHoursMinutes(clase.duracionpractica).horas,
                        minutosPracticos: normalizeDurationToHoursMinutes(clase.duracionpractica).minutos,
                        duracionteoricaClase: normalizeDurationToMinutes(clase.duracionteorica),
                        duracionpracticaClase: normalizeDurationToMinutes(clase.duracionpractica),
                        duraciontotalClase: normalizeDurationToMinutes(clase.duraciontotal),

                    })) || []
                }));

                // Para depuración  console.log("Módulos transformados:", transformedModules); 
                setModulosData(transformedModules);
            } else {
                // Para depuración  console.log("No hay módulos en la respuesta"); 
                setModulosData([]);
            }

            // Resetear los formularios de nuevo módulo y nueva clase
            setNewModule({
                modulo: '',
                duracionteoricaModulo: 0,
                duracionpracticaModulo: 0,
                duraciontotalModulo: 0,
                clases: []
            });

            setNewClass({
                clase: '',
                horasTeoricas: 0,
                minutosTeoricos: 0,
                horasPracticas: 0,
                minutosPracticos: 0,
                duracionteoricaClase: 0,
                duracionpracticaClase: 0,
                duraciontotalClase: 0
            });
        } else {
            // Si no hay datos de edición, resetear todo
            setcurriculaData({
                curricula: '',
                versioncurricula: '',
                sector: '',
                nombresalida: '',
                objetivo: '',
                duracionteoricaCurricula: '00:00:00',
                duracionpracticaCurricula: '00:00:00',
                duraciontotalCurricula: '00:00:00',
                idareaformacion: null,
                creadopor: user.id,
            });
            setModulosData([]);
        }
    }, [editData, user.id]);

    const handleSave = async () => {
        try {


            if (!validateForm()) {
                return; // Detener el guardado si hay errores
            }
            const payload = {
                curriculaData: {
                    ...curriculaData,
                    idcurricula: editId,
                    duracionteoricaCurricula: minutesToHHMMSS(HHMMSSToMinutes(curriculaData.duracionteoricaCurricula)),
                    duracionpracticaCurricula: minutesToHHMMSS(HHMMSSToMinutes(curriculaData.duracionpracticaCurricula)),
                    duraciontotalCurricula: minutesToHHMMSS(HHMMSSToMinutes(curriculaData.duraciontotalCurricula)),
                    idareaformacion: curriculaData.idareaformacion || null,
                    ...(editId
                        ? { modificadopor: user.id }
                        : { creadopor: user.id }),
                },
                modulosData: modulosData.map(module => ({
                    idmodulo: module.idmodulo,
                    modulo: module.modulo,
                    duracionteoricaModulo: minutesToHHMMSS(HHMMSSToMinutes(module.duracionteoricaModulo)),
                    duracionpracticaModulo: minutesToHHMMSS(HHMMSSToMinutes(module.duracionpracticaModulo)),
                    duraciontotalModulo: minutesToHHMMSS(HHMMSSToMinutes(module.duraciontotalModulo)),
                    ...(editId
                        ? { modificadopor: user.id }
                        : { creadopor: user.id }),
                    clases: module.clases.map(cls => ({
                        idclase: cls.idclase,
                        clase: cls.clase,
                        duracionteoricaClase: minutesToHHMMSS(HHMMSSToMinutes(cls.duracionteoricaClase)),
                        duracionpracticaClase: minutesToHHMMSS(HHMMSSToMinutes(cls.duracionpracticaClase)),
                        duraciontotalClase: minutesToHHMMSS(HHMMSSToMinutes(cls.duraciontotalClase)),
                        ...(editId
                            ? { modificadopor: user.id }
                            : { creadopor: user.id }),
                    }))
                }))
            };

            console.log('Datos que envio:', payload);

            let response;
            if (editId) {
                // Llamada para actualizar
                response = await axios.put(
                    `${process.env.REACT_APP_API_URL}/curriculasModulosClases/${editId}`,
                    payload
                );
            } else {
                // Llamada para crear
                response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/curriculasModulosClases`,
                    payload
                );
            }

            Swal.fire({
                title: editId ? "Registro Actualizado" : "Registro Creado",
                text: `La currícula ha sido ${editId ? 'actualizada' : 'creada'} exitosamente.`,
                icon: "success",
                timer: 6000,
            });

            resetAllFields();
            onClose();

        } catch (error) {
            console.error('Error saving curriculum:', error);

            // Show error message to user
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Server responded with:', error.response.data);
                alert(`Error al guardar: ${error.response.data.message || 'Error del servidor'}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                alert('No se recibió respuesta del servidor');
            } else {
                // Something happened in setting up the request
                console.error('Request setup error:', error.message);
                alert('Error al configurar la solicitud');
            }
        }
    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            sx={{
                '& .MuiDialog-paper': {
                    minHeight: '80vh',
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ backgroundColor: color.azul, color: 'white' }}>
                {editId ? 'Actualizar Currícula' : 'Nueva Currícula'}
            </DialogTitle>

            {/* Sección de Información Básica */}
            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item size={6}>
                        <TextField
                            fullWidth
                            label="Nombre de la currícula"
                            variant="standard"
                            name="curricula"
                            value={curriculaData.curricula}
                            onChange={handleInputChange}
                            error={!!validationErrors.curricula}
                            helperText={validationErrors.curricula}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            fullWidth
                            label="Versión de la currícula"
                            variant="standard"
                            name="versioncurricula"
                            value={curriculaData.versioncurricula}
                            onChange={handleInputChange}
                            error={!!validationErrors.versioncurricula}
                            helperText={validationErrors.versioncurricula}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            fullWidth
                            label="Salida ocupacional"
                            variant="standard"
                            name="nombresalida"
                            value={curriculaData.nombresalida}
                            onChange={handleInputChange}
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            fullWidth
                            label="Sector"
                            variant="standard"
                            name="sector"
                            value={curriculaData.sector}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item size={6}>
                        <FormControl fullWidth variant="standard">
                            <InputLabel id="demo-simple-select-label">Área de Formación</InputLabel>
                            <Select
                                name="idareaformacion"
                                value={curriculaData.idareaformacion || ''}
                                onChange={handleInputChange}
                                label="Grado Académicos"

                            >
                                <MenuItem value="">Seleccionar área de formación</MenuItem>
                                {areasF.map(gra => (
                                    <MenuItem key={gra.id} value={gra.id}>
                                        {gra.areaformacion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item size={6}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Objetivo de la currícula"
                            variant="standard"
                            name="objetivo"
                            value={curriculaData.objetivo}
                            onChange={handleInputChange}
                        />
                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Sección de Módulos */}
                <Typography variant="h6" gutterBottom>
                    <strong>Módulos</strong>
                </Typography>
                {validationErrors.modules && (
                    <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                        {validationErrors.modules}
                    </Typography>
                )}
                {/*   <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                    Para guardar la currícula, es necesario ingresar módulos.
                </Typography> */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={addModule}
                        fullWidth
                        sx={{ backgroundColor: color.azul, color: 'white', '&:hover': { backgroundColor: color.rojo } }}
                    >
                        Agregar módulo
                    </Button>
                </Box>
                <Grid container spacing={2} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Grid item size={12} sx={{ marginTop: 3.5 }}>
                        <TextField
                            fullWidth
                            label="Nombre del módulo"
                            variant="standard"
                            name="modulo"
                            value={newModule.modulo}
                            onChange={handleModuleInputChange}
                        />
                    </Grid>
                </Grid>

                {/* Lista de Módulos */}
                {modulosData.length > 0 && (
                    <List sx={{ mb: 3 }}>
                        {modulosData.map((module, index) => (
                            <React.Fragment key={index}>
                                <ListItem

                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => removeModule(index)} sx={{ color: color.rojo }}>
                                            <Tooltip title="Eliminar Módulo" arrow>
                                                <DeleteOutlinedIcon />
                                            </Tooltip>
                                        </IconButton>
                                    }
                                    sx={{
                                        borderBottom: '1px solid #eee',
                                        backgroundColor: validationErrors.moduleClasses[index] ? '#FFF5F5' : 'inherit'
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Box>
                                                {module.modulo}
                                                {validationErrors.moduleClasses[index] && (
                                                    <Typography color="error" variant="body2">
                                                        {validationErrors.moduleClasses[index]}
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <>
                                                <Box component="span" display="block">
                                                    Horas teóricas: {minutesToHHMMSS(module.duracionteoricaModulo)} ||
                                                    Horas prácticas: {minutesToHHMMSS(module.duracionpracticaModulo)} ||
                                                    Total horas: {minutesToHHMMSS(module.duraciontotalModulo)}
                                                </Box>
                                            </>
                                        }
                                    />
                                    <IconButton onClick={() => toggleModuleExpand(index)}>
                                        {expandedModule === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </ListItem>

                                <Collapse in={expandedModule === index} timeout="auto" unmountOnExit>
                                    <Box sx={{ pl: 4, pr: 2, pt: 1, pb: 2 }}>
                                        {/*     <Typography variant="subtitle2" gutterBottom>
                                            Clases de este módulo:
                                        </Typography> */}

                                        {/* Lista de clases existentes */}
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {module.clases.map((cls, clsIndex) => (
                                                <Chip
                                                    key={clsIndex}
                                                    avatar={<Avatar sx={{ bgcolor: color.blanco }}><ClassIcon fontSize="small" sx={{ color: color.azul }} /></Avatar>}
                                                    label={`${cls.clase} (T:${minutesToHHMMSS(cls.duracionteoricaClase)} - P:${minutesToHHMMSS(cls.duracionpracticaClase)} - Total: ${minutesToHHMMSS(cls.duraciontotalClase)})`}
                                                    onClick={() => handleClassClick(index, clsIndex)}
                                                    onDelete={() => removeClass(index, clsIndex)}
                                                    variant="outlined"
                                                    sx={{ mb: 1, cursor: 'pointer' }}
                                                />
                                            ))}
                                        </Box>


                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "flex-end" }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<AddIcon />}
                                                onClick={() => addClassToModule(index)}
                                                fullWidth
                                                sx={{ backgroundColor: color.azul, color: 'white', '&:hover': { backgroundColor: color.rojo } }}
                                            >
                                                {editingClassIndex !== null && editingClassIndex.moduleIndex === index ?
                                                    "Guardar cambios" : "Agregar clase"}
                                            </Button>
                                        </Box>

                                        {/* Formulario para agregar nueva clase */}
                                        <Grid container spacing={2} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                            <Grid item size={4} sx={{ marginTop: 4 }}>
                                                <TextField
                                                    fullWidth
                                                    label="Nombre de la clase"
                                                    variant="standard"
                                                    name="clase"
                                                    value={newClass.clase}
                                                    onChange={handleClassInputChange}
                                                />
                                            </Grid>
                                            {/* Duración Teórica para Clase */}
                                            <Grid item size={4}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Duración Teórica
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item size={4}>
                                                        <TextField
                                                            variant="standard"
                                                            label="Horas"
                                                            fullWidth
                                                            type="number"
                                                            name="horasTeoricas"
                                                            value={newClass.horasTeoricas || ""}
                                                            onChange={handleClassInputChange}
                                                            InputProps={{ inputProps: { min: 0 } }}
                                                        />
                                                    </Grid>
                                                    <Grid item size={4}>
                                                        <TextField
                                                            variant="standard"
                                                            label="Minutos"
                                                            fullWidth
                                                            type="number"
                                                            name="minutosTeoricos"
                                                            value={newClass.minutosTeoricos || ""}
                                                            onChange={handleClassInputChange}
                                                            InputProps={{ inputProps: { min: 0, max: 59 } }}
                                                            error={!!fieldErrors.minutosTeoricos}
                                                            helperText={fieldErrors.minutosTeoricos}
                                                        />
                                                    </Grid>
                                                    <Grid item size={4}>
                                                        <TextField
                                                            variant="standard"
                                                            label="(HH:MM)"
                                                            fullWidth
                                                            value={minutesToHHMMSS(
                                                                (parseInt(newClass.horasTeoricas) || 0) * 60 +
                                                                (parseInt(newClass.minutosTeoricos) || 0)
                                                            )}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            {/* Duración Práctica para Clase */}
                                            <Grid item size={4}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Duración Práctica
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item size={4}>
                                                        <TextField
                                                            variant="standard"
                                                            label="Horas"
                                                            fullWidth
                                                            type="number"
                                                            name="horasPracticas"
                                                            value={newClass.horasPracticas || ""}
                                                            onChange={handleClassInputChange}
                                                            InputProps={{ inputProps: { min: 0 } }}
                                                        />
                                                    </Grid>
                                                    <Grid item size={4}>
                                                        <TextField
                                                            variant="standard"
                                                            label="Minutos"
                                                            fullWidth
                                                            type="number"
                                                            name="minutosPracticos"
                                                            value={newClass.minutosPracticos || ""}
                                                            onChange={handleClassInputChange}
                                                            InputProps={{ inputProps: { min: 0, max: 59 } }}
                                                            error={!!fieldErrors.minutosPracticos}
                                                            helperText={fieldErrors.minutosPracticos}
                                                        />
                                                    </Grid>
                                                    <Grid item size={4}>
                                                        <TextField
                                                            variant="standard"
                                                            label="(HH:MM)"
                                                            fullWidth
                                                            value={minutesToHHMMSS(
                                                                (parseInt(newClass.horasPracticas) || 0) * 60 +
                                                                (parseInt(newClass.minutosPracticos) || 0)
                                                            )}
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            {/* Total de horas de la clase */}
                                            <Grid item size={12}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Total de horas de la clase
                                                </Typography>
                                                <TextField
                                                    variant="standard"
                                                    label="Total (HH:MM)"
                                                    fullWidth
                                                    value={minutesToHHMMSS(
                                                        (parseInt(newClass.horasTeoricas) || 0) * 60 +
                                                        (parseInt(newClass.minutosTeoricos) || 0) +
                                                        (parseInt(newClass.horasPracticas) || 0) * 60 +
                                                        (parseInt(newClass.minutosPracticos) || 0)
                                                    )}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Collapse>
                            </React.Fragment>
                        ))}
                    </List>
                )}

                {/* Totales del currículo */}
                <Grid container spacing={2} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Grid item size={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Horas teóricas totales:</strong> {curriculaData.duracionteoricaCurricula}

                        </Typography>
                    </Grid>
                    <Grid item size={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Horas prácticas totales:</strong> {curriculaData.duracionpracticaCurricula}
                        </Typography>
                    </Grid>
                    <Grid item size={4}>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Horas totales de la currícula:</strong> {curriculaData.duraciontotalCurricula}
                        </Typography>
                    </Grid>
                </Grid>
                {/* Botones de acción */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                        variant="standard"
                        onClick={() => {
                            onClose();
                            resetAllFields();
                        }}
                        sx={{ mr: 2, color: color.rojo }}
                    >
                        Cancelar
                    </Button>
                    <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: color.azul, color: 'white', '&:hover': { backgroundColor: color.rojo } }}>
                        Guardar
                    </Button>
                </Box>

            </DialogContent>
        </Dialog>

    );
};

export default CurriculumCreator;