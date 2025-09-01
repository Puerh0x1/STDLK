#!/bin/bash

echo "🔧 Финальное исправление навигации..."

# Заменяем navigation-fix.js на smart-navigation.js во всех файлах
echo "📝 Обновляю скрипты..."

# В index.html
sed -i 's|navigation-fix\.js|smart-navigation.js|g' index.html

# Во всех файлах в pages
for file in pages/*.html; do
    if [ -f "$file" ]; then
        sed -i 's|navigation-fix\.js|smart-navigation.js|g' "$file"
    fi
done

# Исправляем пути в самих HTML файлах для правильной структуры
echo "📝 Исправляю структуру ссылок в sidebar..."

# Для index.html - ссылки должны вести в pages/
cat > /tmp/fix_index_links.sed << 'EOF'
# Исправляем ссылки в навигации главной страницы
s|href="\.\.\/index\.html"|href="index.html"|g
s|href="profile\.html"|href="pages/profile.html"|g
s|href="portfolio\.html"|href="pages/portfolio.html"|g
s|href="education\.html"|href="pages/education.html"|g
s|href="courses\.html"|href="pages/courses.html"|g
s|href="payments\.html"|href="pages/payments.html"|g
s|href="premium\.html"|href="pages/premium.html"|g
s|href="work\.html"|href="pages/work.html"|g
s|href="projects\.html"|href="pages/projects.html"|g
s|href="help\.html"|href="pages/help.html"|g
EOF

sed -i -f /tmp/fix_index_links.sed index.html

# Для страниц в pages/ - исправляем относительные пути
cat > /tmp/fix_pages_links.sed << 'EOF'
# Исправляем ссылки в навигации для страниц в pages
s|href="index\.html"|href="../index.html"|g
s|href="\.\/index\.html"|href="../index.html"|g
s|href="pages\/profile\.html"|href="profile.html"|g
s|href="pages\/portfolio\.html"|href="portfolio.html"|g
s|href="pages\/education\.html"|href="education.html"|g
s|href="pages\/courses\.html"|href="courses.html"|g
s|href="pages\/payments\.html"|href="payments.html"|g
s|href="pages\/premium\.html"|href="premium.html"|g
s|href="pages\/work\.html"|href="work.html"|g
s|href="pages\/projects\.html"|href="projects.html"|g
s|href="pages\/help\.html"|href="help.html"|g
EOF

for file in pages/*.html; do
    if [ -f "$file" ]; then
        echo "  Обновляю $(basename $file)"
        sed -i -f /tmp/fix_pages_links.sed "$file"
    fi
done

# Чистим временные файлы
rm -f /tmp/fix_index_links.sed /tmp/fix_pages_links.sed

echo "✅ Навигация исправлена!"
echo ""
echo "📌 Структура ссылок:"
echo "  - Из index.html: pages/[страница].html"
echo "  - Из pages/*.html на главную: ../index.html"
echo "  - Из pages/*.html на соседние: [страница].html"
echo ""
echo "🚀 Smart Navigation автоматически адаптирует пути для GitHub Pages!"