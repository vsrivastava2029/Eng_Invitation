/* ==========================================
   CONFIGURABLE EVENT DATA METRICS
   ========================================== */
const TARGET_WEDDING_DATE = new Date("Oct 16, 2026 16:00:00").getTime();

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       A. BACKGROUND PARTICLES (FLOWERS & HEARTS RAIN)
       ========================================== */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particlesArray = [];

    function resizeCanvas() {
        if (!canvas) return;
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
            this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
            this.y = Math.random() * (canvas ? canvas.height : window.innerHeight) - (canvas ? canvas.height : window.innerHeight);
            // 45% Hearts, 40% Flowers/Petals, 15% Gold Dust
            const rand = Math.random();
            this.type = rand < 0.45 ? 'heart' : (rand < 0.85 ? 'flower' : 'dust');
            this.size = this.type === 'heart' ? Math.random() * 8 + 6 : (this.type === 'flower' ? Math.random() * 6 + 4 : Math.random() * 3 + 1.5);
            this.speedY = Math.random() * 0.9 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.rotation = Math.random() * 360;
            this.rotSpeed = Math.random() * 2 - 1;
            
            if (this.type === 'heart') {
                this.color = Math.random() > 0.5 ? '#E63946' : '#FFD700';
            } else if (this.type === 'flower') {
                this.color = Math.random() > 0.4 ? '#FFB300' : (Math.random() > 0.5 ? '#E65100' : '#E63946');
            } else {
                this.color = Math.random() > 0.5 ? '#FFD700' : '#FFF8E7';
            }
            this.opacity = Math.random() * 0.6 + 0.35;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
            this.rotation += this.rotSpeed;
            if (canvas && this.y > canvas.height) {
                this.reset();
                this.y = -10;
            }
        }
        draw() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);

            if (this.type === 'heart') {
                // Draw Heart Shape
                ctx.beginPath();
                const s = this.size;
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s * 0.5, -s * 0.4, -s, s * 0.3, 0, s);
                ctx.bezierCurveTo(s, s * 0.3, s * 0.5, -s * 0.4, 0, s * 0.3);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 4;
                ctx.shadowColor = this.color;
                ctx.fill();
            } else if (this.type === 'flower') {
                // Draw Petal / Flower
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-this.size, -this.size, -this.size, this.size, 0, this.size * 1.5);
                ctx.bezierCurveTo(this.size, this.size, this.size, -this.size, 0, 0);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else {
                // Draw Dust Star
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = '#FFD700';
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function initParticles() {
        if (!canvas) return;
        particlesArray = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 15), 60);
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    /* ==========================================
       B. ROYAL DHARMIK THEME SWITCHER
       ========================================== */
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeMenu = document.getElementById('themeMenu');
    
    if (themeToggleBtn && themeMenu) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => themeMenu.classList.remove('active'));

        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedTheme = btn.getAttribute('data-theme');
                document.body.className = '';
                if (selectedTheme !== 'chandan') {
                    document.body.classList.add('theme-' + selectedTheme);
                }
                themeMenu.classList.remove('active');
            });
        });
    }


    /* ==========================================
       C. MUSIC SYSTEM & VISIBILITY CONTROLLER
       ========================================== */
    const music = document.getElementById('ambientMusic');
    const musicToggle = document.getElementById('musicToggle');
    let wasPlayingBeforeHidden = false;
    let userHasOpenedInvitation = false;
    
    function toggleAudio() {
        if (!music) return;
        if (music.paused) {
            music.play().then(() => {
                if (musicToggle) {
                    musicToggle.classList.add('playing');
                }
            }).catch(e => console.log("Playback interaction lock active:", e));
        } else {
            music.pause();
            if (musicToggle) {
                musicToggle.classList.remove('playing');
            }
        }
    }
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleAudio);
    }

    function handleVisibilityLoss() {
        if (music && !music.paused) {
            wasPlayingBeforeHidden = true;
            music.pause();
            if (musicToggle) {
                musicToggle.classList.remove('playing');
            }
        }
    }

    function handleVisibilityGain() {
        if (wasPlayingBeforeHidden && music && userHasOpenedInvitation) {
            music.play().then(() => {
                if (musicToggle) {
                    musicToggle.classList.add('playing');
                }
            }).catch(e => console.log("Auto-resume note:", e));
            wasPlayingBeforeHidden = false;
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) handleVisibilityLoss();
        else handleVisibilityGain();
    });

    window.addEventListener('pagehide', handleVisibilityLoss);
    window.addEventListener('blur', handleVisibilityLoss);
    window.addEventListener('focus', handleVisibilityGain);


    /* ==========================================
       D. WORKFLOW & ENVELOPE INTERACTION
       ========================================== */
    const heroLayer = document.getElementById('heroLayer');
    const openInviteBtn = document.getElementById('openInviteBtn');
    const envelopeLayer = document.getElementById('envelopeLayer');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const mainContent = document.getElementById('mainContent');

    if (openInviteBtn) {
        openInviteBtn.addEventListener('click', () => {
            userHasOpenedInvitation = true;
            heroLayer.classList.add('slide-up');
            
            if (music) {
                music.play().then(() => {
                    if (musicToggle) {
                        musicToggle.style.display = 'inline-flex';
                        musicToggle.classList.add('playing');
                    }
                }).catch(e => {
                    console.log("Audio playback note:", e);
                    if (musicToggle) musicToggle.style.display = 'inline-flex';
                });
            }
            
            setTimeout(() => {
                heroLayer.style.display = 'none';
                envelopeLayer.style.display = 'flex';
            }, 1000);
        });
    }

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', function() {
            this.classList.add('open');
            
            setTimeout(() => {
                envelopeLayer.style.transition = "opacity 0.5s ease";
                envelopeLayer.style.opacity = "0";
                setTimeout(() => {
                    envelopeLayer.style.display = 'none';
                    mainContent.style.display = 'block';
                    initScratchCard();
                    initScrollAnimations();
                }, 500);
            }, 1500);
        });
    }


    /* ==========================================
       E. INTERACTIVE SCRATCH CARD REVEAL MECHANISM
       ========================================== */
    function initScratchCard() {
        const scratchCanvas = document.getElementById('scratchCanvas');
        if (!scratchCanvas) return;
        const sCtx = scratchCanvas.getContext('2d');
        let isDrawing = false;

        const dpr = window.devicePixelRatio || 1;
        const width = 300;
        const height = 300;
        scratchCanvas.width = width * dpr;
        scratchCanvas.height = height * dpr;
        sCtx.scale(dpr, dpr);

        let gradient = sCtx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#E65100');
        gradient.addColorStop(0.5, '#FFF8E7');
        gradient.addColorStop(1, '#FFB300');
        sCtx.fillStyle = gradient;
        sCtx.fillRect(0, 0, width, height);

        sCtx.fillStyle = '#4A1900';
        sCtx.font = 'bold 13px Montserrat, sans-serif';
        sCtx.textAlign = 'center';
        sCtx.fillText('SCRATCH WITH MOUSE OR FINGER', 150, 140);
        sCtx.fillText('TO REVEAL THE DATE ✨', 150, 165);

        function scratch(e) {
            if (!isDrawing) return;
            e.preventDefault();
            
            const rect = scratchCanvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            sCtx.globalCompositeOperation = 'destination-out';
            sCtx.beginPath();
            sCtx.arc(x, y, 25, 0, Math.PI * 2);
            sCtx.fill();
            
            checkScratchPercentage();
        }

        scratchCanvas.addEventListener('mousedown', () => isDrawing = true);
        scratchCanvas.addEventListener('touchstart', () => isDrawing = true);
        
        window.addEventListener('mouseup', () => isDrawing = false);
        window.addEventListener('touchend', () => isDrawing = false);
        
        scratchCanvas.addEventListener('mousemove', scratch);
        scratchCanvas.addEventListener('touchmove', scratch);

        function checkScratchPercentage() {
            const imgData = sCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
            let clearedPixels = 0;
            for (let i = 3; i < imgData.data.length; i += 4) {
                if (imgData.data[i] === 0) clearedPixels++;
            }
            let percent = (clearedPixels / (imgData.width * imgData.height)) * 100;
            if (percent > 40) {
                scratchCanvas.style.transition = 'opacity 0.6s ease';
                scratchCanvas.style.opacity = 0;
                setTimeout(() => scratchCanvas.remove(), 600);
            }
        }
    }


    /* ==========================================
       F. CHRONO COUNTDOWN CLOCK CONTROLLER
       ========================================== */
    function updateCountdownClock() {
        const now = new Date().getTime();
        const difference = TARGET_WEDDING_DATE - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const secsEl = document.getElementById('seconds');

        if (!daysEl) return;

        if (difference < 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minsEl.innerText = "00";
            secsEl.innerText = "00";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.innerText = d < 10 ? '0' + d : d;
        hoursEl.innerText = h < 10 ? '0' + h : h;
        minsEl.innerText = m < 10 ? '0' + m : m;
        secsEl.innerText = s < 10 ? '0' + s : s;
    }
    setInterval(updateCountdownClock, 1000);
    updateCountdownClock();


    /* ==========================================
       G. CAROUSEL PHOTO GALLERY SYSTEM
       ========================================== */
    const track = document.getElementById('sliderTrack');
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('nextSlide');
        const prevBtn = document.getElementById('prevSlide');
        const pausePlayBtn = document.getElementById('sliderPausePlayBtn');
        const pausePlayIcon = document.getElementById('pausePlayIcon');
        
        let currentSlideIndex = 0;
        let autoSlideTimer; 
        let isSliderPlaying = true;

        function moveSliderToIndex(idx) {
            track.style.transform = 'translateX(-' + (idx * 100) + '%)';
            currentSlideIndex = idx;
        }

        function showNextSlide() {
            let nextIndex = (currentSlideIndex + 1) % slides.length;
            moveSliderToIndex(nextIndex);
        }

        function showPrevSlide() {
            let prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            moveSliderToIndex(prevIndex);
        }

        function startAutoSlide() {
            if (isSliderPlaying) {
                autoSlideTimer = setInterval(showNextSlide, 3500); 
            }
        }

        function stopAutoSlide() {
            clearInterval(autoSlideTimer);
        }

        function resetAutoSlide() {
            stopAutoSlide();
            if (isSliderPlaying) {
                startAutoSlide();
            }
        }

        if (pausePlayBtn) {
            pausePlayBtn.addEventListener('click', () => {
                if (isSliderPlaying) {
                    stopAutoSlide();
                    isSliderPlaying = false;
                    pausePlayIcon.className = 'fas fa-play';
                } else {
                    isSliderPlaying = true;
                    startAutoSlide();
                    pausePlayIcon.className = 'fas fa-pause';
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showNextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showPrevSlide();
                resetAutoSlide();
            });
        }

        let touchStartX = 0;
        let touchEndX = 0;
        const sliderWindow = document.getElementById('gallerySlider');

        if (sliderWindow) {
            sliderWindow.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});

            sliderWindow.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    showNextSlide(); 
                    resetAutoSlide();
                }
                if (touchEndX - touchStartX > 50) {
                    showPrevSlide(); 
                    resetAutoSlide();
                }
            }, {passive: true});
        }

        startAutoSlide();
    }


    /* ==========================================
       H. SCROLL REVEAL ANIMATIONS
       ========================================== */
    function initScrollAnimations() {
        const cards = document.querySelectorAll('.section-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        cards.forEach(card => observer.observe(card));
    }


    /* ==========================================
       I. CALENDAR SHORTCUT LINK
       ========================================== */
    const calendarBtn = document.getElementById('addToCalendar');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            const title = encodeURIComponent("Vikash & Swatika Engagement Ceremony");
            const details = encodeURIComponent("Join us in celebrating the engagement of Vikash & Swatika!");
            const location = encodeURIComponent("The Grand Imperial Palace, Palace Road, Bengaluru");
            const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261016T103000Z/20261016T160000Z&details=${details}&location=${location}`;
            window.open(googleCalUrl, '_blank');
        });
    }
});
