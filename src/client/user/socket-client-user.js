import { ClientUser } from "../client";

export default class SocketClientUser extends ClientUser {
    
    get Id(){
        return -1;
    }

    //클라이언트간 구분 가능한 Id
    get IdentityId(){
        return "socket_client:" + this.Id;
    }

    get Name(){
        return 'Storybot';
    }

    get HasDMChannel(){
        return false;
    }
}