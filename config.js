// ============================================
// КОНФИГУРАЦИЯ ДЛЯ GITHUB PAGES
// ============================================

window.SiteConfig = {
    // Измените это на название вашего репозитория на GitHub
    // Например: если ваш репозиторий https://github.com/username/STDLK
    // то baseURL должен быть '/STDLK'
    baseURL: '/STDLK',
    
    // Для локальной разработки используйте ''
    // baseURL: '',
    
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
        if (path.startsWith('/')) {
            return base + path;
        }
        return base + '/' + path;
    }
};