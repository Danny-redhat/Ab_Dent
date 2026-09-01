<?php
// api/get_pacientes.php

header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 2. Traemos la conexión
require_once '../config/baseDato.php';

try {
    $sql = "SELECT id_paciente, numero_historial, dni, nombre, apellido, telefono, region 
            FROM pacientes 
            ORDER BY id_paciente DESC";
    
    $consulta = $conexion->prepare($sql);
    $consulta->execute();
    
    $pacientes = $consulta->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["exito" => true, "data" => $pacientes]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error al obtener pacientes: " . $e->getMessage()]);
}
?>