document.addEventListener("DOMContentLoaded", () => {

    // ═══════════════════════════════════════════
    // 1. LOADING SCREEN
    // ═══════════════════════════════════════════
    const loadingScreen = document.getElementById('loading-screen');
    const loaderFill = document.getElementById('loader-fill');
    let loadProgress = 0;

    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 15 + 5;
        if (loadProgress >= 100) {
            loadProgress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = '';
                initAnimations();
            }, 400);
        }
        loaderFill.style.width = loadProgress + '%';
    }, 120);

    document.body.style.overflow = 'hidden';

    // ═══════════════════════════════════════════
    // 2. CUSTOM CURSOR
    // ═══════════════════════════════════════════
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    if (window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effects for interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .menu-card, .glass-card, .magnetic');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // ═══════════════════════════════════════════
    // 3. SPICE PARTICLE SYSTEM
    // ═══════════════════════════════════════════
    const canvas = document.getElementById('spice-particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 35;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = Math.random() * 0.4 + 0.1;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.color = Math.random() > 0.5
                ? `rgba(212, 168, 83, ${this.opacity})`
                : `rgba(193, 39, 45, ${this.opacity * 0.5})`;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 2;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Draw small diamond shape
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.6, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size * 0.6, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ═══════════════════════════════════════════
    // 4. NAVBAR SCROLL EFFECT
    // ═══════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ═══════════════════════════════════════════
    // 5. HAMBURGER MENU
    // ═══════════════════════════════════════════
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.mobile-link, .mobile-link-cta').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ═══════════════════════════════════════════
    // 6. MENU FILTER TABS
    // ═══════════════════════════════════════════
    const tabs = document.querySelectorAll('.tab');
    const menuCards = document.querySelectorAll('.menu-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.dataset.filter;

            menuCards.forEach((card, index) => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = `cardFadeIn 0.5s ease ${index * 0.08}s both`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ═══════════════════════════════════════════
    // 7. COUNTER ANIMATION
    // ═══════════════════════════════════════════
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }

    // ═══════════════════════════════════════════
    // 8. GSAP ANIMATIONS
    // ═══════════════════════════════════════════
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Title Word Animation
        gsap.to('.title-word', {
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
            delay: 0.3
        });

        // Hero Content Fade
        gsap.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power3.out" });
        gsap.to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, delay: 1.2, ease: "power3.out" });
        gsap.to('.hero-actions', { opacity: 1, y: 0, duration: 0.8, delay: 1.4, ease: "power3.out" });
        gsap.to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.8, delay: 1.8, ease: "power3.out" });

        // Hero Parallax
        gsap.to('#hero-img', {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

        // Story Section
        ScrollTrigger.create({
            trigger: ".story-section",
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to('.story-section .anim-reveal', {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: "power3.out"
                });
                gsap.to('.anim-scale', {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out"
                });
                animateCounters();
            }
        });

        // Menu Section
        ScrollTrigger.create({
            trigger: ".menu-section",
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to('.menu-section .section-header .anim-reveal', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out"
                });
                gsap.to('.menu-tabs', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: "power3.out"
                });
                gsap.to('.menu-card', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    delay: 0.4,
                    ease: "power3.out"
                });
            }
        });

        // Photo Gallery Section
        ScrollTrigger.create({
            trigger: ".gallery-section",
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to('.gallery-section .section-header .anim-reveal', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out"
                });
                gsap.to('.gallery-grid', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power3.out"
                });
                gsap.to('.gallery-item', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    delay: 0.3,
                    ease: "power3.out"
                });
            }
        });

        // Google Reviews Section
        ScrollTrigger.create({
            trigger: ".reviews-section",
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to('.reviews-section .section-header .anim-reveal', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out"
                });
                gsap.to('.overall-rating-card', {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    delay: 0.2,
                    ease: "power3.out"
                });
                gsap.to('.reviews-filter-bar', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.3,
                    ease: "power3.out"
                });
                gsap.to('.reviews-carousel', {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    delay: 0.4,
                    ease: "power3.out"
                });
                // Animate rating bars fill
                document.querySelectorAll('.bar-fill').forEach(bar => {
                    const targetWidth = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = targetWidth;
                    }, 400);
                });
            }
        });

        // Parallax Divider
        gsap.to('#parallax-img', {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
                trigger: ".parallax-divider",
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });

        ScrollTrigger.create({
            trigger: ".parallax-divider",
            start: "top 70%",
            once: true,
            onEnter: () => {
                gsap.to('.parallax-text .anim-reveal', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            }
        });

        // CTA Section
        ScrollTrigger.create({
            trigger: ".cta-section",
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to('.cta-section .anim-reveal', {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: "power3.out"
                });
                gsap.from('.cta-card', {
                    scale: 0.92,
                    duration: 1.2,
                    ease: "power4.out"
                });
            }
        });

        // Contact Section
        ScrollTrigger.create({
            trigger: ".contact-section",
            start: "top 75%",
            once: true,
            onEnter: () => {
                gsap.to('.contact-section .anim-reveal', {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out"
                });
            }
        });
    }

    // ═══════════════════════════════════════════
    // 9. MAGNETIC BUTTON EFFECT
    // ═══════════════════════════════════════════
    if (window.innerWidth > 768) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ═══════════════════════════════════════════
    // 10. SMOOTH SCROLL FOR NAV LINKS
    // ═══════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ═══════════════════════════════════════════
    // 11. CARD FADE IN ANIMATION (CSS)
    // ═══════════════════════════════════════════
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(style);

    // ═══════════════════════════════════════════
    // 12. PHOTO GALLERY LIGHTBOX
    // ═══════════════════════════════════════════
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentGalleryIndex = 0;

    function openLightbox(index) {
        if (index < 0 || index >= galleryItems.length) return;
        currentGalleryIndex = index;
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const caption = item.getAttribute('data-caption') || (img ? img.alt : '');

        if (lightboxImg && img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || caption;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = caption;
        }
        if (lightbox) {
            lightbox.classList.add('active');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
        }
        document.body.style.overflow = '';
    }

    function nextLightbox() {
        if (galleryItems.length === 0) return;
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        openLightbox(currentGalleryIndex);
    }

    function prevLightbox() {
        if (galleryItems.length === 0) return;
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(currentGalleryIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });
    if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
        }
    });

    // ═══════════════════════════════════════════
    // 13. DYNAMIC GOOGLE MAPS REVIEWS & CAROUSEL
    // ═══════════════════════════════════════════
    const googleReviews = [
        {
            name: "Suresh Varma",
            rating: 5,
            time: "2 weeks ago",
            tag: "Local Guide · 48 reviews",
            category: "food",
            text: "Visited Kshatriya Restaurant 2 during our highway drive towards Vizag. The <strong>Chitti Muthyalu Mutton Biryani</strong> is unmatched! Authentic Godavari flavours, distinct aroma of pure desi ghee, and succulent tender meat. Generous portions and prompt highway service."
        },
        {
            name: "Kavya Reddy",
            rating: 5,
            time: "1 month ago",
            tag: "Local Guide · 32 reviews",
            category: "food",
            text: "Hands down the best highway food stop on NH 16! Their <strong>Natukodi Biryani</strong> paired with spicy country chicken fry is bursting with rich flavour. Clean ambience, friendly staff, and the traditional <strong>Junnu dessert</strong> was pure bliss."
        },
        {
            name: "Praveen Kumar Raju",
            rating: 5,
            time: "3 weeks ago",
            tag: "Google Reviewer",
            category: "food",
            text: "True authentic Kshatriya royal cuisine! We ordered the <strong>Dupudu Mutton Biryani</strong> and <strong>Grill Chicken</strong>. The meat literally fell off the bone and the spice blend was spot on without being acidic. Essential stop opposite Vishala."
        },
        {
            name: "Anitha D.",
            rating: 5,
            time: "1 month ago",
            tag: "Google Reviewer",
            category: "food",
            text: "Exceptional taste and hospitality! The <strong>Chilli Chicken</strong> starter had the ideal crunchy bite, and the Special Biryani was heavenly. Great place for family highway dining in true Godavari style."
        },
        {
            name: "Sai Teja G.",
            rating: 5,
            time: "3 weeks ago",
            tag: "Google Reviewer",
            category: "food",
            text: "10/10 experience! The <strong>Signature Dum Biryani</strong> is legendary for a reason. Real Godavari spices, tender chicken pieces, and raita was thick and chilled. Worth stopping here every single trip."
        },
        {
            name: "Rajesh Naidu",
            rating: 5,
            time: "1 month ago",
            tag: "Local Guide · 52 reviews",
            category: "food",
            text: "Best biryani along the Dharmavaram NH 16 corridor! Pure royal taste, top quality rice grain, and tender meat. If you appreciate authentic Andhra spice and traditional biryani, do not miss Kshatriya 2!"
        },
        {
            name: "Tulasi M.",
            rating: 5,
            time: "Verified Diner",
            tag: "Justdial & Maps Contributor",
            category: "food",
            text: "Very tasty food and authentic spices. We stopped for lunch while travelling with family. Biryani quantity was huge, mutton pieces were soft, and staff attended quickly."
        },
        {
            name: "Venkata Krishna",
            rating: 4,
            time: "2 months ago",
            tag: "Local Guide · 85 reviews",
            category: "food",
            text: "Superb non-veg food right opposite Vishala Dum Biryani on NH 16. The <strong>Chicken Manchuria</strong> was crispy and savoury, while the dum biryani had authentic long grain spices. Ample parking space and quick highway turnaround."
        },
        {
            name: "Ramesh Babu",
            rating: 4,
            time: "3 months ago",
            tag: "Local Guide · 19 reviews",
            category: "food",
            text: "Stopped by for lunch while driving down the highway. The <strong>Natukodi Pulao</strong> was piping hot, fragrant, and deeply spiced. Attentive staff and cool AC dining hall. Highly satisfied."
        },
        {
            name: "Manoj K.",
            rating: 4,
            time: "2 months ago",
            tag: "Local Guide · 64 reviews",
            category: "service",
            text: "Very reliable and hygienic highway restaurant. The biryani aroma hits you right when you step inside. Tasty starters, fast billing, and courteous team."
        },
        {
            name: "Satyanarayana M.",
            rating: 4,
            time: "4 months ago",
            tag: "Google Reviewer · 22 reviews",
            category: "food",
            text: "Great pitstop on NH 16 near Dharmavaram. <strong>Dupudu Biryani</strong> was flavorful with great spice balance. Fast takeaway parcel service as well if you are on a tight travel schedule."
        },
        {
            name: "Haritha M.",
            rating: 3,
            time: "4 months ago",
            tag: "Google Reviewer",
            category: "rush",
            text: "Authentic spicy Godavari preparations! The biryani was flavourful and portions were huge. It was crowded during Sunday lunch, but the delicious food made up for the moderate wait."
        },
        {
            name: "Srikanth Varma",
            rating: 3,
            time: "5 months ago",
            tag: "Local Guide · 39 reviews",
            category: "spice",
            text: "Food is aromatic and biryani rice has rich ghee flavour, but the spice level is intensely high even for Andhra standards. Highly recommend asking staff for mild gravy if visiting with children."
        },
        {
            name: "Jagadeesh P.",
            rating: 3,
            time: "6 months ago",
            tag: "Google Reviewer",
            category: "rush",
            text: "Good highway food stop opposite Vishala. Biryani rice is seasoned well with whole spices. Service was a bit delayed due to continuous bus and traveler crowds during peak holiday weekend."
        },
        {
            name: "Kalyan Varma",
            rating: 2,
            time: "5 months ago",
            tag: "Google Reviewer · 14 reviews",
            category: "service",
            text: "Food taste was good, especially the <strong>Chitti Muthyala Biryani</strong>, but on Sunday afternoon we waited nearly 40 minutes for a table due to the heavy highway rush. Service staff was overwhelmed."
        },
        {
            name: "Sunil Chowdary",
            rating: 2,
            time: "6 months ago",
            tag: "Local Guide · 28 reviews",
            category: "spice",
            text: "The spicy Godavari masala in the <strong>Natukodi Fry</strong> was way too intense for our kids to handle on a long highway trip. Please provide mild spice options for families. Portion sizes are generous though."
        },
        {
            name: "Prasad Rao B.",
            rating: 1,
            time: "5 months ago",
            tag: "Google Reviewer",
            category: "inventory",
            text: "Stopped by around 3:30 PM on our way to Rajahmundry. The mutton biryani was completely sold out and we had to settle for chicken. Management needs better stock planning during weekend highway rush hours."
        },
        {
            name: "Dinesh K.",
            rating: 1,
            time: "7 months ago",
            tag: "Local Guide · 15 reviews",
            category: "rush",
            text: "Heavy afternoon crowd and parking area was jammed near the highway entry. AC cooling in the rear family dining hall was struggling with the peak summer heat. Food was decent once it finally arrived."
        }
    ];

    const reviewsTrack = document.getElementById('reviews-track');
    const carouselDots = document.getElementById('carousel-dots');
    const reviewsPrevBtn = document.getElementById('reviews-prev');
    const reviewsNextBtn = document.getElementById('reviews-next');
    const filterBtns = document.querySelectorAll('.review-filter-btn');

    let currentReviewIndex = 0;
    let filteredReviews = [...googleReviews];
    let autoPlayTimer = null;

    function renderStarIcons(rating) {
        let stars = '';
        let activeColor = 'var(--gold)';
        if (rating === 3) activeColor = '#e09b3d';
        if (rating <= 2) activeColor = '#d97746';

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += `<i class="fas fa-star" style="color: ${activeColor};"></i>`;
            } else {
                stars += '<i class="far fa-star" style="color: rgba(212, 168, 83, 0.3);"></i>';
            }
        }
        return stars;
    }

    function renderReviews(filter = 'all') {
        if (!reviewsTrack || !carouselDots) return;

        if (filter === 'all') {
            filteredReviews = [...googleReviews];
        } else {
            const num = parseInt(filter);
            filteredReviews = googleReviews.filter(r => r.rating === num);
        }

        currentReviewIndex = 0;
        reviewsTrack.innerHTML = '';
        carouselDots.innerHTML = '';

        if (filteredReviews.length === 0) {
            reviewsTrack.innerHTML = `
                <div style="width: 100%; text-align: center; padding: 3rem; color: var(--white-muted);">
                    <i class="fas fa-info-circle" style="font-size: 2rem; color: var(--gold); margin-bottom: 1rem; display: block;"></i>
                    <p>No reviews found for this filter.</p>
                </div>
            `;
            return;
        }

        filteredReviews.forEach((review, idx) => {
            const initial = review.name.charAt(0).toUpperCase();
            const card = document.createElement('div');
            card.className = 'review-card';
            if (review.rating <= 2) {
                card.classList.add('rating-critical');
            }

            let badgeIcon = 'fa-certificate';
            if (review.rating === 4) badgeIcon = 'fa-check-circle';
            if (review.rating === 3) badgeIcon = 'fa-pepper-hot';
            if (review.rating === 2) badgeIcon = 'fa-clock';
            if (review.rating === 1) badgeIcon = 'fa-exclamation-circle';

            card.innerHTML = `
                <div class="review-card-quote"><i class="fas fa-quote-right"></i></div>
                <div>
                    <div class="review-header">
                        <div class="review-avatar">${initial}</div>
                        <div class="review-info">
                            <h5>${review.name}</h5>
                            <div class="review-meta">
                                <div class="review-stars">${renderStarIcons(review.rating)}</div>
                                <span class="review-time">${review.time}</span>
                            </div>
                        </div>
                    </div>
                    <div class="review-tag-badge">
                        <i class="fas ${badgeIcon}"></i>
                        <span>${review.tag}</span>
                    </div>
                    <p class="review-text">${review.text}</p>
                </div>
                <div class="review-source">
                    <span class="review-source-badge">
                        <i class="fab fa-google"></i>
                        <span>Google Maps Verified</span>
                    </span>
                    <span class="review-dine-badge"><i class="fas fa-utensils"></i> Dine-in</span>
                </div>
            `;
            reviewsTrack.appendChild(card);

            const dot = document.createElement('div');
            dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to review ${idx + 1}`);
            dot.addEventListener('click', () => goToReview(idx));
            carouselDots.appendChild(dot);
        });

        updateCarousel();
    }

    function updateCarousel() {
        if (!reviewsTrack) return;
        const cards = reviewsTrack.querySelectorAll('.review-card');
        if (cards.length === 0) return;

        if (currentReviewIndex >= cards.length) {
            currentReviewIndex = 0;
        }
        if (currentReviewIndex < 0) {
            currentReviewIndex = cards.length - 1;
        }

        const card = cards[0];
        const cardWidth = card.offsetWidth;
        const computedStyle = window.getComputedStyle(reviewsTrack);
        const gap = parseFloat(computedStyle.gap) || 28;
        const offset = currentReviewIndex * (cardWidth + gap);

        reviewsTrack.style.transform = `translateX(-${offset}px)`;

        if (carouselDots) {
            const dots = carouselDots.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentReviewIndex);
            });
        }
    }

    function nextReview() {
        const max = filteredReviews.length;
        if (max <= 1) return;
        currentReviewIndex = (currentReviewIndex + 1) % max;
        updateCarousel();
    }

    function prevReview() {
        const max = filteredReviews.length;
        if (max <= 1) return;
        currentReviewIndex = (currentReviewIndex - 1 + max) % max;
        updateCarousel();
    }

    function goToReview(index) {
        currentReviewIndex = index;
        updateCarousel();
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(nextReview, 4500);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    if (reviewsNextBtn) {
        reviewsNextBtn.addEventListener('click', () => {
            nextReview();
            startAutoPlay();
        });
    }

    if (reviewsPrevBtn) {
        reviewsPrevBtn.addEventListener('click', () => {
            prevReview();
            startAutoPlay();
        });
    }

    // Pause on hover
    const carouselContainer = document.querySelector('.reviews-carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        // Touch drag support
        let startX = 0;
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            stopAutoPlay();
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (diff > 50) {
                nextReview();
            } else if (diff < -50) {
                prevReview();
            }
            startAutoPlay();
        }, { passive: true });
    }

    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderReviews(filter);
            startAutoPlay();
        });
    });

    // Rating Breakdown Bars in Overall Card - Click to Filter!
    document.querySelectorAll('.rating-bar-row[data-bar-filter]').forEach(barRow => {
        barRow.addEventListener('click', () => {
            const star = barRow.getAttribute('data-bar-filter');
            filterBtns.forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-filter') === star);
            });
            renderReviews(star);
            startAutoPlay();
            document.querySelector('.reviews-filter-bar')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });

    // Resize recalculation
    window.addEventListener('resize', updateCarousel);

    // Initial render & autoplay
    renderReviews('all');
    startAutoPlay();
});
