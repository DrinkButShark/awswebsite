// Particle Background Animation
class Particle {
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        
        // Random shape selection - equal probability for all shapes
        const shapes = ['circle', 'square', 'triangle', 'diamond', 'star'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        this.element.className = `particle ${shape}`;
        
        // Size variation
        this.size = Math.random() * 20 + 20; // 20-40px range
        
        // Initial position - start from top
        this.x = Math.random() * 100;
        this.y = -10; // Start above viewport
        
        // Snowfall physics
        this.speedX = (Math.random() - 0.5) * 0.5; // Gentle horizontal drift
        this.speedY = Math.random() * 0.5 + 0.5; // Consistent downward movement
        this.amplitude = Math.random() * 2 + 1; // Swaying amplitude
        this.step = Math.random() * Math.PI * 2; // Random starting phase
        
        // Set particle color based on theme
        const isLight = document.body.classList.contains('light');
        this.element.style.backgroundColor = isLight ? 'rgba(255, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        
        // Random rotation for certain shapes
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 4;

        this.element.style.cssText = `
            width: ${this.size}px;
            height: ${this.size}px;
            left: ${this.x}%;
            top: ${this.y}%;
            transform: rotate(${this.rotation}deg);
        `;

        this.container.appendChild(this.element);
    }

    move() {
        // Update step for swaying motion
        this.step += 0.02;
        
        // Calculate swaying motion
        this.x += this.speedX + Math.sin(this.step) * 0.1 * this.amplitude;
        this.y += this.speedY;
        this.rotation = Math.sin(this.step) * 15; // Gentle rotation

        // Reset particle when it goes off screen
        if (this.y >= 110) {
            this.y = -10;
            this.x = Math.random() * 100;
        }
        // Wrap around horizontally
        if (this.x < -10) this.x = 110;
        if (this.x > 110) this.x = -10;

        this.element.style.transform = `translate(${this.x}%, ${this.y}%) rotate(${this.rotation}deg)`;
    }
}

class ParticleLine {
    constructor(container, particle1, particle2) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = 'particle-line';
        this.particle1 = particle1;
        this.particle2 = particle2;
        this.container.appendChild(this.element);
    }

    update() {
        const x1 = this.particle1.x;
        const y1 = this.particle1.y;
        const x2 = this.particle2.x;
        const y2 = this.particle2.y;

        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        if (distance > 15) { // Reduced connection distance for fewer lines
            this.element.style.opacity = '0';
            return;
        }

        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        this.element.style.cssText = `
            width: ${distance}%;
            left: ${x1}%;
            top: ${y1}%;
            transform: rotate(${angle}deg);
            transform-origin: left center;
            opacity: ${0.15 * (1 - distance / 15)};
        `;
    }
}

function initParticles() {
    const container = document.getElementById('particles-bg');
    if (!container) return;

    // Clear any existing particles
    container.innerHTML = '';

    const particles = [];
    const lines = [];
    const numParticles = 50; // Set to 50 particles

    // Create particles
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(container));
    }

    // Create lines between particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            lines.push(new ParticleLine(container, particles[i], particles[j]));
        }
    }

    // Animation loop
    function animate() {
        particles.forEach(particle => particle.move());
        lines.forEach(line => line.update());
        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        initParticles(); // Reinitialize on resize
    });
}

function showTab(id) {
    document.querySelectorAll('main section').forEach(s => {
        if (s.id === id) {
            s.style.opacity = '0';
            s.classList.add('active');
            setTimeout(() => s.style.opacity = '1', 50);
        } else {
            s.classList.remove('active');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = Array.from(document.querySelectorAll('.nav-link')).find(link =>
        link.textContent.toLowerCase().includes(id.replace('Tab','').toLowerCase())
    );
    if (activeLink) activeLink.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("light");
    const isLight = body.classList.contains("light");
    
    // Update particle colors
    document.querySelectorAll('.particle').forEach(particle => {
        particle.style.backgroundColor = isLight ? 'rgba(255, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    });

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.style.color = "var(--text-dark)"; // Always white
    });

    // Update theme icons
    const iconLg = document.getElementById("themeIcon-lg");
    iconLg.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    iconLg.style.color = isLight ? "var(--neon-blue)" : "var(--neon-cyan)";

    const icon = document.getElementById("themeIcon");
    const text = document.getElementById("themeText");
    if(icon && text) {
        icon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
        text.textContent = isLight ? "Dark Mode" : "Light Mode";
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    showTab('videosTab');
});