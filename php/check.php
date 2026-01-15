<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['admin_id'])) {
    echo json_encode(['exito' => true, 'rol' => 'admin']);
} else {
    echo json_encode(['exito' => false]);
}
?>
