export default class Channel {
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

    async sendMessage(){

    }
}