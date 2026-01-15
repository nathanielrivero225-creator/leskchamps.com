<?php
// Verificar si la sesión ya está iniciada antes de iniciarla
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['admin_id'])) {
    header('Location: ../html/admin_login.html');
    exit;
}

include 'conexion.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Get current destacado
    $stmt = $con->prepare("SELECT destacado FROM productos WHERE id = ?");
    $stmt->execute([$id]);
    $producto = $stmt->fetch();

    if ($producto) {
        $nuevo_destacado = $producto['destacado'] ? 0 : 1;

        $stmt = $con->prepare("UPDATE productos SET destacado = ? WHERE id = ?");
        $stmt->execute([$nuevo_destacado, $id]);
    }
}

header('Location: ../html/productos_admin.html');
exit;
?>