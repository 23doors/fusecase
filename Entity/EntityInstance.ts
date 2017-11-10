import Entity from './Entity'
import findProps from './findProps'
import Transaction from './Transaction'

declare var console:any

export default class EntityInstance<T extends Object> {

    originalMethods : { [key:string] : Function } = {}

    transactions: Transaction<T>[]

    transacting : boolean
    
    obj: T

    constructor(readonly entity: Entity<T>, readonly id: string) {
        this.obj = Object.create(entity.ctor.prototype) as T
        
        if (entity.localStorage.contains(id)) {
            this.transactions = JSON.parse(entity.localStorage.getItem(id)) as Transaction<T>[]
        }
        else {
            this.transactions = [ new Transaction(entity.localStorage.createID(), entity.ctor) ]
        }
        var self = this
        entity.remoteServer.subscribe(this).then(
            r => {
                self.replay()
                self.instrument()
            }
        )    
    }

    private replay(): void {
        var trans = this.transacting
        if (!trans) {
            this.transacting = true
        }
        try {
            for (var t of this.transactions) {
                t.perform(this)
            }
        }
        finally {
            if (!trans) {
                this.transacting = false
            }
        }
    }

    
    private instrument(): void {
        var props = findProps(this.obj)
        for (var k of props) {
            if (k.charAt(0) === "$") { continue }
            if (this.obj[k] instanceof Function) {
                var f = this.obj[k] 
                this.originalMethods[k] = f
                this.obj[k] = this.wrapFunction(k, f)
            }
        }
    }

    private wrapFunction(name: string, f: Function) : Function {
        var self = this
        return function() {
            var args = Array.prototype.slice.call(arguments)
            if (this.transacting) {
                return f.apply(self, args)
            }

            this.transacting = true
            try {
                var transaction = new Transaction(self.entity.localStorage.createID(), f, args)
                
                try {
                    var res = transaction.perform(self)
                    
                    self.transactions.push(transaction);
                    
                    self.entity.remoteServer.notifyNewTransactions(self)
                    return res
                }
                catch (e) {
                    if (self.entity.ctor.catch) {
                        self.entity.ctor.catch(e, transaction)
                    }
                }
            }
            finally {
                this.transacting = false
            }
        }
    }
}