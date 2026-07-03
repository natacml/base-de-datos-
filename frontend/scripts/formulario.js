function validarInput(elemento) {
    if (elemento.value.trim() === "") {
        elemento.classList.add('alerta', 'is-invalid');
        return false;
    } else {
        elemento.classList.remove('alerta', 'is-invalid');
        elemento.classList.add('correcto', 'is-valid');
        return true;
    }
}

function validarRut(elemento) {
    if (elemento.value.trim() === "") {
        elemento.classList.add('alerta', 'is-invalid');
        return false;
    } else {
        elemento.classList.remove('alerta', 'is-invalid');
        elemento.classList.add('correcto', 'is-valid');
        return true;
    }
}

function validarEmail(elemento) {
    if (elemento.value.trim() === "") {
        elemento.classList.add('alerta', 'is-invalid');
        return false;
    } else {
        elemento.classList.remove('alerta', 'is-invalid');
        elemento.classList.add('correcto', 'is-valid');
        return true;
    }
}

function validarContrasena(elemento) {
    if (elemento.value.trim() === "") {
        elemento.classList.add('alerta', 'is-invalid');
        return false;
    } else {
        elemento.classList.remove('alerta', 'is-invalid');
        elemento.classList.add('correcto', 'is-valid');
        return true;
    }
}

function validarConfirmarContrasena(elemento1, elemento2) {
    if (validarInput(elemento1)) {
        if (elemento1.value === elemento2.value) {
            elemento1.classList.remove('alerta', 'is-invalid');
            elemento1.classList.add('correcto', 'is-valid');
            return true;
        } else {
            elemento1.classList.add('alerta', 'is-invalid');
            return false;
        }
    }
}

async function cargarPaises() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerPaises');
        if (respuesta.ok) {
            const paises = await respuesta.json();
            const select = document.getElementById('selectNacionalidad');
            
            paises.forEach(pais => {
                const opcion = document.createElement('option');
                opcion.value = pais.iso2;
                opcion.textContent = pais.nombre;
                select.appendChild(opcion);
            });
        }
    } catch (error) {
        console.error('Error al cargar países:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarPaises();
});

async function validarFormulario() {
    const inputNombre = document.getElementById('inputNombre');
    const inputRut = document.getElementById('inputRut');
    const selectNacionalidad = document.getElementById('selectNacionalidad');
    const inputEmail = document.getElementById('inputEmail');
    const inputCelular = document.getElementById('inputCelular');
    const inputNacimiento = document.getElementById('inputNacimiento');
    const selectGenero = document.getElementById('selectGenero');
    const inputContrasena = document.getElementById('inputContrasena');
    const inputRepetirContrasena = document.getElementById('inputRepetirContrasena');
    
    const inputComuna = document.getElementById('inputComuna');
    const inputCalle = document.getElementById('inputCalle');
    const inputNumero = document.getElementById('inputNumero');
    const inputDepartamento = document.getElementById('inputDepartamento');

    // Validaciones obligatorias de campos requeridos
    const v1 = validarInput(inputNombre);
    const v2 = validarRut(inputRut);
    const v3 = validarInput(selectNacionalidad);
    const v4 = validarEmail(inputEmail);
    const v5 = validarInput(inputContrasena);
    const v6 = validarConfirmarContrasena(inputRepetirContrasena, inputContrasena);
    const v7 = validarInput(inputComuna);
    const v8 = validarInput(inputCalle);
    const v9 = validarInput(inputNumero);

    if (v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8 && v9) {
        
        const datosUsuario = {
            nombre: inputNombre.value,
            rut: inputRut.value,
            correo: inputEmail.value,
            telefono: inputCelular.value || null,
            fechaNacimiento: inputNacimiento.value || null,
            genero: selectGenero.value || null, // Captura de Género (M, F, O)
            nacionalidad: selectNacionalidad.value,
            direccion: {
                comuna: inputComuna.value,
                calle: inputCalle.value,
                numero: Number(inputNumero.value),
                departamento: inputDepartamento.value || undefined
            },
            contrasena: inputContrasena.value
        };

        try {
            const respuesta = await fetch('http://localhost:3000/guardarUsuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosUsuario)
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                alert('¡Datos almacenados correctamente!');
                document.getElementById('formularioRegistro').reset();
                document.querySelectorAll('.form-control, .form-select').forEach(el => {
                    el.classList.remove('correcto', 'is-valid');
                });
            } else {
                alert('No se pudo guardar: ' + resultado.mensaje);
            }
        } catch (error) {
            console.error('Error en la petición POST:', error);
            alert('Error al conectar con el servidor.');
        }
    } else {
        alert('Por favor, complete todos los campos obligatorios correctamente.');
    }
}