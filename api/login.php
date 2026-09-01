<?php

//el sistema que va a responder es en formato JSON
header('Content-Type: application/json');

//llamamos nuestra llave de conexion
require_once '../config/baseDato.php';

//capturamos los datos que nos enviara el futuro formulario de login
$datos = json_decode(file_get_contents("php://input"));

//verificamos que no nos envien campos vacios
if(empty($datos->email) || empty($datos->contrasena)){
    echo json_encode(["exito" => false, "mensaje" => "por favor ingresa tu correo y contraseña"]);
    exit;
}

try{
    //buscamos al usuario le preguntamos a la base de dato si existe ese correo
    $sql = "SELECT id_usuario, nombre, apellido, password, rol FROM usuarios WHERE email = ?";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([$datos->email]);

    //si rowcount es mayor a 0 significa que si encontro el correo
    if($consulta->rowCount() > 0){
        
        //extraemos todos los datos de esa fila
        $usuario = $consulta->fetch();

        //la prueba de fuego comparamos las contraseñas
        if(password_verify($datos->contrasena, $usuario['password'])){
            //si la contraseña es correcta
            echo json_encode([
                "exito" => true,
                "mensaje" => "bienvenido de nuevo, " . $usuario['nombre'] . "!!!!!",
                "rol" => $usuario['rol'],
                "nombre_usuario" => $usuario['nombre'],   // AQUI ENVIAMOS EL NOMBRE
                "id_usuario" => $usuario['id_usuario']    // AQUI ENVIAMOS EL ID
            ]);
        }else{
            //el correo existe pero la contraseña esta mal
            echo json_encode(["exito" => false, "mensaje" => "correo o contraseña incorrecta"]);
        }
    }else{
        //el correo no existe en la tabla
        echo json_encode(["exito" => false, "mensaje" => "correo o contraseña incorrecta"]);
    }
}catch (PDOException $e){
    //si hay un error tecnico lo mostraremos
    echo json_encode(["exito" => false, "mensaje" => "error del servidor: " . $e->getMessage()]);
}


?>