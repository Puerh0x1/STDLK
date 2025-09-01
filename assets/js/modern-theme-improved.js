// ============================================
// УЛУЧШЕННЫЙ THEME MANAGER
// ============================================

// Немедленно применяем сохранённую тему
(function() {
    const savedTheme = localStorage.getItem('modern-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

class ModernThemeManager {
    constructor() {
        this.theme = localStorage.getItem('modern-theme') || 'light';
        this.channel = null;
        this.setupBroadcastChannel();
        this.init();
    }
    
    setupBroadcastChannel() {
        try {
            this.channel = new BroadcastChannel('theme-sync');
            this.channel.onmessage = (event) => {
                if (event.data.type === 'theme-change' && event.data.theme !== this.theme) {
                    this.theme = event.data.theme;
                    this.applyTheme();
                    this.updateToggleButton();
                    
                    // Плавная анимация при получении изменения темы
                    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
                    setTimeout(() => {
                        document.body.style.transition = '';
                    }, 300);
                }
            };
        } catch (e) {
            console.log('BroadcastChannel not supported');
        }
    }

    init() {
        const savedTheme = localStorage.getItem('modern-theme');
        if (savedTheme) {
            this.theme = savedTheme;
        }
        
        this.applyTheme();
        this.createThemeToggle();
        this.setupEventListeners();
        this.initAnimations();
        this.setupStorageListener();
    }
    
    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === 'modern-theme' && e.newValue !== this.theme) {
                this.theme = e.newValue || 'light';
                this.applyTheme();
                this.updateToggleButton();
            }
        });
        
        window.addEventListener('focus', () => {
            const savedTheme = localStorage.getItem('modern-theme');
            if (savedTheme && savedTheme !== this.theme) {
                this.theme = savedTheme;
                this.applyTheme();
                this.updateToggleButton();
            }
        });
        
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                const savedTheme = localStorage.getItem('modern-theme');
                if (savedTheme && savedTheme !== this.theme) {
                    this.theme = savedTheme;
                    this.applyTheme();
                    this.updateToggleButton();
                }
            }
        });
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('modern-theme', this.theme);
        
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        document.querySelector('meta[name="theme-color"]').content = 
            this.theme === 'dark' ? '#0f172a' : '#6366f1';
    }

    toggleTheme() {
        document.body.classList.add('no-transition');
        
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('modern-theme', this.theme);
        this.applyTheme();
        this.updateToggleButton();
        
        // Анимация смены темы
        this.animateThemeTransition();
        
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 50);
        
        // Синхронизация с другими вкладками через BroadcastChannel
        if (this.channel) {
            this.channel.postMessage({ 
                type: 'theme-change',
                theme: this.theme 
            });
        }
        
        // Также отправляем событие для синхронизации
        window.dispatchEvent(new CustomEvent('theme-changed', { 
            detail: { theme: this.theme } 
        }));
    }
    
    animateThemeTransition() {
        // Создаем волновой эффект при смене темы
        const toggle = document.querySelector('.theme-toggle-modern');
        if (!toggle) return;
        
        const rect = toggle.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: ${this.theme === 'dark' ? 
                'radial-gradient(circle, rgba(15, 23, 42, 0.3) 0%, transparent 70%)' : 
                'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)'};
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            transition: all 0.6s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.width = '200vmax';
            ripple.style.height = '200vmax';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    updateToggleButton() {
        const toggle = document.querySelector('.theme-toggle-modern');
        if (toggle) {
            toggle.innerHTML = `
                <i class="${this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}"></i>
            `;
        }
    }

    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle-modern';
        toggle.setAttribute('aria-label', 'Переключить тему');
        toggle.innerHTML = `
            <i class="${this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}"></i>
        `;
        
        setTimeout(() => {
            const headerContent = document.querySelector('.header-content');
            if (headerContent) {
                let headerActions = headerContent.querySelector('.header-actions');
                if (!headerActions) {
                    const userInfo = headerContent.querySelector('.user-info-modern');
                    if (userInfo) {
                        headerActions = document.createElement('div');
                        headerActions.className = 'header-actions';
                        headerActions.appendChild(userInfo);
                        headerContent.appendChild(headerActions);
                    }
                }
                
                if (headerActions) {
                    headerActions.appendChild(toggle);
                } else {
                    document.body.appendChild(toggle);
                }
            } else {
                document.body.appendChild(toggle);
            }
        }, 100);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle-modern')) {
                this.toggleTheme();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll(
            '.stat-card-modern, .action-card-modern, .activity-item-modern, .portfolio-card'
        );
        
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
            observer.observe(el);
        });
    }
}

// ============================================
// MOBILE MENU MANAGER
// ============================================

class ModernMobileMenu {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.setupEventListeners();
        this.handleResize();
    }

    createMobileMenu() {
        if (document.querySelector('.mobile-menu-toggle-modern')) return;
        
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle-modern';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Меню');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.appendChild(menuToggle);
        
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay-modern';
        document.body.appendChild(overlay);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu-toggle-modern')) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            }
            
            if (e.target.closest('.mobile-overlay-modern')) {
                this.closeMenu();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-modern-link') && window.innerWidth < 768) {
                setTimeout(() => this.closeMenu(), 200);
            }
        });
    }
    
    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 767 && this.isOpen) {
                    this.closeMenu();
                }
            }, 250);
        });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        const sidebar = document.querySelector('.sidebar-modern');
        const overlay = document.querySelector('.mobile-overlay-modern');
        const toggle = document.querySelector('.mobile-menu-toggle-modern');
        
        if (sidebar && overlay && toggle) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            overlay.style.display = 'block';
            toggle.innerHTML = '<i class="fas fa-times"></i>';
            toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
            
            requestAnimationFrame(() => {
                sidebar.style.transform = 'translateX(0)';
            });
        }
    }

    closeMenu() {
        const sidebar = document.querySelector('.sidebar-modern');
        const overlay = document.querySelector('.mobile-overlay-modern');
        const toggle = document.querySelector('.mobile-menu-toggle-modern');
        
        if (sidebar && overlay && toggle) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            this.isOpen = false;
            
            sidebar.style.transform = '';
            
            setTimeout(() => {
                if (!this.isOpen) {
                    overlay.style.display = 'none';
                }
            }, 300);
        }
    }
}

// ============================================
// UI ENHANCEMENTS
// ============================================

class ModernUIEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.setupCounters();
        this.setupProgressBars();
        this.setupSmoothScroll();
        this.setupRippleEffect();
    }

    setupCounters() {
        const counters = document.querySelectorAll('.stat-value-modern');
        
        const animateCounter = (counter) => {
            const text = counter.innerText;
            const target = parseInt(text.replace(/[^\d]/g, '')) || 0;
            if (target === 0) return;
            
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.floor(current).toLocaleString('ru-RU');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = text;
                }
            };
            
            counter.innerText = '0';
            updateCounter();
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    setupProgressBars() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            background: var(--gradient-primary);
            z-index: 10000;
            transition: width 0.2s ease;
            width: 0%;
        `;
        document.body.appendChild(progressBar);
        
        let ticking = false;
        function updateProgressBar() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateProgressBar);
                ticking = true;
            }
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupRippleEffect() {
        document.querySelectorAll('.btn-modern, .nav-modern-link, .action-card-modern, .portfolio-card').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    transform: scale(0);
                    animation: rippleAnimation 0.5s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 500);
            });
        });
    }
}

// ============================================
// CSS ANIMATIONS
// ============================================

const modernAnimations = `
@keyframes rippleAnimation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animated {
    animation: fadeIn 0.5s ease-out;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = modernAnimations;
document.head.appendChild(styleSheet);

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    window.modernTheme = new ModernThemeManager();
    window.modernMobileMenu = new ModernMobileMenu();
    window.modernUI = new ModernUIEnhancements();
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
    }, 50);
    
    console.log('✨ Modern Theme System v2.0 Initialized!');
});