import { EventEmitter } from "events";

//여러 클라이언트 간 통합 user 클래스

export default class User extends EventEmitter {
    constructor() {
        super();
    }

    get Id(){
        return 0;
    }

    //클라이언트간 구분 가능한 Id
    get IdentityId(){
        return '0';
    }

    get Name(){
        return "";
    }

    get hasDMChannel(){
        return false;
    }

    async getDMChannel(){
        throw new Error("이 유저는 DM을 지원하지 않습니다");
    }

    //유저에게 DM(1대 1 채팅) 전송
    async sendMessage(str, option){
        throw new Error("이 유저는 DM 전송을 지원하지 않습니다");
    }

    equals(user){
        //유저 id와 타입이 같을 경우 true 반환
        return user instanceof this.constructor && user.Id == this.Id;
    }
}