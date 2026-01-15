document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let userData = null;

    // Función para mostrar indicador de carga
    function mostrarCarga(mostrar) {
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>Cargando Film&Food...</p>
                </div>
            `;
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
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

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo = 'info') {
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

    // Función para verificar sesión
    function verificarSesion() {
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
                userData = data;

                if (!data.exito) {
                    // Usuario no logueado
                    console.log("Usuario no logueado, redirigiendo a login");
                    mostrarMensaje("Debes iniciar sesión para acceder", "warning");
                    setTimeout(() => {
                        window.location.href = "../html/index.html";
                    }, 2000);
                    return;
                }

                if (data.rol === "admin") {
                    // Admin intentando acceder a página de cliente
                    console.log("Admin intentando acceder a página de cliente, redirigiendo");
                    mostrarMensaje("Redirigiendo al panel de administración", "info");
                    setTimeout(() => {
                        window.location.href = "../html/panel.html";
                    }, 2000);
                    return;
                }

                // Usuario cliente válido
                console.log("Usuario cliente válido, cargando página");
                inicializarPagina(data);
                mostrarCarga(false);
            })
            .catch(error => {
                console.error("Error verificando sesión:", error);
                mostrarMensaje("Error verificando sesión. Redirigiendo...", "error");
                mostrarCarga(false);
                setTimeout(() => {
                    window.location.href = "../html/index.html";
                }, 2000);
            });
    }

    // Función para inicializar la página
    function inicializarPagina(userData) {
        // Actualizar nombre de usuario en el header
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = userData.usuario || 'Usuario';
        }

        // Actualizar mensaje de bienvenida
        const welcomeTitle = document.getElementById('welcome-title');
        if (welcomeTitle && userData.usuario) {
            welcomeTitle.innerHTML = `<i class="fas fa-star" aria-hidden="true"></i> ¡Bienvenido ${userData.usuario}!`;
        }

        // Cargar estadísticas
        cargarEstadisticas();

        // Inicializar funcionalidades
        inicializarMenuMovil();
        inicializarUserMenu();
        inicializarNewsletter();
        inicializarAnimaciones();
    }

    // Función para cargar estadísticas
    function cargarEstadisticas() {
        // Cargar estadísticas de películas
        fetch("../php/listarPeliculas.php")
            .then(res => res.json())
            .then(data => {
                if (data.peliculas && data.peliculas.length > 0) {
                    const peliculasCount = document.getElementById('peliculasCount');
                    if (peliculasCount) {
                        peliculasCount.textContent = data.peliculas.length + '+';
                    }
                }
            })
            .catch(error => console.error("Error cargando estadísticas de películas:", error));

        // Cargar estadísticas de platos
        fetch("../php/listarPlatos.php")
            .then(res => res.json())
            .then(data => {
                if (data.platos && data.platos.length > 0) {
                    const platosCount = document.getElementById('platosCount');
                    if (platosCount) {
                        platosCount.textContent = data.platos.length + '+';
                    }
                }
            })
            .catch(error => console.error("Error cargando estadísticas de platos:", error));

        // Cargar estadísticas de mesas
        fetch("../php/listarmesas.php")
            .then(res => res.json())
            .then(data => {
                if (data.mesas && data.mesas.length > 0) {
                    const mesasCount = document.getElementById('mesasCount');
                    if (mesasCount) {
                        mesasCount.textContent = data.mesas.length + '+';
                    }
                }
            })
            .catch(error => console.error("Error cargando estadísticas de mesas:", error));
    }

    // Función para inicializar menú móvil
    function inicializarMenuMovil() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function() {
                mobileMenu.classList.toggle('active');
                this.classList.toggle('active');
            });

            // Cerrar menú al hacer click en un enlace
            const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                });
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        }
    }

    // Función para inicializar menú de usuario
    function inicializarUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');

        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', function() {
                // Aquí se podría implementar un dropdown menu
                mostrarMensaje("Funcionalidad próximamente disponible", "info");
            });
        }
    }

    // Función para inicializar newsletter
    function inicializarNewsletter() {
        const newsletterBtn = document.querySelector('.newsletter-btn');
        const newsletterInput = document.querySelector('.newsletter-input');

        if (newsletterBtn && newsletterInput) {
            newsletterBtn.addEventListener('click', function() {
                const email = newsletterInput.value.trim();

                if (!email) {
                    mostrarMensaje("Por favor ingresa tu email", "warning");
                    newsletterInput.focus();
                    return;
                }

                if (!isValidEmail(email)) {
                    mostrarMensaje("Por favor ingresa un email válido", "error");
                    newsletterInput.focus();
                    return;
                }

                // Aquí se enviaría el email al servidor
                mostrarMensaje("¡Gracias por suscribirte! Recibirás nuestras novedades pronto.", "success");
                newsletterInput.value = '';
            });

            newsletterInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    newsletterBtn.click();
                }
            });
        }
    }

    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Función para inicializar animaciones
    function inicializarAnimaciones() {
        // Animación de scroll para elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplicar animaciones a elementos
        const animatedElements = document.querySelectorAll('.servicio-card, .caracteristica-item, .testimonio-card');
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // Función para manejar logout
    function manejarLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                mostrarCarga(true);

                fetch("../php/logout.php")
                    .then(res => res.json())
                    .then(data => {
                        mostrarMensaje("Sesión cerrada correctamente", "success");
                        setTimeout(() => {
                            window.location.href = "../html/index.html";
                        }, 1500);
                    })
                    .catch(error => {
                        console.error("Error en logout:", error);
                        mostrarMensaje("Error cerrando sesión", "error");
                        mostrarCarga(false);
                    });
            });
        }
    }

    // Inicializar aplicación
    verificarSesion();
    manejarLogout();
});
