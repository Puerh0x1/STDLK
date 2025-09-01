// ============================================
// УМНАЯ НАВИГАЦИЯ БЕЗ БАГОВ С ПУТЯМИ
// ============================================

(function() {
    'use strict';
    
    // Определяем базовый путь проекта
    function getBasePath() {
        // Используем конфиг если он доступен
        if (window.SiteConfig && window.SiteConfig.getBasePath) {
            return window.SiteConfig.getBasePath();
        }
        
        const path = window.location.pathname;
        
        // Для GitHub Pages
        if (window.location.hostname.includes('github.io')) {
            // Для вашего конкретного случая - репозиторий STDLK
            return '/STDLK';
        }
        
        // Для локальной разработки
        return '';
    }
    
    // Определяем текущее местоположение
    function getCurrentLocation() {
        const path = window.location.pathname;
        const basePath = getBasePath();
        const cleanPath = basePath ? path.replace(basePath, '') : path;
        
        return {
            isRoot: cleanPath === '/' || cleanPath === '/index.html' || cleanPath === '',
            isInPages: cleanPath.includes('/pages/'),
            currentFile: cleanPath.split('/').pop() || 'index.html',
            basePath: basePath
        };
    }
    
    // Генерируем правильный путь для ссылки
    function generateCorrectPath(href, fromLocation) {
        // Игнорируем внешние ссылки и якоря
        if (!href || href.startsWith('http://') || href.startsWith('https://') || 
            href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return href;
        }
        
        const basePath = fromLocation.basePath;
        
        // Если мы на главной странице
        if (fromLocation.isRoot) {
            // Ссылка на главную
            if (href === 'index.html' || href === './index.html') {
                return basePath + '/index.html';
            }
            // Ссылки на страницы в pages
            if (href.endsWith('.html') && !href.includes('/')) {
                return basePath + '/pages/' + href;
            }
            // Если уже есть pages/ в пути
            if (href.startsWith('pages/')) {
                return basePath + '/' + href;
            }
            // Относительные пути
            if (href.startsWith('./pages/')) {
                return basePath + href.substring(1);
            }
        }
        
        // Если мы в папке pages
        if (fromLocation.isInPages) {
            // Ссылка на главную
            if (href === '../index.html' || href === 'index.html') {
                return basePath + '/index.html';
            }
            // Ссылки на другие страницы в pages
            if (href.endsWith('.html') && !href.includes('/')) {
                return basePath + '/pages/' + href;
            }
            // Если путь начинается с ../
            if (href.startsWith('../')) {
                return basePath + '/' + href.substring(3);
            }
            // Если путь начинается с pages/
            if (href.startsWith('pages/')) {
                return basePath + '/pages/' + href.substring(6);
            }
        }
        
        return href;
    }
    
    // Исправляем все ссылки на странице
    function fixAllLinks() {
        const location = getCurrentLocation();
        const links = document.querySelectorAll('a[href]');
        
        console.log('Current location:', location);
        
        links.forEach(link => {
            const originalHref = link.getAttribute('href');
            const correctedHref = generateCorrectPath(originalHref, location);
            
            if (correctedHref !== originalHref) {
                link.setAttribute('href', correctedHref);
                link.setAttribute('data-original-href', originalHref);
                console.log(`Fixed: ${originalHref} -> ${correctedHref}`);
            }
        });
        
        // Отмечаем активную страницу в меню
        markActiveMenuItem(location);
    }
    
    // Отмечаем активный пункт меню
    function markActiveMenuItem(location) {
        const menuLinks = document.querySelectorAll('.nav-modern-link');
        const currentFile = location.currentFile;
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            const linkFile = href.split('/').pop();
            
            // Удаляем класс active со всех ссылок
            link.classList.remove('active');
            
            // Добавляем active для текущей страницы
            if (linkFile === currentFile) {
                link.classList.add('active');
            } else if (currentFile === '' && linkFile === 'index.html') {
                link.classList.add('active');
            }
        });
    }
    
    // Применяем сохраненную тему
    function applyTheme() {
        const savedTheme = localStorage.getItem('modern-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = savedTheme === 'dark' ? '#0f172a' : '#6366f1';
        }
    }
    
    // Инициализация при загрузке страницы
    function init() {
        // Применяем тему сразу
        applyTheme();
        
        // Исправляем ссылки после загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixAllLinks);
        } else {
            fixAllLinks();
        }
        
        // Перехватываем клики для плавных переходов
        document.addEventListener('click', handleLinkClick);
    }
    
    // Обработка кликов по ссылкам
    function handleLinkClick(e) {
        const link = e.target.closest('a[href]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Игнорируем внешние ссылки и якоря
        if (!href || href.startsWith('http://') || href.startsWith('https://') || 
            href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }
        
        // Добавляем анимацию перехода
        e.preventDefault();
        
        const content = document.querySelector('.main-content-modern');
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(-10px)';
            content.style.transition = 'all 0.2s ease';
        }
        
        // Сохраняем тему перед переходом
        const currentTheme = document.documentElement.getAttribute('data-theme');
        localStorage.setItem('modern-theme', currentTheme);
        
        // Переход на новую страницу
        setTimeout(() => {
            window.location.href = href;
        }, 200);
    }
    
    // Запускаем инициализацию
    init();
    
    // Экспортируем для отладки
    window.SmartNavigation = {
        getBasePath,
        getCurrentLocation,
        generateCorrectPath,
        fixAllLinks
    };
})();