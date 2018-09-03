import Channel from "./channel";
import SocketMessage from "../message/socket-message";
import MessageTemplate from "../message/template/message-template";

export default class SocketChannel extends Channel {
    constructor(client, handler, id, name){
        super(client, id, name);

        this.handler = handler;
    }

    get Handler() {
        return this.handler;
    }

    async send(msgTemplate){
        if (typeof(msgTemplate) == 'string'){
            msgTemplate = new MessageTemplate(msgTemplate);
        }
        
        var messageList = [];

        if (msgTemplate.Text) {
            var message = new SocketMessage(msgTemplate.Text, new Date(), this, this.Client.ClientUser);

            this.Handler.Socket.emit('message', {
                'channel': this.Id,
                'user': {
                    'id': message.User.Id,
                    'nickname': message.User.Name
                },
                'type': 'text',
                'text': msgTemplate.Text
            });

            this.Client.emit('message', message);
            message.User.emit('message', message);
            this.Handler.emit('message', message);
            messageList.push(message);
        }

        for (let attachment of msgTemplate.Attachments) {
            var message = new SocketMessage('', new Date(), this, this.Client.ClientUser);
            this.Handler.Socket.emit('message', {
                'channel': this.Id,
                'user': {
                    'id': message.User.Id,
                    'nickname': message.User.Name
                },
                'type': 'attachment'
            }, attachment.Buffer);

            this.Client.emit('message', message);
            message.User.emit('message', message);
            this.Handler.emit('message', message);
            messageList.push(message);
        }

        return messageList;
    }

    updateName(name) {
        this.name = name;
    }
}