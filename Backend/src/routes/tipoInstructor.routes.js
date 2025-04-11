import {Router} from "express";

import { getTipoEducadorC, getTipoEducadorIdC, postTipoEducadorC, putTipoEducadorC } from "../controllers/tipoInstructor.controller.js";

const router=Router();

router.get('/tipoEducador', getTipoEducadorC)
router.get('/tipoEducador/:id', getTipoEducadorIdC)
router.post('/tipoEducador', postTipoEducadorC)
router.put('/tipoEducador/:id', putTipoEducadorC)



export default router;
