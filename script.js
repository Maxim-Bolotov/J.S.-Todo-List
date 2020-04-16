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

   // Добавляет новый todo к массиву
   addTodo(todoValue) {
      // Задача
      const todo = {
         id: this.myTasks.length > 0 ? this.myTasks[this.myTasks.length - 1].id + 1 : 1,
         value: todoValue,
         completed: false,
      }
      this.myTasks.push(todo);

      this._commit(this.myTasks)
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

   // Фильтрует задачу из массива по id
   deleteTodo(id) {
      this.myTasks = this.myTasks.filter(todo => todo.id !== id);

      this._commit(this.myTasks)
   }

   
}

class View extends Model {
   constructor() {
      super()
      console.log(this.myTasks);
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
      this.span = this.createElement('span', 'todo-count');
      this.strong = this.createElement('strong');
      this.strong.textContent = '1';
      this.spanI = this.createElement('span');
      this.spanI.textContent = ' items';
      this.spanL = this.createElement('span');
      this.spanL.textContent = ' left';
      this.span.append(this.strong, this.spanI, this.spanL);
      // Фильтры для задач
      this.filtres = this.createElement('ul', 'filtres');

      this.footer.append(this.span, this.filtres);

      this.footer.style.display = this.myTasks.length ? 'block' : 'none';

      this.main.append(this.checkBox, this.todoList);
      this.form.append(this.header);
      this.todoApp.append(this.form, this.main, this.footer);
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

         // Cоздать элемент списка
         let listItem = document.createElement("li");
         listItem.id = todo.id;
         // div
         let vievDiv = document.createElement("div")
         // input toggleBox
         let toggleBox = document.createElement("input");
         // label
         let label = document.createElement("label");
         // button.delete
         let destroyButton = document.createElement("button");
         // input (text)
         let editInput = document.createElement("input");
         //Добавляю классы элементам 
         vievDiv.className = "viev";
         vievDiv.id = listItem.id
         toggleBox.className = "toggle";

         // toggleBox.checked = todo.completed
         destroyButton.className = "destroy";
         editInput.classList.add('edit')

         toggleBox.type = "checkBox";
         // Текст 
         label.textContent = todo.value;
         editInput.textContent = todo.value;
         // Создаю узлы в дочерних элементах
         vievDiv.append(toggleBox, label, destroyButton);
         listItem.append(vievDiv, editInput);

         this.todoList.append(listItem);

         if (todo.completed) {
            listItem.className = 'completed'
         }
         
      });

   }
   // Добавить задачу
   bindAddTodo(handler) {
      this.form.addEventListener('submit', event => {
         event.preventDefault()
         if (this._todoValue) {
            handler(this._todoValue)
            this._resetAddInput()
         }
      })
   }
   // Удалить задачу
   bindDeleteTodo(handler) {
      this.todoList.addEventListener('click', event => {
         if (event.target.className === 'destroy') {
            const id = parseInt(event.target.parentElement.id)
            
            handler(id)
         }
      })
   }
   // checkbox
   bindToggleTodo(handler) {
      this.todoList.addEventListener('change', event => {
         if (event.target.type === 'checkbox') {
            const id = parseInt(event.target.parentElement.id);

            handler(id);
         }
      })
   }
}


//Соединяет Model и View
class Controller {

   constructor(model, view) {
      this.model = model;
      this.view = view;
      // Явная привязка
      this.model.bindTodoListChanged(this.onTodoListChanged);
      this.view.bindAddTodo(this.handleAddTodo);
      this.view.bindDeleteTodo(this.handleDeleteTodo);
      this.view.bindToggleTodo(this.handleToggleTodo)
      // // Показать начальные задачи
      this.onTodoListChanged(this.model.myTasks);
   }
   
   onTodoListChanged = myTasks => {
      this.view.displayTodos(myTasks)
   }

   // Обработчик событий (Добавить задачу)
   handleAddTodo = todoValue => {
      this.model.addTodo(todoValue)
   }   

   handleDeleteTodo = id => {
      this.model.deleteTodo(id)
   }

   handleToggleTodo = id => {
      this.model.toggleTodo(id)
   }
}

const app = new Controller(new Model(), new View());
