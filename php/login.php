<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // No mostrar errores en output, pero loggear
try {
    include 'conexion.php';

    if (!isset($con)) {
        echo json_encode(['error' => 'Error de conexión a la base de datos']);
        exit;
    }

    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $nombre = $_POST['nombre'] ?? '';
        $password = $_POST['password'] ?? '';

        if (empty($nombre) || empty($password)) {
            echo json_encode(['error' => 'Nombre de usuario y contraseña son requeridos']);
            exit;
        }

        // Para testing, permitir login con admin/admin sin DB
        if ($nombre === 'admin' && $password === 'admin') {
            session_start();
            $_SESSION['admin_id'] = 1;
            $_SESSION['admin_nombre'] = 'admin';
            echo json_encode(['error' => false, 'message' => 'Login exitoso', 'rol' => 'admin']);
            exit;
        }

        $stmt = $con->prepare("SELECT * FROM administrador WHERE nombre = ? AND contraseña = ?");
        $stmt->execute([$nombre, $password]);
        $admin = $stmt->fetch();

        if ($admin) {
            session_start();
            $_SESSION['admin_id'] = $admin['id_admin'];
            $_SESSION['admin_nombre'] = $admin['nombre'];
            echo json_encode(['error' => false, 'message' => 'Login exitoso', 'rol' => 'admin']);
        } else {
            echo json_encode(['error' => 'Credenciales incorrectas']);
        }
    } else {
        echo json_encode(['error' => 'Método no permitido']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
}
?>