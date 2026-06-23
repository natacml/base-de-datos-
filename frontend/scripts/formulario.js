function validarFormulario() {
    const nombre = document.getElementById('inputNombre')
    const rut = document.getElementById('inputRut')
    const correo = document.getElementById('inputEmail')
    const celular = document.getElementById('inputCelular')
    const fechaNac = document.getElementById('inputNacimiento')
    const nacionalidad = document.getElementById('selectNacionalidad')
    const contrasena = document.getElementById('inputContrasena')
    const repContrasena = document.getElementById('inputRepetirContrasena')
    const direccion = document.getElementById('inputDireccion')
    const foto = document.getElementById('inputFoto')
    const genero = document.querySelector('input[name="radioGenero"]:checked')

    let formularioValido = true

    if (!validarInput(nombre)) { formularioValido = false }
    if (!validarRut(rut)) { formularioValido = false }
    if (!validarEmail(correo)) { formularioValido = false }
    if (!validarInput(celular)) { formularioValido = false }
    if (!validarInput(fechaNac)) { formularioValido = false }
    if (!validarInput(nacionalidad)) { formularioValido = false }
    if (!validarContrasena(contrasena)) { formularioValido = false }
    if (!validarConfirmarContrasena(repContrasena, contrasena)) { formularioValido = false }
    if (!validarInput(direccion)) { formularioValido = false }
    if (!validarInput(foto)) { formularioValido = false }

    if (formularioValido == true) {
        alert('Datos ingresados correctamente, enviando datos...')

        const formulario = document.getElementById('formularioRegistro');
        const inputsForm = new FormData(formulario);
        const datosUsuario = Object.fromEntries(inputsForm.entries());

        const enviarDatos = async () => {
            try {
                const respuesta = await fetch('http://localhost:3000/guardarUsuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosUsuario)
                })
                if(respuesta.ok){
                    window.location.href = './datos.html';
                }
            } catch (error) {
                console.log('Error al guardar los datos:', error)
            }
        }
        enviarDatos();
    }
}

function validarInput(elemento) {
    if (elemento.value === '') {
        elemento.classList.add('alerta', 'is-invalid')
        return false;
    } else {
        elemento.classList.remove('alerta', 'is-invalid')
        elemento.classList.add('correcto', 'is-valid')
        return true;
    }
}

function validarEmail(elemento) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/
    if (validarInput(elemento)) {
        if (regexEmail.test(elemento.value)) {
            elemento.classList.remove('alerta', 'is-invalid')
            elemento.classList.add('correcto', 'is-valid')
            return true;
        } else {
            elemento.classList.add('alerta', 'is-invalid')
            return false;
        }
    }
}

function validarContrasena(elemento) {
    if (validarInput(elemento)) {
        const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/;
        if (regexContrasena.test(elemento.value)) {
            elemento.classList.remove('alerta', 'is-invalid')
            elemento.classList.add('correcto', 'is-valid')
            return true;
        } else {
            elemento.classList.add('alerta', 'is-invalid')
            return false;
        }
    }
}

function validarRut(elemento) {
    if (validarInput(elemento)) {
        let rutCompleto = elemento.value
        rutCompleto = rutCompleto.replace(/\./g, '').replace('-', '');
        const cuerpo = rutCompleto.slice(0, -1);
        const dv = rutCompleto.slice(-1).toUpperCase();

        if (/^\d+$/.test(cuerpo)) {
            let suma = 0;
            let multiplo = 2;

            for (let i = cuerpo.length - 1; i >= 0; i--) {
                suma += parseInt(cuerpo.charAt(i)) * multiplo;
                multiplo = multiplo < 7 ? multiplo + 1 : 2;
            }

            const dvEsperado = 11 - (suma % 11);

            if (dvEsperado === 11) {
                return dv === '0';
            } else if (dvEsperado === 10) {
                return dv === 'K';
            }

            if (dv === dvEsperado.toString()) {
                elemento.classList.remove('alerta', 'is-invalid')
                elemento.classList.add('correcto', 'is-valid')
                return true;
            } else {
                elemento.classList.add('alerta', 'is-invalid')
                return false;
            }
        } else {
            elemento.classList.add('alerta', 'is-invalid')
            return false;
        }
    }
}

function validarConfirmarContrasena(elemento1, elemento2) {
    if (validarInput(elemento1)) {
        if (elemento1.value === elemento2.value) {
            elemento1.classList.remove('alerta', 'is-invalid')
            elemento1.classList.add('correcto', 'is-valid')
            return true;
        } else {
            elemento1.classList.add('alerta', 'is-invalid')
            return false;
        }

    }
}