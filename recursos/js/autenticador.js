document.addEventListener("DOMContentLoaded", function(){

    //buscamos el formulario en la pantalla de regitro por su ID
    const formularioRegistro = document.getElementById("formularioRegistro");

    //si ya estamos en la pagina de registro y el formulario existe seguimos
    if(formularioRegistro){

        //agregamos el evento cunado el usuario de click en CREAR CUENTA
        formularioRegistro.addEventListener("submit", function(evento){
            
            //usamos este codigo para que la pagina se recargue al enviar los datos
            evento.preventDefault();

            //recolectamos lo que el usuario escribio en el formulario
            const datosUsuario = {
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                email: document.getElementById("email").value,
                contrasena: document.getElementById("contrasena").value,
                rol: document.getElementById("rol").value
            };

            //mostraremos los mensajes de exito o error
            const cajaMensaje = document.getElementById("mensajeAlerta");
            cajaMensaje.style.color = "#34495e";
            cajaMensaje.innerText = "cargando... por favor espera.";

            //usaremos fetch para enviar los datos a nuestro archivo php
            fetch("api/crearCuenta.php",{
                method: "POST", //metodo para enviar datos en forma oculta
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(datosUsuario)
            })

                .then(respuesta => respuesta.json()) //convertimos los datos a texto JSON
                .then(datosRecibidos =>{
                    //totamos decisiones basadas en las respuesta de PHP
                    if(datosRecibidos.exito === true){
                        //si salio bien pintamos el mensaje en verde
                        cajaMensaje.style.color ="green";
                        cajaMensaje.innerText = datosRecibidos.mensaje;

                        //limpiamos el formulario para que quede en blanco
                        formularioRegistro.reset();

                        //opcional: redirigimos al usuario a la pantalla de login despues de 2 segundos

                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 2000);
                    }else{
                        //si hubo error como corre repetido lo pintamos de rojo
                        cajaMensaje.style.color = "red";
                        cajaMensaje.innerText = datosRecibidos.mensaje;
                    }
                })
            .catch(error => {
                //si se cae el internet o el servidor falla por completo
                cajaMensaje.style.color = "red";
                cajaMensaje.innerText = "error de conexion con el servidor";
                console.error("error:", error);
            });
        });
    }
});