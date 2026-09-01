<?php
// api/get_paciente_id.php

header('Content-Type: application/json');
require_once '../config/baseDato.php';


if(!isset($_GET['id'])) {
    echo json_encode(["exito" => false, "mensaje" => "Falta el ID del paciente."]);
    exit;
}

$id = $_GET['id'];

try {

    $sql = "SELECT * FROM pacientes WHERE id_paciente = ?";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([$id]);
    
    $paciente = $consulta->fetch(PDO::FETCH_ASSOC);

    if($paciente) {
        echo json_encode(["exito" => true, "data" => $paciente]);
    } else {
        echo json_encode(["exito" => false, "mensaje" => "Paciente no encontrado."]);
    }

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error: " . $e->getMessage()]);
}
?>