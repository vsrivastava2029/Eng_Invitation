/* ==========================================
   CONFIGURABLE EVENT DATA METRICS
   ========================================== */
const TARGET_WEDDING_DATE = new Date("Oct 15, 2026 16:00:00").getTime();

// Asset & Share text configs
const SHARE_TEXT = "You are cordially invited to the engagement celebration of Vikash & Swati! Check out the digital card here: ";
const WEBSITE_URL = window.location.href;

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       A. BACKGROUND PARTICLES (GOLD DUST & FLOWERS)
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
            this.x = Math.random() * (canvas ? canvas.width : window.innerWidth);
            this.y = Math.random() * (canvas ? canvas.height : window.innerHeight) - (canvas ? canvas.height : window.innerHeight);
            this.size = Math.random() * 3.5 + 1.5;
            this.speedY = Math.random() * 0.9 + 0.4;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.color = Math.random() > 0.5 ? '#D4AF37' : '#F3E5AB'; 
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (canvas && this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#D4AF37';
            ctx.fill();
            ctx.restore();
        }
    }

    function initParticles() {
        if (!canvas) return;
        particlesArray = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 16), 55);
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
       B. MUSIC SYSTEM & VISIBILITY PAUSE CONTROLLER
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
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }
            }).catch(e => console.log("Playback interaction error:", e));
        } else {
            music.pause();
            if (musicToggle) {
                musicToggle.classList.remove('playing');
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            }
        }
    }
    if (musicToggle) {
        musicToggle.addEventListener('click', toggleAudio);
    }

    // --- AUTO-PAUSE MUSIC ON TAB SWITCH, MINIMIZE, OR WINDOW BLUR ---
    function handleVisibilityLoss() {
        if (music && !music.paused) {
            wasPlayingBeforeHidden = true;
            music.pause();
            if (musicToggle) {
                musicToggle.classList.remove('playing');
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            }
        }
    }

    function handleVisibilityGain() {
        if (wasPlayingBeforeHidden && music && userHasOpenedInvitation) {
            music.play().then(() => {
                if (musicToggle) {
                    musicToggle.classList.add('playing');
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }
            }).catch(e => console.log("Auto-resume blocked by browser policy:", e));
            wasPlayingBeforeHidden = false;
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            handleVisibilityLoss();
        } else {
            handleVisibilityGain();
        }
    });

    window.addEventListener('pagehide', handleVisibilityLoss);
    window.addEventListener('blur', handleVisibilityLoss);
    window.addEventListener('focus', handleVisibilityGain);


    /* ==========================================
       C. SEQUENTIAL WINDOW WORKFLOW INTERACTION
       ========================================== */
    const heroLayer = document.getElementById('heroLayer');
    const openInviteBtn = document.getElementById('openInviteBtn');
    const envelopeLayer = document.getElementById('envelopeLayer');
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const mainContent = document.getElementById('mainContent');

    // Step 1: Open Welcome Screen & Trigger Auto-Play
    if (openInviteBtn) {
        openInviteBtn.addEventListener('click', () => {
            userHasOpenedInvitation = true;
            heroLayer.classList.add('slide-up');
            
            if (music) {
                music.play().then(() => {
                    if (musicToggle) {
                        musicToggle.style.display = 'flex';
                        musicToggle.classList.add('playing');
                        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                    }
                }).catch(e => {
                    console.log("Audio playback note:", e);
                    if (musicToggle) musicToggle.style.display = 'flex';
                });
            }
            
            setTimeout(() => {
                heroLayer.style.display = 'none';
                envelopeLayer.style.display = 'flex';
            }, 1000);
        });
    }

    // Step 2: Open Envelope System
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
       D. INTERACTIVE SCRATCH CARD REVEAL MECHANISM
       ========================================== */
    function initScratchCard() {
        const scratchCanvas = document.getElementById('scratchCanvas');
        if (!scratchCanvas) return;
        const sCtx = scratchCanvas.getContext('2d');
        let isDrawing = false;

        // High DPI canvas sharpness fix
        const dpr = window.devicePixelRatio || 1;
        const width = 300;
        const height = 300;
        scratchCanvas.width = width * dpr;
        scratchCanvas.height = height * dpr;
        sCtx.scale(dpr, dpr);

        // Paint custom golden layer pattern
        let gradient = sCtx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#B38728');
        gradient.addColorStop(0.5, '#FBF5B7');
        gradient.addColorStop(1, '#AA771C');
        sCtx.fillStyle = gradient;
        sCtx.fillRect(0, 0, width, height);

        // Overlay instructions text
        sCtx.fillStyle = '#58111A';
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
       E. CHRONO COUNTDOWN CLOCK CONTROLLER
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
       F. CAROUSEL PHOTO GALLERY SYSTEM
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
                    pausePlayBtn.setAttribute('aria-label', 'Play Slideshow');
                } else {
                    isSliderPlaying = true;
                    startAutoSlide();
                    pausePlayIcon.className = 'fas fa-pause';
                    pausePlayBtn.setAttribute('aria-label', 'Pause Slideshow');
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
       G. SCROLL REVEAL ANIMATION ENGINE
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
       H. SHARE & CALENDAR UTILITIES
       ========================================== */
    const whatsappBtn = document.getElementById('shareWhatsapp');
    const copyLinkBtn = document.getElementById('copyLink');
    const calendarBtn = document.getElementById('addToCalendar');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const encodedText = encodeURIComponent(SHARE_TEXT + WEBSITE_URL);
            window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
        });
    }

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(WEBSITE_URL).then(() => {
                alert("✨ Engagement invitation link copied to clipboard!");
            }).catch(() => {
                alert("Please copy the browser URL directly.");
            });
        });
    }

    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            const title = encodeURIComponent("Vikash & Swati Engagement Ceremony");
            const details = encodeURIComponent("Join us in celebrating the engagement of Vikash & Swati!");
            const location = encodeURIComponent("The Grand Imperial Palace, Palace Road, Bengaluru");
            const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261015T103000Z/20261015T160000Z&details=${details}&location=${location}`;
            window.open(googleCalUrl, '_blank');
        });
    }
});
