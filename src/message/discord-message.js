import UserMessage from "./user-message";
import MessageTemplate from "./template/message-template";

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

    async edit(msgTemplate){
        //에딧 가능한지 부터 검사하는게 좋겠죠
        super.edit(msgTemplate);

        if (typeof(msgTemplate) == 'string'){
            msgTemplate = new MessageTemplate(msgTemplate);
        }

        return DiscordMessage.fromRawDiscordMessage(this.Source, this.User, await this.RawMessage.edit(msgTemplate.Text));
    }

    async reply(msgTemplate){
        return await this.Source.send(msgTemplate);
    }

    async delete(){
        //제거 가능 확인
        super.delete();

        await this.RawMessage.delete();
    }

    static fromRawDiscordMessage(sourceChannel, user, msg){
        let message = new DiscordMessage(msg, user);

        message.source = sourceChannel;

        return message;
    }
}