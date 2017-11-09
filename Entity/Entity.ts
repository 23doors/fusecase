
import EntityInstance from './EntityInstance'
import Transaction from './Transaction'
import { IRemoteServer, DefaultRemoteServer } from './RemoteServer'
import { ILocalStorage, DefaultLocalStorage } from './LocalStorage'

interface IErrorHandler {
    (e: Error, transaction: Transaction<any>): void
}

interface IEntityConstructor<T> extends Function {
    new(): T
    catch?(e: Error, transaction: Transaction<T>): void
}

var entityClasses: { [name: string]: Entity<any> } = {}

export default class Entity<T extends Object> {

    constructor(readonly ctor: IEntityConstructor<T>,
        readonly remoteServer: IRemoteServer = DefaultRemoteServer.singleton(),
        readonly localStorage: ILocalStorage = DefaultLocalStorage.singleton()
    ) {
        entityClasses[ctor.name] = this
    }

    singleton(): T {
        return this.loadInstance(this.ctor.name + "-singleton").obj
    }

    get(id: string): T {
        return this.loadInstance(this.ctor.name + "-instance-" + id).obj
    }

    private instances: { [id: string]: EntityInstance<T> } = {}

    private loadInstance(id: string): EntityInstance<T> {

        if (!(id in this.instances)) {
            this.instances[id] = new EntityInstance<T>(this, id)
        }

        return this.instances[id]
    }
}


