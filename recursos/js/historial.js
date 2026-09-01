// recursos/js/historial.js

document.addEventListener("DOMContentLoaded", function() {

    const parametrosURL = new URLSearchParams(window.location.search);
    const idPaciente = parametrosURL.get("id");

    if(!idPaciente) {
        alert("Error: Por favor selecciona un paciente primero.");
        window.location.href = "pacientes.html";
        return;
    }

    // ==========================================
    // 1. CARGAR DATOS DE LA CABECERA Y PERFIL
    // ==========================================
    
    // Función para calcular la edad exacta
    function calcularEdad(fechaNacimiento) {
        if(!fechaNacimiento) return "No registrada";
        const hoy = new Date();
        const cumple = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad + " años";
    }

    fetch(`api/get_paciente_id.php?id=${idPaciente}`)
    .then(respuesta => respuesta.json())
    .then(datosRecibidos => {
        if(datosRecibidos.exito === true) {
            const paciente = datosRecibidos.data;
            
            // Llenamos la cabecera blanca
            document.getElementById("nombrePacienteCabecera").innerText = `Historial de ${paciente.nombre} ${paciente.apellido}`;
            document.getElementById("dniPacienteCabecera").innerText = paciente.dni;
            document.getElementById("numHistorialCabecera").innerText = paciente.numero_historial || 'S/N';

            // Llenamos la ventanita oculta del Perfil
            document.getElementById("perfilNombre").innerText = `${paciente.nombre} ${paciente.apellido}`;
            document.getElementById("perfilDni").innerText = paciente.dni;
            document.getElementById("perfilNacimiento").innerText = paciente.fecha_nacimiento || 'No registrada';
            document.getElementById("perfilEdad").innerText = calcularEdad(paciente.fecha_nacimiento);
            document.getElementById("perfilTelefono").innerText = paciente.telefono || 'No registrado';
            document.getElementById("perfilDireccion").innerText = paciente.direccion || 'No registrada';
            document.getElementById("perfilRegion").innerText = paciente.region || 'No registrada';
            
            // Cortamos la fecha de registro para que no salga la hora si no queremos
            const fechaReg = paciente.fecha_creacion ? paciente.fecha_creacion.split(' ')[0] : 'S/N';
            document.getElementById("perfilRegistro").innerText = fechaReg;
        }
    })
    .catch(error => console.error("Error cargando la cabecera:", error));

    // Lógica para abrir y cerrar la ventanita del Perfil
    const modalPerfil = document.getElementById("modalPerfilPaciente");
    const btnVerPerfil = document.getElementById("btnVerPerfil");
    const btnCerrarPerfil = document.getElementById("btnCerrarPerfil");
    const btnAceptarPerfil = document.getElementById("btnAceptarPerfil");

    btnVerPerfil.addEventListener("click", () => {
        modalPerfil.style.display = "flex";
    });

    const cerrarModalPerfil = () => {
        modalPerfil.style.display = "none";
    };

    btnCerrarPerfil.addEventListener("click", cerrarModalPerfil);
    btnAceptarPerfil.addEventListener("click", cerrarModalPerfil);

    // ==========================================
    // 2. CARGAR ANTECEDENTES Y ALERTAS MÉDICAS
    // ==========================================
    const divAlertas = document.getElementById("alertasMedicas");

    function cargarAntecedentes() {
        fetch(`api/get_antecedentes.php?id_paciente=${idPaciente}`)
        .then(respuesta => respuesta.json())
        .then(datosRecibidos => {
            
            divAlertas.innerHTML = ""; // Limpiamos alertas viejas

            if(datosRecibidos.exito === true && datosRecibidos.data) {
                const ant = datosRecibidos.data;
                
                // A) Llenamos el formulario oculto por si el doctor quiere editar
                document.getElementById("chkDiabetes").checked = (ant.diabetes == 1);
                document.getElementById("chkHipertenso").checked = (ant.hipertenso == 1);
                document.getElementById("chkCardiaco").checked = (ant.cardiaco == 1);
                document.getElementById("chkHepatitis").checked = (ant.hepatitis == 1);
                document.getElementById("chkGestacion").checked = (ant.gestacion == 1);
                document.getElementById("txtAlergias").value = ant.alergias || "";
                document.getElementById("txtMedicamentos").value = ant.medicamentos_actuales || "";
                document.getElementById("txtDescripcionAnt").value = ant.descripcion_antecedentes || "";

                if(ant.alergias && ant.alergias.trim() !== "") {
                    divAlertas.innerHTML += `<span style="background: #e74c3c; color: white; padding: 5px 10px; border-radius: 4px; font-size: 13px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">⚠️ ALERGIA: ${ant.alergias.toUpperCase()}</span>`;
                }
                if(ant.diabetes == 1) divAlertas.innerHTML += `<span style="background: #f39c12; color: white; padding: 5px 10px; border-radius: 4px; font-size: 13px; font-weight: bold;">Diabetes</span>`;
                if(ant.hipertenso == 1) divAlertas.innerHTML += `<span style="background: #f39c12; color: white; padding: 5px 10px; border-radius: 4px; font-size: 13px; font-weight: bold;">Hipertensión</span>`;
                if(ant.cardiaco == 1) divAlertas.innerHTML += `<span style="background: #c0392b; color: white; padding: 5px 10px; border-radius: 4px; font-size: 13px; font-weight: bold;">Prob. Cardíacos</span>`;
                if(ant.hepatitis == 1) divAlertas.innerHTML += `<span style="background: #d35400; color: white; padding: 5px 10px; border-radius: 4px; font-size: 13px; font-weight: bold;">Hepatitis</span>`;
                if(ant.gestacion == 1) divAlertas.innerHTML += `<span style="background: #9b59b6; color: white; padding: 5px 10px; border-radius: 4px; font-size: 13px; font-weight: bold;">Gestación</span>`;
            }
        })
        .catch(error => console.error("Error cargando antecedentes:", error));
    }

    cargarAntecedentes(); 


    // ==========================================
    // 3. CARGAR LA TABLA DE CONSULTAS
    // ==========================================
    const cuerpoTablaConsultas = document.getElementById("listaConsultas");

    function cargarConsultas() {
        fetch(`api/get_consultas_paciente.php?id_paciente=${idPaciente}`)
        .then(respuesta => respuesta.json())
        .then(datosRecibidos => {
            cuerpoTablaConsultas.innerHTML = "";
            if(datosRecibidos.exito === true && datosRecibidos.data.length > 0) {
                datosRecibidos.data.forEach(consulta => {
                    const fila = document.createElement("tr");
                    fila.style.borderBottom = "1px solid #ecf0f1";
                    const fechaLimpia = consulta.fecha_consulta.split(' ')[0];

                    
                    fila.innerHTML = `
                        <td style="padding: 12px; font-weight: bold; color: #2c3e50;">${fechaLimpia}</td>
                        <td style="padding: 12px; color: #7f8c8d;">${consulta.motivo_consulta}</td>
                        <td style="padding: 12px;">Dr(a). ${consulta.nombre_doctor}</td>
                        <td style="padding: 12px; display: flex; gap: 8px; align-items: center;">
                            <button onclick="window.location.href='consulta_detalles.html?id_consulta=${consulta.id_consulta}&id_paciente=${idPaciente}'" style="padding: 6px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;">Ver Detalles</button>
                            
                            <button onclick="window.location.href='odontograma.html?id_consulta=${consulta.id_consulta}&id_paciente=${idPaciente}'" style="padding: 6px 12px; background: #34495e; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; transition: 0.2s;" onmouseover="this.style.backgroundColor='#2c3e50'" onmouseout="this.style.backgroundColor='#34495e'">🦷 Odontograma</button>
                        </td>
                    `;
                    cuerpoTablaConsultas.appendChild(fila);
                });
            } else {
                cuerpoTablaConsultas.innerHTML = `<tr><td colspan="4" style="padding: 20px; text-align: center; color: #7f8c8d;">Este paciente aún no tiene consultas registradas.</td></tr>`;
            }
        })
        .catch(error => console.error("Error cargando consultas:", error));
    }

    cargarConsultas();

    // ==========================================
    // 4. LÓGICA DE LA VENTANA DE NUEVA CONSULTA
    // ==========================================
    const modalConsulta = document.getElementById("modalNuevaConsulta");
    const btnNuevaConsulta = document.getElementById("btnNuevaConsulta");
    const formConsulta = document.getElementById("formularioConsulta");
    const inputFecha = document.getElementById("fecha_consulta");

    btnNuevaConsulta.addEventListener("click", () => {
        modalConsulta.style.display = "flex";
        document.getElementById("mensajeModalConsulta").innerText = "";
        
        const ahora = new Date();
        ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
        inputFecha.value = ahora.toISOString().slice(0, 16);
    });

    const cerrarModalConsulta = () => {
        modalConsulta.style.display = "none";
        formConsulta.reset();
    };

    document.getElementById("btnCerrarModalConsulta").addEventListener("click", cerrarModalConsulta);
    document.getElementById("btnCancelarModalConsulta").addEventListener("click", cerrarModalConsulta);

    formConsulta.addEventListener("submit", function(evento) {
        evento.preventDefault();
        const datosConsulta = {
            id_paciente: idPaciente,
            id_usuario: localStorage.getItem("idDoctor"),
            fecha_consulta: inputFecha.value,
            motivo_consulta: document.getElementById("motivo_consulta").value
        };

        const msj = document.getElementById("mensajeModalConsulta");
        msj.style.color = "#3498db";
        msj.innerText = "Guardando consulta...";

        fetch("api/save_consulta.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosConsulta)
        })
        .then(res => res.json())
        .then(datos => {
            if(datos.exito) {
                msj.style.color = "green";
                msj.innerText = datos.mensaje;
                setTimeout(() => { cerrarModalConsulta(); cargarConsultas(); }, 1500);
            } else {
                msj.style.color = "red";
                msj.innerText = datos.mensaje;
            }
        });
    });


    // ==========================================
    // 5. LÓGICA DE LA VENTANA DE ANTECEDENTES
    // ==========================================
    const modalAntecedentes = document.getElementById("modalAntecedentes");
    const btnAbrirAntecedentes = document.getElementById("btnAbrirAntecedentes");
    const formAntecedentes = document.getElementById("formAntecedentes");
    const msjAntecedentes = document.getElementById("mensajeAntecedentes");

    btnAbrirAntecedentes.addEventListener("click", () => {
        modalAntecedentes.style.display = "flex";
        msjAntecedentes.innerText = "";
    });

    const cerrarModalAntecedentes = () => {
        modalAntecedentes.style.display = "none";
    };

    document.getElementById("btnCerrarAntecedentes").addEventListener("click", cerrarModalAntecedentes);
    document.getElementById("btnCancelarAntecedentes").addEventListener("click", cerrarModalAntecedentes);

    formAntecedentes.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const datosAnt = {
            id_paciente: idPaciente,
            alergias: document.getElementById("txtAlergias").value,
            diabetes: document.getElementById("chkDiabetes").checked ? 1 : 0,
            hipertenso: document.getElementById("chkHipertenso").checked ? 1 : 0,
            cardiaco: document.getElementById("chkCardiaco").checked ? 1 : 0,
            hepatitis: document.getElementById("chkHepatitis").checked ? 1 : 0,
            gestacion: document.getElementById("chkGestacion").checked ? 1 : 0,
            medicamentos_actuales: document.getElementById("txtMedicamentos").value,
            descripcion_antecedentes: document.getElementById("txtDescripcionAnt").value
        };

        msjAntecedentes.style.color = "#e67e22";
        msjAntecedentes.innerText = "Guardando...";

        fetch("api/save_antecedentes.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosAnt)
        })
        .then(res => res.json())
        .then(datos => {
            if(datos.exito) {
                msjAntecedentes.style.color = "green";
                msjAntecedentes.innerText = datos.mensaje;
                setTimeout(() => { 
                    cerrarModalAntecedentes(); 
                
                    cargarAntecedentes(); 
                }, 1500);
            } else {
                msjAntecedentes.style.color = "red";
                msjAntecedentes.innerText = datos.mensaje;
            }
        });
    });

});