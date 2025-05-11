import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    MenuItem,
    Grid,
    Paper,
    Checkbox,
    FormControl,
    InputLabel,
    Select,
    ListItemText,
    Divider,
    Tab,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormHelperText,
    List,
    ListItem
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Swal from 'sweetalert2';
import { CheckCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { color } from '../Components/style/Color';
import Dashboard from "../Dashboard/Dashboard";
import { useUser } from "../Components/UserContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InstructorModal from '../Maestros/Maestros';
import { DataGrid } from '@mui/x-data-grid';
import ModalEstudiantes from '../Estudiantes/Estudiante';

// Personalizar el conector entre pasos
const SquareConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: color.rojo,
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundColor: color.rojo,
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[400],
        borderRadius: 1,
    },
}));

// Personalizar el ícono del paso
const SquareStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: color.grisClaro,
    // color: color.blanco,
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '20%',
    ...(ownerState.active && {
        backgroundColor: color.rojo,
        color: color.blanco,
    }),
    ...(ownerState.completed && {
        backgroundColor: color.azul,
        color: theme.palette.success.contrastText,
    }),
}));

function SquareStepIcon(props) {
    const { active, completed, className, icon } = props;

    return (
        <SquareStepIconRoot ownerState={{ completed, active }} className={className}>
            {completed ? <CheckCircle fontSize="large" /> : <Typography variant="h6">{icon}</Typography>}
        </SquareStepIconRoot>
    );
}



const AddEducationalProcess = () => {
    const { user } = useUser();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = [
        'Acción Formativa',
        'Módulos y Clases',
        'Inscripción',
        'Calificaciones',
        'Seguimiento',
        /*  'Certificación', */
    ];
    const [completed, setCompleted] = React.useState({});
    /*     const [formData, setFormData] = useState({
            paso0: {
                idcurricula: '',
                accionformatica: '',
                salida: '',
                horaspracticas: '',
                horasteoricas: '',
                horastotales: '',
                fechainicio: '',
                fechafinal: '',
                iddepartamento: '',
                idmunicipio: '',
                metodologia: '',
                modalidad: '',
                tipomaterial: '',
                localdesarrollo: '',
                programaeducativo: '',
                donantessocios: '',
                creadopor: user.id,
            },
            paso1: {
                // campos del paso 2
            },
            paso2: {
                idaccionformativa: '',
                completocurso: false,
                fechaabandono: '',
                razonabandono: '',
                tipocertificacion: '',
                hasidoempleado: false,
                tipoempleo: '',
                trabajacampoestudio: false,
                idestudiante: '',
                creadopor: user.id
            },
            // ... otros pasos
        }); */

    const [formData, setFormData] = useState({
        // Campos del paso 0 (Acción Formativa)
        idcurricula: '',
        accionformatica: '',
        salida: '',
        horaspracticas: '',
        horasteoricas: '',
        horastotales: '',
        fechainicio: null,
        fechafinal: null,
        iddepartamento: '',
        idmunicipio: '',
        metodologia: '',
        modalidad: '',
        tipomaterial: '',
        localdesarrollo: '',
        programaeducativo: '',
        donantessocios: '',

        // Campos del paso 2 (Estudiantes)
        idaccionformativa: '', // Se llenará con la respuesta del backend
        completocurso: false,
        fechaabandono: '',
        razonabandono: '',
        tipocertificacion: '',
        hasidoempleado: false,
        tipoempleo: '',
        trabajacampoestudio: false,

        creadopor: user.id
    });

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /*------------------------------------------------------------------------------------------------------------------------------------------------------- */
    /*--------------------------------------               STEP      00                                ------------------------------------------------------ */
    /*------------------------------------------------------------------------------------------------------------------------------------------------------- */
    const [curriculas, setCurriculas] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({
        idcurricula: false,
        accionformatica: false,
        iddepartamento: false,
        idmunicipio: false,
        fechainicio: false,
        //fechafinal: false
    });


    //Trae las currícula
    useEffect(() => {
        const obtenerCurriculas = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/curriculas`);
                setCurriculas(response.data);
                console.log("curriculas", response.data);

            } catch (error) {
                console.error("Error al obtener los departamentos", error);
            }
        };
        obtenerCurriculas();
    }, []);


    //Trae los programas
    useEffect(() => {
        const obtenerProgramas = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/programas`);
                setProgramas(response.data);
            } catch (error) {
                console.error("Error al obtener los departamentos", error);
            }
        };
        obtenerProgramas();
    }, []);


    //Trae las Nombre salida, Total de horas,  los modulos, clases y duracion de la currícula seleccionada 
    useEffect(() => {
        const obtenerDatosCurricula = async () => {
            try {
                if (formData.idcurricula) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/clasesMC/${formData.idcurricula}`);
                    const data = response.data[0];
                    const formatTime = (hours, minutes) => {
                        const hh = String(hours).padStart(2, '0');
                        const mm = String(minutes || 0).padStart(2, '0');
                        return `${hh}:${mm}`;
                    };

                    setFormData(prev => ({
                        ...prev,
                        salida: data.nombresalida || '',
                        horasteoricas: formatTime(data.duracionteorica?.hours, data.duracionteorica?.minutes),
                        horaspracticas: formatTime(data.duracionpractica?.hours, data.duracionpractica?.minutes),
                        horastotales: formatTime(data.duraciontotal?.hours, data.duraciontotal?.minutes),
                    }));

                    setCurriculumData(data);

                    // Inicializar fechas para cada módulo
                    const datesInit = {};
                    data.modulos.forEach(mod => {
                        datesInit[mod.idmodulo] = {
                            start: new Date(),
                            end: new Date()
                        };
                    });
                    setModuleDates(datesInit);
                }
            } catch (error) {
                console.error("Error al obtener los datos de la currícula", error);
            }
        };

        obtenerDatosCurricula();
    }, [formData.idcurricula]);


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
            if (!formData.iddepartamento) return;

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/municipios/${formData.iddepartamento}`);
                setMunicipios(response.data);
            } catch (error) {
                console.error("Error al obtener los Municipios", error);
            }
        };

        obtenerMunicipios();
    }, [formData.iddepartamento]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Si el campo estaba marcado como error y ahora tiene valor, limpia el error
        if (fieldErrors[name] && value) {
            setFieldErrors(prev => ({ ...prev, [name]: false }));
        }
    };
    const validateStep0 = () => {
        const requiredFields = {
            idcurricula: !formData.idcurricula,
            accionformatica: !formData.accionformatica,
            iddepartamento: !formData.iddepartamento,
            idmunicipio: !formData.idmunicipio,
            fechainicio: !formData.fechainicio,
            tipomaterial: !formData.tipomaterial,
            modalidad: !formData.modalidad,
            //fechafinal: !formData.fechafinal,
        };

        setFieldErrors(requiredFields); // Actualiza los errores visuales

        // Retorna `true` si hay al menos un campo obligatorio vacío
        return Object.values(requiredFields).some(error => error);
    };


    /*------------------------------------------------------------------------------------------------------------------------------------------------------- */
    /*--------------------------------------               STEP      01                                ------------------------------------------------------ */
    /*------------------------------------------------------------------------------------------------------------------------------------------------------- */
    const [addingClass, setAddingClass] = useState(null);
    const [curriculumData, setCurriculumData] = useState(null);
    const [instructores, setInstructor] = useState([]);
    const [moduleDates, setModuleDates] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ type: '', id: '' });
    const [newClass, setNewClass] = useState({
        idmodulo: '', // Añade esto
        clase: '',
        idmaestro: '',
        horasTeoricas: '',
        minutosTeoricos: '',
        horasPracticas: '',
        minutosPracticos: '',
        duraciontotal: '',
        fechaInicio: '',
        fechaFinal: ''
    });
    const [newModule, setNewModule] = useState({
        modulo: '',
        duracionteorica: '00:00:00',
        duracionpractica: '00:00:00',
        duraciontotal: '00:00:00'
    });
    const [classFieldErrors, setClassFieldErrors] = useState({
        clase: false,
        idmaestro: false,
        fechaInicio: false,
        fechaFinal: false
    });

    //Referencia para el modal de instructores
    const dataTableRef = useRef();

    const abrirModalNuevo = () => {
        dataTableRef.current?.openModal('add');
    };


    // Trae los instructores 
    const fetchFacilitators = async () => {
        const teachersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/maestros`);
        setInstructor(teachersResponse.data);
    };

    useEffect(() => {
        if (formData.idcurricula) {
            fetchFacilitators();
        }
    }, [formData.idcurricula]);

    // Función para extraer horas y minutos de un string "HH:MM:SS"
    const parseTimeString = (timeString) => {
        if (!timeString) return { hours: 0, minutes: 0 };
        const [hours, minutes] = timeString.split(':');
        return {
            hours: parseInt(hours) || 0,
            minutes: parseInt(minutes) || 0
        };
    };

    // Función para formatear la duración (mostrar solo horas:minutos)
    const formatDuration = (durationString) => {
        if (!durationString) return '00:00';
        const { hours, minutes } = parseTimeString(durationString);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    //Calcula las fechas inicio y final del modulo cuando se agregan clases o se quitan
    const calculateModuleDates = (modulo) => {
        if (!modulo.clases || modulo.clases.length === 0) {
            return {
                start: '',
                end: ''
            };
        }

        // Función para parsear fecha sin problemas de timezone
        const parseDateWithoutTimezone = (dateStr) => {
            if (!dateStr) return null;
            const [year, month, day] = dateStr.split('-');
            return new Date(year, month - 1, day);
        };

        // Obtener todas las fechas válidas
        const fechasInicio = modulo.clases
            .map(clase => parseDateWithoutTimezone(clase.fechaInicio))
            .filter(date => date && !isNaN(date.getTime()));

        const fechasFin = modulo.clases
            .map(clase => parseDateWithoutTimezone(clase.fechaFinal))
            .filter(date => date && !isNaN(date.getTime()));

        if (fechasInicio.length === 0 || fechasFin.length === 0) {
            return {
                start: '',
                end: ''
            };
        }

        // Encontrar la fecha más temprana y la más tardía
        const fechaInicioModulo = new Date(Math.min(...fechasInicio));
        const fechaFinModulo = new Date(Math.max(...fechasFin));

        // Formatear a YYYY-MM-DD (formato que espera el input date)
        const formatDate = (date) => {
            if (!date || isNaN(date.getTime())) return '';
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        return {
            start: formatDate(fechaInicioModulo),
            end: formatDate(fechaFinModulo)
        };
    };

    //Calcula la duración del modulo cuando se agregan clases o se quitan
    const calculateModuleDurations = (modulo) => {
        let totalTeoricaMinutes = 0;
        let totalPracticaMinutes = 0;

        modulo.clases.forEach(clase => {
            const teorica = parseTimeString(clase.duracionteorica);
            const practica = parseTimeString(clase.duracionpractica);

            totalTeoricaMinutes += teorica.hours * 60 + teorica.minutes;
            totalPracticaMinutes += practica.hours * 60 + practica.minutes;
        });

        const teoricaHours = Math.floor(totalTeoricaMinutes / 60);
        const teoricaMinutes = totalTeoricaMinutes % 60;

        const practicaHours = Math.floor(totalPracticaMinutes / 60);
        const practicaMinutes = totalPracticaMinutes % 60;

        const totalHours = Math.floor((totalTeoricaMinutes + totalPracticaMinutes) / 60);
        const totalMinutes = (totalTeoricaMinutes + totalPracticaMinutes) % 60;

        return {
            duracionteorica: `${String(teoricaHours).padStart(2, '0')}:${String(teoricaMinutes).padStart(2, '0')}:00`,
            duracionpractica: `${String(practicaHours).padStart(2, '0')}:${String(practicaMinutes).padStart(2, '0')}:00`,
            duraciontotal: `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:00`
        };
    };

    //Activa el modal para pedir confirmación de que se va a eliminar una clase o módulo
    const confirmDelete = () => {
        if (itemToDelete.type === 'module') {
            // Eliminar módulo
            setCurriculumData(prev => ({
                ...prev,
                modulos: prev.modulos.filter(mod => mod.idmodulo !== itemToDelete.id)
            }));
        } else if (itemToDelete.type === 'class') {
            // Eliminar clase
            const [moduleId, classId] = itemToDelete.id.split('-');
            setCurriculumData(prev => ({
                ...prev,
                modulos: prev.modulos.map(mod => {
                    if (mod.idmodulo === parseInt(moduleId)) {
                        return {
                            ...mod,
                            clases: mod.clases.filter(cl => cl.idclase !== parseInt(classId))
                        };
                    }
                    return mod;
                })
            }));
        }
        setDeleteDialogOpen(false);
    };

    const handleDeleteClick = (type, id) => {
        setItemToDelete({ type, id });
        setDeleteDialogOpen(true);
    };

    // Función para agregar nueva clase
    const handleAddClass = (moduleId) => {


        // Validación de campos requeridos
        const errors = {
            clase: !newClass.clase,
            idmaestro: !newClass.idmaestro,
            fechaInicio: !newClass.fechaInicio,
            fechaFinal: !newClass.fechaFinal
        };

        setClassFieldErrors(errors);

        // Verificar si hay errores
        if (Object.values(errors).some(error => error)) {
            Swal.fire({
                title: "Error",
                text: "Por favor complete todos los campos obligatorios",
                icon: "error",
                timer: 6000,
            });
            return;
        }
        // Crear la nueva clase con los formatos correctos
        const nuevaClase = {
            idclase: Date.now(), // Usamos timestamp como ID temporal
            clase: newClass.clase,
            idmaestro: newClass.idmaestro,
            duracionteorica: `${String(newClass.horasTeoricas).padStart(2, '0')}:${String(newClass.minutosTeoricos).padStart(2, '0')}:00`,
            duracionpractica: `${String(newClass.horasPracticas).padStart(2, '0')}:${String(newClass.minutosPracticos).padStart(2, '0')}:00`,
            duraciontotal: newClass.duraciontotal + ':00',
            fechaInicio: newClass.fechaInicio,
            fechaFinal: newClass.fechaFinal,
            creadopor: user.id,
            fechacreacion: new Date().toISOString()
        };

        // Actualizar el estado usando el patrón funcional
        setCurriculumData(prev => {
            const updatedModulos = prev.modulos.map(mod => {
                if (mod.idmodulo === moduleId) {
                    const updatedModulo = {
                        ...mod,
                        clases: [...mod.clases, nuevaClase]
                    };

                    // Calcular nuevas fechas y duraciones para el módulo
                    const newDates = calculateModuleDates(updatedModulo);
                    const newDurations = calculateModuleDurations(updatedModulo);

                    setModuleDates(prevDates => ({
                        ...prevDates,
                        [moduleId]: {
                            start: newDates.start,
                            end: newDates.end
                        }
                    }));

                    // Actualizar las duraciones del módulo
                    return {
                        ...updatedModulo,
                        ...newDurations
                    };
                }
                return mod;
            });
            return {
                ...prev,
                modulos: updatedModulos
            };
        });

        // Resetear el formulario
        setNewClass({
            idmodulo: '',
            clase: '',
            idmaestro: '',
            horasTeoricas: 0,
            minutosTeoricos: 0,
            horasPracticas: 0,
            minutosPracticos: 0,
            duraciontotal: '00:00',
            fechaInicio: '',
            fechaFinal: ''
        });

        setAddingClass(false);
    };

    // Función para manejar cambios en nueva clase
    const handleNewClassChange = (field, value) => {
        setNewClass(prev => {
            const updated = { ...prev };

            // Manejar campos numéricos
            if (['horasTeoricas', 'minutosTeoricos', 'horasPracticas', 'minutosPracticos'].includes(field)) {
                // Convertir a número y asegurar que sea válido
                const numValue = parseInt(value) || 0;

                // Aplicar límites según el campo
                if (field.includes('minutos')) {
                    updated[field] = Math.max(0, Math.min(59, numValue));
                } else {
                    updated[field] = Math.max(0, numValue); // Sin límite superior para horas
                }

                // Calcular total cuando cambian las horas/minutos
                const totalMinutes =
                    (updated.horasTeoricas || 0) * 60 +
                    (updated.minutosTeoricos || 0) +
                    (updated.horasPracticas || 0) * 60 +
                    (updated.minutosPracticos || 0);

                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                updated.duraciontotal = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            } else {
                updated[field] = value;
            }

            if (field === 'fechaInicio' || field === 'fechaFinal') {
                updated[field] = value;

                // Validación de fechas
                if (field === 'fechaInicio' && updated.fechaFinal && value > updated.fechaFinal) {
                    updated.fechaFinal = value;
                }
            }
            return updated;
        });
    };

    // Función para manejar cambios en los módulos
    const handleModuleChange = (moduleId, field, value) => {
        setCurriculumData(prev => {
            const updated = { ...prev };
            const moduleIndex = updated.modulos.findIndex(m => m.idmodulo === moduleId);

            if (moduleIndex !== -1) {
                updated.modulos[moduleIndex][field] = value;
            }

            return updated;
        });
    };

    // Función para manejar cambios en las clases
    const handleClassChange = (moduleId, classId, field, value) => {
        setCurriculumData(prev => {
            const updated = { ...prev };
            const moduleIndex = updated.modulos.findIndex(m => m.idmodulo === moduleId);

            if (moduleIndex !== -1) {
                const classIndex = updated.modulos[moduleIndex].clases.findIndex(c => c.idclase === classId);

                if (classIndex !== -1) {
                    updated.modulos[moduleIndex].clases[classIndex][field] = value;
                    // Si se modificó una fecha, recalcular fechas del módulo
                    if (field === 'fechaInicio' || field === 'fechaFinal') {
                        const newDates = calculateModuleDates(updated.modulos[moduleIndex]);
                        setModuleDates(prevDates => ({
                            ...prevDates,
                            [moduleId]: {
                                start: newDates.start,
                                end: newDates.end
                            }
                        }));
                    }
                    if (field === 'fechaInicio') {
                        // Asegurar que fechaFinal no sea anterior a fechaInicio
                        if (updated.modulos[moduleIndex].clases[classIndex].fechaFinal < value) {
                            updated.modulos[moduleIndex].clases[classIndex].fechaFinal = value;
                        }
                    }
                    // Calcular total si son campos de duración
                    if (field === 'duracionteorica' || field === 'duracionpractica') {
                        const teorica = parseInt(updated.modulos[moduleIndex].clases[classIndex].duracionteorica) || 0;
                        const practica = parseInt(updated.modulos[moduleIndex].clases[classIndex].duracionpractica) || 0;
                        updated.modulos[moduleIndex].clases[classIndex].duraciontotal = `${teorica + practica}:00:00`;
                    }
                }
            }

            return updated;
        });
    };

    //Agrega el paper para un nuevo módulo y sus clases
    const handleAddModule = () => {


        // Calcular duraciones si hay clases
        let duraciones = {
            duracionteorica: '00:00:00',
            duracionpractica: '00:00:00',
            duraciontotal: '00:00:00'
        };

        if (newModule.clases?.length > 0) {
            duraciones = calculateModuleDurations({
                clases: newModule.clases
            });
        }

        const nuevoModulo = {
            idmodulo: newModule.idmodulo || Date.now(),
            modulo: newModule.modulo,
            ...duraciones,
            clases: newModule.clases || [],
            creadopor: user.id,
            fechacreacion: new Date().toISOString()
        };

        // Agregar a curriculumData
        setCurriculumData(prev => ({
            ...prev,
            modulos: [...prev.modulos, nuevoModulo]
        }));

        // Inicializar fechas
        setModuleDates(prev => ({
            ...prev,
            [nuevoModulo.idmodulo]: {
                start: newModule.clases?.length > 0
                    ? Math.min(...newModule.clases.map(c => new Date(c.fechaInicio).getTime()))
                    : '',
                end: newModule.clases?.length > 0
                    ? Math.max(...newModule.clases.map(c => new Date(c.fechaFinal).getTime()))
                    : ''
            }
        }));

        // Resetear estados
        setNewModule({
            modulo: '',
            duracionteorica: '00:00:00',
            duracionpractica: '00:00:00',
            duraciontotal: '00:00:00'
        });

    };


    /*------------------------------------------------------------------------------------------------------------------------------------------------------- */
    /*--------------------------------------               STEP      02                                ------------------------------------------------------ */
    /*------------------------------------------------------------------------------------------------------------------------------------------------------- */
    const [value, setValue] = React.useState('1');
    const [estudiantes, setEstudiantes] = useState([]);
    const estudiantesRef = useRef();
    const [selectionModel, setSelectionModel] = useState([]);

    // Función para obtener estudiantes
    const fetchEstudiantes = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/estudiantes`);
            setEstudiantes(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error al obtener estudiantes:", error);
        }
    };

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const handleAddEstudiante = async () => {
        estudiantesRef.current?.openAddModal();
    };

    const handleSaveSuccess = async () => {
        // Esta función se llamará cuando se guarde exitosamente un estudiante
        await fetchEstudiantes(); // Actualiza la lista de estudiantes
    };

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };



    const handleStepSubmit = async (step) => {
        try {
            switch (step) {
                case 0: // Paso 1: Acción Formativa
                    if (validateStep0()) {
                        throw new Error("Complete los campos obligatorios");
                    }

                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/accform`, {
                        idcurricula: formData.idcurricula,
                        accionformatica: formData.accionformatica || null,
                        salida: formData.salida || null,
                        horaspracticas: formData.horaspracticas || null,
                        horasteoricas: formData.horasteoricas || null,
                        horastotales: formData.horastotales || null,
                        fechainicio: formData.fechainicio || null,
                        fechafinal: formData.fechafinal || null,
                        iddepartamento: formData.iddepartamento || null,
                        idmunicipio: formData.idmunicipio || null,
                        metodologia: formData.metodologia || null,
                        modalidad: formData.modalidad || null,
                        tipomaterial: formData.tipomaterial || null,
                        localdesarrollo: formData.localdesarrollo || null,
                        programaeducativo: formData.programaeducativo || null,
                        donantessocios: formData.donantessocios || null,
                        creadopor: user.id
                    });
                    console.log(response.data);
                    // Actualizar solo el idaccionformativa recibido
                    const id = response.data.idaccionformativa;
                    setFormData(prev => ({ ...prev, idaccionformativa: id }));
                    break;

                case 2: // Paso 3: Inscripción (Estudiantes)
                    if (!Array.isArray(selectionModel)) {
                        throw new Error("Error en la selección de estudiantes");
                    }

                    if (selectionModel.length === 0) {
                        throw new Error("Seleccione al menos un estudiante del listado");
                    }

                    const estudiantesData = selectionModel.map(idEstudiante => ({
                        idaccionformativa: formData.idaccionformativa || null,
                        completocurso: Boolean(formData.completocurso),
                        fechaabandono: formData.fechaabandono || null,
                        razonabandono: formData.razonabandono || null,
                        tipocertificacion: formData.tipocertificacion || null,
                        hasidoempleado: Boolean(formData.hasidoempleado),
                        tipoempleo: formData.tipoempleo || null,
                        trabajacampoestudio: Boolean(formData.trabajacampoestudio),
                        idestudiante: idEstudiante,
                        creadopor: user.id
                    }));

                    console.log("Datos a enviar:", estudiantesData);

                    await axios.post(`${process.env.REACT_APP_API_URL}/seguimientos`, estudiantesData);
                    break;

                // ... otros cases
            }

            handleComplete(step);
        } catch (error) {
            console.error(`Error en paso ${step}:`, error);

        }
    };


    return (
        <Dashboard>
            <Paper maxWidth="lg" sx={{ mt: 4, mb: 4, p: 4, overflowX: 'auto', }} elevation={3}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: color.azul, mb: 3 }}>
                    Acción Formativa
                </Typography>
                <Box sx={{
                    width: '100%',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        marginTop: '5px',
                        backgroundColor: '#ddd',
                        borderRadius: '3px',
                    }
                }}>

                    <Stepper
                        nonLinear
                        activeStep={activeStep}
                        connector={<SquareConnector />}
                        sx={{
                            marginBottom: 2,
                            minWidth: `${steps.length * 180}px`, // Ancho mínimo basado en pasos
                            '& .MuiStepLabel-label': {
                                fontSize: '1rem',
                                fontWeight: 600,
                            },
                            '& .MuiStep-root': {
                                padding: '0 10px',
                            }
                        }}
                    >
                        {steps.map((label, index) => (
                            <Step key={label} completed={completed[index]}>
                                <StepLabel
                                    StepIconComponent={SquareStepIcon}
                                    sx={{
                                        '& .MuiStepLabel-iconContainer': {
                                            paddingRight: 2,
                                        }
                                    }}
                                >
                                    {label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <Box sx={{ p: 2 }}>
                    {activeStep === 0 && (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="demo-simple-select-label" error={fieldErrors.idcurricula}>Curricula</InputLabel>
                                    <Select
                                        fullWidth
                                        name="idcurricula"
                                        value={formData.idcurricula || ''}
                                        onChange={handleChange}
                                        label="Currícula"
                                    >
                                        <MenuItem value="">Seleccionar currícula</MenuItem>
                                        {curriculas.map(dep => (
                                            <MenuItem key={dep.id} value={dep.id}>
                                                {dep.curricula}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {fieldErrors.idcurricula && (
                                        <FormHelperText error>Seleccione una currícula</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth variant="standard">
                                    <InputLabel id="demo-simple-select-label">Programas</InputLabel>
                                    <Select
                                        fullWidth
                                        name="idprograma"
                                        value={formData.idprograma || ''}
                                        onChange={handleChange}
                                        label="Programas"
                                    >
                                        <MenuItem value="">Seleccionar programas</MenuItem>
                                        {programas.map(dep => (
                                            <MenuItem key={dep.id} value={dep.id}>
                                                {dep.programa}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre del proceso educativo"
                                    name="accionformatica"
                                    value={formData.accionformatica || ''}
                                    onChange={handleChange}
                                    variant="standard"
                                    error={fieldErrors.accionformatica}
                                    helperText={fieldErrors.accionformatica ? "Campo obligatorio" : ""}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre de salida"
                                    name="salida"
                                    value={formData.salida || ''}
                                    onChange={handleChange}
                                    variant="standard"

                                />
                            </Grid>
                            <Grid item size={{ xs: 12, md: 6 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Total de Teóricas "
                                            name="horasteoricas"
                                            value={formData.horasteoricas || ''}
                                            onChange={handleChange}
                                            variant="standard"
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Total de Prácticas"
                                            name="horaspracticas"
                                            value={formData.horaspracticas || ''}
                                            onChange={handleChange}
                                            variant="standard"
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Total de horas"
                                            name="horastotales"
                                            value={formData.horastotales || ''}
                                            onChange={handleChange}
                                            variant="standard"
                                            InputProps={{ readOnly: true }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            label="Fecha de Inicio"
                                            name="fechainicio"
                                            value={formData.fechainicio || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="standard"
                                            type='date'
                                            InputLabelProps={{ shrink: true }}
                                            error={fieldErrors.fechainicio}
                                            helperText={fieldErrors.fechainicio ? "Ingrese una fecha" : ""}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <TextField
                                            label="Fecha de Final"
                                            name="fechafinal"
                                            value={formData.fechafinal || ''}
                                            onChange={handleChange}
                                            fullWidth
                                            variant="standard"
                                            type='date'
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                </Grid>

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth variant="standard" error={fieldErrors.iddepartamento}>
                                            <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                            <Select
                                                name="iddepartamento"
                                                value={formData.iddepartamento || ''}
                                                onChange={handleChange}
                                                label="Departamento"
                                            >
                                                <MenuItem value="">Seleccionar departamento</MenuItem>
                                                {departamentos.map(dep => (
                                                    <MenuItem key={dep.id} value={dep.id}>
                                                        {dep.departamento}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {fieldErrors.iddepartamento && (
                                                <FormHelperText error>Seleccione un departamento</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <FormControl fullWidth variant="standard" error={fieldErrors.idmunicipio}>
                                            <InputLabel id="demo-simple-select-label">Municipio</InputLabel>
                                            <Select
                                                name="idmunicipio"
                                                value={formData.idmunicipio || ''}
                                                onChange={handleChange}
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
                                            {fieldErrors.idmunicipio && (
                                                <FormHelperText error>Seleccione un municipio</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Metodología"
                                    name="metodologia"
                                    value={formData.metodologia || ''}
                                    onChange={handleChange}
                                    variant="standard"

                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth variant="standard" error={fieldErrors.modalidad}>
                                    <InputLabel id="demo-simple-select-label">Modalidad</InputLabel>
                                    <Select
                                        name="modalidad"
                                        value={formData.modalidad || ''}
                                        onChange={handleChange}
                                        label="Modalidad"
                                    >
                                        <MenuItem value="">Seleccionar modalidad</MenuItem>
                                        <MenuItem value="Presencial">Presencial</MenuItem>
                                        <MenuItem value="Virtual">Virtual</MenuItem>
                                        <MenuItem value="Mixta">Mixta</MenuItem>
                                        <MenuItem value="Intensiva">Intensiva</MenuItem>
                                    </Select>
                                    {fieldErrors.modalidad && (
                                        <FormHelperText error>Seleccione una modalidad</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth variant="standard" error={fieldErrors.tipomaterial}>
                                    <InputLabel id="demo-simple-select-label">Tipo de material</InputLabel>
                                    <Select
                                        name="tipomaterial"
                                        value={formData.tipomaterial || ''}
                                        onChange={handleChange}
                                        label="Tipo de material"
                                    >
                                        <MenuItem value="">Seleccionar tipo de material</MenuItem>
                                        <MenuItem value="Experimental">Experimental</MenuItem>
                                        <MenuItem value="Tecnológico">Tecnológico</MenuItem>
                                        <MenuItem value="Digital">Digital</MenuItem>
                                    </Select>
                                    {fieldErrors.tipomaterial && (
                                        <FormHelperText error>Seleccione un tipo de material</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Local de desarrollo"
                                    name="localdesarrollo"
                                    value={formData.localdesarrollo || ''}
                                    onChange={handleChange}
                                    variant="standard"

                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Nombre del programa educativo"
                                    variant="standard"
                                    name="programaeducativo"
                                    value={formData.programaeducativo}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Nombre del Donante/Socios Aportantes"
                                    variant="standard"
                                    name="donantessocios"
                                    value={formData.donantessocios}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {activeStep === 1 && (
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12, md: 12 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: color.grisClaro, p: 1, borderRadius: 3, }}>
                                    <Typography variant="h5" sx={{ mr: 5, fontWeight: 'bold' }} gutterBottom>
                                        {formData.accionformatica}
                                    </Typography>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Del {formData.fechainicio} al {formData.fechafinal} || {formData.horastotales && (formData.horastotales.split(':')[0])} horas y  {formData.horastotales && (formData.horastotales.split(':')[1])} minutos
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid
                                container
                                size={{ xs: 12, md: 12 }}
                                display="flex"
                                justifyContent="flex-end"
                                gap={2}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddModule(true)}
                                >
                                    Agregar Módulo
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={abrirModalNuevo}
                                >
                                    Agregar Instructor
                                </Button>
                            </Grid>

                            {/* Lista de módulos */}
                            <Grid container spacing={2}>

                                {curriculumData.modulos.map((modulo, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={modulo.idmodulo}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Módulo {index + 1}
                                        </Typography>
                                        <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
                                            {/* Cabecera del módulo */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <TextField
                                                    fullWidth
                                                    variant="standard"
                                                    value={modulo.modulo}
                                                    onChange={(e) => handleModuleChange(modulo.idmodulo, 'modulo', e.target.value)}
                                                    sx={{
                                                        '& .MuiInput-input': {
                                                            fontSize: '1.25rem',
                                                            fontWeight: 'bold'
                                                        }
                                                    }}
                                                />
                                                <IconButton color="error" onClick={() => handleDeleteClick('module', modulo.idmodulo)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>

                                            {/* Contenido del módulo */}
                                            <Grid container spacing={2}>
                                                {/* Duración del módulo */}
                                                <Grid size={{ xs: 12, md: 12 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <TextField
                                                                label="H Teóricas"
                                                                value={formatDuration(modulo.duracionteorica)}
                                                                fullWidth
                                                                variant="standard"
                                                                InputProps={{ readOnly: true }}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <TextField
                                                                label="H Prácticas"
                                                                value={formatDuration(modulo.duracionpractica)}
                                                                fullWidth
                                                                variant="standard"
                                                                InputProps={{ readOnly: true }}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 4 }}>
                                                            <TextField
                                                                label="Total Horas"
                                                                value={formatDuration(modulo.duraciontotal)}
                                                                fullWidth
                                                                variant="standard"
                                                                InputProps={{ readOnly: true }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                {/* Fechas del módulo */}
                                                <Grid size={{ xs: 12, md: 12 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <TextField
                                                                fullWidth
                                                                label="Fecha de inicio"
                                                                type="date"
                                                                variant="standard"
                                                                value={moduleDates[modulo.idmodulo]?.start || ''}
                                                                InputLabelProps={{ shrink: true }}
                                                                InputProps={{
                                                                    readOnly: true
                                                                }}
                                                            />
                                                        </Grid>
                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                            <TextField
                                                                fullWidth
                                                                label="Fecha final"
                                                                type="date"
                                                                variant="standard"
                                                                value={moduleDates[modulo.idmodulo]?.end || ''}
                                                                InputLabelProps={{ shrink: true }}
                                                                InputProps={{
                                                                    readOnly: true
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                {/* Sección de clases */}
                                                <Grid size={{ xs: 12, md: 12 }}>
                                                    <Divider sx={{ my: 2 }} />
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Clases:</Typography>
                                                        <IconButton sx={{ color: color.azul }} onClick={() => setAddingClass(modulo.idmodulo)}>
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>

                                                    {/* Formulario para nueva clase */}
                                                    {addingClass === modulo.idmodulo && (
                                                        <Paper elevation={2} sx={{ mb: 3, p: 2, position: 'relative' }}>
                                                            {/* Botón de cerrar */}
                                                            <IconButton
                                                                sx={{
                                                                    position: 'absolute',
                                                                    right: 8,
                                                                    top: 8,
                                                                    color: color.rojo
                                                                }}
                                                                onClick={() => setAddingClass(false)}
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                            <TextField
                                                                fullWidth
                                                                label="Nombre de la clase"
                                                                value={newClass.clase}
                                                                onChange={(e) => handleNewClassChange('clase', e.target.value)}
                                                                variant="standard"
                                                                margin="normal"
                                                                required
                                                                error={classFieldErrors.clase}
                                                                helperText={classFieldErrors.clase ? "Este campo es obligatorio" : ""}
                                                            />

                                                            <FormControl fullWidth variant="standard" error={classFieldErrors.idmaestro}>
                                                                <InputLabel>Instructor</InputLabel>
                                                                <Select
                                                                    value={newClass.idmaestro || ''}
                                                                    onChange={(e) => handleNewClassChange('idmaestro', e.target.value)}
                                                                    label="Instructor"
                                                                    required
                                                                >
                                                                    <MenuItem value="">Seleccionar instructor</MenuItem>
                                                                    {instructores.map(teacher => (
                                                                        <MenuItem key={teacher.id} value={teacher.id}>
                                                                            {teacher.nombre} {teacher.apellido}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {classFieldErrors.idmaestro && (
                                                                    <FormHelperText error>Seleccione un instructor</FormHelperText>
                                                                )}
                                                            </FormControl>

                                                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                                                {/* Horas teóricas */}
                                                                <Grid size={{ xs: 12, md: 2 }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="H Teóricas"
                                                                        type="number"
                                                                        value={newClass.horasTeoricas}
                                                                        onChange={(e) => handleNewClassChange('horasTeoricas', e.target.value)}
                                                                        variant="standard"
                                                                        inputProps={{
                                                                            min: 0,
                                                                            step: 1
                                                                        }}

                                                                    />
                                                                </Grid>
                                                                <Grid size={{ xs: 12, md: 2 }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="M Teóricos"
                                                                        type="number"
                                                                        value={newClass.minutosTeoricos}
                                                                        onChange={(e) => handleNewClassChange('minutosTeoricos', e.target.value)}
                                                                        variant="standard"
                                                                        inputProps={{
                                                                            min: 0,
                                                                            max: 59,
                                                                            step: 1
                                                                        }}
                                                                    />
                                                                </Grid>

                                                                {/* Horas prácticas */}
                                                                <Grid size={{ xs: 12, md: 2 }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="H Prácticas"
                                                                        type="number"
                                                                        value={newClass.horasPracticas}
                                                                        onChange={(e) => handleNewClassChange('horasPracticas', e.target.value)}
                                                                        variant="standard"
                                                                        inputProps={{
                                                                            min: 0,
                                                                            step: 1
                                                                        }}
                                                                    />
                                                                </Grid>
                                                                <Grid size={{ xs: 12, md: 2 }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="M Prácticos"
                                                                        type="number"
                                                                        value={newClass.minutosPracticos}
                                                                        onChange={(e) => handleNewClassChange('minutosPracticos', e.target.value)}
                                                                        variant="standard"
                                                                        inputProps={{
                                                                            min: 0,
                                                                            max: 59,
                                                                            step: 1
                                                                        }}
                                                                    />
                                                                </Grid>

                                                                {/* Total horas */}
                                                                <Grid size={{ xs: 12, md: 4 }}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Total horas"
                                                                        value={newClass.duraciontotal}
                                                                        InputProps={{ readOnly: true }}
                                                                        variant="standard"
                                                                    />
                                                                </Grid>

                                                                {/* Fechas */}
                                                                <Grid size={{ xs: 12, md: 12 }}>
                                                                    <Grid container spacing={2}>
                                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                                            <TextField
                                                                                fullWidth
                                                                                label="Fecha inicio"
                                                                                type="date"
                                                                                value={newClass.fechaInicio}
                                                                                onChange={(e) => handleNewClassChange('fechaInicio', e.target.value)}
                                                                                InputLabelProps={{ shrink: true }}
                                                                                variant="standard"
                                                                                required
                                                                                error={classFieldErrors.fechaInicio}
                                                                                helperText={classFieldErrors.fechaInicio ? "Seleccione una fecha" : ""}
                                                                            />
                                                                        </Grid>
                                                                        <Grid size={{ xs: 12, md: 6 }}>
                                                                            <TextField
                                                                                fullWidth
                                                                                label="Fecha final"
                                                                                type="date"
                                                                                value={newClass.fechaFinal}
                                                                                onChange={(e) => handleNewClassChange('fechaFinal', e.target.value)}
                                                                                InputLabelProps={{ shrink: true }}
                                                                                variant="standard"
                                                                                inputProps={{
                                                                                    min: newClass.fechaInicio
                                                                                }}
                                                                                required
                                                                                error={classFieldErrors.fechaFinal}
                                                                                helperText={classFieldErrors.fechaFinal ? "Seleccione una fecha" : ""}
                                                                            />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid size={{ xs: 12, md: 6 }}>
                                                                </Grid>
                                                                <Grid size={{ xs: 12, md: 6 }}>
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => handleAddClass(modulo.idmodulo)}
                                                                        fullWidth
                                                                        sx={{ background: color.azul }}
                                                                    >
                                                                        Agregar Clase
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Paper>
                                                    )}

                                                    {/* Lista de clases existentes */}
                                                    <Grid container spacing={2}>
                                                        {modulo.clases.map((clase) => {
                                                            // Parsear las horas y minutos de las duraciones
                                                            const teorica = parseTimeString(clase.duracionteorica);
                                                            const practica = parseTimeString(clase.duracionpractica);
                                                            const total = parseTimeString(clase.duraciontotal);

                                                            return (
                                                                <Grid size={{ xs: 12, md: 12 }} key={clase.idclase}>
                                                                    <Paper elevation={2} sx={{ mb: 2, p: 2, position: 'relative' }}>
                                                                        <IconButton
                                                                            sx={{ position: 'absolute', right: 8, top: 8 }}
                                                                            color="error"
                                                                            onClick={() => handleDeleteClick('class', `${modulo.idmodulo}-${clase.idclase}`)}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>

                                                                        <TextField
                                                                            fullWidth
                                                                            label="Nombre de la clase"
                                                                            value={clase.clase}
                                                                            onChange={(e) => handleClassChange(modulo.idmodulo, clase.idclase, 'clase', e.target.value)}
                                                                            variant="standard"
                                                                            sx={{ mt: 3 }}
                                                                        />

                                                                        <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
                                                                            <InputLabel>Instructor</InputLabel>
                                                                            <Select
                                                                                value={clase.idmaestro || ''}
                                                                                onChange={(e) => handleClassChange(modulo.idmodulo, clase.idclase, 'idmaestro', e.target.value)}
                                                                                label="Instructor"
                                                                            >
                                                                                <MenuItem value="">Seleccionar instructor</MenuItem>
                                                                                {instructores.map(teacher => (
                                                                                    <MenuItem key={teacher.id} value={teacher.id}>
                                                                                        {teacher.nombre} {teacher.apellido}
                                                                                    </MenuItem>
                                                                                ))}
                                                                            </Select>
                                                                        </FormControl>

                                                                        <Grid container spacing={2} sx={{ mt: 1 }}>
                                                                            {/* Horas teóricas */}
                                                                            <Grid size={{ xs: 12, md: 2 }}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    label="H  Teóricas"
                                                                                    type="number"
                                                                                    value={teorica.hours}
                                                                                    onChange={(e) => {
                                                                                        handleClassChange(
                                                                                            modulo.idmodulo,
                                                                                            clase.idclase,
                                                                                            'horasTeoricas',
                                                                                            e.target.value
                                                                                        );
                                                                                    }}
                                                                                    variant="standard"
                                                                                    inputProps={{ min: 0 }}
                                                                                />
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, md: 2 }}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    label="M Teóricos"
                                                                                    type="number"
                                                                                    value={teorica.minutes}
                                                                                    onChange={(e) => {
                                                                                        handleClassChange(
                                                                                            modulo.idmodulo,
                                                                                            clase.idclase,
                                                                                            'minutosTeoricos',
                                                                                            e.target.value
                                                                                        );
                                                                                    }}
                                                                                    variant="standard"
                                                                                    inputProps={{ min: 0, max: 59 }}
                                                                                />
                                                                            </Grid>

                                                                            {/* Horas prácticas */}
                                                                            <Grid size={{ xs: 12, md: 2 }}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    label="H Prácticas"
                                                                                    type="number"
                                                                                    value={practica.hours}
                                                                                    onChange={(e) => {
                                                                                        handleClassChange(
                                                                                            modulo.idmodulo,
                                                                                            clase.idclase,
                                                                                            'horasPracticas',
                                                                                            e.target.value
                                                                                        );
                                                                                    }}
                                                                                    variant="standard"
                                                                                    inputProps={{ min: 0 }}
                                                                                />
                                                                            </Grid>
                                                                            <Grid size={{ xs: 12, md: 2 }}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    label="M Prácticos"
                                                                                    type="number"
                                                                                    value={practica.minutes}
                                                                                    onChange={(e) => {
                                                                                        handleClassChange(
                                                                                            modulo.idmodulo,
                                                                                            clase.idclase,
                                                                                            'minutosPracticos',
                                                                                            e.target.value
                                                                                        );
                                                                                    }}
                                                                                    variant="standard"
                                                                                    inputProps={{ min: 0, max: 59 }}
                                                                                />
                                                                            </Grid>

                                                                            {/* Total horas */}
                                                                            <Grid size={{ xs: 12, md: 4 }}>
                                                                                <TextField
                                                                                    fullWidth
                                                                                    label="Total horas"
                                                                                    value={`${total.hours.toString().padStart(2, '0')}:${total.minutes.toString().padStart(2, '0')}`}
                                                                                    InputProps={{ readOnly: true }}
                                                                                    variant="standard"
                                                                                />
                                                                            </Grid>

                                                                            {/* Fechas */}
                                                                            <Grid size={{ xs: 12, md: 12 }}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Fecha inicio"
                                                                                            type="date"
                                                                                            value={clase.fechaInicio || ''}
                                                                                            onChange={(e) => handleClassChange(
                                                                                                modulo.idmodulo,
                                                                                                clase.idclase,
                                                                                                'fechaInicio',
                                                                                                e.target.value
                                                                                            )}
                                                                                            InputLabelProps={{ shrink: true }}
                                                                                            variant="standard"
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid size={{ xs: 12, md: 6 }}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Fecha final"
                                                                                            type="date"
                                                                                            value={clase.fechaFinal || ''}
                                                                                            onChange={(e) => handleClassChange(
                                                                                                modulo.idmodulo,
                                                                                                clase.idclase,
                                                                                                'fechaFinal',
                                                                                                e.target.value
                                                                                            )}
                                                                                            InputLabelProps={{ shrink: true }}
                                                                                            variant="standard"
                                                                                            inputProps={{ min: clase.fechaInicio }}
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Paper>
                                                                </Grid>
                                                            );
                                                        })}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>

                            {/* Diálogo de confirmación */}
                            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                                <DialogTitle>Confirmar Eliminación</DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        ¿Estás seguro que deseas eliminar este {itemToDelete.type === 'module' ? 'módulo' : 'clase'}?
                                    </Typography>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                                    <Button onClick={confirmDelete} color="error">Eliminar</Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    )}

                    {activeStep === 2 && (
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                                        <Tab label="Participantes" value="1" />
                                        <Tab label="Inscritos" value="2" />
                                    </TabList>
                                </Box>

                                <TabPanel value="1">
                                    <Grid
                                        container
                                        size={{ xs: 12, md: 12 }}
                                        display="flex"
                                        justifyContent="flex-end"
                                        gap={2}
                                        mb={2}
                                    >
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                            onClick={handleAddEstudiante}
                                        >
                                            Agregar Nuevo Estudiante
                                        </Button>
                                    </Grid>
                                    <DataGrid
                                        rows={estudiantes}
                                        columns={[
                                            { field: "id", headerName: "ID", width: 90 },
                                            { field: 'nombre', headerName: 'Nombre', width: 300 },
                                            { field: 'identificacion', headerName: 'DNI', width: 200 },
                                            { field: 'departamento', headerName: 'Departamento de Residencia', width: 300 },
                                            { field: 'municipio', headerName: 'Municipio de Residencia', width: 300 },
                                        ]}
                                        pageSize={5}
                                        checkboxSelection
                                        getRowId={(row) => row.id}
                                        autoHeight
                                        selectionModel={selectionModel}
                                        onRowSelectionModelChange={(newSelection) => {
                                            setSelectionModel(newSelection);
                                        }}
                                    />
                                </TabPanel>
                                <TabPanel value="2">Item Two</TabPanel>
                            </TabContext>
                        </Box>
                    )}

                    {activeStep === 3 && (
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <TextField fullWidth label="Nombre de salida" />
                            </Grid>
                            <Grid item md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox checked color="success" />
                                <Typography>✔</Typography>
                            </Grid>
                        </Grid>
                    )}

                    {activeStep === 4 && (
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                                <TextField fullWidth label="Horas totales" type="number" />
                            </Grid>
                            <Grid item md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox checked color="success" />
                                <Typography>✔</Typography>
                            </Grid>
                        </Grid>
                    )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Atrás
                    </Button>
                    <Button
                        variant="contained"

                        onClick={() => handleStepSubmit(activeStep)}
                        sx={{
                            mr: 1, backgroundColor: color.azul
                        }} >
                        Guardar
                    </Button>
                </Box>

                <InstructorModal
                    ref={dataTableRef}
                    soloModal={true}
                    onSaveSuccess={fetchFacilitators}
                />
                <ModalEstudiantes
                    ref={estudiantesRef}
                    soloModal={true}
                    onSaveSuccess={handleSaveSuccess} // Pasa el callback
                />
            </Paper >
        </Dashboard >
    );
};

export default AddEducationalProcess;