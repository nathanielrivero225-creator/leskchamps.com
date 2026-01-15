<?php
include 'conexion.php';

$stmt = $con->query("SELECT * FROM productos ORDER BY tipo");
$productos = $stmt->fetchAll();

$isAdmin = strpos($_SERVER['SCRIPT_NAME'], 'productos_admin.html') !== false;

$currentTipo = '';

foreach ($productos as $producto) {
    if (!$isAdmin && $producto['tipo'] !== $currentTipo) {
        if ($currentTipo !== '') {
            echo "</div></section>";
        }
        $currentTipo = $producto['tipo'];
        $tipoLabel = ucfirst($producto['tipo']);
        echo "<section class='productos-section'>";
        echo "<h2>$tipoLabel</h2>";
        echo "<div class='productos-grid'>";
    } elseif ($isAdmin && $currentTipo === '') {
        $currentTipo = 'admin';
        echo "<div class='productos-grid'>";
    }

    echo "<div class='producto' style='background: #faf9f6; border-radius: 15px; padding: 1.5rem; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease; border: 1px solid #e0e0e0;' onmouseover='this.style.transform=\"translateY(-5px)\"; this.style.boxShadow=\"0 10px 25px rgba(0,0,0,0.15)\"' onmouseout='this.style.transform=\"translateY(0)\"; this.style.boxShadow=\"0 5px 15px rgba(0,0,0,0.1)\"'>";
    if ($producto['imagen_url']) {
        echo "<img src='/CRUD/" . htmlspecialchars($producto['imagen_url']) . "' alt='Imagen del producto' style='width:100%; height:200px; object-fit:cover; border-radius: 10px; margin-bottom: 1rem;'>";
    } else {
        echo "<div style='width:100%; height:200px; background: #f8f9fa; border-radius: 10px; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; color: #7f8c8d;'>Sin imagen</div>";
    }
    echo "<h3 style='color: #2c3e50; margin-bottom: 0.5rem; font-size: 1.2rem;'>" . htmlspecialchars($producto['nombre']) . "</h3>";
    echo "<p style='color: #7f8c8d; margin-bottom: 1rem; font-size: 0.9rem; line-height: 1.4;'>" . htmlspecialchars($producto['descripcion']) . "</p>";
    echo "<p style='color: #e74c3c; font-weight: bold; font-size: 1.1rem; margin-bottom: 1rem;'>Precio: $" . htmlspecialchars($producto['precio']) . "</p>";
    if ($isAdmin) {
        echo "<div class='producto-actions'>";
        $destacado = $producto['destacado'] ?? 0;
        $icon = $destacado ? '✅' : '⬜';
        echo "<a href='../php/toggleDestacado.php?id=" . $producto['id'] . "' class='btn-destacar' title='Toggle Destacado' style='margin-right: 0.5rem;'>$icon</a>";
        echo "<a href='../php/editarProducto.php?id=" . $producto['id'] . "' class='btn-editar'>Editar</a>";
        echo "<button onclick='eliminarProducto(" . $producto['id'] . ")' class='btn-eliminar'>Eliminar</button>";
        echo "</div>";
    } else {
        echo "<div class='producto-actions'>";
        echo "<button onclick='addToCart(" . $producto['id'] . ", \"" . addslashes($producto['nombre']) . "\", " . $producto['precio'] . ")' class='btn-agregar-carrito' style='background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 25px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);'>🛒 Añadir al Carrito</button>";
        echo "</div>";
    }
    echo "</div>";
}

if (!$isAdmin && $currentTipo !== '') {
    echo "</div></section>";
} elseif ($isAdmin) {
    echo "</div>";
}
?>