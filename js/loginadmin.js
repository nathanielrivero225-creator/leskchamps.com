window.addEventListener('load', function() {
    const formulario = document.querySelector('form');

    if (!formulario) {
        console.error('Formulario de login no encontrado');
        return;
    }

    const mensajeDiv = document.getElementById("mensaje");
    const btnSubmit = formulario.querySelector('button');
    const btnText = btnSubmit ? btnSubmit.querySelector('.btn-text') : null;
    const btnLoading = btnSubmit ? btnSubmit.querySelector('.btn-loading') : null;

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo = 'error') {
        if (mensajeDiv) {
            mensajeDiv.textContent = mensaje;
            mensajeDiv.className = `form-message ${tipo}`;
            mensajeDiv.style.display = 'block';
        }
    }

    // Función para ocultar mensaje
    function ocultarMensaje() {
        if (mensajeDiv) {
            mensajeDiv.style.display = 'none';
        }
    }

    // Función para mostrar/ocultar loading
    function setLoading(loading) {
        if (btnSubmit && btnText && btnLoading) {
            btnSubmit.disabled = loading;
            btnText.style.display = loading ? 'none' : 'inline';
            btnLoading.style.display = loading ? 'inline' : 'none';
        }
    }

    // Función para validar campos
    function validarCampos() {
        const nombreInput = document.getElementById("nombre");
        const contraInput = document.getElementById("contra");

        if (!nombreInput) {
            console.error("Campo nombre no encontrado");
            return false;
        }

        const nombre = nombreInput.value.trim();
        const contra = contraInput ? contraInput.value.trim() : '';

        if (!nombre) {
            mostrarMensaje('Por favor ingrese su nombre de usuario');
            document.getElementById("nombre").focus();
            return false;
        }

        if (!contra) {
            mostrarMensaje('Por favor ingrese su contraseña');
            document.getElementById("contra").focus();
            return false;
        }

        if (contra.length < 4) {
            mostrarMensaje('La contraseña debe tener al menos 4 caracteres');
            document.getElementById("contra").focus();
            return false;
        }

        return true;
    }

    formulario.addEventListener("submit", function(e) {
        e.preventDefault();

        // Ocultar mensaje anterior
        ocultarMensaje();

        // Validar campos
        if (!validarCampos()) {
            return;
        }

        // Mostrar loading
        setLoading(true);

        const formData = new FormData(formulario);

        fetch("../php/login.php", {
            method: "POST",
            body: new URLSearchParams(formData)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Respuesta login.php:", data);
            console.log("Datos completos recibidos:", JSON.stringify(data, null, 2));

            if (data.error === false || !data.error) {
                // Login exitoso
                mostrarMensaje('Inicio de sesión exitoso. Redirigiendo...', 'success');

                // Determinar página de destino basada en el rol
                let paginaDestino;
                const rol = data.rol || data.tipo_usuario; // Usar cualquiera que esté disponible
                
                console.log("Rol detectado:", rol);
                console.log("Tipo de usuario desde DB:", data.tipo_usuario);

                switch(rol) {
                    case 'admin':
                        paginaDestino = "../html/productos_admin.html";
                        break;
                    case 'mozo':
                        paginaDestino = "../html/panel_mozo.html";
                        break;
                    case 'cocina':
                        paginaDestino = "../html/panel_cocina.html";
                        break;
                    default:
                        // Si el usuario no es admin, mozo o cocina, mostrar error específico
                        mostrarMensaje(`Usuario con rol "${rol}" no puede acceder al sistema administrativo`, 'error');
                        console.error(`Usuario con rol "${rol}" intentó acceder al login administrativo`);
                        return;
                }

                console.log(`✅ Usuario ${rol} - Redirigiendo a: ${paginaDestino}`);
                console.log(`📁 Ruta completa: ${window.location.origin}/${paginaDestino}`);

                // Mostrar mensaje específico según el rol
                let mensajeRedireccion = '';
                switch(rol) {
                    case 'admin':
                        mensajeRedireccion = 'Accediendo al panel de administración...';
                        break;
                    case 'mozo':
                        mensajeRedireccion = 'Accediendo al panel de mozo...';
                        break;
                    case 'cocina':
                        mensajeRedireccion = 'Accediendo al panel de cocina...';
                        break;
                }
                
                mostrarMensaje(mensajeRedireccion, 'success');

                setTimeout(() => {
                    window.location.href = paginaDestino;
                }, 1500);
            } else {
                // Error de login
                console.log("Error de login:", data.error);
                mostrarMensaje(data.error, 'error');
            }
        })
        .catch(error => {
            console.error("Error en login:", error);
            mostrarMensaje('Error de conexión. Por favor intente nuevamente.', 'error');
        })
        .finally(() => {
            setLoading(false);
        });
    });

    // Limpiar mensajes cuando el usuario empiece a escribir
    const inputs = formulario.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', ocultarMensaje);
    });
});