import Channel from './channel';
import Discord from 'discord.js';

export default class DiscordChannel extends Channel {
    
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

    async send(msgTemplate){
        //해당 메세지에 답한 후 새 DiscordMessage객체 반환
        if (msgTemplate.Text)
            await this.guildChannel.send(msgTemplate.Text);

        for(let attachment of msgTemplate.Attachments){
            await this.guildChannel.send(null, new Discord.Attachment(attachment.Buffer, attachment.Name));
        }
    }
}