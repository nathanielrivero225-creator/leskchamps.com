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
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $descripcion = $_POST['descripcion'];
    $precio = $_POST['precio'];
    $tipo = $_POST['tipo'];
    $destacado = $_POST['destacado'] ?? 0;

    $stmt = $con->prepare("UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, tipo = ?, destacado = ? WHERE id = ?");
    $stmt->execute([$nombre, $descripcion, $precio, $tipo, $destacado, $id]);

    header('Location: ../html/productos_admin.html');
    exit;
} elseif (isset($_GET['id'])) {
    $id = $_GET['id'];
    $stmt = $con->prepare("SELECT * FROM productos WHERE id = ?");
    $stmt->execute([$id]);
    $producto = $stmt->fetch();

    if ($producto) {
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Producto - Tienda Online</title>
    <link rel="stylesheet" href="../css/index.css">
</head>
<body>
    <header class="header-simple">
        <div class="header-content">
            <h1>Editar Producto</h1>
            <a href="../php/logout.php">Cerrar Sesión</a>
        </div>
    </header>

    <main style="flex: 1; padding: 2rem 1rem;">
        <section class="productos-section">
            <div class="productos-grid">
                <div class="producto card-agregar">
                    <h3>Editar Producto</h3>
                    <form method="POST" class="form-agregar">
                        <input type="hidden" name="id" value="<?php echo $producto['id']; ?>">
                        <div class="form-group">
                            <label for="nombre">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" value="<?php echo htmlspecialchars($producto['nombre']); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="descripcion">Descripción:</label>
                            <textarea id="descripcion" name="descripcion" required><?php echo htmlspecialchars($producto['descripcion']); ?></textarea>
                        </div>
                        <div class="form-group">
                            <label for="precio">Precio:</label>
                            <input type="number" id="precio" step="0.01" name="precio" value="<?php echo htmlspecialchars($producto['precio']); ?>" required>
                        </div>
                        <div class="form-group">
                            <label for="tipo">Tipo:</label>
                            <select id="tipo" name="tipo" required>
                                <option value="championes" <?php if ($producto['tipo'] == 'championes') echo 'selected'; ?>>Championes</option>
                                <option value="perfumes" <?php if ($producto['tipo'] == 'perfumes') echo 'selected'; ?>>Perfumes</option>
                                <option value="remeras" <?php if ($producto['tipo'] == 'remeras') echo 'selected'; ?>>Remeras</option>
                                <option value="short" <?php if ($producto['tipo'] == 'short') echo 'selected'; ?>>Short</option>
                                <option value="conjuntos" <?php if ($producto['tipo'] == 'conjuntos') echo 'selected'; ?>>Conjuntos</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="destacado">Destacado:</label>
                            <input type="checkbox" id="destacado" name="destacado" value="1" <?php if ($producto['destacado']) echo 'checked'; ?>>
                        </div>
                        <button type="submit" class="btn-agregar">Actualizar Producto</button>
                        <a href="../html/productos_admin.html" class="btn-agregar" style="background-color: #95a5a6; text-decoration: none; display: inline-block; margin-top: 0.5rem;">Cancelar</a>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer-simple">
        <div class="footer-content">
            <p>&copy; 2024 Tienda Online. Todos los derechos reservados.</p>
        </div>
    </footer>
</body>
</html>
<?php
    } else {
        echo "Producto no encontrado.";
    }
} else {
    echo "ID no especificado.";
}
?>