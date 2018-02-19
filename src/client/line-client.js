import Client from './client';

import Line from 'linebot';
import LineUser from '../user/line-user';
import LineMessage from '../message/line-message';

export default class LineClient extends Client {
    constructor(){
        super();
        //내부 linebot 객체
        this.line = null;
        //http 서버
        this.server = null;
    }

    /*
     * 콘픽 형식
     * 
     * {
     *   channelId: CHANNEL_ID,
     *   channelSecret: CHANNEL_SECRET,
     *   channelAccessToken: CHANNEL_ACCESS_TOKEN
     * }
     */

    async initialize(config){
        if (this.Ready)
            throw new Error('해당 클라이언트는 이미 활성화 되어있거나 초기화 중입니다');
        this.initializing = true;
        
        this.line = Line(token);
        
        //리스너 연결
        this.LineBot.on('message', this.onMessage.bind(this));

        //후킹 시작
        await new Promise((resolve, reject) => {
            this.server = this.LineBot.listen('/linewebhook', 3000, resolve);
        });

        this.initializing = false;
        this.ready = true;

        onReady();
    }

    get LineBot(){
        return this.line;
    }

    onReady(){
        this.emit('ready');
    }

    onMessage(e){

    }

    async destroy(){
        if (!this.Ready)
            return;

        this.server.close();
        this.line = null;
    }
}