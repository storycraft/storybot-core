import Channel from './channel';

export default class DiscordChannel {
    
    //Discord DM 그룹챗에는 봇을 초대할수 없습니다
    constructor(guildChannel){
        super(guildChannel.client, guildChannel.id, guildChannel.name);
        this.guildChannel = guildChannel;
    }

    get GuildChannel(){
        return this.guildChannel;
    }

    get Guild(){
        return this.GuildChannel.guild;
    }

    async getMembers(){
        let guild = this.Guild;

        var members = [];

        for (let [snowflake, guildMember] of guild.members){
            members.push(members);
        }

        return members;
    }

    async sendMessage(){

    }
}