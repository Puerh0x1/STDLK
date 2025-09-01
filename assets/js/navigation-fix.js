// ============================================
// ИСПРАВЛЕНИЕ НАВИГАЦИИ И ПУТЕЙ
// ============================================

class NavigationFixer {
    constructor() {
        this.baseURL = window.location.origin;
        this.currentPath = window.location.pathname;
        this.projectRoot = '/home/kali/Desktop/STD_LK_TEST';
        this.init();
    }
    
    init() {
        this.fixAllLinks();
        this.setupLinkInterception();
        this.handleBrowserNavigation();
    }
    
    // Определяем правильный путь к файлу
    getCorrectPath(href, currentLocation) {
        // Убираем лишние слеши и нормализуем путь
        href = href.replace(/\/+/g, '/');
        
        // Если это абсолютный URL, оставляем как есть
        if (href.startsWith('http://') || href.startsWith('https://')) {
            return href;
        }
        
        // Если это якорь или специальный протокол
        if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return href;
        }
        
        // Определяем, где мы находимся
        const isInPagesFolder = currentLocation.includes('/pages/');
        const isIndexPage = currentLocation.endsWith('/') || currentLocation.endsWith('/index.html');
        
        // Обработка путей для главной страницы
        if (isIndexPage || currentLocation === '/') {
            if (href.startsWith('pages/')) {
                return href; // Путь уже правильный
            }
            if (href === 'index.html' || href === './index.html') {
                return 'index.html';
            }
            // Для файлов в pages из главной
            if (href.endsWith('.html') && !href.includes('/')) {
                return 'pages/' + href;
            }
        }
        
        // Обработка путей для страниц в папке pages
        if (isInPagesFolder) {
            // Путь к главной странице
            if (href === 'index.html' || href === '../index.html') {
                return '../index.html';
            }
            // Путь к другим страницам в pages
            if (href.endsWith('.html') && !href.includes('/')) {
                return href; // Остаемся в той же папке
            }
            // Если путь начинается с pages/, убираем префикс
            if (href.startsWith('pages/')) {
                return href.substring(6); // Убираем 'pages/'
            }
            // Если путь абсолютный от корня
            if (href.startsWith('/')) {
                return '..' + href;
            }
        }
        
        return href;
    }
    
    // Исправляем все ссылки на странице
    fixAllLinks() {
        const currentLocation = window.location.pathname;
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const originalHref = link.getAttribute('href');
            if (!originalHref) return;
            
            const correctedHref = this.getCorrectPath(originalHref, currentLocation);
            
            // Обновляем href только если он изменился
            if (correctedHref !== originalHref) {
                link.setAttribute('href', correctedHref);
                link.setAttribute('data-original-href', originalHref);
                console.log(`Fixed link: ${originalHref} -> ${correctedHref}`);
            }
        });
    }
    
    // Перехватываем клики по ссылкам
    setupLinkInterception() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Пропускаем внешние ссылки и специальные протоколы
            if (!href || 
                href.startsWith('http://') || 
                href.startsWith('https://') || 
                href.startsWith('#') || 
                href.startsWith('mailto:') || 
                href.startsWith('tel:')) {
                return;
            }
            
            // Предотвращаем стандартное поведение
            e.preventDefault();
            
            // Выполняем правильный переход
            this.navigateToPage(href);
        });
    }
    
    // Навигация на страницу
    navigateToPage(href) {
        // Сохраняем текущую тему
        const currentTheme = document.documentElement.getAttribute('data-theme');
        localStorage.setItem('modern-theme', currentTheme);
        
        // Добавляем анимацию ухода
        const content = document.querySelector('.main-content-modern');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(-20px)';
            content.style.transition = 'all 0.3s ease';
        }
        
        // Выполняем переход
        setTimeout(() => {
            // Используем обычную навигацию вместо сложной логики
            window.location.href = href;
        }, 300);
    }
    
    // Обработка кнопок браузера
    handleBrowserNavigation() {
        window.addEventListener('popstate', () => {
            // При навигации кнопками браузера просто перезагружаем страницу
            window.location.reload();
        });
    }
}

// ============================================
// УПРОЩЕННЫЕ ПЕРЕХОДЫ БЕЗ БАГОВ
// ============================================

class SimplePageTransitions {
    constructor() {
        this.isTransitioning = false;
        this.init();
    }
    
    init() {
        this.addTransitionStyles();
        this.setupNavigation();
    }
    
    addTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .page-transition-active {
                pointer-events: none;
            }
            
            .fade-out {
                animation: fadeOut 0.3s ease forwards;
            }
            
            .fade-in {
                animation: fadeIn 0.4s ease forwards;
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px);
                }
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
        `;
        document.head.appendChild(style);
    }
    
    setupNavigation() {
        // Анимация при загрузке страницы
        window.addEventListener('load', () => {
            const content = document.querySelector('.main-content-modern');
            if (content) {
                content.classList.add('fade-in');
            }
        });
    }
}

// ============================================
// ИСПРАВЛЕНИЕ ПУТЕЙ В SIDEBAR
// ============================================

class SidebarPathFixer {
    constructor() {
        this.init();
    }
    
    init() {
        this.fixSidebarLinks();
    }
    
    fixSidebarLinks() {
        const currentPath = window.location.pathname;
        const isInPages = currentPath.includes('/pages/');
        
        // Находим все ссылки в сайдбаре
        const sidebarLinks = document.querySelectorAll('.nav-modern-link');
        
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            let newHref = href;
            
            // Если мы на главной странице
            if (!isInPages) {
                // Проверяем, что путь правильный для главной
                if (href === 'index.html' || href === './index.html' || href === '../index.html') {
                    newHref = 'index.html';
                } else if (href.endsWith('.html') && !href.includes('/')) {
                    newHref = 'pages/' + href;
                } else if (href.startsWith('../')) {
                    newHref = href.substring(3);
                }
            } 
            // Если мы в папке pages
            else {
                // Путь к главной
                if (href === 'index.html' || href === './index.html') {
                    newHref = '../index.html';
                } 
                // Путь к файлам в pages
                else if (href.startsWith('pages/')) {
                    newHref = href.substring(6);
                }
                // Если уже есть ../
                else if (!href.startsWith('../') && href === 'index.html') {
                    newHref = '../index.html';
                }
            }
            
            // Обновляем href если изменился
            if (newHref !== href) {
                link.setAttribute('href', newHref);
                console.log(`Fixed sidebar link: ${href} -> ${newHref}`);
            }
            
            // Отмечаем активную страницу
            const linkFile = newHref.split('/').pop();
            const currentFile = currentPath.split('/').pop() || 'index.html';
            
            if (linkFile === currentFile) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем исправления навигации
    const navigationFixer = new NavigationFixer();
    const sidebarFixer = new SidebarPathFixer();
    const transitions = new SimplePageTransitions();
    
    console.log('✅ Navigation fixed and initialized');
});

// Экспортируем для глобального доступа
window.NavigationFixer = NavigationFixer;
window.SidebarPathFixer = SidebarPathFixer;
window.SimplePageTransitions = SimplePageTransitions;