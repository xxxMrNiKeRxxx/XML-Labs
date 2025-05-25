import { MainPage } from "../main/index.js";

export class AnimePage {
    constructor(parent, data) {
        this.parent = parent;
        this.data = data;
    }

    render() {
        this.parent.innerHTML = `
            <div class="anime-page">
                <div class="back-container">
                    <button class="back-button" id="back-button">
                        <span class="back-arrow">←</span>
                        <span class="back-text">К списку аниме</span>
                    </button>
                </div>
                
                <div class="anime-player">
                    <img src="${this.data.image}" style="width:100%; max-height:400px; object-fit:cover;">
                </div>
                
                <h1>${this.data.title}</h1>
                <div class="anime-meta">
                    <span class="episode-badge">${this.data.episodes} эпизодов</span>
                    <span class="rating-badge">${this.data.rating}★</span>
                </div>
                
                <p class="anime-description">${this.data.description}</p>
                
                <div class="episodes-section">
                    <h3>Список эпизодов:</h3>
                    <div id="episodes-container" class="episodes-container"></div>
                </div>
            </div>
        `;

        this.renderEpisodes();
        this.setupBackButton();
    }

    setupBackButton() {
        document.getElementById('back-button').addEventListener('click', () => {
            this.parent.innerHTML = '';
            const mainPage = new MainPage(this.parent);
            mainPage.render();
        });
    }

    renderEpisodes() {
        const container = document.getElementById('episodes-container');
        container.innerHTML = '';
        
        for (let i = 1; i <= this.data.episodes; i++) {
            const btn = document.createElement('button');
            btn.className = 'episode-btn';
            btn.textContent = `Эпизод ${i}`;
            btn.onclick = () => this.watchEpisode(i);
            container.appendChild(btn);
        }
    }

    watchEpisode(num) {
        alert(`Запуск эпизода ${num} аниме "${this.data.title}"`);
    }
}