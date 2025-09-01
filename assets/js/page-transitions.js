// ============================================
// СИСТЕМА ПЛАВНЫХ ПЕРЕХОДОВ МЕЖДУ СТРАНИЦАМИ
// ============================================

class PageTransitionManager {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.createTransitionElements();
        this.setupLinkInterception();
        this.setupInitialAnimation();
        this.preloadPages();
    }

    createTransitionElements() {
        // Создаем оверлей для переходов
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        transitionOverlay.innerHTML = `
            <div class="transition-loader">
                <div class="loader-circle"></div>
                <div class="loader-text">Загрузка...</div>
            </div>
        `;
        document.body.appendChild(transitionOverlay);

        // Создаем прелоадер для начальной загрузки
        const preloader = document.createElement('div');
        preloader.className = 'page-preloader';
        preloader.innerHTML = `
            <div class="preloader-content">
                <div class="preloader-logo">
                    <i class="fas fa-theater-masks"></i>
                </div>
                <div class="preloader-progress">
                    <div class="preloader-progress-bar"></div>
                </div>
                <div class="preloader-text">СТД РФ</div>
            </div>
        `;
        document.body.appendChild(preloader);

        // Добавляем стили для переходов
        const styles = document.createElement('style');
        styles.textContent = `
            /* Оверлей для переходов */
            .page-transition-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }

            .page-transition-overlay.active {
                opacity: 1;
                pointer-events: all;
            }

            .transition-loader {
                text-align: center;
            }

            .loader-circle {
                width: 50px;
                height: 50px;
                border: 3px solid var(--border-color);
                border-top-color: var(--primary);
                border-radius: 50%;
                margin: 0 auto 1rem;
                animation: spin 0.8s linear infinite;
            }

            .loader-text {
                color: var(--text-secondary);
                font-size: 0.9rem;
                font-weight: 500;
            }

            /* Прелоадер */
            .page-preloader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--bg-primary);
                z-index: 100001;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            .page-preloader.hidden {
                opacity: 0;
                transform: scale(1.1);
                pointer-events: none;
            }

            .preloader-content {
                text-align: center;
            }

            .preloader-logo {
                font-size: 4rem;
                color: var(--primary);
                margin-bottom: 2rem;
                animation: pulse 1.5s ease infinite;
            }

            .preloader-progress {
                width: 200px;
                height: 4px;
                background: var(--border-color);
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto 1rem;
            }

            .preloader-progress-bar {
                height: 100%;
                background: var(--gradient-primary);
                width: 0%;
                transition: width 0.3s ease;
                animation: progressAnimation 1s ease forwards;
            }

            .preloader-text {
                color: var(--text-secondary);
                font-size: 1.2rem;
                font-weight: 600;
            }

            /* Анимация загрузки страницы */
            .page-entering {
                animation: pageEnter 0.5s ease forwards;
            }

            .page-leaving {
                animation: pageLeave 0.3s ease forwards;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }

            @keyframes progressAnimation {
                0% { width: 0%; }
                100% { width: 100%; }
            }

            @keyframes pageEnter {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes pageLeave {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }

            /* Fade эффект для контента */
            .main-content-modern {
                animation: fadeIn 0.4s ease;
            }

            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Стиль для активной ссылки */
            .nav-modern-link.transitioning {
                pointer-events: none;
                opacity: 0.6;
            }
        `;
        document.head.appendChild(styles);
    }

    setupInitialAnimation() {
        // Скрываем прелоадер после загрузки страницы
        window.addEventListener('load', () => {
            setTimeout(() => {
                const preloader = document.querySelector('.page-preloader');
                if (preloader) {
                    preloader.classList.add('hidden');
                    setTimeout(() => preloader.remove(), 500);
                }

                // Анимируем появление контента
                const content = document.querySelector('.main-content-modern');
                if (content) {
                    content.classList.add('page-entering');
                }
            }, 500);
        });
    }

    setupLinkInterception() {
        // Перехватываем клики по ссылкам навигации
        document.addEventListener('click', (e) => {
            const link = e.target.closest('.nav-modern-link');
            if (!link || this.isTransitioning) return;

            const href = link.getAttribute('href');
            if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto:')) return;

            // Проверяем, не текущая ли это страница
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const targetPage = href.split('/').pop();
            if (currentPage === targetPage) return;

            e.preventDefault();
            this.navigateToPage(href, link);
        });

        // Поддержка кнопок браузера "Назад" и "Вперед"
        window.addEventListener('popstate', () => {
            this.handlePopState();
        });
    }

    async navigateToPage(href, linkElement) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Добавляем класс для визуальной обратной связи
        if (linkElement) {
            linkElement.classList.add('transitioning');
        }

        const overlay = document.querySelector('.page-transition-overlay');
        const content = document.querySelector('.main-content-modern');

        // Сохраняем текущую тему
        const currentTheme = document.documentElement.getAttribute('data-theme');
        localStorage.setItem('modern-theme', currentTheme);

        // Анимация ухода
        if (content) {
            content.classList.add('page-leaving');
        }

        // Показываем оверлей
        overlay.classList.add('active');

        // Ждем завершения анимации
        await this.wait(300);

        // Переходим на новую страницу
        window.location.href = href;
    }

    handlePopState() {
        // Плавная перезагрузка при навигации браузером
        const content = document.querySelector('.main-content-modern');
        if (content) {
            content.style.opacity = '0';
            setTimeout(() => {
                window.location.reload();
            }, 200);
        }
    }

    preloadPages() {
        // Предзагружаем важные страницы для быстрых переходов
        const importantPages = [
            'index.html',
            'pages/profile.html',
            'pages/portfolio.html',
            'pages/education.html'
        ];

        importantPages.forEach(page => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = page;
            document.head.appendChild(link);
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================
// СИНХРОНИЗАЦИЯ ТЕМЫ МЕЖДУ СТРАНИЦАМИ
// ============================================

class ThemeSynchronizer {
    constructor() {
        this.init();
    }

    init() {
        // Применяем сохраненную тему сразу
        this.applySavedTheme();
        
        // Слушаем изменения темы через BroadcastChannel
        this.setupBroadcastChannel();
        
        // Слушаем изменения в localStorage
        this.setupStorageListener();
        
        // Обновляем тему при фокусе на вкладку
        this.setupFocusListener();
    }

    applySavedTheme() {
        const savedTheme = localStorage.getItem('modern-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Обновляем мета-тег
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = savedTheme === 'dark' ? '#0f172a' : '#6366f1';
        }
    }

    setupBroadcastChannel() {
        try {
            this.channel = new BroadcastChannel('theme-sync');
            
            // Слушаем сообщения от других вкладок
            this.channel.addEventListener('message', (event) => {
                if (event.data.type === 'theme-change') {
                    const newTheme = event.data.theme;
                    document.documentElement.setAttribute('data-theme', newTheme);
                    this.updateThemeToggle(newTheme);
                    
                    // Плавная анимация смены темы
                    this.animateThemeChange();
                }
            });
        } catch (e) {
            console.log('BroadcastChannel not supported, using localStorage fallback');
        }
    }

    setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === 'modern-theme' && event.newValue) {
                const newTheme = event.newValue;
                document.documentElement.setAttribute('data-theme', newTheme);
                this.updateThemeToggle(newTheme);
                this.animateThemeChange();
            }
        });
    }

    setupFocusListener() {
        // Проверяем тему при возврате к вкладке
        window.addEventListener('focus', () => {
            const savedTheme = localStorage.getItem('modern-theme');
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (savedTheme && savedTheme !== currentTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                this.updateThemeToggle(savedTheme);
            }
        });

        // Также проверяем при изменении видимости
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                const savedTheme = localStorage.getItem('modern-theme');
                const currentTheme = document.documentElement.getAttribute('data-theme');
                
                if (savedTheme && savedTheme !== currentTheme) {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                    this.updateThemeToggle(savedTheme);
                }
            }
        });
    }

    updateThemeToggle(theme) {
        const toggle = document.querySelector('.theme-toggle-modern');
        if (toggle) {
            toggle.innerHTML = `<i class="${theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}"></i>`;
        }
    }

    animateThemeChange() {
        // Добавляем плавную анимацию при смене темы
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Метод для отправки изменений темы другим вкладкам
    broadcastThemeChange(theme) {
        // Сохраняем в localStorage
        localStorage.setItem('modern-theme', theme);
        
        // Отправляем через BroadcastChannel
        if (this.channel) {
            this.channel.postMessage({
                type: 'theme-change',
                theme: theme
            });
        }
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

// Запускаем системы при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
    initPageTransitions();
}

function initPageTransitions() {
    // Инициализируем менеджер переходов
    window.pageTransitionManager = new PageTransitionManager();
    
    // Инициализируем синхронизатор темы
    window.themeSynchronizer = new ThemeSynchronizer();
    
    console.log('✨ Page Transitions & Theme Sync initialized!');
}

// Экспортируем для использования в других скриптах
window.PageTransitionManager = PageTransitionManager;
window.ThemeSynchronizer = ThemeSynchronizer;