import Client from './client';

import Discord from 'discord.js';
import DiscordUser from '../user/discord-user';
import DiscordMessage from '../message/discord-message';
import DiscordChannel, { DiscordDMChannel } from '../channel/discord-channel';
import discordUser from '../user/discord-user';

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
        if (this.Ready)
            throw new Error('해당 클라이언트는 이미 활성화 되어있거나 초기화 중입니다');
        this.initializing = true;
        
        this.discord = new Discord.Client();
        
        //리스너 연결
        this.DiscordClient.on('ready', this.onReady.bind(this));
        this.DiscordClient.on('message', this.onMessage.bind(this));

        //제공된 토큰을 사용하여 비동기 로그인
        var obj = await this.DiscordClient.login(token);

        this.initializing = false;
        this.ready = true;

        return obj;
    }

    get DiscordClient(){
        return this.discord;
    }

    get DiscordUser(){
        return this.DiscordClient.user;
    }

    //Discord User 관련 부분 시작

    get UserName(){
        return this.DiscordUser.username;
    }

    async setUserName(name){
        await this.DiscordUser.setUsername(name);
    }

    get Avatar(){
        return this.DiscordUser.avatarURL;
    }

    async setAvatar(buffer){
        await this.DiscordUser.setAvatar(buffer);
    }

    get Status(){
        return this.DiscordUser.avatarURL;
    }

    async setStatus(statusString){
        await this.DiscordUser.setStatus(statusString);
    }

    get Presence(){
        return this.DiscordUser.presence;
    }

    async setPresence(rawPresenceData){
        await this.DiscordUser.setPresence(rawPresenceData);
    }

    //Discord User 관련 부분 끝

    onReady(){
        this.emit('ready');
    }

    onMessage(msg){
        var sourceChannel = this.getSource(msg);
        var user = this.getWrappedUser(msg.author);
        var message = DiscordMessage.fromRawDiscordMessage(sourceChannel, user, msg);

        sourceChannel.emit('message', message);
        user.emit('message', message);

        this.emit('message', message);
    }

    getSource(msg){
        if (this.channels.has(msg.channel))
            return this.channels.get(msg.channel);

        var chan = null;

        if (msg.channel.type == 'text')
            chan = new DiscordChannel(this, msg.channel);
        else if (msg.channel.type == 'dm' || msg.channel.type == 'group')
            chan = new DiscordDMChannel(this, msg.channel);

        this.channels.set(msg.channel, chan);

        return chan;
    }

    getWrappedUser(user){
        if (this.users.has(user))
            return this.users.get(user);

        let wrappedUser = DiscordUser.fromDiscordUser(user);

        this.users.set(user, wrappedUser);

        return wrappedUser;
    }

    //해당 네임으로 DM 그룹쳇 생성
    async createChannel(name){
        var chan = await this.DiscordUser.createGroupDM(name);

        return new DiscordDMChannel(chan);
    }

    async destroy(){
        if (!this.Ready)
            return;

        await this.DiscordClient.destroy();
    }
}