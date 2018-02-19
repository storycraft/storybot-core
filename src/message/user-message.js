import { Attachment } from "discord.js";

export default class UserMessage {
    /* 클라이언트 메세지 wrapper 클래스
     * 
     * user : 보낸 유저 (User를 상속하는 모든 객체)
     */
    cosntructor(user){
        this.user = user;
    }
    
    get User(){
        return this.user;
    }

    //메세지를 보낸곳 DM일경우 User, 그룹챗일경우 Channel 반환
    get Source(){
        return null;
    }

    get Message(){
        return "";
    }

    get Timestamp(){
        return new Date(0);
    }

    get Editable(){
        return false;
    }

    get Deleteable(){
        return false;
    }

    get Attachments(){
        return [];
    }

    async edit(msgTemplate){
        if (!this.Editable)
            throw new Error('이 메세지는 수정 할 수 없습니다.');
    }

    //reply 관련 메서드는 해당 메세지가 온 서버 또는 채널 또는 사용자에게 메세지를 전송하는 역할만 하면 됩니다

    //텍스트 전송
    async reply(msgTemplate){
        throw new Error('이 메세지에 답 할수 없습니다.');
    }
}

export class MessageAttachment {
    constructor(type, url){
        this.type = type;
        this.url = url;
    }

    get Type(){
        return this.type;
    }

    get Url(){
        return this.url;
    }
}

//첨부 파일 타입 enum
var AttachmentType = {
    'IMAGE': 0,
    'AUDIO': 1,
    'VIDEO': 2,

    //이 타입은 알수 없는 타입도 포함한다고요?
    'FILE': 3
}

export { AttachmentType };