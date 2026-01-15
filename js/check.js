document.addEventListener("DOMContentLoaded", () => {
    // Función para mostrar indicador de carga
    function mostrarCarga(mostrar) {
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>Verificando sesión...</p>
                </div>
            `;
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
                font-family: 'Segoe UI', sans-serif;
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = mostrar ? 'flex' : 'none';
    }

    // Mostrar carga inicial
    mostrarCarga(true);

    fetch("../php/check.php")
        .then(res => {
            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log("Estado de sesión:", data);

            const path = window.location.pathname;
            const paginaActual = path.split("/").pop(); // obtiene solo el nombre del archivo

            // Definir páginas públicas y protegidas
            const paginasPublicas = ["index.html", "admin_login.html", "registro.html"];
            const paginasProtegidas = ["inicio.html", "panel.html", "peliculas.html", "menu.html", "reservas.html", "usuarios_admin.html", "platos_admin.html", "peliculas_admin.html", "mesas_reservas_admin.html", "reportes_admin.html"];

            const esPublica = paginasPublicas.includes(paginaActual);
            const esProtegida = paginasProtegidas.includes(paginaActual);

            console.log(`Página actual: ${paginaActual}, Es pública: ${esPublica}, Es protegida: ${esProtegida}`);

            // Si el usuario está logueado y está en páginas públicas de login, redirigir según rol
            if ((paginaActual === "index.html" || paginaActual === "admin_login.html" || paginaActual === "registro.html") && data.exito) {
                console.log("Usuario logueado en index.html, redirigiendo según rol");
                mostrarMensajeTemporal("Ya estás logueado. Redirigiendo...", "info");
                setTimeout(() => {
                    if (data.rol === "admin") {
                        window.location.href = "../html/panel.html";
                    } else {
                        window.location.href = "../html/inicio.html";
                    }
                }, 2000);
                return;
            }

            // Si el usuario NO está logueado y está en una página protegida, redirigir
            if (!data.exito && esProtegida) {
                console.log("Usuario no logueado intentando acceder a página protegida, redirigiendo");
                mostrarMensajeTemporal("Debes iniciar sesión para acceder a esta página", "warning");
                setTimeout(() => {
                    window.location.href = "../html/index.html";
                }, 2000);
                return;
            }

            // Si el usuario está logueado como cliente pero intenta acceder a panel admin
            if (data.exito && data.rol !== "admin" && paginaActual === "panel.html") {
                console.log("Cliente intentando acceder a panel admin, redirigiendo");
                mostrarMensajeTemporal("Acceso denegado. Redirigiendo...", "error");
                setTimeout(() => {
                    window.location.href = "../html/inicio.html";
                }, 2000);
                return;
            }

            // Si el usuario está logueado como admin pero está en páginas de cliente
            if (data.exito && data.rol === "admin" && (paginaActual === "inicio.html" || paginaActual === "peliculas.html" || paginaActual === "menu.html")) {
                console.log("Admin en página de cliente, podría redirigir al panel si es necesario");
                // Por ahora permitir que el admin navegue, pero podríamos agregar una notificación
            }

            // Si está en una página pública o ya está en el lugar correcto, continuar normalmente
            console.log("Verificación completada, continuando normalmente");
            mostrarCarga(false);
        })
        .catch(error => {
            console.error("Error verificando sesión:", error);

            // En caso de error, asumir que no está logueado y redirigir si está en página protegida
            const path = window.location.pathname;
            const paginaActual = path.split("/").pop();
            const paginasProtegidas = ["inicio.html", "panel.html", "peliculas.html", "menu.html", "reservas.html"];

            if (paginasProtegidas.includes(paginaActual)) {
                console.log("Error de verificación en página protegida, redirigiendo a login");
                mostrarMensajeTemporal("Error verificando sesión. Redirigiendo...", "error");
                setTimeout(() => {
                    window.location.href = "../html/index.html";
                }, 2000);
            } else {
                mostrarMensajeTemporal("Error verificando sesión. Continuando como invitado.", "warning");
                mostrarCarga(false);
            }
        });
});

// Función para mostrar mensajes temporales
function mostrarMensajeTemporal(mensaje, tipo = 'info') {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-temporal ${tipo}`;
    mensajeDiv.textContent = mensaje;
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        max-width: 90%;
        text-align: center;
        animation: slideDown 0.3s ease-out;
    `;

    // Colores según tipo
    const colores = {
        'success': '#27ae60',
        'error': '#e74c3c',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    mensajeDiv.style.backgroundColor = colores[tipo] || colores.info;

    document.body.appendChild(mensajeDiv);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (mensajeDiv.parentNode) {
            mensajeDiv.parentNode.removeChild(mensajeDiv);
        }
    }, 3000);
}

