
import EntityInstance from './EntityInstance'

declare var console:any

export interface IRemoteServer {
    notifyNewTransactions(instance: EntityInstance<any>): void
    subscribe(instance: EntityInstance<any>): any
}

export class DefaultRemoteServer implements IRemoteServer {

    private constructor() { }

    private static _singleton: IRemoteServer = null

    static singleton(): IRemoteServer {
        if (DefaultRemoteServer._singleton == null) {
            DefaultRemoteServer._singleton = new DefaultRemoteServer()
        }
        return DefaultRemoteServer._singleton
    }

    private idEnum = 0
    subscribe(instance: EntityInstance<any>){
        
    }
    notifyNewTransactions(instance: EntityInstance<any>): void {
        for (var t of instance.transactions) {
            t.canonize("remote-" + this.idEnum++)
        }
    }
}