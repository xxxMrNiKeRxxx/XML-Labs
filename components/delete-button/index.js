export class DeleteButtonComponent {
    constructor(parent, onDeleteSuccess) {
        this.parent = parent;
        this.onDeleteSuccess = onDeleteSuccess; // Колбэк после успешного удаления
    }

    async deleteFirstItem() {
        try {
            const response = await fetch('/api/items/first', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // При необходимости добавить авторизацию:
                    // 'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Обновление интерфейса после успешного удаления
            this.onDeleteSuccess();
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Не удалось выполнить удаление');
        }
    }

    render() {
        const button = document.createElement('button');
        button.className = 'control-button delete-button';
        button.textContent = 'Удалить первое';
        
        // Добавляем обработчик с привязкой контекста
        button.addEventListener('click', () => this.deleteFirstItem());
        
        this.parent.appendChild(button);
    }
}