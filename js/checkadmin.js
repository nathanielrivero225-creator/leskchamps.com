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
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
                font-family: Arial, sans-serif;
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
            const paginaActual = path.split("/").pop(); // ej: "admin.html"

            // Páginas de login administrativo - permitir acceso
            const esPaginaLogin = paginaActual === "admin_login.html" || paginaActual === "admin.html";
            
            // Páginas específicas para mozo y cocina (únicas páginas permitidas para estos roles)
            const esPaginaMozo = paginaActual === "panel_mozo.html";
            const esPaginaCocina = paginaActual === "panel_cocina.html";
            
            console.log(`Página actual: ${paginaActual}`);
            console.log(`Rol del usuario: ${data.rol || 'No logueado'}`);
            
            // Verificar autenticación primero
            if (!data.exito) {
                // Usuario no logueado
                if (!esPaginaLogin) {
                    console.log("Usuario no logueado, redirigiendo a login administrativo");
                    mostrarMensajeTemporal("Debe iniciar sesión para acceder. Redirigiendo...", "info");
                    setTimeout(() => {
                        window.location.href = "../html/admin_login.html";
                    }, 2000);
                    return;
                } else {
                    mostrarCarga(false);
                    return;
                }
            }

            // Usuario logueado - verificar permisos
            if (data.rol === "admin") {
                // Admin tiene acceso completo
                console.log("Admin logueado - acceso completo");
                mostrarCarga(false);
                return;
            }

            // Restricciones para mozo y cocina - SOLO pueden estar en sus paneles específicos
            if (data.rol === "mozo") {
                if (esPaginaMozo) {
                    console.log("Mozo accediendo a su panel - Permitido");
                    mostrarCarga(false);
                } else {
                    // Cualquier otra página - redirigir al panel de mozo
                    console.log("Mozo intentando acceder a página no permitida, redirigiendo a panel_mozo.html");
                    mostrarMensajeTemporal("Personal de mozo solo puede acceder a su panel. Redirigiendo...", "warning");
                    setTimeout(() => {
                        window.location.href = "../html/panel_mozo.html";
                    }, 2000);
                }
                return;
            }

            if (data.rol === "cocina") {
                if (esPaginaCocina) {
                    console.log("Cocina accediendo a su panel - Permitido");
                    mostrarCarga(false);
                } else {
                    // Cualquier otra página - redirigir al panel de cocina
                    console.log("Cocina intentando acceder a página no permitida, redirigiendo a panel_cocina.html");
                    mostrarMensajeTemporal("Personal de cocina solo puede acceder a su panel. Redirigiendo...", "warning");
                    setTimeout(() => {
                        window.location.href = "../html/panel_cocina.html";
                    }, 2000);
                }
                return;
            }

            if (data.rol === "cliente") {
                // Cliente intenta acceder a página con checkadmin (probablemente por error)
                // Redirigir al inicio
                console.log("Cliente intentando acceder a página administrativa, redirigiendo al inicio");
                mostrarMensajeTemporal("Acceso no autorizado para clientes. Redirigiendo...", "warning");
                setTimeout(() => {
                    window.location.href = "../html/inicio.html";
                }, 2000);
                return;
            }

            // Rol desconocido - redirigir al inicio por seguridad
            console.log(`Rol desconocido '${data.rol}', redirigiendo al inicio por seguridad`);
            mostrarMensajeTemporal("Rol no reconocido. Redirigiendo al inicio...", "error");
            setTimeout(() => {
                window.location.href = "../html/inicio.html";
            }, 2000);
        })
        .catch(error => {
            console.error("Error verificando sesión:", error);
            mostrarMensajeTemporal("Error verificando sesión. Por favor recarga la página.", "error");
            mostrarCarga(false);
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
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        max-width: 400px;
        text-align: center;
    `;

    // Colores según tipo
    const colores = {
        'success': '#4CAF50',
        'error': '#f44336',
        'warning': '#ff9800',
        'info': '#2196F3'
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
