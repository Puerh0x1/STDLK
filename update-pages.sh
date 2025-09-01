#!/bin/bash

# Скрипт для обновления всех HTML страниц с оптимизированной загрузкой

echo "Обновление страниц для оптимизированной загрузки..."

# Функция для добавления критических стилей в head
add_critical_styles() {
    local file=$1
    
    # Проверяем, не добавлены ли уже критические стили
    if grep -q "Критические inline стили" "$file"; then
        echo "✓ $file уже обновлен"
        return
    fi
    
    # Добавляем критические стили после title
    sed -i '/<title>.*<\/title>/a\
    \
    <!-- Критические inline стили -->\
    <style>\
        html { visibility: hidden; opacity: 0; }\
        :root {\
            --primary: #6366f1;\
            --bg-primary: #ffffff;\
            --bg-secondary: #f8fafc;\
            --text-primary: #0f172a;\
            --border-color: #e2e8f0;\
        }\
        [data-theme="dark"] {\
            --primary: #818cf8;\
            --bg-primary: #0f172a;\
            --bg-secondary: #1e293b;\
            --text-primary: #f1f5f9;\
            --border-color: #334155;\
        }\
        * { margin: 0; padding: 0; box-sizing: border-box; }\
        body {\
            font-family: "Inter", -apple-system, sans-serif;\
            background: var(--bg-primary);\
            color: var(--text-primary);\
            opacity: 0;\
        }\
        .init-loader {\
            position: fixed;\
            top: 0; left: 0;\
            width: 100%; height: 100%;\
            background: var(--bg-primary);\
            z-index: 999999;\
            display: flex;\
            align-items: center;\
            justify-content: center;\
        }\
        .init-loader.hidden { opacity: 0; pointer-events: none; }\
        .init-spinner {\
            width: 40px; height: 40px;\
            border: 3px solid var(--border-color);\
            border-top-color: var(--primary);\
            border-radius: 50%;\
            animation: spin 0.8s linear infinite;\
        }\
        @keyframes spin { to { transform: rotate(360deg); } }\
    </style>\
    \
    <!-- Немедленная инициализация темы -->\
    <script>\
        (function() {\
            const theme = localStorage.getItem("modern-theme") || "light";\
            document.documentElement.setAttribute("data-theme", theme);\
            const meta = document.querySelector("meta[name=\"theme-color\"]");\
            if (meta) meta.content = theme === "dark" ? "#0f172a" : "#6366f1";\
        })();\
    </script>' "$file"
    
    echo "✓ Обновлен $file"
}

# Функция для добавления прелоадера в body
add_preloader() {
    local file=$1
    
    # Проверяем, не добавлен ли уже прелоадер
    if grep -q "init-loader" "$file"; then
        return
    fi
    
    # Добавляем прелоадер после открывающего тега body
    sed -i '/<body>/a\
    <!-- Прелоадер -->\
    <div class="init-loader" id="initLoader">\
        <div class="init-spinner"></div>\
    </div>' "$file"
}

# Функция для обновления скриптов
update_scripts() {
    local file=$1
    
    # Заменяем старые скрипты на новые с defer
    sed -i 's|<script src="\(.*\)modern-theme-improved.js"></script>|<script src="\1instant-load.js" defer></script>\n    <script src="\1page-transitions.js" defer></script>\n    <script src="\1modern-theme-improved.js" defer></script>|g' "$file"
    
    # Добавляем скрипт быстрой инициализации перед закрывающими скриптами
    if ! grep -q "Быстрая инициализация" "$file"; then
        sed -i '/<script src=".*instant-load.js"/i\
    <!-- Быстрая инициализация -->\
    <script>\
        (function() {\
            function showPage() {\
                document.documentElement.style.visibility = "visible";\
                document.documentElement.style.opacity = "1";\
                document.body.style.opacity = "1";\
                document.body.style.transition = "opacity 0.3s ease";\
                const loader = document.getElementById("initLoader");\
                if (loader) {\
                    loader.classList.add("hidden");\
                    setTimeout(() => loader.remove(), 300);\
                }\
            }\
            if (document.readyState === "complete") {\
                showPage();\
            } else {\
                window.addEventListener("load", showPage);\
                setTimeout(showPage, 1500);\
            }\
        })();\
    </script>\
    ' "$file"
    fi
}

# Обновляем все HTML файлы в pages
for file in pages/*.html; do
    if [ -f "$file" ]; then
        add_critical_styles "$file"
        add_preloader "$file"
        update_scripts "$file"
    fi
done

echo "✅ Все страницы обновлены!"
echo "Теперь страницы загружаются мгновенно без мерцания"