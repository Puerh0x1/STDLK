// Navigation Helper for GitHub Pages
(function() {
    // Конфигурация
    const config = {
        baseURL: '/STDLK',
        isGitHubPages: window.location.hostname.includes('github.io'),
        isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    };
    
    // Получить правильный базовый путь
    function getBasePath() {
        if (config.isLocal) {
            return '';
        }
        if (config.isGitHubPages) {
            return config.baseURL;
        }
        return '';
    }
    
    // Исправить все ссылки на странице
    function fixAllLinks() {
        const basePath = getBasePath();
        
        // Пропускаем, если мы на локальном сервере
        if (config.isLocal) {
            return;
        }
        
        // Исправляем все ссылки
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            
            // Пропускаем внешние ссылки и якоря
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                return;
            }
            
            // Определяем текущую страницу
            const currentPath = window.location.pathname;
            const isInPagesDir = currentPath.includes('/pages/');
            
            // Корректируем путь
            let newHref = href;
            
            if (href.startsWith('../')) {
                // Относительный путь вверх
                newHref = basePath + '/' + href.substring(3);
            } else if (href.startsWith('./')) {
                // Относительный путь в текущей директории
                if (isInPagesDir) {
                    newHref = basePath + '/pages/' + href.substring(2);
                } else {
                    newHref = basePath + '/' + href.substring(2);
                }
            } else if (!href.startsWith('/')) {
                // Относительный путь без префикса
                if (isInPagesDir && !href.includes('/')) {
                    // Ссылка на файл в той же директории pages
                    newHref = basePath + '/pages/' + href;
                } else if (!isInPagesDir && href.startsWith('pages/')) {
                    // Ссылка из корня в pages
                    newHref = basePath + '/' + href;
                } else if (!isInPagesDir && !href.includes('/')) {
                    // Ссылка на файл в корне
                    newHref = basePath + '/' + href;
                }
            }
            
            // Обновляем href только если он изменился
            if (newHref !== href && !newHref.includes(basePath + basePath)) {
                link.setAttribute('href', newHref);
            }
        });
        
        // Исправляем пути к изображениям
        document.querySelectorAll('img[src]').forEach(img => {
            const src = img.getAttribute('src');
            
            if (!src || src.startsWith('http') || src.startsWith('data:')) {
                return;
            }
            
            let newSrc = src;
            if (src.startsWith('../')) {
                newSrc = basePath + '/' + src.substring(3);
            } else if (!src.startsWith('/')) {
                if (window.location.pathname.includes('/pages/')) {
                    newSrc = basePath + '/' + src;
                } else {
                    newSrc = basePath + '/' + src;
                }
            }
            
            if (newSrc !== src && !newSrc.includes(basePath + basePath)) {
                img.setAttribute('src', newSrc);
            }
        });
    }
    
    // Запускаем исправление при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixAllLinks);
    } else {
        fixAllLinks();
    }
    
    // Экспортируем для использования в других скриптах
    window.NavigationHelper = {
        getBasePath: getBasePath,
        fixAllLinks: fixAllLinks,
        config: config
    };
})();
