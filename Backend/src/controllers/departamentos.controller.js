
import { getDepartamentoIdM, getDepartamentosM, postDepartamentosM, putDepartamentoM } from "../models/departamentos.models.js";

export const getDepartamentosC = async (req, res) => {
    try {
        const departamentos = await getDepartamentosM();
        res.json(departamentos);
    } catch (error) {
        console.error('Error al obtener departamentos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const getDepartamentoIdC = async (req, res) => {
    try {
        const { id } = req.params
        const departamento = await getDepartamentoIdM(id);

        if (!departamento) {
            return res.status(404).json({ message: "Departamento no encontrado" });
        }

        // Retornar el ID del departamento 
        res.json({ id: departamento[0].id });
    } catch (error) {
        console.error('Error al obtener el departamento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const postDepartamentosC = async (req, res) => {
    try {
        const { departamento } = req.body;

        if (!departamento) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const newDepto = await postDepartamentosM(departamento);
        res.json({ message: "Departamento agregado exitosamente: ", newDepto });

    } catch (error) {
        console.error('Error al insertar el departamento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const putDepartamentoC = async (req, res) => {
    try {
        const { id } = req.params;
        const { departamento } = req.body;

        if (!departamento) {
            console.log("Faltan datos en la solicitud");
            return res.status(400).json({ error: "Faltan datos en la solicitud" });
        }

        const updatedDepto = await putDepartamentoM( departamento, id);
        res.json({ message: "Departamento actualizado exitosamente: ", updatedDepto });
    } catch (error) {
        console.error('Error al actualizar el departamento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}