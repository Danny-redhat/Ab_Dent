<?php
// api/get_antecedentes.php
header('Content-Type: application/json');
require_once '../config/baseDato.php';

if(!isset($_GET['id_paciente'])) {
    echo json_encode(["exito" => false, "mensaje" => "Falta el ID del paciente."]);
    exit;
}

try {
    $sql = "SELECT * FROM antecedentes WHERE id_paciente = ?";
    $consulta = $conexion->prepare($sql);
    $consulta->execute([$_GET['id_paciente']]);
    
    $antecedentes = $consulta->fetch(PDO::FETCH_ASSOC);

    if($antecedentes) {
        echo json_encode(["exito" => true, "data" => $antecedentes]);
    } else {
        echo json_encode(["exito" => false, "mensaje" => "Aún no tiene antecedentes registrados."]);
    }
} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error: " . $e->getMessage()]);
}
?>