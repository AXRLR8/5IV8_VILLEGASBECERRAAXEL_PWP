const mysql2 = require('mysql2');
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ax10el80',
    database: 'cursosdb'
});

db.connect((error) => {
    if(error) {
        console.log('Error de conexion a la base de datos:', error);
    } else {
        console.log('Conexion exitosa a la base de datos');
    }
});


module.exports = db;
