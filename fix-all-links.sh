#!/bin/bash

echo "🔧 Исправление всех ссылок в проекте..."

# Исправляем ссылки в index.html (главная страница)
echo "📝 Обновляю index.html..."
sed -i 's|href="profile.html"|href="pages/profile.html"|g' index.html
sed -i 's|href="portfolio.html"|href="pages/portfolio.html"|g' index.html
sed -i 's|href="education.html"|href="pages/education.html"|g' index.html
sed -i 's|href="courses.html"|href="pages/courses.html"|g' index.html
sed -i 's|href="payments.html"|href="pages/payments.html"|g' index.html
sed -i 's|href="premium.html"|href="pages/premium.html"|g' index.html
sed -i 's|href="work.html"|href="pages/work.html"|g' index.html
sed -i 's|href="projects.html"|href="pages/projects.html"|g' index.html
sed -i 's|href="help.html"|href="pages/help.html"|g' index.html

# Исправляем ссылки в файлах внутри папки pages
echo "📝 Обновляю файлы в pages/..."
for file in pages/*.html; do
    if [ -f "$file" ]; then
        echo "  - $(basename $file)"
        
        # Ссылка на главную
        sed -i 's|href="index.html"|href="../index.html"|g' "$file"
        sed -i 's|href="./index.html"|href="../index.html"|g' "$file"
        
        # Ссылки на другие страницы в pages (убираем префикс pages/ если есть)
        sed -i 's|href="pages/profile.html"|href="profile.html"|g' "$file"
        sed -i 's|href="pages/portfolio.html"|href="portfolio.html"|g' "$file"
        sed -i 's|href="pages/education.html"|href="education.html"|g' "$file"
        sed -i 's|href="pages/courses.html"|href="courses.html"|g' "$file"
        sed -i 's|href="pages/payments.html"|href="payments.html"|g' "$file"
        sed -i 's|href="pages/premium.html"|href="premium.html"|g' "$file"
        sed -i 's|href="pages/work.html"|href="work.html"|g' "$file"
        sed -i 's|href="pages/projects.html"|href="projects.html"|g' "$file"
        sed -i 's|href="pages/help.html"|href="help.html"|g' "$file"
        
        # Исправляем пути к скриптам (убираем page-transitions.js)
        sed -i '/<script src=".*page-transitions.js".*><\/script>/d' "$file"
        
        # Добавляем navigation-fix.js если его нет
        if ! grep -q "navigation-fix.js" "$file"; then
            sed -i 's|<script src="../assets/js/instant-load.js"|<script src="../assets/js/navigation-fix.js"></script>\n    <script src="../assets/js/instant-load.js"|' "$file"
        fi
    fi
done

echo "✅ Все ссылки исправлены!"