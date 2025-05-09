import {Router} from "express";
import { getAccionFormativaC } from "../controllers/accionformativa.controller";



const router=Router();

router.get('/accform', getAccionFormativaC)



export default router;
