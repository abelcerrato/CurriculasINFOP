import { pool } from '../db.js'

export const getMunicipiosM = async () => {
    try {
        const { rows } = await pool.query('SELECT * from municipios')
        console.log(rows);
        return rows;
    } catch (error) {
        throw error;
    }
}


export const getMunicipioIdM = async (id) => {
    console.log('Municipio enviado:', id);
    try {
        const { rows } = await pool.query('SELECT municipio, iddepartamento FROM municipios WHERE id=$1', [id]);
        console.log('Resultado de la consulta del Municipio:', rows); 
        return rows;
    } catch (error) {
        console.error('Error al obtener el Municipio:', error); 
        throw error;
    }
}


export const postMunicipiosM = async (municipio, iddepartamento) =>{
    try {
        const { rows } = await pool.query('INSERT INTO municipios (municipio, iddepartamento, fechacreacion, fechamodificacion) VALUES ($1, $2, CURRENT_TIMESTAMP, null) RETURNING *', [municipio, iddepartamento]);
        return rows;
    } catch (error) {
        throw error;
    }
}



export const putMunicipioM = async (id, municipio, iddepartamento) => {
    try {
        const { rows } = await pool.query('UPDATE municipios SET municipio=$1, iddepartamento=$2, fechamodificacion=CURRENT_TIMESTAMP WHERE id=$3 RETURNING *', [municipio, iddepartamento, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}