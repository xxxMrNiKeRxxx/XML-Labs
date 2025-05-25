export class AnimeCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    render(anime, onClick) {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <div class="card-controls">
                <button class="edit-button">✏️</button>
                <button class="delete-button">🗑️</button>
            </div>
            <img class="anime-cover" 
                 src="${anime.image || anime.src || 'https://www.nzsothebysrealty.com/images/placeholder.png'}" 
                 alt="${anime.title}"
                 onerror="this.src='https://www.nzsothebysrealty.com/images/placeholder.png'}">
            <div class="anime-info">
                <h3 class="anime-title">${anime.title || 'Без названия'}</h3>
                <div class="anime-meta">
                    <span class="episode-badge">${anime.episodes || 0} эп.</span>
                </div>
            </div>
        `;

        // Обработчик клика по карточке
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-controls')) {
                onClick(anime);
            }
        });

        // Обработчик удаления
        card.querySelector('.delete-button').addEventListener('click', (e) => {
            e.stopPropagation();
            card.remove();
        });

        // Обработчик редактирования
        card.querySelector('.edit-button').addEventListener('click', (e) => {
            e.stopPropagation();
            this.editAnime(card, anime);
        });

        this.parent.appendChild(card);
    }

    editAnime(cardElement, animeData) {
        const titleElement = cardElement.querySelector('.anime-title');
        const episodesElement = cardElement.querySelector('.episode-badge');
        
        const newTitle = prompt('Введите новое название:', animeData.title || '');
        if (newTitle !== null) {
            titleElement.textContent = newTitle || 'Без названия';
            animeData.title = newTitle;
        }

        const newEpisodes = prompt('Введите количество эпизодов:', animeData.episodes || 0);
        if (newEpisodes !== null) {
            episodesElement.textContent = `${newEpisodes || 0} эп.`;
            animeData.episodes = newEpisodes;
        }
    }
}