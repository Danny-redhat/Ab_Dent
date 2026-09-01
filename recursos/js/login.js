//esperamos a que la pantalla de login cargue por completo
document.addEventListener("DOMContentLoaded", function(){


    //buscamos el formulario usando el id que le pusimos en el html
    const formularioLogin = document.getElementById("formularioLogin");

    //si el formulario existe en la pantalla empezamos a vigilarlo
    if (formularioLogin){
        
        //cuando  se click en ingresar
        formularioLogin.addEventListener("submit", function(evento){
            
            //evitamos que la pagina parpadee o se recarge
            evento.preventDefault();

            //recolectamos el correo y la contraseña que escribio
            const datosIngreso = {
                email: document.getElementById("email").value,
                contrasena: document.getElementById("contrasena").value
            };

            //preparamos la cajita para mostrar mensajes
            const cajaMensaje = document.getElementById("mensajeAlerta");
            cajaMensaje.style.color = "#34495e";
            cajaMensaje.innerText = "verificando credenciales...";

            //enviamos los datos a nuestro archivo php
            fetch("api/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosIngreso)

            })

            .then(respuesta => respuesta.json()) //leemos la respuesta de php
            .then(datosRecibidos => {

                //si la contraseña y el correo son correcto....
                if(datosRecibidos.exito === true){
                    cajaMensaje.style.color = "green";
                    cajaMensaje.innerText = datosRecibidos.mensaje;

                    // ✨ LA MAGIA: Guardamos los datos del doctor en la memoria del navegador
                    // (Asumimos que tu archivo login.php nos envía el nombre y el ID)
                    localStorage.setItem("nombreDoctor", datosRecibidos.nombre_usuario);
                    localStorage.setItem("idDoctor", datosRecibidos.id_usuario);

                    //si es un exito haremos que nos rediriga al panel principal
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 2000);
                }else{
                    //si te equivocaste de contraseña o correo mostraremos un error
                    cajaMensaje.style.color = "red";
                    cajaMensaje.innerText = datosRecibidos.mensaje;
                }
            })
            .catch(error => {
                cajaMensaje.style.color = "red";
                cajaMensaje.innerText = "error de conexion con el servidor";
                console.error("error:", error);
            });
        });
    }
});