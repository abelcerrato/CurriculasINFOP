import express from "express";
import {PORT} from './config.js'
import userRoutes from './routes/users.routes.js'
import aldeasRoutes from './routes/aldeas.routes.js'
import municipiosRoutes from "./routes/municipios.routes.js";
import deptoRoutes from "./routes/departamentos.routes.js";
import academicoRoutes from "./routes/academico.routes.js";
import etniasRoutes from "./routes/etnias.routes.js";
import discapacidadRoutes from "./routes/discapacidades.router.js"
import tipoEducadorRoutes from "./routes/tipoEducador.routes.js"
import areasFormacionRoutes from "./routes/areasFormacion.routes.js"
import rolesRoutes from "./routes/roles.routes.js"
import permisosRoutes from "./routes/permisos.routes.js"
import rolyPermisosRoutes from "./routes/rolypermisos.routes.js"
import estudiantesRouter from "./routes/estudiantes.routes.js";
import maestrosRouter from "./routes/maestros.routes.js";
import curriculasRoutes from "./routes/curriculas.routes.js";
import modulosCurriculasRoutes from "./routes/modulosCurriculas.routes.js";
import clasesModCurriculas from "./routes/clasesModCurriculas.routes.js";
import cursosRoutes from "./routes/cursos.routes.js"
import modulosCursosRoutes from "./routes/modulosCursos.routes.js"
import clasesModCursos from './routes/clasesModCursos.routes.js'


import cors from "cors"


import 'dotenv/config'; 


const app = express()

app.use(cors());
app.use(express.json())
app.use(userRoutes)
app.use(aldeasRoutes)
app.use(municipiosRoutes)
app.use(deptoRoutes)
app.use(academicoRoutes)
app.use(etniasRoutes)
app.use(discapacidadRoutes)
app.use(tipoEducadorRoutes)
app.use(areasFormacionRoutes)
app.use(rolesRoutes)
app.use(permisosRoutes)
app.use(rolyPermisosRoutes)
app.use(estudiantesRouter)
app.use(maestrosRouter)
app.use(curriculasRoutes)
app.use(modulosCurriculasRoutes)
app.use(clasesModCurriculas)
app.use(cursosRoutes)
app.use(modulosCursosRoutes)
app.use(clasesModCursos)



console.log("DB_USER:", process.env.DB_USER); // Prueba si se está cargando correctamente

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

