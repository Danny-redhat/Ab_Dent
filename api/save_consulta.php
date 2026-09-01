<?php
// api/save_consulta.php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/baseDato.php';

//capturamos los datos enviados por Javascript
$datos = json_decode(file_get_contents("php://input"));

//verificamos que no falte nada importante
if(empty($datos->id_paciente) || empty($datos->fecha_consulta) || empty($datos->motivo_consulta)) {
    echo json_encode(["exito" => false, "mensaje" => "Por favor, completa la fecha y el motivo."]);
    exit;
}

try {
    //Preparamos la inserción a tu tabla consultas
    $sql = "INSERT INTO consultas (id_paciente, id_usuario, fecha_consulta, motivo_consulta) 
            VALUES (?, ?, ?, ?)";
    
    $consulta = $conexion->prepare($sql);
    
    $consulta->execute([
        $datos->id_paciente,
        $datos->id_usuario,
        $datos->fecha_consulta,
        $datos->motivo_consulta
    ]);

    echo json_encode(["exito" => true, "mensaje" => "¡Consulta registrada exitosamente!"]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error en la base de datos: " . $e->getMessage()]);
}
?>