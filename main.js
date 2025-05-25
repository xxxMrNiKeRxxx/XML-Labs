import { MainPage } from "./pages/main/index.js";
import { AnimePage } from "./pages/anime/index.js";
import { RedactAnimePage } from "./pages/redact/index.js";

class Router {
    constructor(rootElement) {
        this.root = rootElement;
        this.routes = {
            '/': MainPage,
            '/main': MainPage,
            
            '/anime/:id': AnimePage,
            '/edit/:id': RedactAnimePage,
            '/create': RedactAnimePage
        };
        this.currentPage = null;
        this.init();
    }

    init() {
        // Обработка навигации при загрузке
        window.addEventListener('DOMContentLoaded', () => {
            this.navigate(window.location.pathname);
        });

        // Обработка кликов по ссылкам
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const path = e.target.getAttribute('href');
                this.navigate(path);
            }
        });

        // Обработка изменения истории
        window.addEventListener('popstate', () => {
            this.navigate(window.location.pathname, false);
        });
    }

    async navigate(path, addToHistory = true) {
        // Очищаем текущую страницу
        if (this.currentPage) {
            this.currentPage.unmount?.();
            this.root.innerHTML = '';
        }

        // Ищем подходящий маршрут
        const matchedRoute = this.matchRoute(path);
        if (!matchedRoute) {
            this.show404();
            return;
        }

        const { PageClass, params } = matchedRoute;

        // Добавляем в историю
        if (addToHistory) {
            window.history.pushState(null, '', path);
        }

        // Создаем и рендерим новую страницу
        try {
            this.currentPage = new PageClass(this.root, params);
            await this.currentPage.render();
            document.title = this.getPageTitle(this.currentPage);
            this.updateActiveNavLink(path);
        } catch (error) {
            console.error('Page render error:', error);
            this.showError();
        }
    }

    matchRoute(path) {
        for (const [route, PageClass] of Object.entries(this.routes)) {
            const routeParts = route.split('/');
            const pathParts = path.split('/');

            if (routeParts.length !== pathParts.length) continue;

            let match = true;
            const params = {};

            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    params[routeParts[i].substring(1)] = pathParts[i];
                } else if (routeParts[i] !== pathParts[i]) {
                    match = false;
                    break;
                }
            }

            if (match) {
                return { PageClass, params };
            }
        }
        return null;
    }

    getPageTitle(page) {
        if (page instanceof MainPage) return 'Главная | Аниме каталог';
        
        if (page instanceof AnimePage) return `${page.data?.title || 'Аниме'} | Аниме каталог`;
        if (page instanceof RedactAnimePage) {
            return page.id === -1 ? 'Создание аниме' : 'Редактирование аниме';
        }
        return 'Аниме каталог';
    }

    updateActiveNavLink(currentPath) {
        document.querySelectorAll('[data-link]').forEach(link => {
            const linkPath = link.getAttribute('href');
            link.classList.toggle('active', linkPath === currentPath);
        });
    }

    show404() {
        this.root.innerHTML = `
            <div class="error-page">
                <h1>404</h1>
                <p>Страница не найдена</p>
                <a href="/" data-link>Вернуться на главную</a>
            </div>
        `;
    }

    showError() {
        this.root.innerHTML = `
            <div class="error-page">
                <h1>Ошибка</h1>
                <p>Произошла ошибка при загрузке страницы</p>
                <a href="/" data-link>Вернуться на главную</a>
            </div>
        `;
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
        const router = new Router(root);
        
        // Сохранение состояния перед закрытием
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('lastVisitedPath', window.location.pathname);
        });

        // Восстановление последней страницы
        const lastPath = localStorage.getItem('lastVisitedPath');
        if (lastPath && lastPath !== window.location.pathname) {
            router.navigate(lastPath);
        }
    } else {
        console.error('Root element not found');
    }
});