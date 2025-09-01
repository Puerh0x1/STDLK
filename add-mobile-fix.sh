#!/bin/bash

# Скрипт для добавления мобильного меню во все HTML файлы

echo "Добавляем поддержку мобильного меню..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Базовый путь для GitHub Pages
BASE_URL="/STDLK"

# Функция для добавления скрипта в HTML файл
add_mobile_script() {
    local file=$1
    local is_in_pages=$2
    
    # Проверяем, не добавлен ли уже скрипт
    if grep -q "mobile-menu-fix.js" "$file"; then
        echo -e "${YELLOW}⚠ mobile-menu-fix.js уже подключен в $file${NC}"
        return
    fi
    
    # Определяем путь к скрипту
    local script_path="${BASE_URL}/assets/js/mobile-menu-fix.js"
    
    # Добавляем скрипт перед закрывающим тегом body
    sed -i "s|</body>|<script src=\"${script_path}\"></script>\n</body>|" "$file"
    
    echo -e "${GREEN}✓ mobile-menu-fix.js добавлен в $file${NC}"
}

# Обработка index.html
echo -e "\n${YELLOW}=== Обработка index.html ===${NC}"
add_mobile_script "index.html" false

# Обработка файлов в папке pages
echo -e "\n${YELLOW}=== Обработка файлов в папке pages ===${NC}"
for file in pages/*.html; do
    if [ -f "$file" ]; then
        add_mobile_script "$file" true
    fi
done

echo -e "\n${GREEN}✅ Мобильное меню добавлено успешно!${NC}"