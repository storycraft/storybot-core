import Client from './client';

import Discord from 'discord.js';
import DiscordUser from '../user/discord-user';
import DiscordMessage from '../message/discord-message';
import DiscordChannel from '../channel/discord-channel';

export default class DiscordClient extends Client {
    constructor(){
        super();
        //내부 discord.js 객체
        this.discord = null;

        //임시 discord 카테고리들
        this.tempCategories = new Map();

        this.channels = new Map();
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
        
        this.discord = new Discord();
        
        //리스너 연결
        this.DiscordClient.on('ready', this.onReady.bind(this));
        this.DiscordClient.on('message', this.onMessage.bind(this));

        //제공된 토큰을 사용하여 비동기 로그인
        var obj = await this.DiscordClient.login(token);

        this.initializing = false;
        this.ready = true;

        return obj;
    }

    async getChannel(id){
        return null;
    }

    get DiscordClient(){
        return this.discord;
    }

    onReady(){
        this.emit('ready');
    }

    onMessage(msg){
        var sourceChannel = this.getSource(msg);
        var message = DiscordMessage.fromRawDiscordMessage(sourceChannel, msg);

        sourceChannel.emit('message', message);

        this.emit('message', message);
    }

    getSource(msg){
        if (this.channels.has(msg.channel))
            return this.channels.get(msg.channel);

        let chan = new DiscordChannel(msg.channel);

        this.channels.set(msg.channel, chan);

        return chan;
    }

    //채널 생성시 봇 생성 채널 구분을 위해 무조건 storybot 카테고리에 넣습니다
    async createChannel(discordChannel, name){
        var chan = await discordChannel.Guild.createChannel(name);

        await chan.setParent(await this.getBotCategory(discordChannel));

        return new DiscordChannel(chan);
    }

    hasBotCategory(discordChannel){
        return this.tempCategories.has(discordChannel.Guild);
    }

    async getBotCategory(discordChannel){
        if (this.hasBotCategory(discordChannel))
            return this.tempCategories.get(discordChannel.Guild);

        //임시 채널 생성 시도
        var category = await discordChannel.Guild.createChannel('-- storybot --', 'category', null, null, '임시 채널용 카테고리가 필요해요!');
        this.tempCategories.set(discordChannel.Guild, category);

        return category;
    }

    async destroy(){
        if (!this.Ready)
            return;

        //만든 쓰레기들 제거
        let tasks = [];
        for (let [guild, category] of this.tempCategories){
            tasks.push(category.delete('필요 없을듯 ㅇㅇ'));
        }

        await Promise.all(tasks);
        await this.DiscordClient.destroy();
    }
}