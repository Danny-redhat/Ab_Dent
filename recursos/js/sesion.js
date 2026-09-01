// recursos/js/sesion.js

document.addEventListener("DOMContentLoaded", function() {

    const nombreGuardado = localStorage.getItem("nombreDoctor");

    if(!nombreGuardado) {
        window.location.href = "index.html"; 
        return;
    }

    const contenedorNombre = document.querySelector(".usuario-actual span");

    if(contenedorNombre) {
        contenedorNombre.innerText = "Dr(a). " + nombreGuardado;
    }


    const btnSalir = document.querySelector(".boton-salir");
    if(btnSalir) {
        btnSalir.addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.clear();
            window.location.href = "index.html";
        });
    }
});