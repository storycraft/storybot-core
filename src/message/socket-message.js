import UserMessage from "./user-message";

export default class SocketMessage extends UserMessage {
    constructor(text, timestamp, source, user){
        super(user);

        this.text = text;
        this.timestamp = timestamp;
        this.user = user;

        this.source = source;
    }

    get User(){
        return this.user;
    }

    get Text(){
        return this.text;
    }

    get Timestamp(){
        return this.timestamp;
    }

    get Editable(){
        return false;
    }

    get Deletable(){
        return false;
    }

    get EditedTimestamp(){
        return this.timestamp;
    }

    get Edits(){
        return 0;
    }

    isMentioned(user){
        return this.Text.includes(`@${user.Name}`);
    }

    async reply(msgTemplate){
        return await this.Source.send(msgTemplate);
    }
}
