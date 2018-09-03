import { EventEmitter } from 'events';
import User from '../user/user';

/*
 * 어떤 클라이언트의 이벤트 목록
 * 
 * initialize 완료시 ready 이벤트 발생
 * 메세지 도착시 message 이벤트 발생
 * 
 */
export default class Client extends EventEmitter {
    constructor(){
        super();

        this.ready = false;
        this.initializing = false;
        this.user = null;
    }

    get Ready(){
        return this.ready;
    }

    get Initializing(){
        return this.initializing;
    }

    get ClientUser(){
        return this.user;
    }

    get Handler(){
        return null;
    }

    //해당 채널의 멤버를 사용해 그룹 채널 생성
    async createChannel(name){

    }

    async initialize(args){
        
    }

    async sendMessage(msgTemplate){

    }

    async destroy(){
        
    }
}

export class ClientHandler {
    constructor(client){
        this.client = client;
    }

    get Client(){
        return this.client;
    }
}

export class ClientUser extends User {
    constructor(){
        super();
    }
}