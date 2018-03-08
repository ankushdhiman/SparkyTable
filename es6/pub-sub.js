
export class Subject {
    constructor(){
        this.observers=[];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(id) {
        const index = this.observers.findIndex(observer => observer.id == id);
        this.observers.splice(index, 1);
    }

    notifyAll(payload) {
        for(let observer of this.observers)
        {
            observer.notify(payload);
        }
    }

    notify(id, payload) {
        const observerToBeNotified = this.observers.find(observer => observer.id == id);
        observerToBeNotified.notify(payload);
    }
}

export class Observer {
    constructor(callback){
        this.id = Date.now().toString();
        this.notify = callback;
    }
}
