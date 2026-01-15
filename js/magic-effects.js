// Efectos mágicos para la página (optimizados)
document.addEventListener('DOMContentLoaded', function() {
    createMagicParticles();
    addScrollAnimations();
    // Cursor effects removidos para mejor rendimiento
});

// Crear partículas mágicas flotantes (reducidas)
function createMagicParticles() {
    const container = document.getElementById('magicParticles');
    if (!container) return;

    const particleCount = 15; // Reducido de 50 a 15
    const colors = [
        'rgba(102, 126, 234, 0.6)',
        'rgba(118, 75, 162, 0.6)',
        'rgba(52, 152, 219, 0.6)',
        'rgba(255, 255, 255, 0.4)'
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 15 + 15;
        const delay = Math.random() * 5;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.left = startX + '%';
        particle.style.top = startY + '%';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

        container.appendChild(particle);
    }
}

// Animaciones al hacer scroll
function addScrollAnimations() {
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

    // Observar todos los elementos con clase magic-card
    document.querySelectorAll('.magic-card').forEach(card => {
        observer.observe(card);
    });
}

// Efectos pesados removidos para mejor rendimiento

