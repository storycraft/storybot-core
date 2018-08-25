import Channel from "./channel";

export default class WebChannel extends Channel {
    constructor(client, webChannel){
        super(client, webChannel.id, webChannel.name);
    }

    async getMembers(){
        return [/*User*/];
    }

    async send(msgTemplate){
        return [];
    }
}