window.onload = function () {
    cargarUsuariosDesplegable();
};

async function cargarUsuariosDesplegable() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        
        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            const select = document.getElementById('selectUsuario');
            
            select.innerHTML = '<option value="">-- Seleccione un Propietario --</option>';
            
            usuarios.forEach(usuario => {
                const opcion = document.createElement('option');
                opcion.value = usuario._id; 
                opcion.textContent = `${usuario.nombre} (${usuario.rut})`;
                select.appendChild(opcion);
            });
        } else {
            console.error("No se pudieron cargar los usuarios en el formulario.");
        }
    } catch (error) {
        console.error("Error de red al obtener los usuarios: ", error);
    }
}

async function guardarDispositivo() {
    const formulario = document.getElementById('formDispositivo');
    const usuarioId = document.getElementById('selectUsuario').value;
    const tipo = document.getElementById('inputTipo').value;
    const marca = document.getElementById('inputMarca').value;
    const modelo = document.getElementById('inputModelo').value;
    const serie = document.getElementById('inputSerie').value;
    const fechaCompra = document.getElementById('inputFecha').value;
    const garantiaMeses = document.getElementById('inputGarantia').value;
    const sistemaOperativo = document.getElementById('inputSO').value;
    const estado = document.getElementById('selectEstado').value;
    const valor = document.getElementById('inputValor').value;

    if (!usuarioId) {
        alert("Por favor, seleccione un usuario propietario para este dispositivo.");
        return;
    }
    if (!serie) {
        alert("El número de serie es obligatorio.");
        return;
    }

    // Estructuramos el objeto JSON limpio para MongoDB
    const datosDispositivo = {
        usuarioId: usuarioId,
        tipo: tipo,
        marca: marca,
        modelo: modelo,
        serie: serie,
        fechaCompra: fechaCompra ? new Date(fechaCompra) : null, // Mapeo correcto de fecha
        garantiaMeses: garantiaMeses ? parseInt(garantiaMeses) : 0,
        sistemaOperativo: sistemaOperativo,
        estado: estado,
        valor: valor ? parseInt(valor) : 0
    };

    try {
        // Enviamos los datos mediante una peticion POST al servidor
        const respuesta = await fetch('http://localhost:3000/guardarDispositivo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosDispositivo)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert("¡Dispositivo electrónico registrado correctamente en MongoDB!");
            if (formulario) formulario.reset(); 
            window.location.href = "./datos.html"; 
        } else {
            alert("Error al guardar: " + (resultado.mensaje || "Ocurrió un problema"));
        }

    } catch (error) {
        console.error("Error al enviar la petición al servidor: ", error);
        alert("No se pudo conectar con el servidor. Revisa que tu terminal backend esté corriendo.");
    }
}