//-------------------------------- Seleção de elementos------------------------------
const TodoForm = document.querySelector("#todo-form");
const TodoInput = document.querySelector("#todo-input");
const TodoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const CancelEditBtn = document.querySelector("#cancel-edit-btn");
const SearchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;



//------------------------------- Funções -------------------------------------------


// Função de adicionar
const saveTodo = (text, done = 0, save = 1) => {

    const todo = document.createElement("div");
    todo.classList.add("todo");


    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text; // Isso faz com que oque eu digite no primeiro evento seja capturado pela variavel Text
    todo.appendChild(todoTitle)

    const doneBtn = document.createElement("button")       //
    doneBtn.classList.add("finish-todo")                   //Pegando o Botão de Finalizar Tarefa
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'//
    todo.appendChild(doneBtn) // colocando o botao como filho do todo

    const editBtn = document.createElement("button")       //
    editBtn.classList.add("edit-todo")                   //Pegando o Botão de Editar Tarefa
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'//
    todo.appendChild(editBtn) // colocando o botao como filho do todo

    const RemoveBtn = document.createElement("button")       //
    RemoveBtn.classList.add("remove-todo")                   //Pegando o Botão de Remover Tarefa
    RemoveBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'//
    todo.appendChild(RemoveBtn) // colocando o botao como filho do todo

    // --------------------- UTILIZANDO DADOS DO LOCAL STORAGE -------------------------------
    if(done) {
        todo.classList.add("done")
    }

    if(save) {
        saveTodoLocalStorage({ text, done }) // passando dois objetos
    }

    TodoList.appendChild(todo) // colocando o todo como filha do TODOLIST (que é o elemento pai no HTML)

    TodoInput.value = "" // colocando o input vazio logo depois que for disparado o evento
    TodoInput.focus(); // focando logo dps que for disparada
}

// função de Editar

const toggleForms = () => {
    editForm.classList.toggle("hide")
    TodoForm.classList.toggle("hide")
    TodoList.classList.toggle("hide")
}

const updateTodo = (text) => {

    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue) {
           todoTitle.innerText = text

           updateTodosLocalStorage(oldInputValue, text)
        }

    })

}

const getSearchTodo = (search) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        const normalizeSearch = search.toLowerCase();

        todo.style.display = "flex";

        if(!todoTitle.includes(normalizeSearch)) {
            todo.style.display = "none";
        }

    })

}

const FilterTodos = (filterValue) => {

    const todos = document.querySelectorAll(".todo")

    switch(filterValue) {
        case "all":
        todos.forEach((todo) => todo.style.display = "flex")
        break;

        case "done":
        todos.forEach((todo) => todo.classList.contains("done") 
        ? (todo.style.display = "flex") // se tiver
        : (todo.style.display = "none") // se nao tiver
        );
        break;

        case "do":
        todos.forEach((todo) => 
        !todo.classList.contains("done") 
            ? (todo.style.display = "flex") 
            : (todo.style.display = "none")
        );
        break;

        default: 
        break;
    }

}


//-------------------------------- Eventos ------------------------------------------



TodoForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const inputvalue = TodoInput.value;

    if(inputvalue) {
        saveTodo(inputvalue)
    }

})


document.addEventListener("click", (e) => {

    const targetelement = e.target;
    const parentelement = targetelement.closest("div"); // selecionando a div mais proxima 
    let todoTitle;

    if(parentelement && parentelement.querySelector("h3")){
        todoTitle = parentelement.querySelector("h3").innerText; // vendo se tem o titulo da tarefa
    }

    if(targetelement.classList.contains("finish-todo")){
        parentelement.classList.toggle("done") // colocamos toggle para pode desmarcar caso aperte errado

        updateTodosStatusLocalStorage(todoTitle)
    }

    if(targetelement.classList.contains("remove-todo")) {
        parentelement.remove();

        removeTodosLocalStorage(todoTitle)
    }

    if(targetelement.classList.contains("edit-todo")) {
        toggleForms(); // função para mudar para a interface de edição

        editInput.value = todoTitle; // mudar o valor do input
        oldInputValue = todoTitle; // salvando o valor anterior
    }
})

CancelEditBtn.addEventListener("click", (e) => { // evento do botao de cancelar
    e.preventDefault()

    toggleForms();
})

editForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const editInputValue = editInput.value // pegando oque o usuario digitou no imput

    if(editInputValue) {
        updateTodo(editInputValue)
    }

    toggleForms()



})

SearchInput.addEventListener("keyup", (e) => { // evento de busca quando a tecla for soltada

    const search = e.target.value

    getSearchTodo(search);

})

eraseBtn.addEventListener("click", (e) => {

    e.preventDefault();

    SearchInput.value = ""

    SearchInput.dispatchEvent(new Event("keyup"))

})

filterBtn.addEventListener("change", (e) => {

    const filterValue = e.target.value;

    FilterTodos(filterValue);

})

// ---------------------------------------- Local Storage ----------------------------------------

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos;

}

const loadTodos = () => {
    const todos = getTodosLocalStorage();

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}

const saveTodoLocalStorage = (todo) =>{
    const todos = getTodosLocalStorage()

    todos.push(todo) //salvando

    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeTodosLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

const updateTodosStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => todo.text === todoText ? todo.done = !todo.done : null)

    localStorage.setItem("todos", JSON.stringify(todos));
}

const updateTodosLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage()

    todos.map((todo) => 
    todo.text === todoOldText ? (todo.text = todoNewText) : null)

    localStorage.setItem("todos", JSON.stringify(todos));
}

loadTodos()