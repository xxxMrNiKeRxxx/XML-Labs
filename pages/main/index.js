import { AnimeCardComponent } from "../../components/anime-card/index.js";
import { AnimePage } from "../anime/index.js";
import { AddButtonComponent, DeleteButtonComponent, SortButtonComponent } from "../../components/controls/index.js";
import { 
    calculateAverage, 
    sumOfSquares,
    groupAnagrams
} from "../../utils.js";
const animeData = [
    {
        id: "1",
        title: "Наруто: Ураганные хроники",
        image: "https://avatars.mds.yandex.net/i?id=9fec54d9c6a3263e0e916c7525e40a16_l-5884402-images-thumbs&n=13",
        episodes: 500,
        rating: 8.7,
        description: "История о Наруто Узумаки, шумном ниндзя-подростке, который мечтает достичь звания Хокаге."
    },
    {
        id: "2",
        title: "Атака титанов",
        image: "https://i.pinimg.com/736x/77/94/c5/7794c5dbef05eb983d6779da80ff3c19.jpg",
        episodes: 75,
        rating: 9.5,
        description: "Человечество живет в городах, окруженных огромными стенами, защищающими от титанов."
    },
    {
        id: "3",
        title: "Магическая битва",
        image: "https://api.azbooka.ru/upload/iblock/599/m74in1pxcm9l8mbl4z7rrzn8hwy47rhv.jpg",
        episodes: 24,
        rating: 9.0,
        description: "История о Юдзи Итадори, который становится сосудом для могущественного проклятия."
    }
];
export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.sortStatus = 0;
        this.filteredAnime = null;
        this.showAnagrams = false;
        this.showStats = true;
    }

    render() {
        this.parent.innerHTML = `
            <div class="header-panel">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Поиск аниме..." id="anime-search">
                    <div class="search-results" id="search-results"></div>
                </div>
                
                <div class="control-panel">
                    <div class="controls-container" id="controls-container"></div>
                    <button id="toggle-anagrams" class="toggle-btn">
                        <i class="fas fa-font"></i> Анаграммы
                    </button>
                    <button id="toggle-stats" class="toggle-btn">
                        <i class="fas fa-chart-bar"></i> Статистика
                    </button>
                </div>
            </div>
            
            <div class="anime-grid" id="anime-grid"></div>
        `;

        this.initSearch();
        this.initControls();
        this.setupToggleButtons();
        this.renderAnimeGrid();
    }

    initSearch() {
        const searchInput = document.getElementById('anime-search');
        const resultsContainer = document.getElementById('search-results');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length < 1) {
                resultsContainer.style.display = 'none';
                this.filteredAnime = null;
                this.renderAnimeGrid();
                return;
            }

            const results = animeData.filter(anime => 
                anime.title.toLowerCase().includes(query) ||
                anime.description.toLowerCase().includes(query) ||
                anime.tags.some(tag => tag.includes(query))
            );

            this.showSearchResults(results);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                resultsContainer.style.display = 'none';
            }
        });
    }

    setupToggleButtons() {
        document.getElementById('toggle-anagrams').addEventListener('click', () => {
            this.showAnagrams = !this.showAnagrams;
            this.renderAnimeGrid();
        });

        document.getElementById('toggle-stats').addEventListener('click', () => {
            this.showStats = !this.showStats;
            this.renderAnimeGrid();
        });
    }

    renderAnimeGrid() {
        const grid = document.getElementById('anime-grid');
        grid.innerHTML = '';

        // Статистика
        if (this.showStats && !this.filteredAnime) {
            const ratings = animeData.map(a => parseFloat(a.rating));
            const stats = document.createElement('div');
            stats.className = 'anime-stats';
            stats.innerHTML = `
                <div class="stat-card">
                    <h3><i class="fas fa-chart-pie"></i> Статистика</h3>
                    <p><i class="fas fa-star"></i> Средний рейтинг: ${calculateAverage(ratings)}</p>
                    <p><i class="fas fa-square"></i> Сумма квадратов: ${sumOfSquares(ratings)}</p>
                    <p><i class="fas fa-film"></i> Всего аниме: ${animeData.length}</p>
                </div>
            `;
            grid.appendChild(stats);
        }

        // Фильтрация анаграмм
        if (this.showAnagrams) {
            const titles = animeData.map(a => a.title);
            const anagramGroups = groupAnagrams(titles)
                .filter(group => group.length > 1);

            if (anagramGroups.length > 0) {
                const anagramHeader = document.createElement('h2');
                anagramHeader.className = 'section-header';
                anagramHeader.innerHTML = '<i class="fas fa-font"></i> Группы анаграмм';
                grid.appendChild(anagramHeader);

                anagramGroups.forEach(group => {
                    const groupElement = document.createElement('div');
                    groupElement.className = 'anagram-group';
                    groupElement.innerHTML = `
                        <h3>${group.join(' ↔ ')}</h3>
                        <div class="anagram-cards"></div>
                    `;
                    
                    const cardsContainer = groupElement.querySelector('.anagram-cards');
                    
                    animeData
                        .filter(a => group.includes(a.title))
                        .forEach(anime => {
                            const card = new AnimeCardComponent(cardsContainer);
                            card.render(anime, () => {
                                new AnimePage(this.parent, anime).render();
                            });
                        });
                    
                    grid.appendChild(groupElement);
                });
            }
        }

        // Обычный список
        const dataToRender = this.filteredAnime || animeData;
        if (!this.showAnagrams || this.filteredAnime) {
            dataToRender.forEach(anime => {
                const card = new AnimeCardComponent(grid);
                card.render(anime, () => {
                    new AnimePage(this.parent, anime).render();
                });
            });
        }
    }

    initControls() {
        const container = document.getElementById('controls-container');
        
        new AddButtonComponent(container, () => {
            if (animeData.length === 0) return;
            
            const firstAnime = animeData[0];
            const animeCopy = { 
                ...JSON.parse(JSON.stringify(firstAnime)),
                id: Date.now().toString(),
                title: `${firstAnime.title} (копия)`
            };
            
            animeData.push(animeCopy);
            this.renderAnimeGrid();
        }).render();

        new DeleteButtonComponent(container, () => {
            if (animeData.length > 0) {
                animeData.pop();
                this.renderAnimeGrid();
            }
        }).render();

        new SortButtonComponent(container, () => {
            this.sortStatus = this.sortStatus === 1 ? 2 : 1;
            animeData.sort((a, b) => 
                this.sortStatus === 1 
                    ? a.title.localeCompare(b.title) 
                    : b.title.localeCompare(a.title)
            );
            this.renderAnimeGrid();
        }).render();
    }

    showSearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';

        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
            resultsContainer.style.display = 'block';
            return;
        }

        results.forEach(anime => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <img src="${anime.image}" class="search-result-img">
                <div>
                    <h4>${anime.title}</h4>
                    <p>${anime.description.substring(0, 50)}...</p>
                </div>
            `;
            item.addEventListener('click', () => {
                new AnimePage(this.parent, anime).render();
            });
            resultsContainer.appendChild(item);
        });

        resultsContainer.style.display = 'block';
    }
    
}