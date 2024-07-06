(function () {
    let listArray = []
    listName = '';
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = `Введите название нового дела`
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = `Добавить дело`;
        //делаем чтобы кнопка была не активна при пустом поле ввода
        button.disabled = true;
        //делаем активным поле ввода
        input.addEventListener('input', function () {
            if (input.value !== "") {
                button.disabled = false;
            } else {
                button.disabled = true
            }
        })

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }
    //создаем и возвращаем список элементов
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        //кнопки помещаем элемент который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //устанавливаем стили для элемента списка, а так же для размещения кнопок
        //в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (obj.done == true) item.classList.add('list-group-item-success')

        //добавляем оброботчики на кнопки
        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');

            for (const listItem of listArray) {
                if (listItem.id == obj.id) listItem.done = !listItem.done
            }
            saveList(listArray, listName);
        });
        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove();

                listArray.splice(listArray.find(t => t.id === obj.id), 1);
                saveList(listArray, listName);
            }
        });

        //вкладываем кнопки в отдельный элемент чтобы они объеденились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        //приложению нужен доступ к самому элементу и кнопкам чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }
    //присваеваем уникальный id
    function getNewId(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) max = item.id
        }
        return max + 1;
    }
    //из массива переводим в строку
    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function createTodoApp(container, title = 'Список дел', keyName) {
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        callFunction();
        listName = keyName;

        //браузер создает событие submit на форме по нажатию на enter или на кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            //эта строчка необходима чтобы предотвратить события браузера
            //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
            e.preventDefault();

            //игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {
                return;
            }

            //чтобы новая запись добавлялась в массив
            let newItem = {
                id: getNewId(listArray),
                name: todoItemForm.input.value,
                done: false,
            };

            listArray.push(newItem);
            saveList(listArray, listName);

            let todoItem = createTodoItem(newItem);

            //создаем и добовляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);
            //делаем кнопку не активной после оправки
            todoItemForm.button.disabled = true;
            //обнуляем значение в поле,чтобы не пришлось стирать его в ручную
            todoItemForm.input.value = '';
        });

        function callFunction() {
            let localData = localStorage.getItem(listName);
            //Из строки переводим опять в массив
            if (localData !== null && localData !== '') listArray = JSON.parse(localData);
            for (const itemList of listArray) {
                let todoItem = createTodoItem(itemList);
                todoList.append(todoItem.item);
            };
        };
        callFunction();
    }

    window.createTodoApp = createTodoApp;
})();
