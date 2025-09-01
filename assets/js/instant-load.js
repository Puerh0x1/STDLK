// ============================================
// INSTANT LOAD - МГНОВЕННАЯ ЗАГРУЗКА БЕЗ МЕРЦАНИЯ
// ============================================

// Критические стили для предотвращения FOUC (Flash of Unstyled Content)
const criticalCSS = `
    /* Скрываем всё до полной загрузки */
    html {
        visibility: hidden;
        opacity: 0;
    }
    
    /* Базовые переменные для темы */
    :root {
        --primary: #6366f1;
        --bg-primary: #ffffff;
        --bg-secondary: #f8fafc;
        --text-primary: #0f172a;
        --border-color: #e2e8f0;
        --transition-base: 250ms;
    }
    
    [data-theme="dark"] {
        --primary: #818cf8;
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --text-primary: #f1f5f9;
        --border-color: #334155;
    }
    
    /* Прелоадер всегда видим */
    .instant-preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.4s ease, transform 0.4s ease;
    }
    
    .instant-preloader.ready {
        opacity: 0;
        transform: scale(0.95);
        pointer-events: none;
    }
    
    .instant-preloader-content {
        text-align: center;
    }
    
    .instant-preloader-logo {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        position: relative;
    }
    
    .instant-preloader-spinner {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 3px solid var(--border-color);
        border-top-color: var(--primary);
        border-radius: 50%;
        animation: instantSpin 0.8s linear infinite;
    }
    
    .instant-preloader-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        color: var(--primary);
    }
    
    .instant-preloader-text {
        color: var(--text-primary);
        font-size: 0.9rem;
        opacity: 0.6;
        font-family: system-ui, -apple-system, sans-serif;
    }
    
    @keyframes instantSpin {
        to { transform: rotate(360deg); }
    }
    
    /* Состояние готовности */
    html.dom-ready {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    /* Плавное появление контента */
    body {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    body.content-ready {
        opacity: 1;
    }
`;

// Вставляем критические стили в head как можно раньше
(function() {
    // Создаем стили
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
    
    // Применяем сохраненную тему сразу
    const savedTheme = localStorage.getItem('modern-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Создаем прелоадер
    const preloader = document.createElement('div');
    preloader.className = 'instant-preloader';
    preloader.innerHTML = `
        <div class="instant-preloader-content">
            <div class="instant-preloader-logo">
                <div class="instant-preloader-spinner"></div>
                <div class="instant-preloader-icon">🎭</div>
            </div>
            <div class="instant-preloader-text">Загрузка...</div>
        </div>
    `;
    
    // Добавляем прелоадер в начало body
    if (document.body) {
        document.body.insertBefore(preloader, document.body.firstChild);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.insertBefore(preloader, document.body.firstChild);
        });
    }
})();

// ============================================
// МЕНЕДЖЕР ЗАГРУЗКИ СТРАНИЦЫ
// ============================================

class InstantLoadManager {
    constructor() {
        this.resourcesLoaded = false;
        this.domReady = false;
        this.animationReady = false;
        this.init();
    }
    
    init() {
        // Отслеживаем состояние DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
        
        // Отслеживаем загрузку всех ресурсов
        window.addEventListener('load', () => this.onResourcesLoaded());
        
        // Таймаут на случай зависания
        setTimeout(() => this.forceShow(), 3000);
        
        // Предзагружаем критические ресурсы
        this.preloadCriticalResources();
    }
    
    onDOMReady() {
        this.domReady = true;
        document.documentElement.classList.add('dom-ready');
        this.checkReadyState();
    }
    
    onResourcesLoaded() {
        this.resourcesLoaded = true;
        this.checkReadyState();
    }
    
    checkReadyState() {
        // Проверяем, всё ли загружено
        if (this.domReady && this.resourcesLoaded && !this.animationReady) {
            this.showContent();
        }
    }
    
    showContent() {
        if (this.animationReady) return;
        this.animationReady = true;
        
        // Плавно показываем контент
        requestAnimationFrame(() => {
            // Скрываем прелоадер
            const preloader = document.querySelector('.instant-preloader');
            if (preloader) {
                preloader.classList.add('ready');
                setTimeout(() => preloader.remove(), 400);
            }
            
            // Показываем контент
            document.body.classList.add('content-ready');
            
            // Запускаем анимации появления
            this.animatePageEntrance();
        });
    }
    
    forceShow() {
        // Принудительно показываем страницу через 3 секунды
        if (!this.animationReady) {
            console.warn('Forced page show after timeout');
            this.showContent();
        }
    }
    
    animatePageEntrance() {
        // Анимируем появление элементов
        const elements = document.querySelectorAll(
            '.sidebar-modern, .header-modern, .stat-card-modern, .activity-item-modern'
        );
        
        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`;
            
            requestAnimationFrame(() => {
                el.style.opacity = '';
                el.style.transform = '';
            });
        });
    }
    
    preloadCriticalResources() {
        // Предзагружаем критические ресурсы
        const criticalResources = [
            '/assets/css/modern-theme-fixed.css',
            '/assets/js/modern-theme-improved.js',
            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ];
        
        criticalResources.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = url.endsWith('.css') ? 'style' : 'script';
            link.href = url;
            document.head.appendChild(link);
        });
    }
}

// ============================================
// ОПТИМИЗИРОВАННЫЕ ПЕРЕХОДЫ
// ============================================

class OptimizedTransitions {
    constructor() {
        this.init();
    }
    
    init() {
        this.interceptLinks();
        this.optimizeImages();
    }
    
    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
            
            e.preventDefault();
            this.navigateWithTransition(href);
        });
    }
    
    async navigateWithTransition(href) {
        // Сохраняем текущее состояние
        const currentTheme = document.documentElement.getAttribute('data-theme');
        localStorage.setItem('modern-theme', currentTheme);
        
        // Создаем оверлей для перехода
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-primary);
            z-index: 999999;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        document.body.appendChild(overlay);
        
        // Показываем оверлей
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        // Предзагружаем следующую страницу
        const response = await fetch(href);
        const html = await response.text();
        
        // Создаем новый документ
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(html, 'text/html');
        
        // Переносим критические стили
        const criticalStyle = document.createElement('style');
        criticalStyle.textContent = criticalCSS;
        newDoc.head.insertBefore(criticalStyle, newDoc.head.firstChild);
        
        // Заменяем текущий документ
        setTimeout(() => {
            document.documentElement.innerHTML = newDoc.documentElement.innerHTML;
            
            // Переинициализируем скрипты
            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.src) {
                    const newScript = document.createElement('script');
                    newScript.src = script.src;
                    script.parentNode.replaceChild(newScript, script);
                }
            });
            
            // Обновляем URL
            window.history.pushState({}, '', href);
            
            // Запускаем менеджер загрузки
            new InstantLoadManager();
        }, 200);
    }
    
    optimizeImages() {
        // Ленивая загрузка изображений
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

// Запускаем менеджер загрузки
const instantLoadManager = new InstantLoadManager();

// Запускаем оптимизированные переходы после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new OptimizedTransitions();
    });
} else {
    new OptimizedTransitions();
}

// Экспортируем для глобального доступа
window.InstantLoadManager = InstantLoadManager;
window.OptimizedTransitions = OptimizedTransitions;