
import EntityInstance from './EntityInstance'

declare var console:any

export default class Transaction<T extends Object> {
    remoteId: string = null
    
    constructor(
        readonly localId: string,
        readonly method: Function, 
        readonly args?: any[]) {
    }

    perform(instance: EntityInstance<T> ) {
        return this.method.apply(instance.obj, this.args)
    }

    canonize(remoteId: string) {
        this.remoteId = remoteId
    }
}


