import { ajax } from "../../modules/ajax.js";
import { animeURLs } from "../../modules/animeURLs.js";
import { MainPage } from "../main/index.js";

export class RedactanimePage {
    constructor(parent, id = -1) {
        this.parent = parent;
        this.id = id; // -1 для нового аниме
        this.formData = {
            title: '',
            description: '',
            episodes: 0,
            image: ''
        };
    }

    render() {
        this.parent.innerHTML = `
            <div class="redact-page">
                <div class="header">
                    <button id="back-btn" class="back-button">← Назад</button>
                    <h2>${this.id === -1 ? 'Добавление' : 'Редактирование'} аниме</h2>
                </div>
                
                <form id="anime-form" class="anime-form">
                    <div class="form-group">
                        <label>Название *</label>
                        <input type="text" id="title" required 
                               value="${this.formData.title}">
                    </div>
                    
                    <div class="form-group">
                        <label>Ссылка на обложку</label>
                        <input type="url" id="image" 
                               value="${this.formData.image}">
                        <div class="image-preview" id="image-preview"></div>
                    </div>
                    
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea id="description">${this.formData.description}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Количество эпизодов</label>
                        <input type="number" id="episodes" min="0" 
                               value="${this.formData.episodes}">
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn primary">
                            ${this.id === -1 ? 'Создать' : 'Сохранить'}
                        </button>
                        <button type="button" class="btn" id="cancel-btn">Отмена</button>
                    </div>
                </form>
            </div>
        `;

        this.setupPreview();
        this.setupEventListeners();
    }

    setupPreview() {
        const imageInput = document.getElementById('image');
        const preview = document.getElementById('image-preview');
        
        if (imageInput && preview) {
            imageInput.addEventListener('input', () => {
                preview.innerHTML = imageInput.value ? 
                    `<img src="${imageInput.value}" alt="Превью обложки">` : 
                    '<div class="preview-placeholder">Превью появится здесь</div>';
            });
        }
    }

    setupEventListeners() {
        const form = document.getElementById('anime-form');
        const cancelBtn = document.getElementById('cancel-btn');
        const backBtn = document.getElementById('back-btn');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                new MainPage(this.parent).render();
            });
        }

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                new MainPage(this.parent).render();
            });
        }
    }

    async handleSubmit() {
        const formData = {
            title: document.getElementById('title').value.trim(),
            description: document.getElementById('description').value.trim(),
            episodes: parseInt(document.getElementById('episodes').value) || 0,
            src: document.getElementById('image').value.trim()
        };

        if (!formData.title) {
            alert('Пожалуйста, укажите название аниме');
            return;
        }

        try {
            if (this.id === -1) {
                await this._sendCreateRequest(formData);
            } else {
                await this._sendUpdateRequest(formData);
            }
            
            new MainPage(this.parent).render();
        } catch (error) {
            console.error('Ошибка:', error);
            alert(`Ошибка: ${error.message}`);
        }
    }

    _sendCreateRequest(data) {
        return new Promise((resolve, reject) => {
            ajax.post(
                animeURLs.createAnime(),
                data,
                (response, status) => {
                    if (status >= 200 && status < 300) {
                        alert('Аниме успешно добавлено!');
                        resolve();
                    } else {
                        reject(new Error(`Ошибка создания: ${status}`));
                    }
                },
                (error) => reject(error)
            );
        });
    }

    _sendUpdateRequest(data) {
        return new Promise((resolve, reject) => {
            ajax.patch(
                animeURLs.updateAnimeById(this.id),
                data,
                (response, status) => {
                    if (status >= 200 && status < 300) {
                        alert('Изменения сохранены!');
                        resolve();
                    } else {
                        reject(new Error(`Ошибка сохранения: ${status}`));
                    }
                },
                (error) => reject(error)
            );
        });
    }
}