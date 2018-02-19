import EventEmitter from 'events';

export default class Channel extends EventEmitter {
    constructor(client, id, name){
        this.client = client;
        this.id = id;
        this.name = name;
    }

    get Client(){
        return this.client;
    }

    get Id(){
        return this.id;
    }

    get Name(){
        return this.name;
    }

    async getMembers(){
        return [/*User*/];
    }

    async send(msgTemplate){

    }
}