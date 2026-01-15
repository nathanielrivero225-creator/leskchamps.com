<?php
include 'conexion.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $con->prepare("DELETE FROM productos WHERE id = ?");
    $stmt->execute([$id]);

    header('Location: ../html/productos_admin.html');
    exit;
} else {
    echo "ID no especificado.";
}
?>