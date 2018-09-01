import Channel from "./channel";
import WebMessage from "../message/web-message";

export default class WebChannel extends Channel {
    constructor(client, handler, id, name){
        super(client, id, name);

        this.handler = handler;
    }

    get Handler() {
        return this.handler;
    }

    async getMembers(){
        return [/*User*/];
    }

    async send(msgTemplate){
        if (typeof(msgTemplate) == 'string'){
            msgTemplate = new MessageTemplate(msgTemplate);
        }
        
        var messageList = [];

        if (msgTemplate.Text) {
            this.Handler.Socket.send('message', {
                'channel': this.Id,
                'type': 'text',
                'text': msgTemplate.Text
            });

            var message = new WebMessage(msgTemplate.Text, new Date(), this.Handler.WebClient.ClientUser);
            this.Client.emit('message', message);
            this.Client.ClientUser.emit('message', message);
            this.Handler.emit('message', message);
            messageList.push(message);
        }

        for (let attachment of msgTemplate.Attachments) {
            this.Handler.Socket.send('message', {
                'channel': this.Id,
                'type': 'attachment'
            }, attachment.Buffer);

            var message = new WebMessage('', new Date(), this.Handler.WebClient.ClientUser);
            this.Client.emit('message', message);
            this.Client.ClientUser.emit('message', message);
            this.Handler.emit('message', message);
            messageList.push(message);
        }

        return messageList;
    }
}