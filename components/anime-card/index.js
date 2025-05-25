export class AnimeCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    render(data, clickHandler) {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <img src="${data.image}" class="anime-cover" alt="${data.title}">
            <div class="anime-info">
                <div class="anime-title">${data.title}</div>
                <div class="anime-meta">
                    <span class="episode-badge">${data.episodes} эп.</span>
                    <span>${data.rating}★</span>
                </div>
            </div>
            <button class="delete-button">Удалить</button>
        `;

        // Находим кнопку удаления в DOM карточки
        const deleteButton = card.querySelector('.delete-button');
        
        // Вешаем обработчик на кнопку удаления
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие, чтобы не сработал clickHandler карточки
            card.remove(); // Удаляем карточку из DOM
        });

        // Обработчик клика по карточке
        card.addEventListener('click', clickHandler);
        
        this.parent.appendChild(card);
    }
}