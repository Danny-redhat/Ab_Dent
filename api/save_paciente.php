<?php
    // Enciende las alarmas para mostrar errores ocultos
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

    //respondemos en formato JSON
    header('Content-Type: application/json');

    //traemos la llave de conexion a la base de dato
    require_once '../config/baseDato.php';

    //capturamos los datos que nos enviara el formulario
    $datos = json_decode(file_get_contents("php://input"));


    //verificamos que los datos mas importante no esten vacias
    if(empty($datos->numero_historial) || empty($datos->dni) || empty($datos->nombre) || empty($datos->apellido)){
        echo json_encode(["exito" => false, "mensaje" => "por favor, completa los campos obligatorios."]);
        exit;
    }

    //calculamos la edad exacta automaticamente para la columna edad
    $edad = null;
    if(!empty($datos->fecha_nacimiento)){
        $fechaNacimiento = new DateTime($datos->fecha_nacimiento);
        $hoy = new DateTime(); //fecha de hoy
        $edad = $hoy->diff($fechaNacimiento)->y; //extraemos solo los años de diferencia
    }

    try{
        //preparamos para cuando den click guardar
        //usamos los nombres exactos de las columnas de la tabla phpmyadmin
        $sql = "INSERT INTO pacientes (numero_historial, dni, nombre, apellido, edad, fecha_nacimiento, telefono, direccion, region)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";


        $consulta = $conexion->prepare($sql);

        //ejecutamos la instruccion metiendo los datos en orden

        $consulta->execute([
            $datos->numero_historial,
            $datos->dni,
            $datos->nombre,
            $datos->apellido,
            $edad,
            $datos->fecha_nacimiento,
            $datos->telefono,
            $datos->direccion,
            $datos->region
        ]);

        //si salio bien le enviamos un mensaje de exito
        echo json_encode(["exito" => true, "mensaje" => "paciente registrado exitosamente!!!"]);
    
    }catch (PDOException $e){
        //si la base de dato se queja un ejemplo por poner un dni existente
        //el codigo 23000 de MySQL significa "dato duplicado"
        if($e->getCode() == 23000){
            echo json_encode(["exito" => false, "mensaje" => "error: este dni o N° de historial ya esta registrado."]);
        }else{
            echo json_encode(["exito" => false, "mensaje" => "error del servidor: ". $e->getMessage()]);
        }
    }
?>