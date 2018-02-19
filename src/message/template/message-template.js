//메세지 전송에 필요한 템플릿 클래스

export default class MessageTemplate {
    //attachments에는 Attachment 객체 배열!
    constructor(text, attachments = []){
        this.text = text;
        
        this.attachments = attachments;
    }

    get Text(){
        return this.text;
    }

    set Text(text){
        this.text = text;
    }

    get Attachments(){
        return this.attachments;
    }

    static fromMessage(userMessage){
        return new MessageTemplate(userMessage.Message, userMessage.Attachments);
    }
}

export class Attachment {
    constructor(name, buffer){
        this.name = name;
        this.buffer = buffer;
    }

    get Name(){
        return this.name;
    }

    set Name(name){
        this.name = name;
    }

    get Buffer(){
        return this.buffer;
    }

    set Buffer(buffer){
        this.buffer = buffer;
    }
}