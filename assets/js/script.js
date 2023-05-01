// ! =============== Selectors ===============

const taskList = document.querySelector('.tasks'),
    taskInput = document.querySelector('.new-task-input'),
    addButton = document.querySelector('.add-new-task'),
    clearAllButton = document.querySelector('.trash-all-btn'),
    defaultTask = document.querySelector('.default-task'),
    filterOption = document.querySelector('.filter-task');

// ! =============== Event Listeners ===============

document.addEventListener('DOMContentLoaded', getLocalTasks);
addButton.addEventListener('click', addTask);
taskList.addEventListener('click', checkListEvent);
filterOption.addEventListener('click', filterTask);
clearAllButton.addEventListener('click', () => {
    const isOk = confirm('By clicking OK, all tasks will be deleted. \nAre you sure?')
    if (!isOk) return;
    while (taskList.children[0]) {
        removeTask(taskList.children[0]);
    }
});

// ! =============== Functions ===============

function defaultCheck() {
    const otherTasks = document.querySelectorAll('.task.flexx');
    if (otherTasks[0]) {
        defaultTask.classList.add('hide');
    } else {
        defaultTask.classList.remove('hide');
    }
}

function addTask(e) {
    e.preventDefault();
    const taskInputValue = taskInput.value.trim();
    if (!taskInputValue) return;

    // ? Add task 
    taskList.insertAdjacentHTML('beforeend', `
        <div class="task flexx">
            <p class="task-text">${taskInputValue}</p>
            <ul class="subtasks"></ul>
            <div class="actions flexx">
                <button class="trash-btn btn">Delete</button>
            </div>
        </div>
    `);

    // ? Add task to local storage
    saveLocalTasks(taskInputValue);

    defaultCheck();
    taskInput.value = '';
}

function removeTask(task) {
    if (task) {
        removeLocalTasks(task.firstElementChild.innerText);
        task.remove();
        defaultCheck();
    }
}


function checkListEvent(e) {
    const item = e.target;
    // ? delete task
    if (item.classList.contains('trash-btn')) {
        const task = item.parentNode.parentNode;
        task.classList.add('fall');
        removeLocalTasks(task.firstElementChild.innerText);
        setTimeout(() => {
            removeTask(task);
        }, 500);
    }
    // ? check complete
    if (item.classList.contains('task-text')) {
        item.parentNode.classList.toggle('completed');
    }
}



function filterTask(e) {
    const tasks = taskList.children;
    Array.from(tasks).forEach((task) => {
        switch (e.target.value) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'completed':
                if (task.classList.contains('completed')) {
                    task.style.display = 'flex';
                } else {
                    task.style.display = 'none';
                }
                break;
            case 'uncompleted':
                if (task.classList.contains('completed')) {
                    task.style.display = 'none';
                } else {
                    task.style.display = 'flex';
                }
        }
    });
}

function saveLocalTasks(task) {
    // check for previously does anything in the local storage?
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getLocalTasks() {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    tasks.forEach((task) => {
        taskList.insertAdjacentHTML('beforeend', `
            <div class="task flexx">
                <p class="task-text">${task}</p>
                <ul class="subtasks"></ul>
                <div class="actions flexx">
                    <button class="trash-btn btn">Delete</button>
                </div>
            </div>
        `);
    });
    defaultCheck();
}

function removeLocalTasks(task) {
    let tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    const index = tasks.indexOf(task);
    if (index !== -1) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}