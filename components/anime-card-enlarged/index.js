export class animeComponent {
    constructor(parent) {
        this.parent = parent;
        this.defaultImage = 'https://via.placeholder.com/800x1000?text=No+Image';
        this.errorImage = 'https://via.placeholder.com/800x1000?text=Image+Error';
    }

    render(anime) {
        if (!anime) {
            console.error('Anime data is missing');
            return this.renderErrorState();
        }

        const card = document.createElement('div');
        card.className = 'anime-card-enlarged';
        card.innerHTML = this.generateCardContent(anime);
        this.parent.appendChild(card);
    }

    generateCardContent(anime) {
        const safeTitle = this.escapeHtml(anime.title || 'Без названия');
        const safeDescription = this.escapeHtml(anime.description || 'Описание отсутствует');
        const safeBriefText = anime.brief_text ? this.escapeHtml(anime.brief_text) : null;
        const imageUrl = this.validateImageUrl(anime.src);
        const episodes = anime.episodes || 0;
        const rating = anime.rating ? this.formatRating(anime.rating) : null;
        const year = anime.year || null;
        const genres = anime.genres ? this.formatGenres(anime.genres) : null;

        return `
            <div class="anime-header">
                <div class="image-container">
                    <img class="anime-cover" 
                         src="${imageUrl}" 
                         alt="${safeTitle}"
                         loading="lazy"
                         onerror="this.src='${this.errorImage}'">
                    ${rating ? `<div class="rating-badge">${rating} ★</div>` : ''}
                </div>
                <div class="anime-meta">
                    <h1 class="anime-title">${safeTitle}</h1>
                    <div class="meta-details">
                        ${year ? `<span class="year-badge">${year}</span>` : ''}
                        <span class="episode-badge">${episodes} эпизодов</span>
                    </div>
                    ${genres ? `<div class="genres-container">${genres}</div>` : ''}
                </div>
            </div>
            <div class="anime-content">
                <h3 class="section-title">Описание</h3>
                <p class="anime-description">${safeDescription}</p>
                ${safeBriefText ? `
                <div class="brief-section">
                    <h3 class="section-title">Кратко</h3>
                    <p class="anime-brief">${safeBriefText}</p>
                </div>
                ` : ''}
                ${this.renderAdditionalInfo(anime)}
            </div>
        `;
    }

    renderAdditionalInfo(anime) {
        let additionalInfo = '';
        
        if (anime.studio) {
            additionalInfo += `<p class="info-item"><strong>Студия:</strong> ${this.escapeHtml(anime.studio)}</p>`;
        }
        
        if (anime.director) {
            additionalInfo += `<p class="info-item"><strong>Режиссер:</strong> ${this.escapeHtml(anime.director)}</p>`;
        }
        
        if (anime.release_date) {
            additionalInfo += `<p class="info-item"><strong>Дата выхода:</strong> ${this.formatDate(anime.release_date)}</p>`;
        }
        
        return additionalInfo ? `
            <div class="additional-info">
                <h3 class="section-title">Дополнительная информация</h3>
                ${additionalInfo}
            </div>
        ` : '';
    }

    renderErrorState() {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'anime-error-state';
        errorDiv.innerHTML = `
            <div class="error-content">
                <img src="${this.errorImage}" alt="Ошибка загрузки">
                <h2>Ошибка загрузки данных</h2>
                <p>Не удалось загрузить информацию об аниме</p>
            </div>
        `;
        this.parent.appendChild(errorDiv);
    }

    validateImageUrl(url) {
        if (!url) return this.defaultImage;
        try {
            new URL(url);
            return url;
        } catch {
            return this.defaultImage;
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

    formatRating(rating) {
        return parseFloat(rating).toFixed(1);
    }

    formatGenres(genres) {
        if (Array.isArray(genres)) {
            return genres.map(genre => 
                `<span class="genre-tag">${this.escapeHtml(genre)}</span>`
            ).join('');
        }
        return `<span class="genre-tag">${this.escapeHtml(genres)}</span>`;
    }

    formatDate(dateString) {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    }
}