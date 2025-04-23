import express from "express";
import {PORT} from './config.js'
import userRoutes from './routes/ms_usuarios.routes.js'
import nacionalidadesRoutes from './routes/nacionalidades.routes.js'
import aldeasRoutes from './routes/aldeas.routes.js'
import municipiosRoutes from "./routes/municipios.routes.js";
import deptoRoutes from "./routes/departamentos.routes.js";
import academicoRoutes from "./routes/academico.routes.js";
import etniasRoutes from "./routes/etnias.routes.js";
import discapacidadRoutes from "./routes/discapacidades.router.js"
import tipoInstructorRoutes from "./routes/tipoInstructor.routes.js"
import areasFormacionRoutes from "./routes/areasFormacion.routes.js"

import estudiantesRouter from "./routes/estudiantes.routes.js";
import instructoresRouter from "./routes/instructores.routes.js";
import curriculasRoutes from "./routes/curriculas.routes.js";
import modulosCurriculasRoutes from "./routes/modulosCurriculas.routes.js";
import clasesModCurriculas from "./routes/clasesModCurriculas.routes.js";
import cursosRoutes from "./routes/cursos.routes.js"
import modulosCursosRoutes from "./routes/modulosCursos.routes.js"
import clasesModCursos from './routes/clasesModCursos.routes.js'

import ms_rolesRoutes from "./routes/ms_roles.routes.js";
import ms_modulosRoutes from "./routes/ms_modulos.routes.js"
import ms_objetosRoutes from "./routes/ms_objetos.routes.js";
import ms_permisosRoutes from "./routes/ms_permisos.routes.js"

import estudiantesExternos from "./routes/ApiExternaEstudiantes.routes.js"
import programasRouter from './routes/programas.routes.js'
import seguimientoRouter from './routes/seguimiento.routes.js'
import matriculas from './routes/matriculas.routes.js'
import calificaciones from './routes/calificaciones.routes.js'

import cors from "cors"


import 'dotenv/config'; 


const app = express()

app.use(cors());
app.use(express.json())
app.use(userRoutes)

app.use(nacionalidadesRoutes)
app.use(aldeasRoutes)
app.use(municipiosRoutes)
app.use(deptoRoutes)
app.use(academicoRoutes)
app.use(etniasRoutes)
app.use(discapacidadRoutes)
app.use(tipoInstructorRoutes)
app.use(areasFormacionRoutes)



app.use(estudiantesRouter)
app.use(instructoresRouter)
app.use(curriculasRoutes)
app.use(modulosCurriculasRoutes)
app.use(clasesModCurriculas)
app.use(cursosRoutes)
app.use(modulosCursosRoutes)
app.use(clasesModCursos)

app.use(ms_rolesRoutes)
app.use(ms_modulosRoutes)
app.use(ms_objetosRoutes)
app.use(ms_permisosRoutes)

app.use(estudiantesExternos)

app.use(programasRouter)
app.use(seguimientoRouter)
app.use(matriculas)
app.use(calificaciones)

console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

