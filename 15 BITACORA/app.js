const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

// Carga las variables de entorno del archivo .env
require('dotenv').config({path: './.env'});

const app = express();
const port = 3000;

const bd = mysql.createConnection({
    // Usa las variables definidas en tu archivo .env
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

// Configuración de body-parser para recibir datos de formularios y JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Configuración de archivos estáticos (CSS, JS de cliente, imágenes)
// La carpeta 'css' es accesible públicamente bajo el prefijo '/css'
app.use('/css', express.static(path.join(__dirname, 'css')));

// Ruta GET para mostrar el formulario y la lista de estudiantes
app.get('/', (req, res)=>{
    const querry = 'SELECT * FROM estudiantes';
    bd.query(querry, (error, resultados)=>{
        if(error){
            console.log('Error al obtener los estudiantes: ' + error);
            return res.status(500).send('Error al obtener los estudiantes');
        }
        res.render('index', { estudiantes: resultados });
    });
});

// Ruta para crear un estudiante
app.post('/estudiantes', (req, res) => {
    const { nombre, edad, curso } = req.body;
    // Consultas dentro del mysql con valores sanitizados (mayor seguridad)
    const querry = `INSERT INTO estudiantes (nombre, edad, curso) VALUES (?, ?, ?);`;
    const values = [nombre, edad, curso];
    
    bd.query(querry, values, (error, resultados) => {
        if (error) {
            console.log('Error al crear el estudiante: ' + error);
            return res.status(500).send('Error al crear el estudiante');
        }
        res.redirect('/');
    });
});

// Ruta para eliminar estudiante
app.get('/estudiantes/delete/:id', (req, res) =>{
    const estudianteid = req.params.id;
    const querry = `DELETE FROM estudiantes WHERE id = ?;`;
    
    bd.query(querry, [estudianteid], (error, resultados) =>{
        if(error){
            console.log('Error al eliminar el estudiante: ' + error);
            return res.status(500).send('Error al eliminar el estudiante');
        }
        res.redirect('/');
    });
});

// Ruta para buscar y actualizar (form de edición)
app.get('/estudiantes/edit/:id', (req, res) =>{ 
    const estudianteid = req.params.id;
    const querry = `SELECT * FROM estudiantes WHERE id = ?;`;
    
    bd.query(querry, [estudianteid], (error, resultados) =>{
        if(error){
            console.log('Error al obtener el estudiante: ' + error);
            return res.status(500).send('Error al obtener el estudiante');
        } 
        res.render('edit', { estudiante: resultados[0] });  
    });
});

app.post('/estudiantes/update/:id', (req, res) =>{
    const estudianteid = req.params.id;
    const { nombre, edad, curso } = req.body;  
    
    const querry = `UPDATE estudiantes SET nombre = ?, edad = ?, curso = ? WHERE id = ?;`;
    const values = [nombre, edad, curso, estudianteid];
    
    bd.query(querry, values, (error, resultados) =>{
        if(error){
            console.log('Error al actualizar el estudiante: ' + error);
            return res.status(500).send('Error al actualizar el estudiante');
        }
        res.redirect('/');
    });
});

// Mostrar el formulario de registro y la lista de registros de bitácora
app.get('/bitacora', (req, res)=>{
    const querry = 'SELECT * FROM bitacora ORDER BY id DESC';
    bd.query(querry, (error, resultados)=>{
        if(error){
            console.log('Error al obtener la bitácora: ' + error);
            return res.status(500).send('Error al obtener la bitácora');
        }
        res.render('bitacora_index', { registros: resultados }); 
    });
});

// Crear un nuevo registro en la bitácora
app.post('/bitacora', (req, res) => {
    const { fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector } = req.body;
    
    // Consultas dentro del mysql con valores sanitizados(mayor seguridad)
    const querry = `INSERT INTO bitacora (fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector) VALUES (?, ?, ?, ?, ?, ?, ?);`;
    const values = [fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector];

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

// Mostrar el formulario de edición para un registro específico
app.get('/bitacora/edit/:id', (req, res) =>{ 
    const registroId = req.params.id;
    const querry = `SELECT * FROM bitacora WHERE id = ?;`;
    
    bd.query(querry, [registroId], (error, resultados) =>{
        if(error){
            console.log('Error al obtener el registro: ' + error);
            return res.status(500).send('Error al obtener el registro');
        } 
        res.render('bitacora_edit', { registro: resultados[0] });  
    });
});

// Actualizar los datos de un registro
app.post('/bitacora/update/:id', (req, res) =>{
    const registroId = req.params.id;
    const { fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector } = req.body; 
    
    // Constultas actualizadas sanitizadas  
    const querry = `UPDATE bitacora SET fecha_hora_ronda=?, area_sector=?, punto_control=?, estado=?, observaciones=?, seguimiento_requerido=?, inspector=? WHERE id=?;`;
    const values = [fecha_hora_ronda, area_sector, punto_control, estado, observaciones, seguimiento_requerido, inspector, registroId];

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