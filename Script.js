// Background animation with 2D Canvas - Universe Aesthetic
const canvas = document.getElementById('background-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let shootingStars = [];
const config = {
    starCount: 580,
    speed: 0.05,
    parallaxFactor: 0.05
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

function initStars() {
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1 + 0.1,
            vx: (Math.random() - 0.5) * config.speed,
            vy: (Math.random() - 0.5) * config.speed,
            opacity: Math.random(),
            pulse: Math.random() * 0.02 + 0.005
        });
    }
}

function createShootingStar() {
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // roughly 45 degrees
    const speed = 1 + Math.random() * 10;
    shootingStars.push({
        x: Math.random() * canvas.width * 1.5 - canvas.width * 0.5,
        y: -50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 150 + Math.random() * 100,
        opacity: 1
    });
}

// Trigger shooting star roughly every 3 seconds
setInterval(createShootingStar, 3000);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        // Movement
        star.x += star.vx;
        star.y += star.vy;

        // Screen Wrap
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Pulse Opacity
        star.opacity += star.pulse;
        if (star.opacity > 1 || star.opacity < 0) star.pulse = -star.pulse;

        // Draw
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.opacity) * 0.8})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'white';
        ctx.fill();
    });

    // Shooting Stars
    shootingStars.forEach((s, index) => {
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= 0.01;

        if (s.opacity <= 0 || s.y > canvas.height + s.len || s.x > canvas.width + s.len) {
            shootingStars.splice(index, 1);
            return;
        }

        const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
        grad.addColorStop(0, `rgba(189, 0, 255, ${s.opacity})`); // Purple
        grad.addColorStop(1, 'rgba(0, 255, 255, 0)');           // Blue/Cyan fade

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 5, s.y - s.vy * 5); // Length of the streak head
        ctx.stroke();
    });

    requestAnimationFrame(animate);
}

function init() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();
}

// Smooth scrolling & Mobile Menu Close
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        // Skip if it's just a hash
        if (targetId === '#' || !targetId.startsWith('#')) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();

            // If it's a mobile nav link, close the menu first
            if (this.closest('.nav-links')) {
                toggleMobileMenu(false);
            }

            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Fade in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Hero animations
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBtns = document.querySelector('.hero-btns');

    gsap.to(heroContent, { opacity: 1, y: 0, duration: 1, delay: 0.5 });
    gsap.to(heroTitle, { opacity: 1, y: 0, duration: 1, delay: 0.8 });
    gsap.to(heroSubtitle, { opacity: 1, y: 0, duration: 1, delay: 1.1 });
    gsap.to(heroBtns, { opacity: 1, y: 0, duration: 1, delay: 1.4 });

    init(); // Initialize background
});

function openModal(src) {
    const modal = document.getElementById("certModal");
    const modalImg = document.getElementById("modalImg");
    const caption = document.getElementById("caption");

    modalImg.src = src;
    modal.style.display = "flex";

    // Use setTimeout to ensure display: flex is applied before adding class for transition
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Stop body scroll
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById("certModal");
    modal.classList.remove('active');

    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = 'auto';
    }, 400);
}

// Close modal when clicking outside the image
window.onclick = function (event) {
    const modal = document.getElementById("certModal");
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

// Hamburger Menu Logic
const hamburger = document.getElementById('hamburger');
const closeNav = document.getElementById('closeNav');
const navOverlay = document.getElementById('navOverlay');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

function toggleMobileMenu(open) {
    if (open) {
        if (hamburger) hamburger.classList.add('active');
        if (navLinks) navLinks.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('active');
        toggleMobileMenu(!isOpen);
    });
}

if (closeNav) {
    closeNav.addEventListener('click', () => toggleMobileMenu(false));
}

if (navOverlay) {
    navOverlay.addEventListener('click', () => toggleMobileMenu(false));
}