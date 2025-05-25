import { AnimeCardComponent } from "../../components/anime-card/index.js";
import { AnimePage } from "../anime/index.js";
import { AddButtonComponent, SortButtonComponent, DeleteButtonComponent } from "../../components/controls/index.js";
import { animeURLs } from "../../modules/animeURLs.js";
import { RedactAnimePage } from "../redact/index.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.animeData = [];
        this.filteredAnime = [];
        this.sortStatus = 0;
        this.searchDebounceTimer = null;
    }

    async render() {
        this.parent.innerHTML = `
            <div class="main-page">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Поиск аниме..." id="anime-search">
                    <div class="search-results" id="search-results"></div>
                </div>
                <div class="controls-container" id="controls-container"></div>
                <div class="anime-grid" id="anime-grid"></div>
                <div class="loading-indicator" id="loading-indicator">Загрузка данных...</div>
            </div>
        `;

        try {
            await this.loadAnimeData();
            this.initSearch();
            this.initControls();
            this.renderAnimeGrid();
        } catch (error) {
            console.error('Render error:', error);
            this.showError(error);
        } finally {
            this.hideLoading();
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
            const response = await fetch(animeURLs.deleteAnime(firstAnime.id), {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Ошибка удаления: статус ${response.status}`);
            }

            // Удаляем из обоих массивов
            this.animeData = this.animeData.filter(a => a.id !== firstAnime.id);
            this.filteredAnime = this.filteredAnime.filter(a => a.id !== firstAnime.id);
            this.renderAnimeGrid();
        } catch (error) {
            console.error('Delete error:', error);
            alert(`Ошибка при удалении: ${error.message}`);
        }
    }

    async loadAnimeData() {
        this.showLoading();
        
        try {
            const response = await fetch(animeURLs.getAnimes());
            
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json();
            
            // Обработка различных форматов ответа
            let animeArray = data;
            if (!Array.isArray(data)) {
                if (data.data && Array.isArray(data.data)) {
                    animeArray = data.data;
                } else if (data.items && Array.isArray(data.items)) {
                    animeArray = data.items;
                } else {
                    throw new Error('Expected array but got: ' + typeof data);
                }
            }

            this.animeData = animeArray.map(item => ({
                id: item.id,
                title: item.title || 'No title',
                description: item.description || '',
                episodes: item.episodes || 0,
                image: item.src || item.image || 'placeholder.jpg',
                rating: item.rating || 0
            }));
            
            this.filteredAnime = [...this.animeData];
        } catch (error) {
            console.error('Load anime data error:', error);
            throw error;
        }
    }

    initSearch() {
        const searchInput = document.getElementById('anime-search');
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchDebounceTimer);
            
            this.searchDebounceTimer = setTimeout(() => {
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
                                <img src="${anime.image}" alt="${anime.title}" class="search-result-image">
                                <div class="search-result-info">
                                    <div class="search-result-title">${anime.title}</div>
                                    <div class="search-result-meta">
                                        <span>${anime.episodes} эп.</span>
                                        <span>${anime.rating.toFixed(1)}★</span>
                                    </div>
                                </div>
                            </div>
                        `)
                        .join('');
                    
                    searchResults.style.display = this.filteredAnime.length ? 'block' : 'none';
                } else {
                    this.filteredAnime = [...this.animeData];
                    searchResults.style.display = 'none';
                }
                
                this.renderAnimeGrid();
            }, 300);
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
            new RedactAnimePage(this.parent, -1).render();
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
                new AnimePage(this.parent, selectedAnime).render();
            });
        });
    }

    showLoading() {
        const loader = document.getElementById('loading-indicator');
        if (loader) loader.style.display = 'block';
    }

    hideLoading() {
        const loader = document.getElementById('loading-indicator');
        if (loader) loader.style.display = 'none';
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
                        <li>Сетевое подключение активно</li>
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