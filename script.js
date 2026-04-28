// --- Background Music ---
let isMuted = false;
let hasInteracted = false;
let audio;

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    
    const hideLoader = () => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
    };

    window.addEventListener('load', () => setTimeout(hideLoader, 1500));
    setTimeout(hideLoader, 5000);

    // --- HTML5 Audio Setup ---
    audio = document.getElementById('bg-audio');
    audio.volume = 0.25;

    const muteBtn = document.getElementById('mute-toggle');
    const visualizer = document.getElementById('visualizer');
    const lyricsToggle = document.getElementById('lyrics-toggle');
    const lyricsOverlay = document.getElementById('lyrics-overlay');
    const closeLyrics = document.getElementById('close-lyrics');

    if (lyricsToggle) {
        lyricsToggle.addEventListener('click', () => {
            lyricsOverlay.classList.toggle('open');
        });
    }

    if (closeLyrics) {
        closeLyrics.addEventListener('click', () => {
            lyricsOverlay.classList.remove('open');
        });
    }

    const startMusic = () => {
        if (!hasInteracted) {
            audio.play().then(() => {
                visualizer.classList.remove('paused');
                hasInteracted = true;
                ['click', 'keydown', 'scroll', 'touchstart'].forEach(type => {
                    document.removeEventListener(type, startMusic);
                });
            }).catch(err => console.log('Audio play failed:', err));
        }
    };

    ['click', 'keydown', 'scroll', 'touchstart'].forEach(type => {
        document.addEventListener(type, startMusic);
    });

    // Link CTAs to music start too
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', startMusic);
    });

    muteBtn.addEventListener('click', () => {
        if (isMuted) {
            audio.muted = false;
            muteBtn.innerHTML = '<i data-lucide="volume-2"></i>';
            visualizer.classList.remove('paused');
        } else {
            audio.muted = true;
            muteBtn.innerHTML = '<i data-lucide="volume-x"></i>';
            visualizer.classList.add('paused');
        }
        isMuted = !isMuted;
        lucide.createIcons();
    });

    // --- Particle System (Smoke Effect) ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 150 + 50;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.15;
            this.color = Math.random() > 0.5 ? 'rgba(255, 59, 59, 0.05)' : 'rgba(20, 20, 20, 0.2)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < -this.size || this.x > canvas.width + this.size ||
                this.y < -this.size || this.y > canvas.height + this.size) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 30; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // --- Scroll Reveal ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-scroll]').forEach(el => observer.observe(el));

    // --- Tilt Effect ---
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // --- Mobile Menu ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('loading'); // Reuse loading to lock scroll
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('loading');
        });
    });

    // --- Active Link Tracking ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
});
