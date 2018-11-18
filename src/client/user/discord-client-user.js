import { ClientUser } from "../client";

export default class DiscordClientUser extends ClientUser {
    constructor(user){
        super();
        this.discordUser = user;
    }

    get DiscordUser(){
        return this.discordUser;
    }

    get Id(){
        return this.DiscordUser.id;
    }

    get Tag(){
        return this.DiscordUser.tag;
    }

    get IdentityId(){
        return `discord_client:${this.Id}`;
    }

    get Name(){
        return this.DiscordUser.username;
    }

    get HasDMChannel(){
        return !!(this.dmChan);
    }

    async getDMChannel(){
        //DM Channel이 없을 경우 만든 후 캐싱
        return this.dmChan || (this.dmChan = await this.DiscordUser.createDM());
    }
}