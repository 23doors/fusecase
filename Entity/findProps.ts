
export default function findProps(obj, arr: string[] = []) : string[] {
    
    var keys = Object.getOwnPropertyNames(obj);
    for (var i in keys) {
        var p = keys[i] as string
        if (p === "constructor") { continue; }
        arr.push(p)
    }

    // Include members from object's prototype chain (to allow ES6 classes)
    var proto = Object.getPrototypeOf(obj);
    if (proto && proto !== Object.prototype) { 
        return findProps(proto, arr); 
    }

    return arr
}