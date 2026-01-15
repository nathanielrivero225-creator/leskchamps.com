function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        fetch('../php/eliminar.php?id=' + id)
            .then(response => {
                if (response.ok) {
                    // Recargar la página para actualizar la lista
                    window.location.reload();
                } else {
                    alert('Error al eliminar el producto.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión.');
            });
    }
}