#!/bin/bash

# Скрипт для исправления проблем с навигацией на GitHub Pages

echo "Исправляем проблемы с навигацией для GitHub Pages..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Базовый путь для GitHub Pages
BASE_URL="/STDLK"

# Функция для исправления путей в HTML файлах
fix_html_paths() {
    local file=$1
    local is_in_pages_dir=$2
    
    echo -e "${YELLOW}Обрабатываем файл: $file${NC}"
    
    # Создаем временный файл
    tmp_file="${file}.tmp"
    
    if [ "$is_in_pages_dir" = true ]; then
        # Для файлов в папке pages
        # Исправляем ссылки на главную страницу
        sed "s|href=\"../index.html\"|href=\"${BASE_URL}/index.html\"|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
        
        # Исправляем ссылки на другие страницы в папке pages
        sed "s|href=\"\([a-z]*\.html\)\"|href=\"${BASE_URL}/pages/\1\"|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
        
        # Исправляем пути к CSS и JS файлам
        sed "s|href=\"../assets/|href=\"${BASE_URL}/assets/|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
        
        sed "s|src=\"../assets/|src=\"${BASE_URL}/assets/|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
    else
        # Для index.html в корне
        # Исправляем ссылки на главную страницу
        sed "s|href=\"index.html\"|href=\"${BASE_URL}/index.html\"|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
        
        # Исправляем ссылки на страницы в папке pages
        sed "s|href=\"pages/\([a-z]*\.html\)\"|href=\"${BASE_URL}/pages/\1\"|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
        
        # Исправляем пути к CSS и JS файлам
        sed "s|href=\"assets/|href=\"${BASE_URL}/assets/|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
        
        sed "s|src=\"assets/|src=\"${BASE_URL}/assets/|g" "$file" > "$tmp_file"
        mv "$tmp_file" "$file"
    fi
    
    echo -e "${GREEN}✓ Файл $file обработан${NC}"
}

# Добавляем JavaScript для динамической корректировки путей
create_navigation_helper() {
    cat > assets/js/navigation-helper.js << 'EOF'
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
EOF
    echo -e "${GREEN}✓ Создан navigation-helper.js${NC}"
}

# Добавляем подключение navigation-helper.js ко всем HTML файлам
add_navigation_helper_to_html() {
    local file=$1
    
    # Проверяем, не добавлен ли уже скрипт
    if grep -q "navigation-helper.js" "$file"; then
        echo -e "${YELLOW}⚠ navigation-helper.js уже подключен в $file${NC}"
        return
    fi
    
    # Определяем правильный путь к скрипту
    if [[ "$file" == *"pages/"* ]]; then
        script_path="${BASE_URL}/assets/js/navigation-helper.js"
    else
        script_path="${BASE_URL}/assets/js/navigation-helper.js"
    fi
    
    # Добавляем скрипт перед закрывающим тегом body
    sed -i "s|</body>|<script src=\"${script_path}\"></script>\n</body>|" "$file"
    
    echo -e "${GREEN}✓ navigation-helper.js добавлен в $file${NC}"
}

# Обработка index.html
echo -e "\n${YELLOW}=== Обработка index.html ===${NC}"
fix_html_paths "index.html" false
add_navigation_helper_to_html "index.html"

# Обработка файлов в папке pages
echo -e "\n${YELLOW}=== Обработка файлов в папке pages ===${NC}"
for file in pages/*.html; do
    if [ -f "$file" ]; then
        fix_html_paths "$file" true
        add_navigation_helper_to_html "$file"
    fi
done

# Создаем helper скрипт
echo -e "\n${YELLOW}=== Создание navigation-helper.js ===${NC}"
create_navigation_helper

# Обновляем config.js
echo -e "\n${YELLOW}=== Обновление config.js ===${NC}"
cat > config.js << 'EOF'
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
EOF

echo -e "${GREEN}✓ config.js обновлен${NC}"

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Все исправления применены успешно!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "\n${YELLOW}Теперь выполните следующие команды:${NC}"
echo -e "1. git add ."
echo -e "2. git commit -m 'Fix navigation for GitHub Pages'"
echo -e "3. git push"
echo -e "\n${YELLOW}После деплоя на GitHub Pages навигация должна работать корректно.${NC}"