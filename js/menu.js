function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// Función para abrir/cerrar menú móvil
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && toggle) {
        nav.classList.toggle('active');
        const isExpanded = nav.classList.contains('active');
        toggle.setAttribute('aria-expanded', isExpanded);
    }
}

// Función para cerrar menú móvil
function closeMobileMenu() {
    const nav = document.getElementById('mainNav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (nav && toggle) {
        nav.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
    }
}

// Show inicio by default
document.addEventListener('DOMContentLoaded', function() {
    showSection('inicio');
    
    // Agregar evento al botón del menú hamburguesa
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        const nav = document.getElementById('mainNav');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (nav && toggle && nav.classList.contains('active')) {
            if (!nav.contains(e.target) && !toggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
});