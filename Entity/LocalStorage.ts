declare var console:any;

export interface ILocalStorage {
    contains(key: string): boolean
    getItem(key: string): string
    setItem(key: string, value: string): void
    createID(): string
}


export class DefaultLocalStorage implements ILocalStorage {
    objects={}
    contains(key: string): boolean {
        return key in this.objects
    }
    getItem(key: string) : string {
        return this.objects[key]
    }
    setItem(key: string, value: string) : void {
        this.objects[key] = value
    }
    createID(): string {
        var id = parseInt(this.getItem("local-id-enumerator")) || 0
        this.setItem("local-id-enumerator", ""+(id+1))
        return "local-id-"+id
    }

    private static _singleton : ILocalStorage = null

    private constructor() {}

    static singleton() : ILocalStorage {
        if (DefaultLocalStorage._singleton == null) {
            DefaultLocalStorage._singleton = new DefaultLocalStorage()
        }
        return DefaultLocalStorage._singleton
    }
}