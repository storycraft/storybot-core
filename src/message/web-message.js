import UserMessage from "./user-message";
import MessageTemplate from "./template/message-template";
import Bot from "../bot";
import WebUser from "../user/web-user";

export default class WebMessage extends UserMessage {
    constructor(text, timestamp, source, user){
        super(user);

        this.timestamp = timestamp;
        this.source = source;
        this.user = user;
    }

    get RawMessage(){
        return this.rawMessage;
    }

    get User(){
        return this.user;
    }

    get Text(){
        return this.RawMessage.content;
    }

    get Timestamp(){
        return timestamp;
    }

    get Editable(){
        return false;
    }

    get Deletable(){
        return false;
    }

    get EditedTimestamp(){
        return new Date(this.RawMessage.editedTimestamp);
    }

    get Edits(){
        return this.RawMessage.edits;
    }

    isMentioned(user){
        return false;
    }

    async reply(msgTemplate){
        return await this.Source.send(msgTemplate);
    }
}
