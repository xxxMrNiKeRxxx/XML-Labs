export class DeleteButtonComponent {
    constructor(parent, onClick) {
        this.parent = parent;
        this.onClick = onClick;
    }

    render() {
        const button = document.createElement('button');
        button.className = 'control-button delete-button';
        button.textContent = 'Удалить первое';
        button.addEventListener('click', this.onClick);
        this.parent.appendChild(button);
    }
}