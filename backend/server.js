const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const aplicacion = express();

aplicacion.use(cors());
aplicacion.use(express.json());

mongoose.connect('mongodb://localhost:27017/AP-N3-C2')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse con la BD, error ocurrido: ', excepcion));

const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, 'localhost', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const usuario = new mongoose.Schema({
    nombre: { type: String, required: true },
    rut: { type: String, required: true, unique: true },
    correo: { type: String, required: true, unique: true },
    telefono: { type: String },
    fechaNacimiento: { 
        type: Date,
        validate: {
            validator: function(valor) { return valor < new Date(); },
            message: 'La fecha debe ser anterior a la actual.'
        }
    },
    nacionalidad: { type: String, required: true, maxlength: 2 },
    genero: { type: String, enum: ['M', 'F', 'O'] },
    direccion: {
        comuna: { type: String, required: true },
        calle: { type: String, required: true },
        numero: { type: Number, required: true },
        departamento: { type: String }
    },
    contrasena: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    foto: {
        filename: String,
        path: String,
        mimetype: String
    }
});

usuario.pre('save', async function(next) {
    if (!this.isModified('contrasena')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.contrasena = await bcrypt.hash(this.contrasena, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});

const vehiculoSchema = new mongoose.Schema({
    patente: { type: String, required: true, unique: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    anio: { type: Number, required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }
});

const Usuario = mongoose.model('Usuario', usuario, 'usuarios');
const Pais = mongoose.model('Pais', pais, 'paises');
const Vehiculo = mongoose.model('Vehiculo', vehiculoSchema, 'vehiculos');

aplicacion.post('/guardarUsuario', async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(200).json({ mensaje: 'Datos almacenados correctamente.', usuario: nuevoUsuario });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'No se han podido guardar los datos. ', error: error.message });
    }
});

aplicacion.post('/guardarVehiculo', async (req, res) => {
    try {
        const nuevoVehiculo = new Vehiculo(req.body);
        await nuevoVehiculo.save();
        res.status(200).json({ mensaje: 'Vehículo guardado correctamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar el vehículo.', error: error.message });
    }
});

aplicacion.get('/obtenerVehiculosDetalle', async (req, res) => {
    try {
        const resultado = await Vehiculo.aggregate([
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuarioId',
                    foreignField: '_id',
                    as: 'propietario'
                }
            },
            { $unwind: '$propietario' }
        ]);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar la agregación avanzada', error: error.message });
    }
});

aplicacion.get('/obtenerUsuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos. ', error });
    }
});

aplicacion.get('/obtenerPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.json(paises);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos. ', error });
    }
});