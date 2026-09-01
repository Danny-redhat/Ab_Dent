// recursos/js/consulta_detalles.js

document.addEventListener("DOMContentLoaded", function() {

    // extraemo los números secretos de la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const idConsulta = parametrosURL.get("id_consulta");
    const idPaciente = parametrosURL.get("id_paciente");

    //si alguien entra por error sin IDs, lo regresamos a la lista de pacientes
    if(!idConsulta || !idPaciente) {
        alert("Error: Faltan datos de la consulta.");
        window.location.href = "pacientes.html";
        return;
    }

    // arreglamos el boton de "Volver" para que regrese al historial de este paciente
    const btnVolver = document.getElementById("btnVolver");
    btnVolver.href = `historial.html?id=${idPaciente}`;

    // cuando el doctor elige un tratamiento, llenamos el precio
    const selectTratamiento = document.getElementById("selectTratamiento");
    const inputPrecio = document.getElementById("precioTratamiento");

    selectTratamiento.addEventListener("change", function() {
        //buscamos la opcion que el doctor acaba de seleccionar
        const opcionSeleccionada = this.options[this.selectedIndex];
        
        const precio = opcionSeleccionada.getAttribute("data-precio");
        
        // si hay un precio, lo ponemos en la cajitasi no, la dejamos en blanco
        if(precio) {
            inputPrecio.value = precio;
        } else {
            inputPrecio.value = "";
        }
    });


});