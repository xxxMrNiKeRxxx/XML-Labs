import {animeComponent} from "../../components/anime-card-enlarged/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import { MainPage } from "../main/index.js";
import { ajax } from "../../modules/ajax.js";
import { animeURLs } from "../../modules/animeURLs.js";


export class animePage {
    constructor(parent, data = {}) {
        this.parent = parent;
        
        // Инициализация данных с значениями по умолчанию
        this.data = {
            image: data.image || 'https://via.placeholder.com/800x400?text=No+Image',
            title: data.title || 'Название не указано',
            description: data.description || 'Описание отсутствует',
            episodes: data.episodes || 0,
            rating: data.rating || 0
        };
    }

    render() {
        // Проверка всех данных перед рендерингом
        if (!this.validateData()) {
            console.error('Invalid anime data:', this.data);
            this.showError();
            return;
        }

        this.parent.innerHTML = this.getTemplate();
        this.renderEpisodes();
        this.setupBackButton();
    }

    validateData() {
        return (
            typeof this.data === 'object' &&
            this.data !== null &&
            typeof this.data.image === 'string' &&
            typeof this.data.title === 'string'
        );
    }

    getTemplate() {
        return `
            <div class="anime-page">
                ${this.getBackButton()}
                ${this.getPoster()}
                ${this.getTitle()}
                ${this.getMeta()}
                ${this.getDescription()}
                ${this.getEpisodesSection()}
            </div>
        `;
    }

    getBackButton() {
        return `
            <div class="back-container">
                <button class="back-button" id="back-button">
                    <span class="back-arrow">←</span>
                    <span class="back-text">К списку аниме</span>
                </button>
            </div>
        `;
    }

    getPoster() {
        return `
            <div class="anime-player">
                <img src="${this.data.image}" 
                     alt="${this.data.title}"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/800x400?text=Image+Error'">
            </div>
        `;
    }

    getTitle() {
        return `<h1>${this.data.title}</h1>`;
    }

    getMeta() {
        return `
            <div class="anime-meta">
                ${this.data.episodes > 0 ? `
                    <span class="episode-badge">
                        ${this.data.episodes} эпизодов
                    </span>
                ` : ''}
                ${this.data.rating > 0 ? `
                    <span class="rating-badge">
                        ${this.data.rating.toFixed(1)}★
                    </span>
                ` : ''}
            </div>
        `;
    }

    getDescription() {
        return this.data.description ? `
            <div class="description-section">
                <h2>Описание</h2>
                <p class="anime-description">${this.data.description}</p>
            </div>
        ` : '';
    }

    getEpisodesSection() {
        return this.data.episodes > 0 ? `
            <div class="episodes-section">
                <h3>Список эпизодов:</h3>
                <div id="episodes-container" class="episodes-container"></div>
            </div>
        ` : '';
    }

    showError() {
        this.parent.innerHTML = `
            <div class="error-container">
                <h2>Ошибка загрузки данных</h2>
                <p>Попробуйте обновить страницу или вернуться позже</p>
                <button id="back-button">Вернуться назад</button>
            </div>
        `;
        this.setupBackButton();
    }

    setupBackButton() {
        const btn = document.getElementById('back-button');
        if (btn) {
            btn.addEventListener('click', () => {
                this.parent.innerHTML = '';
                new MainPage(this.parent).render();
            });
        }
    }

    renderEpisodes() {
        const container = document.getElementById('episodes-container');
        if (!container || this.data.episodes <= 0) return;

        container.innerHTML = '';
        for (let i = 1; i <= this.data.episodes; i++) {
            container.appendChild(this.createEpisodeButton(i));
        }
    }

    createEpisodeButton(num) {
        const btn = document.createElement('button');
        btn.className = 'episode-btn';
        btn.textContent = `Эпизод ${num}`;
        btn.addEventListener('click', () => this.watchEpisode(num));
        return btn;
    }

    watchEpisode(num) {
        console.log(`Запуск эпизода ${num}`, this.data);
    }
}