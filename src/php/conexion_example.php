<?php
$host = "hostname";
$user = "user";
$password = "password";
$db = "database";

$conexion = mysqli_connect($host, $user, $password, $db);

// Check connection
if (!$conexion) {
    die("Connection failed: " . mysqli_connect_error());
}

mysqli_set_charset($conexion, "utf8");
