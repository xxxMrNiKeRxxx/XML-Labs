
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