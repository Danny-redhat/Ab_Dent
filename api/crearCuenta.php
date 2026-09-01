<?php

    //le decimos al sistema que vamos a devolver un mensaje en formato JSON
    header('Content-Type: application/json');

    //traemos nuestra llave de conexion
    require_once '../config/baseDato.php';

    //capturamos los datos que nos enviara el formulario html

    $datos = json_decode(file_get_contents("php://input"));

    //verificamos que no tengo campos varios por error
    if(empty($datos->nombre) || empty($datos->email) || empty($datos->contrasena)){
        //si falta algo tendremos que detener todo el formulario y le mandamos un mensaje
        echo json_encode(["exito" => false, "mensaje" => "falta datos obligatorios"]);
        exit;
    }

    try{
        //ahora que ya verifico que no esta vacio el formulario, veremos si no tiene duplicado en el correo
        $consulta_previa = $conexion->prepare("SELECT id_usuario FROM usuarios WHERE email = ?");
        $consulta_previa->execute([$datos->email]);

        if($consulta_previa->rowCount() > 0){
            echo json_encode(["exito" => false, "mensaje" => "este correo ya esta registrado"]);
            exit;
        }
        //encriptamos la contraseña para que sea inreconocible en la base de dato
        $contrasena_segura = password_hash($datos->contrasena, PASSWORD_BCRYPT);

        // guardamos al nuevo usuario preparamos el SQL

        $sql = "INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?,?,?,?,?)";
        $insertar = $conexion->prepare($sql);

        //si esta en blanco apellido o rol le pondremos valores por defecto

        $apellido = isset($datos->apellido) ? $datos->apellido : ''; //por defecto estara vacio
        $rol = isset($datos->rol) ? $datos->rol : 'dentista'; //por defecto estara en dentista

        //ejecutamos la orden enviando los datos limpios
        $insertar ->execute([$datos->nombre, $apellido, $datos->email, $contrasena_segura, $rol]);

        //ahora le enviamos un mensaje que se creo correctamente
        echo json_encode(["exito" => true, "mensaje" => "cuenta creada correctamente"]);

    }catch(PDOException $e){
        //si hay un error lo mostraremos
        echo json_encode(["exito" => false, "mensaje" => "error al guardar" . $e->getMessage()]);
    }

?>