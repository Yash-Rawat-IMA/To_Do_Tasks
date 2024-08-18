document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById('task-form').addEventListener('submit', addTask);
document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => displayTask(task));
    checkDueDates(tasks);
    applyDarkMode();
}

function addTask(e) {
    e.preventDefault();
    
    const taskInput = document.getElementById('task-input').value.trim();
    const dueDateInput = document.getElementById('due-date-input').value;

    if (isTaskDuplicate(taskInput)) {
        alert('Task with the same name already exists!');
        return;
    }

    if (isDateInvalid(dueDateInput)) {
        alert('Task due date cannot be before today!');
        return;
    }
    
    const task = {
        id: Date.now(),
        text: taskInput,
        dueDate: dueDateInput,
        completed: false
    };

    displayTask(task);
    saveTask(task);

    document.getElementById('task-input').value = '';
    document.getElementById('due-date-input').value = '';
}

function displayTask(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    li.innerHTML = `
        <span>${task.text} (Due: ${task.dueDate})</span>
        <div class="actions">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            <button class="edit" onclick="editTask(${task.id})">Edit</button>
            <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    taskList.appendChild(li);
}


function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    updateTaskDisplay(id);
}

function editTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskToEdit = tasks.find(task => task.id === id);

    const newTaskText = prompt("Edit task:", taskToEdit.text);
    const newDueDate = prompt("Edit due date:", taskToEdit.dueDate);

    if (newTaskText === null || newTaskText.trim() === "" || isTaskDuplicate(newTaskText, id)) {
        alert('Invalid task name or duplicate task!');
        return;
    }

    if (isDateInvalid(newDueDate)) {
        alert('Task due date cannot be before today!');
        return;
    }

    taskToEdit.text = newTaskText;
    taskToEdit.dueDate = newDueDate;
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateTaskDisplay(id);
}

function deleteTask(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    document.querySelector(`[data-id='${id}']`).remove();
}

function updateTaskDisplay(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(task => task.id === id);
    const taskElement = document.querySelector(`[data-id='${id}']`);

    taskElement.querySelector('span').innerText = `${task.text} (Due: ${task.dueDate})`;
    taskElement.querySelector('input[type="checkbox"]').checked = task.completed;

    taskElement.classList.toggle('completed', task.completed);
}

function isTaskDuplicate(taskText, id = null) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase() && task.id !== id);
}

function isDateInvalid(dueDate) {
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return selectedDate < today;
}

function checkDueDates(tasks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        const dueDate = new Date(task.dueDate);
        if (!task.completed && dueDate.getTime() === today.getTime()) {
            alert(`Task "${task.text}" is due today!`);
        }
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

function applyDarkMode() {
    const darkModeEnabled = JSON.parse(localStorage.getItem('dark-mode'));
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }
}
