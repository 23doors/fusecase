console.error = console.log; //TODO: this is workaround
import DI from 'FuseJS/DI'
import TodoList from 'Model/TodoList'
import Navigation from 'Services/Navigation'
import Entity from 'Entity/Entity'
import Server from 'Entity/SyncanoServer'
const server = new Server("billowing-tree-7276")

const todoListEntity = new Entity(TodoList,server)
export default class TodoApp {
    constructor() {
        DI(this)
        this.todoList = todoListEntity.singleton()
        this.navigation = new Navigation()
        this.navigation.goHome()
    }
}
