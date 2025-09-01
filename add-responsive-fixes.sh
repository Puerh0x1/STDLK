#!/bin/bash

# Скрипт для добавления responsive-fixes.css во все HTML файлы

echo "Добавляем responsive-fixes.css для улучшения адаптивности..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Базовый путь для GitHub Pages
BASE_URL="/STDLK"

# Функция для добавления CSS в HTML файл
add_responsive_css() {
    local file=$1
    
    # Проверяем, не добавлен ли уже CSS
    if grep -q "responsive-fixes.css" "$file"; then
        echo -e "${YELLOW}⚠ responsive-fixes.css уже подключен в $file${NC}"
        return
    fi
    
    # Определяем путь к CSS
    local css_path="${BASE_URL}/assets/css/responsive-fixes.css"
    
    # Добавляем CSS после modern-theme-fixed.css
    sed -i "s|</head>|    <link href=\"${css_path}\" rel=\"stylesheet\">\n</head>|" "$file"
    
    echo -e "${GREEN}✓ responsive-fixes.css добавлен в $file${NC}"
}

# Обработка index.html
echo -e "\n${YELLOW}=== Обработка index.html ===${NC}"
add_responsive_css "index.html"

# Обработка файлов в папке pages
echo -e "\n${YELLOW}=== Обработка файлов в папке pages ===${NC}"
for file in pages/*.html; do
    if [ -f "$file" ]; then
        add_responsive_css "$file"
    fi
done

echo -e "\n${GREEN}✅ Responsive fixes добавлены успешно!${NC}"
echo -e "${YELLOW}Теперь сайт должен корректно работать на всех устройствах.${NC}"