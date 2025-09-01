// ============================================
// КОНФИГУРАЦИЯ ДЛЯ GITHUB PAGES
// ============================================

window.SiteConfig = {
    // Название репозитория на GitHub
    baseURL: '/STDLK',
    
    // Определение окружения
    isGitHubPages: window.location.hostname.includes('github.io'),
    isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
    
    // Получить правильный базовый путь
    getBasePath: function() {
        if (this.isLocal) {
            return '';
        }
        if (this.isGitHubPages) {
            return this.baseURL;
        }
        return '';
    },
    
    // Получить правильный путь к ресурсу
    getPath: function(path) {
        const base = this.getBasePath();
        
        // Убираем лишние слеши
        if (path.startsWith('/')) {
            return base + path;
        }
        return base + '/' + path;
    },
    
    // Получить правильный URL для навигации
    getNavigationUrl: function(path) {
        // Для локальной разработки
        if (this.isLocal) {
            return path;
        }
        
        // Для GitHub Pages
        if (this.isGitHubPages) {
            if (path.startsWith('/')) {
                return this.baseURL + path;
            }
            if (path.startsWith('../')) {
                // Переход из pages в корень
                return this.baseURL + '/' + path.substring(3);
            }
            if (path.startsWith('./')) {
                // В той же директории
                const currentPath = window.location.pathname;
                if (currentPath.includes('/pages/')) {
                    return this.baseURL + '/pages/' + path.substring(2);
                }
                return this.baseURL + '/' + path.substring(2);
            }
            // Относительный путь без префикса
            const currentPath = window.location.pathname;
            if (currentPath.includes('/pages/') && !path.includes('/')) {
                return this.baseURL + '/pages/' + path;
            }
            return this.baseURL + '/' + path;
        }
        
        return path;
    }
};

// Автоматическое исправление ссылок при загрузке
if (window.SiteConfig.isGitHubPages) {
    document.addEventListener('DOMContentLoaded', function() {
        // Используем NavigationHelper если он доступен
        if (window.NavigationHelper && window.NavigationHelper.fixAllLinks) {
            window.NavigationHelper.fixAllLinks();
        }
    });
}
