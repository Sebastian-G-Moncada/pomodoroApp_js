const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const taskInput = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");

renderTime();
renderTasks();

form.addEventListener('submit', e => {
    e.preventDefault();
    if (taskInput.value !== '') {
        createTask(taskInput.value);
        taskInput.value = '';
        renderTasks();
    }
});

function createTask(value) {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false
    };
    tasks.unshift(newTask);
}

function renderTasks() {
    const html = tasks.map(task => {
        return `
        <div class="task">  
            <div class="completed">${task.completed ? `<span class="done">Done</span>` : `<button class="start-button" data-id="${task.id}">Start</button>`}</div>
            <div class="title">${task.title}</div>
        </div>
        `;
    });

    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = html.join("");

    const startButtons = document.querySelectorAll('.task .start-button');

    startButtons.forEach(button => {
        button.addEventListener('click', e => {
            if (!timer) {
                const id = button.getAttribute('data-id');
                startButtonsHandler(id);
                button.textContent = 'In progress...';
            }
        });
    });
}

function startButtonsHandler(id) {
    time = 25*60; // Establecer el tiempo a 5 segundos para pruebas
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;
    renderTime();

    timer = setInterval(() => {
        timerHandler(); // No es necesario pasar 'id' aquí
    }, 1000);
}

function timerHandler() {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timer);
        markCompleted(current);
        timer = null;
        renderTasks();
        startBreak();
    }
}

function startBreak() {
    time = 5*60; // Establecer el tiempo de descanso a 3 segundos para pruebas
    taskName.textContent = 'Break';
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

function timerBreakHandler() {
    time--;
    renderTime();

    if (time === 0) {
        clearInterval(timerBreak);
        timerBreak = null;
        taskName.textContent = "";
        renderTasks();
    }
}

function renderTime() {
    const timeDiv = document.querySelector('#time #value');

    if (timeDiv) {
        const minutes = parseInt(time / 60);
        const seconds = parseInt(time % 60);
        timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
}

function markCompleted(id) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    tasks[taskIndex].completed = true;
}

// Llamada inicial para renderizar las tareas
renderTasks();

