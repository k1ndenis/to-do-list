const tasks = (JSON.parse(localStorage.getItem('tasks')) || []);
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearBtn = document.getElementById('clearBtn');

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.done) {
      span.classList.add('done');
    }
    span.dataset.index = index;
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.dataset.index = index;
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  })
}

renderTasks();

taskList.addEventListener('click', (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;
  if (e.target.tagName === 'SPAN') {
    tasks[index].done = !tasks[index].done;
    e.target.classList.toggle('done');
    tasks.sort((a, b) => a.done - b.done);
    saveTasks();
    renderTasks();
  }
  if (e.target.classList.contains('delete-btn')) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
})

taskInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addTaskFn();
})

addTaskBtn.addEventListener('click', () => addTaskFn());
  
function addTaskFn() {
  const text = taskInput.value;
  if (!text) return;
  tasks.push({ text, done: false });
  tasks.sort((a, b) => a.done - b.done);
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
  setTimeout(() => taskInput.blur(), 5000);
}

clearBtn.addEventListener('click', () => {
  const conf = confirm('Подтвердите действие');
  if (conf) tasks.length = 0;
  saveTasks();
  renderTasks();
})