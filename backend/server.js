
const express = require('express');
const cors = require('cors');
const Mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs');

const aplicacion = express();

//Instanciamos las dependencias de la aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Crear la conexion con DB
Mongoose.connect('mongodb://localhost:27017/AP-N3-C2')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse con la DB, error ocurrido: ', excepcion));

const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, 'localhost', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


const direccionSchema = new Mongoose.Schema({
    comuna: { type: String, required: true },
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    departamento: String
});

const usuarioSchema = new Mongoose.Schema({
    nombre: { type: String, required: true }, 
    rut: { type: String, required: true },
    correo: { type: String, required: true }, 
    telefono: String,
    fechaNacimiento: { type: Date, required: true },
    nacionalidad: { type: String, required: true },
    genero: { type: String, enum: ['M', 'F', 'O'] },
    direccion: [direccionSchema],
    contrasena: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true },
    foto: {
        filename: String,
        path: String,
        mimetype: String
    }
});

const paisSchema = new Mongoose.Schema({
    nombre: String,
    iso2: String
});

// Modelos de la base de datos
const Usuario = Mongoose.model('usuario', usuarioSchema);
const Pais = Mongoose.model('pais', paisSchema);


const dispositivoElectronicoSchema = new Mongoose.Schema({
    usuarioId: { 
        type: Mongoose.Schema.Types.ObjectId, 
        ref: 'usuario',
        required: true 
    },
    tipo: { type: String, required: true },
    marca: String,           
    modelo: String,          
    serie: { type: String, unique: true, required: true },
    fechaCompra: Date,
    garantiaMeses: Number,
    sistemaOperativo: String, 
    estado: { type: String, default: 'Nuevo' }, 
    valor: Number
});


const Dispositivo = Mongoose.model('dispositivoElectronico', dispositivoElectronicoSchema);


aplicacion.post('/guardarUsuario', async (req, res) => {
    try {
        const { nombre, rut, correo, telefono, fechaNacimiento, nacionalidad, genero, contrasena, direccion, foto } = req.body;
        const direccionUsuario = JSON.parse(direccion);


        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(contrasena, salt);

        const nuevoUsuario = new Usuario({ 
            nombre, rut, correo, telefono, fechaNacimiento, nacionalidad, genero, contrasena: hash, direccion: direccionUsuario, foto 
        });
        await nuevoUsuario.save();

        res.status(200).json({ mensaje: 'Usuario almacenado correctamente.' });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'No se han podido guardar los datos.', error });
    }
});

aplicacion.get('/obtenerUsuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos.', error });
    }
});

aplicacion.get('/obtenerPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.json(paises);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los países.', error });
    }
});

aplicacion.post('/guardarDispositivo', async (req, res) => {
    try {
        const nuevoDispositivo = new Dispositivo(req.body);
        await nuevoDispositivo.save();
        res.status(200).json({ mensaje: 'Datos del dispositivo almacenados correctamente.' });
    }
    catch (error) {
        res.status(500).json({ mensaje: 'No se han podido guardar los datos del dispositivo.', error });
    }
});


aplicacion.get('/obtenerDispositivos', async (req, res) => {
    try {
        const dispositivos = await Dispositivo.aggregate([
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuarioId',
                    foreignField: '_id', 
                    as: 'propietario'
                }
            },
            {

                $unwind: {
                    path: '$propietario',
                    preserveNullAndEmptyArrays: true
                }
            },
            {

                $project: {
                    'propietario.contrasena': 0
                }
            }
        ]);
        res.json(dispositivos);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los dispositivos.', error });
    }
});