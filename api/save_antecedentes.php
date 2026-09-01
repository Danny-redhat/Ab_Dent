<?php
// api/save_antecedentes.php
header('Content-Type: application/json');
require_once '../config/baseDato.php';

$datos = json_decode(file_get_contents("php://input"));

if(empty($datos->id_paciente)) {
    echo json_encode(["exito" => false, "mensaje" => "Falta el ID del paciente."]);
    exit;
}

try {
    // Primero revisamos si este paciente ya tiene un registro de antecedentes
    $check = $conexion->prepare("SELECT id_antecedentes FROM antecedentes WHERE id_paciente = ?");
    $check->execute([$datos->id_paciente]);
    $existe = $check->fetch();

    if($existe) {
        // Si ya existe, lo ACTUALIZAMOS (UPDATE)
        $sql = "UPDATE antecedentes SET alergias=?, diabetes=?, hipertenso=?, cardiaco=?, hepatitis=?, gestacion=?, medicamentos_actuales=?, descripcion_antecedentes=? WHERE id_paciente=?";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$datos->alergias, $datos->diabetes, $datos->hipertenso, $datos->cardiaco, $datos->hepatitis, $datos->gestacion, $datos->medicamentos_actuales, $datos->descripcion_antecedentes, $datos->id_paciente]);
    } else {
        // Si es nuevo, lo INSERTAMOS (INSERT)
        $sql = "INSERT INTO antecedentes (id_paciente, alergias, diabetes, hipertenso, cardiaco, hepatitis, gestacion, medicamentos_actuales, descripcion_antecedentes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conexion->prepare($sql);
        $stmt->execute([$datos->id_paciente, $datos->alergias, $datos->diabetes, $datos->hipertenso, $datos->cardiaco, $datos->hepatitis, $datos->gestacion, $datos->medicamentos_actuales, $datos->descripcion_antecedentes]);
    }
    
    echo json_encode(["exito" => true, "mensaje" => "¡Antecedentes guardados correctamente!"]);

} catch (PDOException $e) {
    echo json_encode(["exito" => false, "mensaje" => "Error al guardar: " . $e->getMessage()]);
}
?>