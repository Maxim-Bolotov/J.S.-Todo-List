// Поле ввода
const newTodo = document.getElementsByClassName('new-todo');
// ul для задач

// Массив с тасками
let myTasks = [
   {
      id: 1,
      value: "Пойти в кино",
      completed: false
   },
   {
      id: 2,
      value: "Сходить погулять",
      completed: true
   },
];


myTasks.map((elem) => {

   let todoList = document.getElementById("todo-list");
   // Cоздать элемент списка
   let listItem = document.createElement("li");
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
   vievDiv.className = "viev"
   checkBox.className = "toggle"
   destroyButton.className = "destroy"
   editInput.className = "edit"

   checkBox.type = "checkBox";
   // Текст 
   label.innerText = elem.value;
   editInput.defaultValue = elem.value;
   // Создаю узлы в дочерних элементах
   listItem.appendChild(vievDiv);
   vievDiv.appendChild(checkBox);
   vievDiv.appendChild(label);
   vievDiv.appendChild(destroyButton);
   listItem.appendChild(editInput);
   todoList.appendChild(listItem)

});







