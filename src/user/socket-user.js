import User from './user';
export default class SocketUser extends User {
    constructor(id, namespace, name){
        super();

        this.id = id;
        this.namespace = namespace;
        this.name = name;
    }

    get Id(){
        return this.id;
    }

    get IdentityId(){
        return `socket_user_${this.namespace}:${this.Id}`;
    }

    get Name(){
        return this.name;
    }

    get HasDMChannel(){
        return false;
    }

    async getDMChannel(){
        return null;
    }

    async send(msgTemplate){
        throw new Error("Cannot DM to Socket User");
    }

    updateName(name) {
        this.name = name;
    }
}