export class AddButtonComponent {
    constructor(parent, onClick) {
        this.parent = parent;
        this.onClick = onClick;
    }

    render() {
        const button = document.createElement('button');
        button.className = 'control-button';
        button.textContent = 'Добавить аниме';
        button.addEventListener('click', this.onClick);
        this.parent.appendChild(button);
    }
}