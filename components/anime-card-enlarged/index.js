export class animeComponent {
    constructor(parent) {
        this.parent = parent;
    }

    render(anime) {
        // Создаем карточку с увеличенным видом
        const card = document.createElement('div');
        card.className = 'anime-card-enlarged';
        card.innerHTML = `
            <div class="anime-header">
                <img class="anime-cover" src="${anime.src || 'https://via.placeholder.com/400x500?text=No+Image'}" 
                     alt="${anime.title}" 
                     onerror="this.src='https://via.placeholder.com/400x500?text=Image+Error'">
                <div class="anime-meta">
                    <h1 class="anime-title">${anime.title || 'Без названия'}</h1>
                    <div class="episode-badge">${anime.episodes || 0} эпизодов</div>
                </div>
            </div>
            <div class="anime-content">
                <h3>Описание:</h3>
                <p class="anime-description">${anime.description || 'Описание отсутствует'}</p>
                ${anime.brief_text ? `<p class="anime-brief">${anime.brief_text}</p>` : ''}
            </div>
        `;
        
        this.parent.appendChild(card);
    }
}