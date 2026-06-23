// Instanciamos/Importamos las depedencias necesarias y las almacenamos en una constante
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Iniciamos nuestra aplicación express
const aplicacion = express();
const puerto = 3000;

// Instanciamos las depedencias de la aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Crear la conexión con DB
mongoose.connect('mongodb://localhost:27017/AP-N3-C2')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse con la DB, error ocurrido: ', excepcion));

const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, 'localhost', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const usuario = new mongoose.Schema({
    nombre: String,
    rut: String,
    nacionalidad: Number,
    email: String,
    celular: String,
    fechaNacimiento: Date,
    contrasena: String,
    direccion: String,
    foto: {
        filename: String,
        path: String,
        mimetype: String
    }
});

const Usuario = mongoose.model('Usuario', usuario, 'usuarios');

aplicacion.post('/guardarUsuario', async (req, res) => {
    try {
        const { nombre, rut, nacionalidad, email, celular, fechaNacimiento, contrasena, direccion, foto } = req.body;
        const nuevoUsuario = new Usuario({ nombre, rut, nacionalidad, email, celular, fechaNacimiento, contrasena, direccion, foto });
        await nuevoUsuario.save();

        res.status(200).json({ mensaje: 'Datos almacenados correctamente.' })
    }
    catch (error) {
        res.status(500).json({ mensaje: 'No se han podido guardar los datos. ', error });
    };
});