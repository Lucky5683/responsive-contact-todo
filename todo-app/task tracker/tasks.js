let tasks = [];

// Load tasks from localStorage on page load
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (savedTasks) {
    tasks = savedTasks;
  }
  renderTasks();
};

function saveTasksToStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
  const taskText = document.getElementById('taskInput').value.trim();
  const category = document.getElementById('categorySelect').value;
  const dueDate = document.getElementById('dueDate').value;

  if (!taskText) {
    alert('Please enter a task.');
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    category,
    dueDate,
    done: false,
  };

  tasks.push(newTask);
  saveTasksToStorage();

  document.getElementById('taskInput').value = '';
  document.getElementById('dueDate').value = '';
  renderTasks();
}

function toggleDone(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveTasksToStorage();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasksToStorage();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // Replace the task item with an editable form
  const li = document.querySelector(`li[data-id='${id}']`);
  if (!li) return;

  li.innerHTML = `
    <input type="text" id="editText_${id}" value="${task.text}" style="flex:2; margin-right: 10px;" />
    <select id="editCategory_${id}" style="flex:1; margin-right: 10px;">
      <option value="Personal" ${task.category === 'Personal' ? 'selected' : ''}>Personal</option>
      <option value="Study" ${task.category === 'Study' ? 'selected' : ''}>Study</option>
      <option value="Work" ${task.category === 'Work' ? 'selected' : ''}>Work</option>
    </select>
    <input type="date" id="editDueDate_${id}" value="${task.dueDate}" style="flex:1; margin-right: 10px;" />
    <button onclick="saveEdit(${id})" style="background: #27ae60;">Save</button>
    <button onclick="renderTasks()" style="background: #e74c3c;">Cancel</button>
  `;
}

function saveEdit(id) {
  const newText = document.getElementById(`editText_${id}`).value.trim();
  const newCategory = document.getElementById(`editCategory_${id}`).value;
  const newDueDate = document.getElementById(`editDueDate_${id}`).value;

  if (!newText) {
    alert('Task text cannot be empty.');
    return;
  }

  tasks = tasks.map(task =>
    task.id === id
      ? { ...task, text: newText, category: newCategory, dueDate: newDueDate }
      : task
  );
  saveTasksToStorage();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('taskList');
  const categoryFilter = document.getElementById('filterCategory').value;
  const statusFilter = document.getElementById('filterStatus').value;
  const sortBy = document.getElementById('sortTasks').value;

  list.innerHTML = '';

  let filteredTasks = tasks.filter(task => {
    const categoryMatch = categoryFilter === 'All' || task.category === categoryFilter;
    const statusMatch =
      statusFilter === 'All' ||
      (statusFilter === 'Done' && task.done) ||
      (statusFilter === 'Pending' && !task.done);
    return categoryMatch && statusMatch;
  });

  // Sort tasks
  if (sortBy === 'DueDate') {
    filteredTasks.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  } else if (sortBy === 'Category') {
    filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.className = task.done ? 'done' : '';
    li.innerHTML = `
      <div class="task-text"><strong>${task.text}</strong></div>
      <div class="task-meta">${task.category} | Due: ${task.dueDate || 'None'}</div>
      <div class="task-controls">
        <button onclick="toggleDone(${task.id})">${task.done ? 'Undo' : 'Done'}</button>
        <button onclick="editTask(${task.id})" style="background: #f39c12;">Edit</button>
        <button onclick="deleteTask(${task.id})" style="background: #e74c3c;">Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}
