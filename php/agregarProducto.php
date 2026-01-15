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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $precio = $_POST['precio'];
    $tipo = $_POST['tipo'];
    $destacado = $_POST['destacado'] ?? 0;

    $imagen_url = '';

    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
        $allowed = ['jpg', 'jpeg'];
        $filename = $_FILES['imagen']['name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        if (in_array($ext, $allowed)) {
            $newname = uniqid() . '.' . $ext;
            $destination = '../img/' . $newname;

            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $destination)) {
                $imagen_url = 'img/' . $newname;
            } else {
                echo "Error al subir la imagen.";
                exit;
            }
        } else {
            echo "Solo se permiten archivos JPG.";
            exit;
        }
    }

    $stmt = $con->prepare("INSERT INTO productos (nombre, descripcion, precio, tipo, imagen_url, destacado) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $descripcion, $precio, $tipo, $imagen_url, $destacado]);

    // Redirigir de vuelta al panel de admin después de agregar
    header('Location: ../html/productos_admin.html?success=1');
    exit;
} else {
?>
<form method="POST" enctype="multipart/form-data" class="form-agregar">
    <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" name="nombre" required>
    </div>
    <div class="form-group">
        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" name="descripcion" required></textarea>
    </div>
    <div class="form-group">
        <label for="precio">Precio:</label>
        <input type="number" id="precio" step="0.01" name="precio" required>
    </div>
    <div class="form-group">
        <label for="tipo">Tipo:</label>
        <select id="tipo" name="tipo" required>
            <option value="championes">Championes</option>
            <option value="perfumes">Perfumes</option>
            <option value="remeras">Remeras</option>
            <option value="short">Short</option>
            <option value="conjuntos">Conjuntos</option>
        </select>
    </div>
    <div class="form-group">
        <label for="imagen">Imagen (JPG):</label>
        <input type="file" id="imagen" name="imagen" accept=".jpg,.jpeg" required>
    </div>
    <div class="form-group">
        <label for="destacado">Destacado:</label>
        <input type="checkbox" id="destacado" name="destacado" value="1">
    </div>
    <button type="submit" class="btn-agregar">Agregar Producto</button>
</form>
<?php
}
?>