export class AddButtonComponent {
    constructor(parent, onClick) {
        this.parent = parent;
        this.onClick = onClick;
    }

    render() {
        const button = document.createElement('button');
        button.className = 'btn primary';
        button.textContent = 'Добавить аниме';
        button.addEventListener('click', this.onClick);
        this.parent.appendChild(button);
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
        btn.innerHTML = '× Удалить первое';
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