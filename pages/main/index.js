
import { AnimeCardComponent } from "../../components/anime-card/index.js";
import { animePage } from "../anime/index.js";
import { AddButtonComponent, SortButtonComponent, DeleteButtonComponent } from "../../components/controls/index.js";
import { ajax } from "../../modules/ajax.js";
import { animeURLs } from "../../modules/animeURLs.js";
import { RedactanimePage } from "../redact/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.animeData = [];
        this.filteredAnime = [];
        this.sortStatus = 0;
    }

    async render() {
        this.parent.innerHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Поиск аниме..." id="anime-search">
                <div class="search-results" id="search-results"></div>
            </div>
            <div class="controls-container" id="controls-container"></div>
            <div class="anime-grid" id="anime-grid"></div>
            <div class="loading">Загрузка данных...</div>
        `;

        try {
            await this.loadAnimeData();
            this.initSearch();
            this.initControls();
            this.renderAnimeGrid();
        } catch (error) {
            this.showError(error);
        } finally {
            const loadingElement = this.parent.querySelector('.loading');
            if (loadingElement) loadingElement.remove();
        }
    }

    async deleteFirstAnime() {
    if (this.filteredAnime.length === 0) {
        alert('Нет элементов для удаления');
        return;
    }

    const firstAnime = this.filteredAnime[0];
    
    if (!confirm(`Удалить "${firstAnime.title}"?`)) {
        return;
    }

    try {
        await new Promise((resolve, reject) => {
            ajax.delete(
                animeURLs.deleteAnime(firstAnime.id),
                (data, status) => {
                    if (status === 200) {
                        // Удаляем из обоих массивов
                        this.animeData = this.animeData.filter(a => a.id !== firstAnime.id);
                        this.filteredAnime = this.filteredAnime.filter(a => a.id !== firstAnime.id);
                        this.renderAnimeGrid();
                        resolve();
                    } else {
                        reject(new Error(`Ошибка удаления: статус ${status}`));
                    }
                }
            );
        });
    } catch (error) {
        console.error('Delete error:', error);
        alert(`Ошибка при удалении: ${error.message}`);
    }
}


    async loadAnimeData() {
    return new Promise((resolve, reject) => {
        ajax.get(
            animeURLs.getAnimes(),
            (data, status) => {
                console.log('Raw response:', data); // Добавьте для отладки
                
                // Проверяем статус
                if (status !== 200) {
                    reject(new Error(`HTTP error ${status}`));
                    return;
                }

                // Проверяем, что data существует
                if (!data) {
                    reject(new Error('Empty server response'));
                    return;
                }

                // Если данные не массив, пытаемся преобразовать
                let animeArray = data;
                if (!Array.isArray(data)) {
                    // Попробуем найти массив в объекте
                    if (data.data && Array.isArray(data.data)) {
                        animeArray = data.data;
                    } else if (data.items && Array.isArray(data.items)) {
                        animeArray = data.items;
                    } else {
                        reject(new Error('Expected array but got: ' + typeof data));
                        return;
                    }
                }

                // Обработка данных
                try {
                    this.animeData = animeArray.map(item => ({
                        id: item.id,
                        title: item.title || 'No title',
                        description: item.description || '',
                        episodes: item.episodes || 0,
                        image: item.src || item.image || 'placeholder.jpg'
                    }));
                    
                    this.filteredAnime = [...this.animeData];
                    resolve();
                } catch (e) {
                    reject(new Error('Data processing error: ' + e.message));
                }
            }
        );
    });
}

    initSearch() {
        const searchInput = document.getElementById('anime-search');
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            if (searchTerm.length > 0) {
                this.filteredAnime = this.animeData.filter(anime => 
                    anime.title.toLowerCase().includes(searchTerm) ||
                    (anime.description && anime.description.toLowerCase().includes(searchTerm))
                );
                
                // Показываем подсказки (первые 5 результатов)
                searchResults.innerHTML = this.filteredAnime
                    .slice(0, 5)
                    .map(anime => `
                        <div class="search-result-item" data-id="${anime.id}">
                            <div class="search-result-title">${anime.title}</div>
                            <div class="search-result-episodes">Эпизодов: ${anime.episodes}</div>
                        </div>
                    `)
                    .join('');
                
                searchResults.style.display = this.filteredAnime.length ? 'block' : 'none';
            } else {
                this.filteredAnime = [...this.animeData];
                searchResults.style.display = 'none';
            }
            
            this.renderAnimeGrid();
        });

        // Обработка клика по результату поиска
        searchResults.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (item) {
                const id = item.dataset.id;
                const anime = this.animeData.find(a => a.id.toString() === id);
                if (anime) {
                    new AnimePage(this.parent, anime).render();
                }
            }
        });
    }

      initControls() {
        const container = document.getElementById('controls-container');
        
        // 1. Кнопка добавления аниме
        new AddButtonComponent(container, () => {
            this.parent.innerHTML = '';
            new RedactanimePage(this.parent, -1).render();
        }).render();

        // 2. Кнопка сортировки
        new SortButtonComponent(container, () => {
            this.sortStatus = this.sortStatus === 1 ? 2 : 1;
            this.filteredAnime.sort((a, b) => {
                return this.sortStatus === 1 
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            });
            this.renderAnimeGrid();
        }).render();

        // 3. Кнопка удаления первого аниме
        new DeleteButtonComponent(container, () => this.deleteFirstAnime()).render();
    }


        renderAnimeGrid() {
        
        const grid = document.getElementById('anime-grid');
        grid.innerHTML = '';
        
        if (this.filteredAnime.length === 0) {
            grid.innerHTML = '<p class="no-results">Аниме не найдено</p>';
            return;
        }
        
        this.filteredAnime.forEach(anime => {
            const card = new AnimeCardComponent(grid);
            card.render(anime, (selectedAnime) => {
                new animePage(this.parent, selectedAnime).render();
            });
        });
    }

    showError(error) {
        const grid = document.getElementById('anime-grid') || this.parent;
        grid.innerHTML = `
            <div class="error-message">
                <h3>Ошибка загрузки данных</h3>
                <p>${error.message}</p>
                <div class="error-details">
                    <p>Проверьте:</p>
                    <ul>
                        <li>Сервер запущен на ${animeURLs.baseUrl}</li>
                        <li>Эндпоинт /animes доступен</li>
                    </ul>
                </div>
                <button id="retry-btn" class="btn">Попробовать снова</button>
            </div>
        `;
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.render();
        });
    }
}