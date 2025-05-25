export class AnimeCardComponent {
    constructor(parent) {
        this.parent = parent;
        this.defaultImage = 'https://via.placeholder.com/300x450?text=No+Image';
    }

    render(anime, onClick) {
        if (!anime) {
            console.error('Anime data is missing');
            return this.renderErrorCard();
        }

        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = this.getCardHTML(anime);
        this.setupCardInteractions(card, anime, onClick);
        this.parent.appendChild(card);
    }

    getCardHTML(anime) {
        const imageUrl = this.validateImageUrl(anime.image || anime.src);
        const title = this.escapeHtml(anime.title || 'Без названия');
        const episodes = anime.episodes || 0;
        const rating = anime.rating ? this.formatRating(anime.rating) : '';

        return `
            <div class="anime-card-inner">
                <div class="anime-image-container">
                    <img class="anime-cover" 
                         src="${imageUrl}" 
                         alt="${title}"
                         loading="lazy"
                         onerror="this.src='${this.defaultImage}'">
                    ${rating ? `<div class="anime-rating-badge">${rating}</div>` : ''}
                </div>
                <div class="anime-info">
                    <h3 class="anime-title" title="${title}">${title}</h3>
                    <div class="anime-meta">
                        <span class="episode-badge">${episodes} эп.</span>
                        ${anime.year ? `<span class="year-badge">${anime.year}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderErrorCard() {
        const card = document.createElement('div');
        card.className = 'anime-card error-card';
        card.innerHTML = `
            <div class="error-content">
                <img src="${this.defaultImage}" alt="Ошибка загрузки">
                <p>Ошибка загрузки карточки</p>
            </div>
        `;
        this.parent.appendChild(card);
    }

    setupCardInteractions(card, anime, onClick) {
        if (typeof onClick === 'function') {
            card.addEventListener('click', () => onClick(anime));
            card.classList.add('clickable');
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            
            // Добавляем обработчик для клавиатуры
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(anime);
                }
            });
        }
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
}