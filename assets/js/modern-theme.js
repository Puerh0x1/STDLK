// ============================================
// СУПЕР СОВРЕМЕННЫЙ THEME MANAGER
// ============================================

// Немедленно применяем сохранённую тему, чтобы избежать мигания
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
        // Создаем канал для синхронизации между вкладками
        try {
            this.channel = new BroadcastChannel('theme-sync');
            this.channel.onmessage = (event) => {
                if (event.data.theme && event.data.theme !== this.theme) {
                    this.theme = event.data.theme;
                    this.applyTheme();
                    this.updateToggleButton();
                }
            };
        } catch (e) {
            // BroadcastChannel не поддерживается - используем только localStorage
            console.log('BroadcastChannel not supported, using localStorage only');
        }
    }

    init() {
        // Проверяем тему из localStorage при каждой загрузке страницы
        const savedTheme = localStorage.getItem('modern-theme');
        if (savedTheme) {
            this.theme = savedTheme;
        }
        
        this.applyTheme();
        this.createThemeToggle();
        this.setupEventListeners();
        this.initAnimations();
        this.initParticles();
        
        // Добавляем слушатель для синхронизации при изменении в других вкладках
        this.setupStorageListener();
    }
    
    setupStorageListener() {
        // Слушаем изменения localStorage из других вкладок
        window.addEventListener('storage', (e) => {
            if (e.key === 'modern-theme' && e.newValue !== this.theme) {
                this.theme = e.newValue || 'light';
                this.applyTheme();
                this.updateToggleButton();
            }
        });
        
        // Дополнительная проверка при возврате к вкладке
        window.addEventListener('focus', () => {
            const savedTheme = localStorage.getItem('modern-theme');
            if (savedTheme && savedTheme !== this.theme) {
                this.theme = savedTheme;
                this.applyTheme();
                this.updateToggleButton();
            }
        });
        
        // Синхронизация при видимости страницы
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
        
        // Обновляем meta тег
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
        // Добавляем класс для отключения транзишнов во время переключения
        document.body.classList.add('no-transition');
        
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('modern-theme', this.theme);
        this.applyTheme();
        this.animateThemeChange();
        this.updateToggleButton();
        
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 100);
        
        // Синхронизируем с другими вкладками через BroadcastChannel
        if (this.channel) {
            this.channel.postMessage({ theme: this.theme });
        }
        
        // Уведомления убраны по просьбе пользователя
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
        
        // Находим подходящее место для кнопки
        setTimeout(() => {
            // Пытаемся найти header с информацией о пользователе
            const headerContent = document.querySelector('.header-content');
            if (headerContent) {
                // Создаем контейнер для действий в header, если его нет
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
                    // Если не нашли header, добавляем в body как fallback
                    document.body.appendChild(toggle);
                }
            } else {
                // Fallback: добавляем в body
                document.body.appendChild(toggle);
            }
        }, 100);
    }

    animateThemeChange() {
        // Создаем волновой эффект при переключении темы
        const toggle = document.querySelector('.theme-toggle-modern');
        const rect = toggle.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        ripple.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: ${this.theme === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            transition: all 1s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        requestAnimationFrame(() => {
            ripple.style.width = '3000px';
            ripple.style.height = '3000px';
            ripple.style.opacity = '0';
        });
        
        setTimeout(() => ripple.remove(), 1000);
    }

    setupEventListeners() {
        // Клик по кнопке темы
        document.addEventListener('click', (e) => {
            if (e.target.closest('.theme-toggle-modern')) {
                this.toggleTheme();
            }
        });
        
        // Горячие клавиши
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T для переключения темы
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    initAnimations() {
        // Intersection Observer для анимаций при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Наблюдаем за элементами
        const animatedElements = document.querySelectorAll(
            '.stat-card-modern, .action-card-modern, .activity-item-modern'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    initParticles() {
        // Создаем плавающие частицы для красоты
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        particlesContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        document.body.appendChild(particlesContainer);
        
        // Создаем частицы
        for (let i = 0; i < 20; i++) {
            this.createParticle(particlesContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: var(--primary);
            border-radius: 50%;
            opacity: 0.1;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${duration}s ${delay}s infinite ease-in-out;
        `;
        
        container.appendChild(particle);
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast-modern';
        toast.innerHTML = `
            <div class="toast-modern-content">
                <div class="toast-modern-icon">
                    <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
                </div>
                <div class="toast-modern-message">
                    <div class="toast-modern-title">${type === 'success' ? 'Успешно!' : type === 'error' ? 'Ошибка!' : 'Информация'}</div>
                    <div class="toast-modern-text">${message}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ============================================
// MOBILE MENU MANAGER - АДАПТИВНЫЙ БУРГЕР
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
        // Проверяем, не создано ли уже меню
        if (document.querySelector('.mobile-menu-toggle-modern')) return;
        
        // Создаем кнопку мобильного меню
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle-modern';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.setAttribute('aria-label', 'Меню');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.appendChild(menuToggle);
        
        // Создаем оверлей
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
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // Закрываем меню при клике на пункт навигации
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-modern-link') && window.innerWidth < 768) {
                setTimeout(() => this.closeMenu(), 300);
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
            
            // Анимация открытия
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
            
            // Анимация закрытия
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
        this.setupHoverEffects();
        this.setupCounters();
        this.setupProgressBars();
        this.setupTooltips();
        this.setupSmoothScroll();
    }

    setupHoverEffects() {
        // Магнитный эффект для кнопок
        document.querySelectorAll('.btn-modern, .action-card-modern').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                element.style.transform = `
                    translate(${x * 0.1}px, ${y * 0.1}px)
                    scale(1.05)
                `;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }

    setupCounters() {
        // Анимированные счетчики
        const counters = document.querySelectorAll('.stat-value-modern');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.innerText.replace(/[^\d]/g, ''));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.floor(current).toLocaleString('ru-RU');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target.toLocaleString('ru-RU');
                    if (counter.innerText.includes('₽')) {
                        counter.innerText += ' ₽';
                    }
                }
            };
            
            updateCounter();
        };
        
        // Используем Intersection Observer для запуска анимации
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }

    setupProgressBars() {
        // Создаем прогресс-бар для скролла страницы
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--gradient-primary);
            z-index: 10000;
            transition: width 0.3s ease;
            width: 0%;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${progress}%`;
        });
    }

    setupTooltips() {
        // Добавляем тултипы
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip-modern';
                tooltip.innerText = element.dataset.tooltip;
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                
                setTimeout(() => tooltip.style.opacity = '1', 10);
                
                element.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                    setTimeout(() => tooltip.remove(), 300);
                }, { once: true });
            });
        });
    }

    setupSmoothScroll() {
        // Плавный скролл для якорных ссылок
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
}

// ============================================
// SPECIAL EFFECTS
// ============================================

class ModernSpecialEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupCursorEffect();
        this.setupRippleEffect();
        this.setupParallax();
    }

    setupCursorEffect() {
        // Кастомный курсор отключен по просьбе пользователя
        return;
    }

    setupRippleEffect() {
        // Ripple эффект для кнопок
        document.querySelectorAll('.btn-modern, .nav-modern-link').forEach(button => {
            button.addEventListener('click', function(e) {
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
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    transform: scale(0);
                    animation: rippleAnimation 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupParallax() {
        // Параллакс эффект
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            
            document.querySelectorAll('.header-modern').forEach(el => {
                el.style.transform = `translateY(${scrolled * 0.5}px)`;
            });
            
            document.querySelectorAll('.stat-card-modern').forEach((el, index) => {
                el.style.transform = `translateY(${scrolled * 0.1 * (index + 1)}px)`;
            });
        });
    }
}

// ============================================
// CSS ANIMATIONS
// ============================================

const modernAnimations = `
@keyframes floatParticle {
    0% {
        transform: translate(0, 0) rotate(0deg);
        opacity: 0;
    }
    10% {
        opacity: 0.1;
    }
    90% {
        opacity: 0.1;
    }
    100% {
        transform: translate(100px, -100vh) rotate(720deg);
        opacity: 0;
    }
}

@keyframes rippleAnimation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes pulseGlow {
    0%, 100% {
        box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }
    50% {
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.8);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
`;

// Добавляем CSS анимации
const styleSheet = document.createElement('style');
styleSheet.textContent = modernAnimations;
document.head.appendChild(styleSheet);

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем все модули
    window.modernTheme = new ModernThemeManager();
    window.modernMobileMenu = new ModernMobileMenu();
    window.modernUI = new ModernUIEnhancements();
    window.modernEffects = new ModernSpecialEffects();
    
    // Добавляем начальную анимацию
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Приветственное сообщение убрано по просьбе пользователя
    
    console.log('🚀 Modern Theme System Initialized!');
});