import { MainPage } from "./pages/main/index.js";
import { UtilsPage } from "./pages/utils/index.js";

const root = document.getElementById('root');
const mainPage = new MainPage(root);

// Функция для инициализации приложения
async function initApp() {
    // Загружаем главную страницу по умолчанию
    await mainPage.render();
    
    // Инициализируем навигацию
    setupNavigation();
}

// Функция для настройки навигации
function setupNavigation() {
    const homeLink = document.getElementById('home-link');
    const utilsLink = document.getElementById('utils-link');
    
    if (homeLink) {
        homeLink.addEventListener('click', async (e) => {
            e.preventDefault();
            root.innerHTML = '';
            await mainPage.render();
            // После рендера нужно заново установить обработчики
            setupNavigation();
        });
    }
    
    if (utilsLink) {
        utilsLink.addEventListener('click', async (e) => {
            e.preventDefault();
            root.innerHTML = '';
            const utilsPage = new UtilsPage(root);
            await utilsPage.render();
            setupNavigation();
        });
    }
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Обработка обновления страницы
window.addEventListener('beforeunload', () => {
    // Можно добавить сохранение состояния
    localStorage.setItem('lastVisitedPage', window.location.pathname);
});