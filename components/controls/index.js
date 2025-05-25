export class AddButtonComponent {
    constructor(parent, onClick) {
        this.parent = parent;
        this.onClick = onClick;
    }

    render() {
        const btn = document.createElement('button');
        btn.className = 'control-btn copy-btn';
        btn.innerHTML = `
            <i class="fas fa-clone"></i> 
            <span class="btn-text">Клонировать первое аниме</span>
        `;
        btn.addEventListener('click', this.onClick);
        
        // Добавляем подсказку
        btn.title = "Создает точную копию первой карточки и добавляет в конец списка";
        this.parent.appendChild(btn);
    }
}

export class DeleteButtonComponent {
    constructor(parent, onClick) {
        this.parent = parent;
        this.onClick = onClick;
    }

    render() {
        const btn = document.createElement('button');
        btn.className = 'control-btn delete-btn';
        btn.innerHTML = '× Удалить последнее';
        btn.addEventListener('click', this.onClick);
        this.parent.appendChild(btn);
    }
}

export class SortButtonComponent {
    constructor(parent, onClick) {
        this.parent = parent;
        this.onClick = onClick;
    }

    render() {
        const btn = document.createElement('button');
        btn.className = 'control-btn';
        btn.innerHTML = '⇅ Сортировать';
        btn.addEventListener('click', this.onClick);
        this.parent.appendChild(btn);
    }
}