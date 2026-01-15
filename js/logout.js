document.addEventListener('DOMContentLoaded', function() {
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Mostrar confirmación
            if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                return;
            }

            // Deshabilitar botón y mostrar loading
            cerrarSesionBtn.disabled = true;
            const originalText = cerrarSesionBtn.textContent;
            cerrarSesionBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cerrando sesión...';

            // Llamar al endpoint de logout
            fetch('../php/logout.php')
                .then(response => response.json())
                .then(data => {
                    if (data.ok) {
                        // Redirigir a la página de inicio
                        window.location.href = '../html/index.html';
                    } else {
                        console.error('Error en logout:', data);
                        alert('Error al cerrar sesión. Inténtalo de nuevo.');
                        // Restaurar botón
                        cerrarSesionBtn.disabled = false;
                        cerrarSesionBtn.textContent = originalText;
                    }
                })
                .catch(error => {
                    console.error('Error de conexión:', error);
                    alert('Error de conexión. Verifica tu conexión a internet.');
                    // Restaurar botón
                    cerrarSesionBtn.disabled = false;
                    cerrarSesionBtn.textContent = originalText;
                });
        });
    }
});