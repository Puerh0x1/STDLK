// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.applyTheme();
        this.createToggleButton();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        
        // Обновляем мета-тег для системной темы
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', this.currentTheme === 'dark' ? '#0f172a' : '#6366f1');
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateToggleIcon();
        
        // Синхронизация с другими вкладками/окнами
        this.syncThemeAcrossTabs();
        
        // Add transition effect
        document.body.style.transition = 'background 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
        
        // Показываем уведомление
        this.showThemeNotification();
    }

    createToggleButton() {
        // Удаляем существующую кнопку если есть
        const existingToggle = document.querySelector('.theme-toggle');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Переключить тему');
        toggle.innerHTML = this.getToggleIcon();
        
        // Найти header и добавить кнопку туда
        const header = document.querySelector('.header');
        if (header) {
            header.style.position = 'relative';
            header.appendChild(toggle);
        } else {
            // Fallback - добавить в body если header не найден
            document.body.appendChild(toggle);
        }
    }

    getToggleIcon() {
        return this.currentTheme === 'light' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }

    updateToggleIcon() {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.innerHTML = this.getToggleIcon();
        }
    }

    syncThemeAcrossTabs() {
        // Отправить событие в localStorage для синхронизации с другими вкладками
        localStorage.setItem('theme', this.currentTheme);
        
        // Дополнительно можно использовать BroadcastChannel API для более быстрой синхронизации
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('theme_channel');
            channel.postMessage({ theme: this.currentTheme });
        }
    }

    showThemeNotification() {
        const themeName = this.currentTheme === 'light' ? 'светлую' : 'темную';
        const message = `Переключено на ${themeName} тему`;
        this.showToast(message, 'info');
    }

    setupEventListeners() {
        // Используем делегирование событий для динамически созданных элементов
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle')) {
                this.toggleTheme();
            }
        });
        
        // Слушать изменения темы в других вкладках
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') {
                this.currentTheme = e.newValue || 'light';
                this.applyTheme();
                this.updateToggleIcon();
            }
        });
        
        // Слушать BroadcastChannel для быстрой синхронизации
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('theme_channel');
            channel.onmessage = (event) => {
                if (event.data.theme) {
                    this.currentTheme = event.data.theme;
                    this.applyTheme();
                    this.updateToggleIcon();
                }
            };
        }
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Mobile Menu Manager
class MobileMenuManager {
    constructor() {
        this.init();
    }

    init() {
        this.createMobileMenu();
        this.setupEventListeners();
    }

    createMobileMenu() {
        // Удаляем существующие элементы если есть
        const existingToggle = document.querySelector('.mobile-menu-toggle');
        const existingOverlay = document.querySelector('.sidebar-overlay');
        const existingClose = document.querySelector('.sidebar-close');
        
        if (existingToggle) existingToggle.remove();
        if (existingOverlay) existingOverlay.remove();
        if (existingClose) existingClose.remove();

        // Создаем кнопку мобильного меню
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.setAttribute('aria-label', 'Открыть меню');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Создаем оверлей для закрытия меню
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        
        // Добавляем элементы на страницу
        document.body.appendChild(mobileToggle);
        document.body.appendChild(overlay);
        
        // Добавляем кнопку закрытия в сайдбар
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            const closeButton = document.createElement('button');
            closeButton.className = 'sidebar-close';
            closeButton.setAttribute('aria-label', 'Закрыть меню');
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            closeButton.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--primary-color);
                border: none;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                z-index: 10001;
            `;
            
            sidebar.appendChild(closeButton);
        }
    }

    setupEventListeners() {
        // Используем делегирование событий
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu-toggle')) {
                this.openMenu();
            }
            if (e.target.closest('.sidebar-overlay')) {
                this.closeMenu();
            }
            if (e.target.closest('.sidebar-close')) {
                this.closeMenu();
            }
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
        
        // Закрытие при клике на ссылку в мобильном меню
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link') && window.innerWidth <= 768) {
                this.closeMenu();
            }
        });
    }

    openMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.add('show');
        }
        
        if (overlay) {
            overlay.classList.add('show');
        }
        
        // Блокируем скролл body
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.remove('show');
        }
        
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        // Разблокируем скролл body
        document.body.style.overflow = '';
    }
}

// Enhanced UI Manager
class UIManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupAnimations();
        this.setupNavigation();
        this.setupForms();
        this.setupCards();
        this.setupLoadingStates();
        this.setupKeyboardShortcuts();
        this.setupScrollEffects();
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-scale');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.stat-card, .course-card, .work-card, .project-card, .award-card, .portfolio-card, .action-card, .help-section, .faq-section, .contact-section, .add-work-form').forEach(el => {
            observer.observe(el);
        });
    }

    setupNavigation() {
        // Active navigation highlighting
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || 
                (currentPath.includes(href) && href !== '../index.html' && href !== 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupForms() {
        // Enhanced form interactions
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });

            // Auto-resize textareas
            if (input.tagName === 'TEXTAREA') {
                input.addEventListener('input', function() {
                    this.style.height = 'auto';
                    this.style.height = this.scrollHeight + 'px';
                });
            }
        });

        // Form validation
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                this.classList.add('loading');
                
                // Simulate form submission
                setTimeout(() => {
                    this.classList.remove('loading');
                    window.uiManager.showSuccessMessage('Данные успешно сохранены!');
                }, 2000);
            });
        });
    }

    setupCards() {
        // Enhanced card interactions
        document.querySelectorAll('.stat-card, .course-card, .work-card, .project-card, .award-card, .portfolio-card, .action-card, .contact-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });

            // Click effects
            card.addEventListener('click', function(e) {
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'translateY(-8px) scale(1.02)';
                    }, 150);
                }
            });
        });
    }

    setupLoadingStates() {
        // Add loading states to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('loading') && !this.classList.contains('disabled')) {
                    this.classList.add('loading');
                    setTimeout(() => {
                        this.classList.remove('loading');
                    }, 2000);
                }
            });
        });
    }

    setupScrollEffects() {
        // Parallax effect for header
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const header = document.querySelector('.header');
            if (header) {
                header.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    }

    setupKeyboardShortcuts() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                window.themeManager.toggleTheme();
            }

            // Escape to close modals and mobile menu
            if (e.key === 'Escape') {
                this.closeModals();
                if (window.mobileMenuManager) {
                    window.mobileMenuManager.closeMenu();
                }
            }
        });
    }

    closeModals() {
        // Close any open modals
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    showSuccessMessage(message = 'Операция выполнена успешно!') {
        window.themeManager.showToast(message, 'success');
    }

    showErrorMessage(message = 'Произошла ошибка!') {
        window.themeManager.showToast(message, 'error');
    }
}

// Performance Optimizations
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupDebouncing();
        this.optimizeAnimations();
        this.setupPreloading();
    }

    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    setupDebouncing() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                // Handle scroll-based animations
            }, 16);
        });
    }

    optimizeAnimations() {
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
        }
    }

    setupPreloading() {
        // Preload critical resources
        const criticalLinks = [
            'assets/css/theme.css',
            'assets/js/theme.js'
        ];

        criticalLinks.forEach(link => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.href = link;
            preloadLink.as = link.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(preloadLink);
        });
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupFocusManagement();
        this.setupARIA();
        this.setupSkipLinks();
    }

    setupFocusManagement() {
        // Ensure focus is visible
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupARIA() {
        // Add ARIA labels where needed
        document.querySelectorAll('.btn').forEach(btn => {
            if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
                btn.setAttribute('aria-label', 'Кнопка');
            }
        });
    }

    setupSkipLinks() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Перейти к основному содержимому';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
        `;
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    window.themeManager = new ThemeManager();
    window.mobileMenuManager = new MobileMenuManager();
    window.uiManager = new UIManager();
    window.performanceManager = new PerformanceManager();
    window.accessibilityManager = new AccessibilityManager();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Service Worker registration (for PWA features)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }

    // Show welcome message
    setTimeout(() => {
        window.themeManager.showToast('Добро пожаловать в личный кабинет СТД РФ!', 'info');
    }, 1000);
});

// Export for use in other scripts
window.ThemeManager = ThemeManager;
window.MobileMenuManager = MobileMenuManager;
window.UIManager = UIManager;
window.PerformanceManager = PerformanceManager;
window.AccessibilityManager = AccessibilityManager; 