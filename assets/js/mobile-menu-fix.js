// Mobile Menu Fix for STD LK
(function() {
    'use strict';
    
    // Создаем класс для управления мобильным меню
    class MobileMenuManager {
        constructor() {
            this.sidebar = document.querySelector('.sidebar-modern');
            this.isMenuOpen = false;
            this.mobileBreakpoint = 768;
            this.touchStartX = null;
            this.touchStartY = null;
            
            if (this.sidebar) {
                this.init();
            }
        }
        
        init() {
            // Создаем кнопку мобильного меню
            this.createMobileMenuButton();
            
            // Создаем оверлей
            this.createOverlay();
            
            // Инициализируем обработчики событий
            this.attachEventListeners();
            
            // Проверяем начальное состояние
            this.checkViewport();
            
            // Добавляем стили для мобильной версии
            this.injectMobileStyles();
        }
        
        createMobileMenuButton() {
            // Проверяем, не существует ли уже кнопка
            if (document.querySelector('.mobile-menu-toggle')) {
                return;
            }
            
            const button = document.createElement('button');
            button.className = 'mobile-menu-toggle';
            button.innerHTML = `
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            `;
            button.setAttribute('aria-label', 'Toggle menu');
            button.setAttribute('aria-expanded', 'false');
            
            // Добавляем кнопку в начало body
            document.body.insertBefore(button, document.body.firstChild);
            this.menuButton = button;
        }
        
        createOverlay() {
            // Проверяем, не существует ли уже оверлей
            if (document.querySelector('.mobile-overlay')) {
                return;
            }
            
            const overlay = document.createElement('div');
            overlay.className = 'mobile-overlay';
            document.body.appendChild(overlay);
            this.overlay = overlay;
        }
        
        attachEventListeners() {
            // Клик по кнопке меню
            if (this.menuButton) {
                this.menuButton.addEventListener('click', () => this.toggleMenu());
            }
            
            // Клик по оверлею
            if (this.overlay) {
                this.overlay.addEventListener('click', () => this.closeMenu());
            }
            
            // Клик по ссылкам в меню (закрываем меню после клика)
            const menuLinks = this.sidebar.querySelectorAll('.nav-modern-link');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= this.mobileBreakpoint) {
                        this.closeMenu();
                    }
                });
            });
            
            // Ресайз окна
            window.addEventListener('resize', () => this.handleResize());
            
            // Свайп для закрытия меню
            this.attachSwipeListeners();
            
            // Escape для закрытия меню
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMenu();
                }
            });
        }
        
        attachSwipeListeners() {
            // Touch события для свайпа
            this.sidebar.addEventListener('touchstart', (e) => {
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;
            });
            
            this.sidebar.addEventListener('touchend', (e) => {
                if (!this.touchStartX || !this.touchStartY) {
                    return;
                }
                
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                
                const diffX = this.touchStartX - touchEndX;
                const diffY = this.touchStartY - touchEndY;
                
                // Свайп влево для закрытия меню
                if (Math.abs(diffX) > Math.abs(diffY) && diffX > 50) {
                    this.closeMenu();
                }
                
                this.touchStartX = null;
                this.touchStartY = null;
            });
        }
        
        toggleMenu() {
            if (this.isMenuOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }
        
        openMenu() {
            this.isMenuOpen = true;
            this.sidebar.classList.add('mobile-open');
            this.overlay.classList.add('active');
            this.menuButton.classList.add('active');
            this.menuButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        
        closeMenu() {
            this.isMenuOpen = false;
            this.sidebar.classList.remove('mobile-open');
            this.overlay.classList.remove('active');
            this.menuButton.classList.remove('active');
            this.menuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
        
        handleResize() {
            this.checkViewport();
            
            // Закрываем меню при переходе на десктоп
            if (window.innerWidth > this.mobileBreakpoint && this.isMenuOpen) {
                this.closeMenu();
            }
        }
        
        checkViewport() {
            const isMobile = window.innerWidth <= this.mobileBreakpoint;
            
            if (isMobile) {
                document.body.classList.add('mobile-view');
                this.sidebar.setAttribute('aria-hidden', !this.isMenuOpen);
            } else {
                document.body.classList.remove('mobile-view');
                this.sidebar.setAttribute('aria-hidden', 'false');
                if (this.isMenuOpen) {
                    this.closeMenu();
                }
            }
        }
        
        injectMobileStyles() {
            // Проверяем, не добавлены ли уже стили
            if (document.getElementById('mobile-menu-styles')) {
                return;
            }
            
            const styles = `
                /* Mobile Menu Button */
                .mobile-menu-toggle {
                    display: none;
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 10001;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.95);
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu-toggle:hover {
                    background: #fff;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                }
                
                .mobile-menu-toggle.active {
                    background: #1a1a2e;
                }
                
                .hamburger-line {
                    display: block;
                    width: 22px;
                    height: 2px;
                    background: #333;
                    margin: 5px auto;
                    transition: all 0.3s ease;
                }
                
                .mobile-menu-toggle.active .hamburger-line {
                    background: #fff;
                }
                
                .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
                    transform: rotate(-45deg) translate(5px, -5px);
                }
                
                /* Mobile Overlay */
                .mobile-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9998;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .mobile-overlay.active {
                    opacity: 1;
                }
                
                /* Mobile Responsive Styles */
                @media (max-width: 768px) {
                    .mobile-menu-toggle {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                    
                    .mobile-overlay {
                        display: block;
                        pointer-events: none;
                    }
                    
                    .mobile-overlay.active {
                        pointer-events: auto;
                    }
                    
                    .sidebar-modern {
                        position: fixed !important;
                        left: -280px !important;
                        top: 0 !important;
                        height: 100vh !important;
                        z-index: 9999 !important;
                        transition: left 0.3s ease !important;
                        width: 280px !important;
                        overflow-y: auto !important;
                    }
                    
                    .sidebar-modern.mobile-open {
                        left: 0 !important;
                        box-shadow: 2px 0 15px rgba(0, 0, 0, 0.2);
                    }
                    
                    .content-modern {
                        margin-left: 0 !important;
                        padding: 70px 15px 20px !important;
                    }
                    
                    .header-modern {
                        padding-left: 70px !important;
                    }
                    
                    .sidebar-header-modern {
                        padding: 20px !important;
                    }
                    
                    .nav-modern-link {
                        padding: 12px 20px !important;
                    }
                    
                    .dashboard-grid-modern {
                        grid-template-columns: 1fr !important;
                        gap: 15px !important;
                        padding: 0 !important;
                    }
                    
                    .card-modern {
                        margin-bottom: 15px;
                    }
                    
                    .stat-modern {
                        padding: 15px !important;
                    }
                    
                    .action-card-modern {
                        padding: 15px !important;
                        min-height: auto !important;
                    }
                    
                    .dashboard-section-modern {
                        padding: 15px !important;
                    }
                    
                    .form-section-modern {
                        padding: 15px !important;
                    }
                    
                    .dashboard-title-modern {
                        font-size: 24px !important;
                        margin-bottom: 15px !important;
                    }
                    
                    /* Улучшение читаемости на мобильных */
                    body {
                        font-size: 14px !important;
                    }
                    
                    h1 {
                        font-size: 28px !important;
                    }
                    
                    h2 {
                        font-size: 24px !important;
                    }
                    
                    h3 {
                        font-size: 20px !important;
                    }
                    
                    /* Фиксим переполнение */
                    * {
                        max-width: 100vw !important;
                        word-wrap: break-word !important;
                    }
                    
                    table {
                        display: block !important;
                        overflow-x: auto !important;
                    }
                    
                    /* Адаптивные таблицы */
                    .table-responsive {
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                }
                
                /* Планшеты */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .sidebar-modern {
                        width: 240px !important;
                    }
                    
                    .content-modern {
                        margin-left: 240px !important;
                    }
                    
                    .dashboard-grid-modern {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                
                /* Маленькие мобильные устройства */
                @media (max-width: 480px) {
                    .mobile-menu-toggle {
                        width: 36px;
                        height: 36px;
                        top: 15px;
                        left: 15px;
                    }
                    
                    .hamburger-line {
                        width: 20px;
                    }
                    
                    .content-modern {
                        padding: 60px 10px 15px !important;
                    }
                    
                    .dashboard-grid-modern {
                        gap: 10px !important;
                    }
                    
                    .card-modern,
                    .stat-modern,
                    .action-card-modern {
                        padding: 12px !important;
                    }
                    
                    .dashboard-title-modern {
                        font-size: 20px !important;
                    }
                }
                
                /* Ландшафтная ориентация на мобильных */
                @media (max-width: 768px) and (orientation: landscape) {
                    .sidebar-modern {
                        width: 250px !important;
                    }
                    
                    .content-modern {
                        padding-top: 60px !important;
                    }
                }
                
                /* Улучшение доступности */
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: 0.01ms !important;
                    }
                }
                
                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .mobile-menu-toggle {
                        background: rgba(30, 30, 30, 0.95);
                    }
                    
                    .hamburger-line {
                        background: #fff;
                    }
                    
                    .mobile-menu-toggle.active {
                        background: #2a2a3e;
                    }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'mobile-menu-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
    }
    
    // Инициализация при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new MobileMenuManager();
        });
    } else {
        new MobileMenuManager();
    }
    
    // Экспортируем для глобального доступа
    window.MobileMenuManager = MobileMenuManager;
})();