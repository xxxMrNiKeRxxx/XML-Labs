import { animeURLs } from "../../modules/animeURLs.js";
import { MainPage } from "../main/index.js";

export class RedactAnimePage {
    constructor(parent, id = -1) {
        this.parent = parent;
        this.id = id; // -1 для нового аниме
        this.formData = {
            title: '',
            description: '',
            episodes: 0,
            image: '',
            rating: 0
        };
    }

    async render() {
        // Если редактируем существующее аниме - загружаем данные
        if (this.id !== -1) {
            try {
                await this.loadAnimeData();
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                this.showError('Не удалось загрузить данные аниме');
                return;
            }
        }

        this.parent.innerHTML = `
            <div class="redact-page">
                <div class="header">
                    <button class="back-btn" id="back-btn">← Назад</button>
                    <h2>${this.id === -1 ? 'Добавление' : 'Редактирование'} аниме</h2>
                </div>
                
                <form id="anime-form" class="anime-form">
                    <div class="form-group">
                        <label for="title">Название *</label>
                        <input type="text" id="title" required 
                               value="${this.escapeHtml(this.formData.title)}">
                    </div>
                    
                    <div class="form-group">
                        <label for="image">Ссылка на обложку</label>
                        <input type="url" id="image" 
                               value="${this.escapeHtml(this.formData.image)}">
                        <div class="image-preview" id="image-preview">
                            ${this.formData.image ? `<img src="${this.escapeHtml(this.formData.image)}" alt="Превью">` : ''}
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Описание</label>
                        <textarea id="description">${this.escapeHtml(this.formData.description)}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="episodes">Количество эпизодов</label>
                        <input type="number" id="episodes" min="0" 
                               value="${this.formData.episodes}">
                    </div>
                    
                    <div class="form-group">
                        <label for="rating">Рейтинг (0-10)</label>
                        <input type="number" id="rating" min="0" max="10" step="0.1"
                               value="${this.formData.rating}">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn primary">
                            ${this.id === -1 ? 'Создать' : 'Сохранить'}
                        </button>
                        <button type="button" class="btn" id="cancel-btn">Отмена</button>
                    </div>
                </form>
                
                <div id="error-message" class="error-message"></div>
            </div>
        `;

        this.setupPreview();
        this.setupEventListeners();
    }

    async loadAnimeData() {
        const response = await fetch(animeURLs.getAnimeById(this.id));
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }

        const data = await response.json();
        this.formData = {
            title: data.title || '',
            description: data.description || '',
            episodes: data.episodes || 0,
            image: data.src || data.image || '',
            rating: data.rating || 0
        };
    }

    setupPreview() {
        const imageInput = document.getElementById('image');
        const preview = document.getElementById('image-preview');
        
        imageInput.addEventListener('input', () => {
            const url = imageInput.value.trim();
            if (url) {
                preview.innerHTML = `<img src="${url}" alt="Превью обложки" onerror="this.src='https://via.placeholder.com/300x450?text=Ошибка+загрузки'">`;
            } else {
                preview.innerHTML = '<div class="preview-placeholder">Превью появится здесь</div>';
            }
        });
    }

    setupEventListeners() {
        document.getElementById('anime-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.navigateBack();
        });

        document.getElementById('back-btn').addEventListener('click', () => {
            this.navigateBack();
        });
    }

    async handleSubmit() {
        const formData = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            episodes: parseInt(document.getElementById('episodes').value) || 0,
            src: document.getElementById('image').value.trim(),
            rating: parseFloat(document.getElementById('rating').value) || 0
        };

        if (!formData.title) {
            this.showError('Пожалуйста, укажите название аниме');
            return;
        }

        try {
            if (this.id === -1) {
                await this._sendCreateRequest(formData);
            } else {
                await this._sendUpdateRequest(formData);
            }
            
            this.navigateBack();
        } catch (error) {
            console.error('Ошибка:', error);
            this.showError(error.message || 'Произошла ошибка при сохранении');
        }
    }

    async _sendCreateRequest(data) {
        const response = await fetch(animeURLs.createAnime(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Ошибка создания: ${response.status}`);
        }

        alert('Аниме успешно добавлено!');
    }

    async _sendUpdateRequest(data) {
        const response = await fetch(animeURLs.updateAnimeById(this.id), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Ошибка сохранения: ${response.status}`);
        }

        alert('Изменения сохранены!');
    }

    navigateBack() {
        new MainPage(this.parent).render();
    }

    showError(message) {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}