document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');

    // Инициализация задач из localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Функция сохранения в localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Функция отрисовки списка
    const renderTasks = () => {
        list.innerHTML = '';
        
        if (tasks.length === 0) {
            list.innerHTML = '<p class="empty-state">Список пуст. Добавьте первую задачу!</p>';
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement('li');
            if (task.completed) li.classList.add('completed');

            li.innerHTML = `
                <div class="task-content" onclick="toggleTask(${task.id})">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onclick="event.stopPropagation(); toggleTask(${task.id})">
                    <span class="task-text">${escapeHTML(task.text)}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            list.appendChild(li);
        });
    };

    // Защита от XSS
    const escapeHTML = (str) => {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Добавление новой задачи
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        
        if (text !== '') {
            const newTask = {
                id: Date.now(),
                text: text,
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            input.value = '';
        }
    });

    // Переключение статуса задачи 
    window.toggleTask = (id) => {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    };

    // Удаление задачи
    window.deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    };

    // Первичный рендер
    renderTasks();
});