window.onload = function () {
    obtenerYMostrarDispositivos();
};

async function obtenerYMostrarDispositivos() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerDispositivos');
        
        if (respuesta.ok) {
            const dispositivos = await respuesta.json();
            const tbody = document.getElementById('tablaDispositivos');
            
            tbody.innerHTML = '';

            if (dispositivos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay dispositivos registrados.</td></tr>';
                return;
            }

            // Volvemos al orden nativo y simple que tenías antes:
            dispositivos.forEach(dispositivo => {
                const fila = document.createElement('tr');

                // Extraemos los textos directos de tu consulta original
                const valorSimple = dispositivo.valor || 0;
                const nombrePropietario = dispositivo.propietario ? dispositivo.propietario.nombre : 'No asignado';
                const rutPropietario = dispositivo.propietario ? (dispositivo.propietario.rut || '---') : '---';

                // Render clásico: Tipo | Marca | Modelo | Serie | Valor | Propietario | RUT
                fila.innerHTML = `
                    <td>${dispositivo.tipo || '---'}</td>
                    <td>${dispositivo.marca || '---'}</td>
                    <td>${dispositivo.modelo || '---'}</td>
                    <td>${dispositivo.serie || '---'}</td>
                    <td>${valorSimple}</td>
                    <td>${nombrePropietario}</td>
                    <td>${rutPropietario}</td>
                `;

                tbody.appendChild(fila);
            });

        } else {
            console.error("Error al obtener los datos del servidor.");
        }
    } catch (error) {
        console.error("Error de red: ", error);
    }
}