"use strict";


class Model {

   constructor() {
      // Массив с тасками
      this.myTasks = JSON.parse(localStorage.getItem('myTasks')) || [];
   }

   bindTodoListChanged(callback) {
      this.onTodoListChanged = callback;
   }

   _commit(myTasks) {
      this.onTodoListChanged(myTasks);
      localStorage.setItem('myTasks', JSON.stringify(myTasks));
   }

   _filterTodo(filter) {
      this.onTodoListChanged(filter);
      localStorage.setItem('filter', JSON.stringify(filter));
   }
   // Добавляет новый todo к массиву
   addTodo(todoValue) {
      // Задача
      const todo = {
         id: this.myTasks.length > 0 ? this.myTasks[this.myTasks.length - 1].id + 1 : 1,
         value: todoValue,
         completed: false,
      }
      this.myTasks.push(todo);
      this._commit(this.myTasks);

   }

   // Изменяет value задачи по id
   editTodo(id, updatedValue) {
      this.myTasks = this.myTasks.map(todo =>
         todo.id === id ? { id: todo.id, value: updatedValue, completed: todo.completed } : todo
      )

      this._commit(this.myTasks)
   }

   // Изменяет completed задачи по id
   toggleTodo(id) {
      this.myTasks = this.myTasks.map(todo =>
         todo.id === id ? { id: todo.id, value: todo.value, completed: !todo.completed } : todo
      )
      
      this._commit(this.myTasks)
   }

   // Изменение всех задач
   changeAllTasks(completed) {
      this.myTasks = this.myTasks.map((todo) => {
         return this.myTasks.every(todo => todo.completed === true) === completed ? 
            { id: todo.id, value: todo.value, completed: true } : 
            { id: todo.id, value: todo.value, completed: false }
      })

      this._commit(this.myTasks)
   }

   // Удаляет задачу из массива по id
   deleteTodo(id) {
      this.myTasks = this.myTasks.filter(todo => todo.id !== id);

      this._commit(this.myTasks)
   }

   allTodo(){
      this.myTasks;
      this._commit(this.myTasks);
   }

   // Показывает активные задачи
   activeTodo(completed) {
      this.activeTasks = this.myTasks.filter(todo => todo.completed === completed)

      this._filterTodo(this.activeTasks)
   }

   // Показывает выполненные задачи
   completedTodo(completed) {
      this.completedTasks = this.myTasks.filter(todo => todo.completed === completed)

      this._filterTodo(this.completedTasks)
   }

   // Удаляет выполненные задачи
   clearCompletedTodo(completed) {
      this.myTasks = this.myTasks.filter(todo => todo.completed !== completed);

      this._commit(this.myTasks)
   }
}

class View extends Model {
   constructor() {
      super()
      // Доступ к секции
      this.todoApp = this.getElement('section');
      // Форма
      this.form = this.createElement('form');
      this.header = this.createElement('header', 'header');
      // Заголовок
      this.h = this.createElement('h1');
      this.h.textContent = 'Todos';
      // Поле ввода
      this.addInput = this.createElement('input', 'new-todo');
      this.addInput.placeholder = 'What needs to be done?';
      this.addInput.type = 'text';
      // Позиционирование элементов
      this.header.append(this.h, this.addInput);
      // Список
      this.main = this.createElement('section', 'main');
      this.checkBox = this.createElement('input', 'toggle-all');
      this.checkBox.type = 'checkBox';
      this.todoList = this.createElement('ul', 'todo-list');
      // footer
      this.footer = this.createElement('footer', 'footer');
      // Число задач
      this.strong = this.createElement('strong');

      this.span = this.createElement('span', 'todo-count');
      this.spanI = this.createElement('span');
      this.spanI.textContent = ' items';
      this.spanL = this.createElement('span');
      this.spanL.textContent = ' left';
      this.span.append(this.strong, this.spanI, this.spanL);

      // Фильтры для задач
      this.todoFilter = this.createElement('ul', 'filters');   
      // All
      this.allTasksListItem = this.createElement('li');
      this.allTask = this.createElement('button','all');
      this.allTask.textContent = 'All'
      this.allTasksListItem.append(this.allTask);
      // Active
      this.activeTasksListItem = this.createElement('li');
      this.activeTask = this.createElement('button', 'active');
      this.activeTask.textContent = 'Active'
      this.activeTasksListItem.append(this.activeTask);
      // Completed
      this.completedTasksListItem = this.createElement('li');
      this.completedTask = this.createElement('button', 'completed');
      this.completedTask.textContent = 'Completed'
      this.completedTasksListItem.append(this.completedTask);

      this.todoFilter.append(this.allTasksListItem, this.activeTasksListItem, this.completedTasksListItem);
      // Clear completed
      this.clearCompletedTasksBtn = this.createElement('button', 'clear-completed');
      this.clearCompletedTasksBtn.textContent = 'Clear completed';

      this.footer.append(this.span, this.todoFilter, this.clearCompletedTasksBtn);
      this.footer.style.display = 'none';

      this.main.append(this.checkBox, this.todoList);
      this.form.append(this.header);
      this.todoApp.append(this.form, this.main, this.footer);

      this._temporaryTodoText = ''
      this._initLocalListeners()
   }

   // Возврат текста
   get _todoValue() {
      return this.addInput.value
   } 
   // Очистка input после добавления
   _resetAddInput() {
      this.addInput.value = ''
   }

   // // Создать элемент с необязательным классом
   createElement(tag, className) {
      const element = document.createElement(tag);
      if (className) element.classList.add(className)
 
      return element;
   }
 
   // // Получить элемент из DOM
   getElement(selector) {
      const element = document.querySelector(selector);
 
      return element;
   }

   // Отображение задач
   displayTodos(myTasks) {

      // Удалить все узлы
      while (this.todoList.firstChild) {
         this.todoList.removeChild(this.todoList.firstChild)
      }
   
      myTasks.forEach(todo => {

         //footer display
         this.footer.style.display = 'block'
         this.strong.textContent = `${myTasks.filter(todo => todo.completed === false).length}`;

         // Cоздать элемент списка
         let listItem = document.createElement("li");
         listItem.id = todo.id;
         // div
         let vievDiv = document.createElement("div")
         // input toggleBox
         let toggleBox = document.createElement("input");
         toggleBox.className = "toggle";
         toggleBox.type = "checkBox";
         // toggleBox.checked = todo.completed
         // label
         let editLabel = document.createElement("label");
         editLabel.classList.add('editable');
         editLabel.contentEditable = true
         editLabel.textContent = todo.value;
         // button.delete
         let destroyButton = document.createElement("button");  
         destroyButton.className = "destroy";
         //Добавляю классы элементам 
         vievDiv.className = "viev";
         vievDiv.id = listItem.id
         // Создаю узлы в дочерних элементах
         vievDiv.append(toggleBox, editLabel, destroyButton);
         listItem.append(vievDiv);
         this.todoList.append(listItem);
         //Checked
         if (todo.completed) {
            listItem.className = 'completed'
         }
     
      });

      //footer display
      this.displayFooter(myTasks)

   }

   displayFooter(myTasks){
      if (myTasks.length < 1) {
         this.footer.style.display = 'none'
      }
   }

   // Обновить временное состояние
   _initLocalListeners() {
      this.todoList.addEventListener('input', event => {
         if (event.target.className === 'editable') {
            this._temporaryTodoText = event.target.innerText
         }
      })
   }
   // Add
   bindAddTodo(handler) {
      this.form.addEventListener('submit', event => {
         event.preventDefault()
         if (this._todoValue) {
            handler(this._todoValue)
            this._resetAddInput()
         }
      })
   }
   // Delete
   bindDeleteTodo(handler) {
      this.todoList.addEventListener('click', event => {
         if (event.target.className === 'destroy') {
            const id = parseInt(event.target.parentElement.id)
            
            handler(id)
         }
      })
   }
   // Toogle
   bindToggleTodo(handler) {
      this.todoList.addEventListener('change', event => {
         if (event.target.type === 'checkbox') {
            const id = parseInt(event.target.parentElement.id);

            handler(id);
         }
      })
   }
   // toogle all
   bindChangeAllTasks(handler) {
      this.todoApp.addEventListener('click', event => {
         if(event.target.className === 'toggle-all'){

            handler(false)
         }
      })
   }
   // edit
   bindEditTodo(handler) {
      this.todoList.addEventListener('keydown', event => {
         if(event.key == 'Enter') {

            const id = parseInt(event.target.parentElement.id)
  
            handler(id, this._temporaryTodoText)
            this._temporaryTodoText = ''
         }
      })
   }
   // All
   bindAllTodo(handler) {
      this.footer.addEventListener('click', event => {
         if(event.target.className === 'all'){
            handler()
         }
      })
   }
   // Active
   bindActiveTodo(handler) {
      this.footer.addEventListener('click', event => {
         if(event.target.className === 'active'){

            handler(false)
         }
      })
      this.displayFooter(this.myTasks)
   }
   // Completed
   bindCompletedTodo(handler) {
      this.footer.addEventListener('click', event => {
         if(event.target.className === 'completed'){

            handler(true)
         }
      })
   }
   // Clear all completed
   clearCompletedTodo(handler) {
      this.footer.addEventListener('click', event => {
         if(event.target.className === 'clear-completed'){

            handler(true)
         }
      })
   }
}

//Соединяет Model и View
class Controller {

   constructor(model, view) {
      this.model = model;
      this.view = view;
      // Привязка к обработчику
      this.model.bindTodoListChanged(this.onTodoListChanged);
      this.view.bindAddTodo(this.handleAddTodo);
      this.view.bindDeleteTodo(this.handleDeleteTodo);
      this.view.bindToggleTodo(this.handleToggleTodo);
      this.view.bindChangeAllTasks(this.handleChangeAllTasks)
      this.view.bindEditTodo(this.handleEditTodo);
      //
      this.view.bindAllTodo(this.handleAllTodo);
      this.view.bindActiveTodo(this.handleActiveTodo);
      this.view.bindCompletedTodo(this.handleCompletedTodo);
      this.view.clearCompletedTodo(this.handleClearAllCompleted);
      // Показать начальные задачи
      this.onTodoListChanged(this.model.myTasks);
   }
   
   // Отправка завершенного значения в модель
   onTodoListChanged = myTasks => {
      this.view.displayTodos(myTasks)
   }
   // Add
   handleAddTodo = todoValue => {
      this.model.addTodo(todoValue)
   }   
   // Delete
   handleDeleteTodo = id => {
      this.model.deleteTodo(id)
   }
   // Toogle 
   handleToggleTodo = id => {
      this.model.toggleTodo(id)
   }
   // Toogle all 
   handleChangeAllTasks = completed => {
      this.model.changeAllTasks(completed)
   }
   // Edit
   handleEditTodo = (id, todoText) => {
      this.model.editTodo(id, todoText)
   }
   // All
   handleAllTodo = () => {
      this.model.allTodo()
   }
   // Active
   handleActiveTodo = (completed) => {
      this.model.activeTodo(completed)
   }
   // Completed
   handleCompletedTodo = (completed) => {
      this.model.completedTodo(completed)
   }
   // Clear all completed
   handleClearAllCompleted = (completed) => {
      this.model.clearCompletedTodo(completed)
   }
}

const app = new Controller(new Model(), new View());