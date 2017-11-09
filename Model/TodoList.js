
import TodoItem from './TodoItem'
export default class TodoList {
    constructor() {
        this.todos = []
    }
    addTodo(description) {
        this.todos.push(new TodoItem(description))
    }
}