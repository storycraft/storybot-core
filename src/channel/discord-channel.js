import Channel from './channel';
import { Attachment, DMChannel, GroupDMChannel } from 'discord.js';
import MessageTemplate from '../message/template/message-template';
import DiscordMessage from '../message/discord-message';

export default class DiscordChannel extends Channel {
    
    constructor(client, textChannel){
        super(client, textChannel.id, textChannel.name);
        this.textChannel = textChannel;
    }

    get TextChannel(){
        return this.textChannel;
    }

    async getMembers(){
        var members = [];

        for (let [snowflake, member] of this.TextChannel.members){
            members.push(this.Client.getWrappedUser(member));
        }

        return members;
    }

    async send(msgTemplate){
        //msgTemplate이 문자열일경우 문자열로 전송
        if (typeof(msgTemplate) == 'string'){
            msgTemplate = new MessageTemplate(msgTemplate);
        }

        var messages = [];

        //텍스트 입력 효과
        if (msgTemplate.Text){
            this.TextChannel.startTyping();

            let sendQueue = this.TextChannel.send(msgTemplate.Text || '');

            this.TextChannel.stopTyping();
            var message = DiscordMessage.fromRawDiscordMessage(this, this.Client.ClientUser, await sendQueue);
            this.Client.emit('message', message);
            message.User.emit('message', message);
            this.emit('message', message);
            messages.push(message);
        }

        for(let attachment of msgTemplate.Attachments){
            var message = DiscordMessage.fromRawDiscordMessage(this, this.Client.ClientUser, await this.TextChannel.send('', new Attachment(attachment.Buffer, attachment.Name)));
            messages.push(message);
            this.Client.emit('message', message);
            message.User.emit('message', message);
            this.emit('message', message);
        }

        return messages;
    }
}

export class DiscordDMChannel extends DiscordChannel {
    
    constructor(client, textChannel){
        super(client, textChannel);
    }

    //1대 1 DM 채널인지 체크
    get IsPMChannel(){
        return this.TextChannel instanceof DMChannel;
    }

    //그룹 DM 채널인지 체크
    get IsGroupChannel(){
        return this.TextChannel instanceof GroupDMChannel;
    }

    async addUser(user, customNick){
        if (this.IsPMChannel){
            throw new Error('Cannot add user to PMChannel');
        }

        this.TextChannel.addUser(user.DiscordUser, customNick);
    }

    async getMembers(){
        if (this.IsGroupChannel){
            return [ this.Client.getWrappedUser(this.TextChannel.recipient) ];
        }
        else if (this.IsSingleChannel){
            var members = [];

            for (let [snowflake, member] of this.TextChannel.recipients){
                members.push(this.Client.getWrappedUser(member));
            }

            return members;
        }
        else{
            throw new Error('Unknown Discord Channel ' + this.TextChannel);
        }
    }
}