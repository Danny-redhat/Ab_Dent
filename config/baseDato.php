<?php

//definimos las credenciales de mi hosting
$servidor = 'localhost';
$base_datos = 'u366749359_clinica_dental';
$usuario = 'root';
$contrasena = '';
$codificacion = 'utf8mb4';

//configuramos la conexion


 $ruta_conexion = "mysql:host=$servidor;dbname=$base_datos;charset=$codificacion";

 //opciones extra de seguridad y formato

 $opciones = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, //va a mostrar errores ejemplo: "Error: La columna 'telefono' no existe en la tabla pacientes"
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, //entregar datos limpios
    PDO::ATTR_EMULATE_PREPARES => false, //mayor seguridad anti-hackeos
 ];

 // intentamos conectar a la base de datos
 try{
     $conexion = new PDO($ruta_conexion, $usuario, $contrasena, $opciones);

}catch (\PDOException $e){
    //si la contraseña o el usuario esta mal, ellos nos avisara con este codigo
    throw new \PDOException($e->getMessage(),(int)$e->getCode());
}
   
?>