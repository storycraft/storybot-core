import Client, { ChatHandler, ClientUser } from './client';

import Discord from 'discord.js';
import DiscordUser from '../user/discord-user';
import DiscordMessage from '../message/discord-message';
import DiscordChannel, { DiscordDMChannel } from '../channel/discord-channel';

export default class DiscordClient extends Client {
    constructor(){
        super();
        //내부 discord.js 객체
        this.discord = null;

        this.channels = new Map();
        this.users = new Map();
    }

    /*
     * 토큰 형식
     * 
     * 'AM2SNAKJS536SNSD8...'
     */
    
    async initialize(token){
        if (this.Ready || this.Initializing)
            throw new Error('해당 클라이언트는 이미 활성화 되어있거나 초기화 중입니다');
        this.initializing = true;
        
        this.discord = new Discord.Client();
        this.handler = new DiscordChatHandler(this);
        
        //제공된 토큰을 사용하여 비동기 로그인
        var obj = await this.DiscordClient.login(token);

        this.user = new DiscordClientUser(this.DiscordClient.user);
        this.hookUserWithId(this.user.Id, this.user);

        this.initializing = false;
        this.ready = true;

        return obj;
    }

    get DiscordClient(){
        return this.discord;
    }

    get ClientUser(){
        return this.user;
    }

    get Handler(){
        return this.handler;
    }

    //Discord User 관련 부분 시작

    get UserName(){
        return this.ClientUser.DiscordUser.username;
    }

    async setUserName(name){
        await this.ClientUser.DiscordUser.setUsername(name);
    }

    get Avatar(){
        return this.ClientUser.DiscordUser.avatarURL;
    }

    async setAvatar(buffer){
        await this.ClientUser.DiscordUser.setAvatar(buffer);
    }

    get Status(){
        return this.ClientUser.DiscordUser.avatarURL;
    }

    async setStatus(statusString){
        await this.ClientUser.DiscordUser.setStatus(statusString);
    }

    get Presence(){
        return this.ClientUser.DiscordUser.presence;
    }

    async setPresence(rawPresenceData){
        await this.ClientUser.DiscordUser.setPresence(rawPresenceData);
    }

    //Discord User 관련 부분 끝

    getSource(msg){
        if (this.channels.has(msg.channel.id))
            return this.channels.get(msg.channel.id);

        var chan = null;

        if (msg.channel.type == 'text')
            chan = new DiscordChannel(this, msg.channel);
        else if (msg.channel.type == 'dm' || msg.channel.type == 'group')
            chan = new DiscordDMChannel(this, msg.channel);

        this.channels.set(msg.channel.id, chan);

        return chan;
    }

    getWrappedUser(user){
        if (this.users.has(user.id))
            return this.users.get(user.id);

        let wrappedUser = DiscordUser.fromDiscordUser(user);

        this.hookUserWithId(wrappedUser.Id, wrappedUser);

        return wrappedUser;
    }

    hookUserWithId(id, wrappedUser){
        this.users.set(id, wrappedUser);
    }

    //해당 네임으로 DM 그룹쳇 생성
    async createChannel(name){
        var chan = await this.ClientUser.DiscordUser.createGroupDM(name);

        return new DiscordDMChannel(chan);
    }

    async destroy(){
        if (!this.Ready)
            return;

        this.Handler.destroy();

        await this.DiscordClient.destroy();
    }
}

class DiscordChatHandler extends ChatHandler {
    constructor(client){
        super(client);

        let discord = this.Client.DiscordClient;
        discord.on('ready', this.onReady.bind(this));
        discord.on('message', this.onMessage.bind(this));
    }

    onMessage(msg){
        var sourceChannel = this.Client.getSource(msg);
        var user = this.Client.getWrappedUser(msg.author);

        var message = DiscordMessage.fromRawDiscordMessage(sourceChannel, user, msg);

        sourceChannel.emit('message', message);
        user.emit('message', message);

        this.Client.emit('message', message);
    }

    onReady(){
        this.Client.emit('ready');
    }

    destroy(){

    }
}

class DiscordClientUser extends ClientUser {
    constructor(user){
        super();
        this.discordUser = user;
    }
}