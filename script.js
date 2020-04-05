"use strict";


class Model {

   constructor() {
      // Массив с тасками
      this.myTasks = [
         {
            id: 1,
            value: "Пойти в кино",
            completed: false
         },
         {
            id: 2,
            value: "Сходить погулять",
            completed: false
         },
      ];
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
   }

   // Изменяет value задачи по id
   editTodo(id, updatedValue) {
      this.myTasks = this.myTasks.map(todo =>
         todo.id === id ? { id: todo.id, value: updatedValue, completed: todo.completed } : todo
      )
   }

   // Изменяет completed задачи по id
   toggleTodo(id) {
      this.myTasks = this.myTasks.map(todo =>
         todo.id === id ? { id: todo.id, value: todo.value, complete: !todo.complete } : todo
      )
   }

   // Фильтрует задачу из массива по id
   deleteTodo(id) {
      this.myTasks = this.myTasks.filter(todo => todo.id !== id);
   }

}

class View {
   constructor() {
      this.todoList = this.getElement('#todo-list');
   }

   // Создать элемент с необязательным классом
   createElement(tag, className) {
      const element = document.createElement(tag);
      if (className) element.classList.add(className)
 
      return element;
   }
 
   // Получить элемент из DOM
   getElement(selector) {
      const element = document.querySelector(selector);
 
      return element;
   }

   // Очистка input после добавления 
   get _todoValue() {
      return this.input.value
   } 
   _resetInput() {
      this.input.value = ''
   }

   // Отображение задач
   displayTodos(myTasks) {
      // Удалить все узлы
      while (this.todoList.firstChild) {
         this.todoList.removeChild(this.todoList.firstChild)
      }
      // Cообщение по умолчанию
      if (myTasks.length === 0) {
         const p = this.createElement('p')
         p.textContent = 'Nothing to do! Add a task?'
         this.todoList.append(p)
      } else {

         myTasks.forEach(todo => {

            // Cоздать элемент списка
            let listItem = document.createElement("li");
            listItem.id = todo.id;
            // div
            let vievDiv = document.createElement("div")
            // input checkbox
            let checkBox = document.createElement("input");
            // label
            let label = document.createElement("label");
            // button.delete
            let destroyButton = document.createElement("button");
            // input (text)
            let editInput = document.createElement("input");
            //Добавляю классы элементам 
            vievDiv.className = "viev";
            checkBox.className = "toggle";
            // checkbox.checked = todo.completed
            destroyButton.className = "destroy";
            editInput.className = "edit";

            checkBox.type = "checkBox";
            // Текст 
            label.innerText = todo.value;
            editInput.defaultValue = todo.value;
            // Создаю узлы в дочерних элементах
            vievDiv.append(checkBox, label, destroyButton);
            listItem.append(vievDiv, editInput);

            this.todoList.append(listItem);
         });
      }
   }

   bindAddTodo(handler) {
      this.header.addEventListener('submit', event => {
         event.preventDefault()
    
         if (this._todoValue) {
            handler(this._todoValue)
            this._resetInput()
         }
      })
   }
    
   bindDeleteTodo(handler) {
      this.todoList.addEventListener('click', event => {
         if (event.target.className === 'destroy') {
            const id = parseInt(event.target.parentElement.id)
    
            handler(id)
         }
      })
   }
    
   bindToggleTodo(handler) {
      this.todoList.addEventListener('change', event => {
         if (event.target.type === 'checkbox') {
            const id = parseInt(event.target.parentElement.id)
    
            handler(id)
         }
      })
   }
}




//Соединяет Model и View
class Controller {

   constructor(model, view) {
      this.model = model;
      this.view = view;
      // Показать начальные задачи
      this.onTodoListChanged(this.model.myTasks)
   }

   onTodoListChanged = myTasks => {
      this.view.displayTodos(myTasks)
   }

   handleAddTodo = todoValue => {
      this.model.addTodo(todoValue)
   }
    
   handleEditTodo = (id, todoValue) => {
      this.model.editTodo(id, todoValue)
   }
    
   handleDeleteTodo = id => {
      this.model.deleteTodo(id)
   }
    
   handleToggleTodo = id => {
      this.model.toggleTodo(id)
   }
}



const app = new Controller(new Model(), new View());






























