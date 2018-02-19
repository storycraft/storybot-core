import UserMessage from "./user-message";
import DiscordUser from "../user/discord-user";

export default class DiscordMessage extends UserMessage {
    constructor(rawMessage, user){
        super(user);

        this.rawMessage = rawMessage;
        this.user = user;
    }

    get RawMessage(){
        return this.rawMessage;
    }

    get User(){
        return this.user;
    }

    get Message(){
        return this.RawMessage.content;
    }

    get Source(){
        return null;
    }

    get Timestamp(){
        return new Date(this.RawMessage.createdTimestamp);
    }

    get Editable(){
        return this.RawMessage.editable;
    }

    get Deleteable(){
        return this.RawMessage.deleteable;
    }

    get EditedTimestamp(){
        return new Date(this.RawMessage.editedTimestamp);
    }

    get Edits(){
        return this.RawMessage.edits;
    }

    async edit(str, option){
        //에딧 가능한지 부터 검사하는게 좋겠죠
        super.edit(str, option);

        return DiscordMessage.fromRawDiscordMessage(await this.RawMessage.edit(str, option));
    }

    async reply(str, option){
        //해당 메세지에 답한 후 새 DiscordMessage객체 반환
        return DiscordMessage.fromRawDiscordMessage(await this.RawMessage.reply(str, option));
    }

    async replyAttachment(messageAttachment){
        throw new Error('이 메세지에 답 할수 없습니다.');
    }

    static fromRawDiscordMessage(msg){
        let user = DiscordUser.fromDiscordUser(msg.author);
        let message = new DiscordMessage(msg, user);

        return message;
    }
}