<?php
// api/get_consultas_paciente.php

header('Content-Type: application/json');
require_once '../config/baseDato.php';


if(!isset($_GET['id_paciente'])) {
    echo json_encode(["exito" => false, "mensaje" => "Falta el ID del paciente."]);
    exit;
}

$id_paciente = $_GET['id_paciente'];

try {
    $sql = "SELECT c.id_consulta, c.fecha_consulta, c.motivo_consulta, c.id_usuario, u.nombre AS nombre_doctor 
            FROM consultas c 
            INNER JOIN usuarios u ON c.id_usuario = u.id_usuario 
            WHERE c.id_paciente = ? 
            ORDER BY c.fecha_consulta DESC";
    
    $consulta = $conexion->prepare($sql);
    $consulta->execute([$id_paciente]);
    
    $consultas = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["exito" => true, "data" => $consultas]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error al obtener consultas: " . $e->getMessage()]);
}
?>