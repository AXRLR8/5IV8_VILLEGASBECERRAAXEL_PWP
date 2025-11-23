const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

// Función auxiliar para formatear la fecha a un string compatible con MySQL DATETIME
function formatToMySQLDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// Carga las variables de entorno del archivo .env
require('dotenv').config({path: './.env'});

const app = express();
const port = 3000;

const bd = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
});

bd.connect((error) => {
    if (error) {
        console.log('Error de conexión a la base de datos: ' + error);
    } else {
        console.log('Conexion exitosa a la base de datos');
    }
});

// Configuración de body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de EJS y vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Configuración de archivos estáticos (CSS)
app.use('/css', express.static(path.join(__dirname, 'css')));

// Ruta raíz: Redirige al index de la bitácora
app.get('/', (req, res) => {
    res.redirect('/bitacora');
});

// Mostrar el formulario de registro y la lista de registros de bitácora
app.get('/bitacora', (req, res)=>{
    const querry = 'SELECT * FROM bitacora ORDER BY id DESC';
    bd.query(querry, (error, resultados)=>{
        if(error){
            console.log('Error al obtener la bitácora: ' + error);
            return res.status(500).send('Error al obtener la bitácora');
        }
        res.render('index', { registros: resultados }); 
    });
});

// Crear un nuevo registro en la bitácora
app.post('/bitacora', (req, res) => {
    const { fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector } = req.body;
    const fechaHoraFormateada = formatToMySQLDateTime(fecha_hora_ronda);

    const querry = `INSERT INTO bitacora (fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const values = [fechaHoraFormateada, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector];

    bd.query(querry, values, (error, resultados) => {
        if (error) {
            console.log('Error al crear el registro de bitácora: ' + error);
            return res.status(500).send('Error al crear el registro');
        }
        res.redirect('/bitacora');
    });
});

// Eliminar un registro
app.get('/bitacora/delete/:id', (req, res) =>{
    const registroId = req.params.id;
    const querry = `DELETE FROM bitacora WHERE id = ?;`;
    
    bd.query(querry, [registroId], (error, resultados) =>{
        if(error){
            console.log('Error al eliminar el registro: ' + error);
            return res.status(500).send('Error al eliminar el registro');
        }
        res.redirect('/bitacora');
    });
});

// Mostrar el formulario de seguimiento para un registro específico
app.get('/bitacora/seguimiento/:id', (req, res) =>{ 
    const registroId = req.params.id;
    const querry = `SELECT * FROM bitacora WHERE id = ?;`;
    
    bd.query(querry, [registroId], (error, resultados) =>{
        if(error){
            console.log('Error al obtener el registro: ' + error);
            return res.status(500).send('Error al obtener el registro');
        } 
        res.render('seguimiento', { registro: resultados[0] });  
    });
});

// Actualizar los datos de un registro (desde la vista de seguimiento)
app.post('/bitacora/update/:id', (req, res) =>{
    const registroId = req.params.id;
    const { fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector } = req.body; 
    
    // 🛑 CORRECCIÓN: Formatear la fecha para UPDATE
    const fechaHoraFormateada = formatToMySQLDateTime(fecha_hora_ronda);

    const querry = `UPDATE bitacora SET fecha_hora_ronda=?, area_sector=?, punto_control=?, estado=?, observaciones=?, seguimiento_requerido=?, inspector=? WHERE id=?;`;
    
    // Usamos la variable formateada
    const values = [fechaHoraFormateada, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector, registroId];

    bd.query(querry, values, (error, resultados) =>{
        if(error){
            console.log('Error al actualizar el registro: ' + error);
            return res.status(500).send('Error al actualizar el registro');
        }
        res.redirect('/bitacora');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});