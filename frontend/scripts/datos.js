window.onload = function () {
    obtenerDataUsuarios();
};

async function obtenerDataUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            
            new DataTable('#tablaUsuarios',{
                data:usuarios,
                columns:[
                    {data:'nombre'},
                    {data:'rut'},
                    {data:'nacionalidad'},
                    {data:'celular'},
                    {data:'email'},
                    {data:'fechaNacimiento'}
                ]
            });
        }
    } catch (error) {
        console.log('Error al cargar los datos: ', error)
    }
};