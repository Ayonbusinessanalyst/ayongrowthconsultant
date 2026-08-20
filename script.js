/**
 * AHMED AYON — PORTFOLIO SCRIPT
 * Handles all motion, interactivity, and theme logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------------------------
    // 1. PAGE LOAD ANIMATION
    // ----------------------------------------------------------------------
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading delay (max 1.2s total as per requirements)
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Trigger IntersectionObserver after load
        setTimeout(() => {
            document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('visible');
                }
            });
        }, 100);
    }, 800);


    // ----------------------------------------------------------------------
    // 2. THEME TOGGLE (Dark/Light)
    // ----------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });


    // ----------------------------------------------------------------------
    // 3. CUSTOM CURSOR
    // ----------------------------------------------------------------------
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
            // Add slight lag to ring for smooth effect
            setTimeout(() => {
                cursorRing.style.left = e.clientX + 'px';
                cursorRing.style.top = e.clientY + 'px';
            }, 80);
        });

        // Hover states
        const hoverElements = document.querySelectorAll('a, button, .insight-card, .review-card, .case-card, .video-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.classList.contains('btn-primary')) {
                    body.classList.add('cursor-hover');
                } else {
                    body.classList.add('cursor-hover-blue');
                }
            });
            el.addEventListener('mouseleave', () => {
                body.classList.remove('cursor-hover');
                body.classList.remove('cursor-hover-blue');
            });
        });
    }


    // ----------------------------------------------------------------------
    // 4. SCROLL INTERACTIONS (Navbar, Indicators, IntersectionObserver)
    // ----------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        // Sticky Nav
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide scroll indicator
        if (window.scrollY > 100 && scrollIndicator) {
            scrollIndicator.classList.add('hidden');
        }
    });



    // Reveal Animation Setup
    const revealObserverOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80); // Stagger effect
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
        revealObserver.observe(el);
    });

    // About Section Text Illumination
    const bioLines = document.querySelectorAll('.bio-line');
    const bioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('illuminated');
            }
        });
    }, { threshold: 0.8 });

    bioLines.forEach(line => bioObserver.observe(line));

    // Stats Count Up Animation
    const stats = document.querySelectorAll('.stat-number');
    let counted = false;
    
    const countUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                stats.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCount();
                });
                counted = true; // Prevents recounting
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.hero-stats, .about-stats-row').forEach(el => countUpObserver.observe(el));


    // ----------------------------------------------------------------------
    // 5. TYPEWRITER EFFECT
    // ----------------------------------------------------------------------
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        const roles = ["Meta Ads Expert", "Growth Consultant", "Ad Strategist", "Marketing Mentor"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2500; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 400; // Pause before new word
            }
            
            setTimeout(type, typeSpeed);
        }
        
        setTimeout(type, 1500); // Start delay
    }


    // ----------------------------------------------------------------------
    // 6. macOS PANEL SWITCHER (Proof Section)
    // ----------------------------------------------------------------------
    const macNavItems = document.querySelectorAll('.macos-sidebar .nav-item');
    const macPanels = document.querySelectorAll('.macos-content .content-panel');

    macNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            macNavItems.forEach(nav => nav.classList.remove('active'));
            macPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');
            
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });


    // ----------------------------------------------------------------------
    // 7. BLOG & CASE STUDY FILTER
    // ----------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const insightCards = document.querySelectorAll('.insight-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            insightCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    // Re-trigger animation
                    card.classList.remove('visible');
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ----------------------------------------------------------------------
    // 8. MODAL SYSTEM
    // ----------------------------------------------------------------------
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');
    
    // Close Modals
    const closeModal = (modal) => {
        modal.classList.remove('active');
        // Stop youtube video if closing that modal
        if (modal.id === 'youtube-modal') {
            document.getElementById('youtube-iframe').src = '';
        }
    };

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal-overlay'));
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) closeModal(modal);
            });
        }
    });

    // Open Quote Modal
    const getQuoteBtn = document.getElementById('btn-get-quote');
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', () => {
            document.getElementById('quote-modal').classList.add('active');
        });
    }

    // Handle Form Submit (Simulation)
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        // If not using mailto, we would prevent default and show success state.
        // For now, mailto will trigger email client, but we also show UI feedback
        quoteForm.addEventListener('submit', (e) => {
            // Uncomment next line to prevent mailto and just test UI
            // e.preventDefault(); 
            
            quoteForm.style.display = 'none';
            document.getElementById('form-success').classList.remove('hidden');
            
            setTimeout(() => {
                closeModal(document.getElementById('quote-modal'));
                // Reset form
                setTimeout(() => {
                    quoteForm.reset();
                    quoteForm.style.display = 'block';
                    document.getElementById('form-success').classList.add('hidden');
                }, 500);
            }, 3000);
        });
    }

    // Open Review Modal
    const textReviews = document.querySelectorAll('.text-review');
    textReviews.forEach(review => {
        review.addEventListener('click', () => {
            const text = review.getAttribute('data-review-text');
            const name = review.getAttribute('data-client-name');
            const role = review.getAttribute('data-client-role');
            
            document.getElementById('modal-review-text').innerText = `"${text}"`;
            document.getElementById('modal-review-client').innerText = name;
            document.getElementById('modal-review-role').innerText = role;
            
            document.getElementById('review-modal').classList.add('active');
        });
    });

    // Open YouTube Modal
    const videoTriggers = document.querySelectorAll('.video-card, .video-review, .video-trigger');
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            // Find parent with youtube id if clicking on an internal element
            let target = trigger;
            if (!target.hasAttribute('data-youtube-id')) {
                target = trigger.closest('[data-youtube-id]');
            }
            
            if (target) {
                const videoId = target.getAttribute('data-youtube-id');
                const iframe = document.getElementById('youtube-iframe');
                // Use nocookie and enable autoplay
                iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
                document.getElementById('youtube-modal').classList.add('active');
            }
        });
    });

    // Image Review Modal (Google Reviews, WhatsApp Screenshots, etc)
    const imageReviews = document.querySelectorAll('.image-review');
    imageReviews.forEach(review => {
        review.addEventListener('click', () => {
            // For placeholder, we'll just show an alert or placeholder image
            const modalImage = document.getElementById('modal-image');
            // Check if there's a real src, otherwise use placeholder
            const src = review.getAttribute('data-img-src') || 'https://via.placeholder.com/800x600.png?text=Review+Screenshot';
            modalImage.src = src;
            document.getElementById('image-modal').classList.add('active');
        });
    });

    // ----------------------------------------------------------------------
    // 9. SANITY CONTENT LOADER
    // ----------------------------------------------------------------------
    async function loadSanityContent() {
        const grid = document.querySelector('.insights-grid');
        if (!grid) return;

        try {
            const response = await fetch('/api/portfolio');
            const data = await response.json();

            if (!Array.isArray(data.items) || data.items.length === 0) {
                return;
            }

            const normalizeCategory = (value) => {
                if (!value) return 'blog';
                const clean = String(value).toLowerCase().trim();
                if (clean.includes('case')) return 'case-study';
                if (clean.includes('video')) return 'video';
                return 'blog';
            };

            const cards = data.items.map(item => {
                const category = normalizeCategory(item.category || item._type);
                const title = item.title || 'Untitled post';
                const excerpt = item.excerpt || 'Read the latest update from this project.';
                const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent';
                const youtubeId = item.youtubeId || '';
                const href = item.url || (youtubeId ? '#' : '#');
                const isVideo = category === 'video' || Boolean(youtubeId);

                if (isVideo) {
                    return `
                        <article class="insight-card reveal" data-category="video" data-title="${title}" data-youtube-id="${youtubeId}" data-link="#">
                            <div class="card-thumb video">
                                <div class="badge">Video</div>
                                <img src="https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg" alt="${title}" class="yt-thumb" loading="lazy">
                                <div class="play-overlay">▶</div>
                            </div>
                            <div class="card-content">
                                <h3 class="card-title">${title}</h3>
                                <p class="card-excerpt">${excerpt}</p>
                                <div class="card-footer">
                                    <span class="meta-date">${date}</span>
                                    <span class="meta-read">Video</span>
                                    <button class="read-more video-trigger">Watch Now →</button>
                                </div>
                            </div>
                        </article>
                    `;
                }

                return `
                    <article class="insight-card reveal" data-category="${category}" data-title="${title}" data-link="${href}">
                        <div class="card-thumb">
                            <div class="badge">${category === 'case-study' ? 'Case Study' : 'Blog'}</div>
                            <div class="thumb-placeholder">Image</div>
                        </div>
                        <div class="card-content">
                            <h3 class="card-title">${title}</h3>
                            <p class="card-excerpt">${excerpt}</p>
                            <div class="card-footer">
                                <span class="meta-date">${date}</span>
                                <span class="meta-read">${category === 'case-study' ? 'Case' : 'Article'}</span>
                                <a href="${href}" class="read-more">Read More →</a>
                            </div>
                        </div>
                    </article>
                `;
            }).join('');

            grid.innerHTML = cards;

            const filterBtns = document.querySelectorAll('.filter-btn');
            const insightCards = document.querySelectorAll('.insight-card');
            filterBtns.forEach(btn => {
                btn.onclick = () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const filter = btn.getAttribute('data-filter');
                    insightCards.forEach(card => {
                        if (filter === 'all' || card.getAttribute('data-category') === filter) {
                            card.style.display = 'flex';
                            card.classList.remove('visible');
                            setTimeout(() => card.classList.add('visible'), 50);
                        } else {
                            card.style.display = 'none';
                        }
                    });
                };
            });

            const newVideoTriggers = document.querySelectorAll('.video-trigger');
            newVideoTriggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = trigger.closest('[data-youtube-id]');
                    if (!target) return;
                    const videoId = target.getAttribute('data-youtube-id');
                    const iframe = document.getElementById('youtube-iframe');
                    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
                    document.getElementById('youtube-modal').classList.add('active');
                });
            });
        } catch (error) {
            console.error('Sanity content failed to load:', error);
        }
    }

    loadSanityContent();

    // ----------------------------------------------------------------------
    // 10. MOBILE MENU
    // ----------------------------------------------------------------------
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }
});
