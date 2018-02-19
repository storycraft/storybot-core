import User from './user';
import UserMessage from '../message/user-message';

export default class DiscordUser extends User {
    constructor(){
        super();

        this.discordUser = null;
        this.dmChan = null;
    }

    get DiscordUser(){
        return this.discordUser;
    }

    get Tag(){
        return this.DiscordUser.tag;
    }

    get Name(){
        return this.DiscordUser.username;
    }

    get hasDMChannel(){
        return !!(this.dmChan);
    }

    async getDMChannel(){
        //DM Channel이 없을 경우 만든 후 캐싱
        return this.dmChan || (this.dmChan = await this.DiscordUser.createDM());
    }

    async sendMessage(str, option){
        var dmChan = await this.getDMChannel();

        var rawMessage = await dmChan.send(str, option);

        return new UserMessage(this, rawMessage.content, new Date(rawMessage.createdTimestamp), rawMessage.editable, rawMessage.deleteable);
    }

    static fromDiscordUser(discordUser){
        let user = new DiscordUser();

        user.discordUser = discordUser;

        return user;
    }
}