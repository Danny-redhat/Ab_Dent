// recursos/js/pacientes.js

document.addEventListener("DOMContentLoaded", function() {

    const modal = document.getElementById("modalNuevoPaciente");
    const btnNuevo = document.getElementById("btnNuevoPaciente");
    const btnCerrar = document.getElementById("btnCerrarModal");
    const btnCancelar = document.getElementById("btnCancelarModal");
    const formulario = document.getElementById("formularioPaciente");
    const mensajeModal = document.getElementById("mensajeModal");
    const cuerpoTabla = document.getElementById("listaPacientes");
    const inputBuscador = document.getElementById("buscarPaciente");
    const selectFiltro = document.getElementById("filtroRegion");
    let pacientesGlobales = []; 

    // ==========================================
    // 1. CARGAR PACIENTES
    // ==========================================
    function cargarPacientes() {
        fetch("api/get_pacientes.php")
        .then(respuesta => respuesta.json())
        .then(datosRecibidos => {
            if(datosRecibidos.exito === true && datosRecibidos.data.length > 0) {
                pacientesGlobales = datosRecibidos.data; 
                pintarTabla(pacientesGlobales); 
            } else {
                pacientesGlobales = [];
                cuerpoTabla.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: #7f8c8d;">Aún no hay pacientes registrados.</td></tr>`;
            }
        })
        .catch(error => console.error("Error cargando pacientes:", error));
    }

    // ==========================================
    // 2. DIBUJAR LA TABLA
    // ==========================================
    function pintarTabla(listaDePacientes) {
        cuerpoTabla.innerHTML = ""; 

        if(listaDePacientes.length === 0) {
            cuerpoTabla.innerHTML = `<tr><td colspan="5" style="padding: 20px; text-align: center; color: #7f8c8d;">No se encontraron resultados para tu búsqueda.</td></tr>`;
            return;
        }

        listaDePacientes.forEach(paciente => {
            const fila = document.createElement("tr");
            fila.style.borderBottom = "1px solid #ecf0f1";

            fila.innerHTML = `
                <td style="padding: 12px; font-weight: bold; color: #3498db;">${paciente.numero_historial || 'S/N'}</td>
                <td style="padding: 12px;">${paciente.dni}</td>
                <td style="padding: 12px;">${paciente.nombre} ${paciente.apellido}</td>
                <td style="padding: 12px;">${paciente.telefono || 'No registrado'}</td>
                <td style="padding: 12px;">
                    <button onclick="abrirModalEditar(${paciente.id_paciente})" style="padding: 5px 10px; background: #f39c12; color: white; border: none; border-radius: 3px; cursor: pointer;">Editar</button>
                    <button onclick="window.location.href='historial.html?id=${paciente.id_paciente}'" style="padding: 5px 10px; background: #2ecc71; color: white; border: none; border-radius: 3px; cursor: pointer;">Historial</button>
                </td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }

    // ==========================================
    // 3. EL BUSCADOR INTELIGENTE
    // ==========================================
    function aplicarFiltros() {
        const textoBuscado = inputBuscador.value.toLowerCase();
        const regionBuscada = selectFiltro.value; 

        const pacientesFiltrados = pacientesGlobales.filter(paciente => {
            const coincideTexto = paciente.nombre.toLowerCase().includes(textoBuscado) || 
                                  paciente.apellido.toLowerCase().includes(textoBuscado) || 
                                  paciente.dni.includes(textoBuscado);
            
            const coincideRegion = (regionBuscada === "todas") || (paciente.region === regionBuscada);
            return coincideTexto && coincideRegion;
        });

        pintarTabla(pacientesFiltrados); 
    }

    inputBuscador.addEventListener("input", aplicarFiltros);
    selectFiltro.addEventListener("change", aplicarFiltros);
    cargarPacientes(); 

    // ==========================================
    // 4. LÓGICA DE EDICIÓN (TRAE TODOS LOS DATOS DESDE LA BD)
    // ==========================================
    window.abrirModalEditar = function(idPaciente) {
        modal.style.display = "flex";
        document.getElementById("tituloModalPaciente").innerText = "Editar Paciente"; 
        document.getElementById("id_paciente_editar").value = idPaciente; 
        
        mensajeModal.style.color = "#3498db";
        mensajeModal.innerText = "Cargando datos completos...";

        fetch(`api/get_paciente_id.php?id=${idPaciente}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            mensajeModal.innerText = ""; 

            if(datos.exito === true) {
                const pac = datos.data;
                document.getElementById("numero_historial").value = pac.numero_historial || "";
                document.getElementById("dni").value = pac.dni || "";
                document.getElementById("nombre").value = pac.nombre || "";
                document.getElementById("apellido").value = pac.apellido || "";
                document.getElementById("fecha_nacimiento").value = pac.fecha_nacimiento || "";
                document.getElementById("telefono").value = pac.telefono || "";
                document.getElementById("direccion").value = pac.direccion || ""; 
                document.getElementById("region").value = pac.region || "Otra";
            } else {
                alert("No se pudieron cargar los datos completos del paciente.");
                cerrarModal();
            }
        })
        .catch(error => {
            console.error("Error al editar:", error);
            mensajeModal.style.color = "red";
            mensajeModal.innerText = "Error de conexión al cargar los datos.";
        });
    };
    // ==========================================
    // 5. VENTANA EMERGENTE (MODAL) Y GUARDAR
    // ==========================================
    btnNuevo.addEventListener("click", () => {
        modal.style.display = "flex";
        document.getElementById("tituloModalPaciente").innerText = "Registrar Nuevo Paciente"; 
        document.getElementById("id_paciente_editar").value = ""; 
        formulario.reset(); 
        mensajeModal.innerText = ""; 
    });

    const cerrarModal = () => {
        modal.style.display = "none";
        formulario.reset(); 
    };

    btnCerrar.addEventListener("click", cerrarModal);
    btnCancelar.addEventListener("click", cerrarModal);

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault(); 

        const idEditar = document.getElementById("id_paciente_editar").value; 
        
        const datosPaciente = {
            numero_historial: document.getElementById("numero_historial").value,
            dni: document.getElementById("dni").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            fecha_nacimiento: document.getElementById("fecha_nacimiento").value,
            telefono: document.getElementById("telefono").value,
            direccion: document.getElementById("direccion").value,
            region: document.getElementById("region").value
        };

        
        if (idEditar !== "") {
            datosPaciente.id_paciente = idEditar;
        }

        const archivoPHP = idEditar !== "" ? "api/update_paciente.php" : "api/save_paciente.php";

        mensajeModal.style.color = "#3498db";
        mensajeModal.innerText = "Guardando en la base de datos...";

        fetch(archivoPHP, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosPaciente)
        })
        .then(respuesta => respuesta.json())
        .then(datosRecibidos => {
            if(datosRecibidos.exito === true) {
                mensajeModal.style.color = "green";
                mensajeModal.innerText = datosRecibidos.mensaje;
                
                setTimeout(() => {
                    cerrarModal();
                    cargarPacientes(); 
                    inputBuscador.value = "";
                    selectFiltro.value = "todas";
                }, 1500);

            } else {
                mensajeModal.style.color = "red";
                mensajeModal.innerText = datosRecibidos.mensaje;
            }
        })
        .catch(error => {
            mensajeModal.style.color = "red";
            mensajeModal.innerText = "Error de conexión con el servidor.";
            console.error("Error:", error);
        });
    });
});