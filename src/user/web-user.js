import User from './user';
export default class WebUser extends User {
    constructor(id, name){
        super();

        this.id = id;
        this.name = name;
    }

    get Id(){
        return this.id;
    }

    get IdentityId(){
        return `web:${this.Id}`;
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

    async sendMessage(str, option){
        throw new Error("Cannot DM to Web User");
    }
}