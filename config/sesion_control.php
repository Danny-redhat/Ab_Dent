<?php
// config/sesion_control.php
// Este archivo centraliza el control de sesión con PHP puro (session nativa),
// en vez de confiar solo en localStorage (que cualquiera puede editar desde la consola del navegador).

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Llamar esta función al inicio de cualquier api/*.php que requiera estar logueado
function requiereSesion() {
    if (!isset($_SESSION['id_usuario'])) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(["exito" => false, "mensaje" => "Debes iniciar sesión para continuar."]);
        exit;
    }
}

// Llamar esta función cuando el endpoint sea exclusivo para administradores
function requiereAdmin() {
    requiereSesion();
    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
        header('Content-Type: application/json');
        http_response_code(403);
        echo json_encode(["exito" => false, "mensaje" => "No tienes permisos suficientes para esta acción."]);
        exit;
    }
}
?>