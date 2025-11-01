const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");

function saveTasks() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Ошибка при сохранении данных:", e);
  }
}

function createButton(text, className, dataIndex) {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  if (dataIndex !== undefined) button.dataset.index = dataIndex;
  return button;
}

const sortBtn = createButton("Сортировать");
let sortAscending = true;
sortBtn.addEventListener("click", () => {
  if (sortAscending) {
    tasks.sort((a, b) => a.done - b.done);
  } else tasks.sort((a, b) => b.done - a.done);
  sortAscending = !sortAscending;
  saveTasks();
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-item");
    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.done) span.classList.add("done");
    span.dataset.index = index;
    const deleteBtn = createButton("x", "delete-btn", index);
    const editBtn = createButton("✎", "edit-btn", index);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    taskList.appendChild(sortBtn);
  });
}

renderTasks();

taskList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;
  if (e.target.tagName === "SPAN") {
    tasks[index].done = !tasks[index].done;
    e.target.classList.toggle("done");
    saveTasks();
    renderTasks();
  }
  if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
  if (e.target.classList.contains("edit-btn")) {
    startEditing(index);
  }
});

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTaskFn();
});

addTaskBtn.addEventListener("click", () => addTaskFn());

function addTaskFn() {
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text, done: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
  setTimeout(() => taskInput.blur(), 5000);
}

function startEditing(index) {
  const li = taskList.children[index];
  const task = tasks[index];
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.classList.add("edit-input");
  const span = li.querySelector("span");
  li.replaceChild(input, span);
  input.focus();
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finishEditing(index, input.value);
  });
  input.addEventListener("blur", () => finishEditing(index, input.value));
}

function finishEditing(index, newText) {
  if (newText.trim() === "") return;
  tasks[index].text = newText.trim();
  saveTasks();
  renderTasks();
}

clearBtn.addEventListener("click", () => {
  if (tasks.length === 0) return;
  const conf = confirm("Подтвердите действие");
  if (conf) tasks.length = 0;
  saveTasks();
  renderTasks();
});
