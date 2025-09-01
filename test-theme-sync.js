// Проверка синхронизации темы
console.log("Текущая тема из localStorage:", localStorage.getItem("modern-theme"));
console.log("Текущая тема на странице:", document.documentElement.getAttribute("data-theme"));
console.log("BroadcastChannel поддерживается:", typeof BroadcastChannel !== "undefined");
