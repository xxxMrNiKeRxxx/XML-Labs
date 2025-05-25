import { AnimeCardComponent } from "../../components/anime-card/index.js";
import { AnimePage } from "../anime/index.js";
import { AddButtonComponent, DeleteButtonComponent, SortButtonComponent } from "../../components/controls/index.js";

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
        description: "Человечество живет в городе, окруженным огромными стенами, защищающими их от титанов."
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
        this.filteredAnime = [...animeData];
    }

    render() {
        this.parent.innerHTML = `
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Поиск аниме..." id="anime-search">
                <div class="search-results" id="search-results"></div>
            </div>
            <div class="controls-container" id="controls-container"></div>
            <div class="anime-grid" id="anime-grid"></div>
        `;

        this.initSearch();
        this.initControls();
        this.renderAnimeGrid();
    }

    initSearch() {
        const searchInput = document.getElementById('anime-search');
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm.length > 0) {
                this.filteredAnime = animeData.filter(anime => 
                    anime.title.toLowerCase().includes(searchTerm) ||
                    anime.description.toLowerCase().includes(searchTerm)
                );
                
                // Показываем подсказки
                searchResults.innerHTML = this.filteredAnime
                    .map(anime => `
                        <div class="search-result-item" data-id="${anime.id}">
                            <div class="search-result-title">${anime.title}</div>
                            <div class="search-result-description">${anime.description.substring(0, 50)}...</div>
                        </div>
                    `)
                    .join('');
                
                searchResults.style.display = 'block';
            } else {
                this.filteredAnime = [...animeData];
                searchResults.style.display = 'none';
            }
            
            this.renderAnimeGrid();
        });

        // Обработка клика по результату поиска
        searchResults.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (item) {
                const id = item.getAttribute('data-id');
                const anime = animeData.find(a => a.id === id);
                if (anime) {
                    new AnimePage(this.parent, anime).render();
                }
            }
        });

        // Скрываем результаты при клике вне поиска
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
    }

    initControls() {
        const container = document.getElementById('controls-container');
        
        new AddButtonComponent(container, () => {
            if (animeData.length === 0) return;
            
            const firstAnime = animeData[0];
            const animeCopy = JSON.parse(JSON.stringify(firstAnime));
            animeCopy.id = Date.now().toString();
            
            animeData.push(animeCopy);
            this.filteredAnime = [...animeData];
            localStorage.setItem('animeData', JSON.stringify(animeData));
            this.renderAnimeGrid();
            
            setTimeout(() => {
                const cards = document.querySelectorAll('.anime-card');
                if (cards.length > 0) {
                    cards[cards.length - 1].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest'
                    });
                }
            }, 100);
        }).render();

        new DeleteButtonComponent(container, () => {
            if (animeData.length > 0) {
                animeData.pop();
                this.filteredAnime = [...animeData];
                localStorage.setItem('animeData', JSON.stringify(animeData));
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
            this.filteredAnime = [...animeData];
            localStorage.setItem('animeData', JSON.stringify(animeData));
            this.renderAnimeGrid();
        }).render();
    }

    renderAnimeGrid() {
        const grid = document.getElementById('anime-grid');
        grid.innerHTML = '';
        
        this.filteredAnime.forEach(anime => {
            const card = new AnimeCardComponent(grid);
            card.render(anime, () => {
                new AnimePage(this.parent, anime).render();
            });
        });
    }
}