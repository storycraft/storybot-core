import { EventEmitter } from "events";

export default class CommandManager extends EventEmitter {
    constructor(bot,commandPrefix){
        super();

        this.bot = bot;
        
        this.commandPrefix = commandPrefix;

        this.commandInfoList = [];

        this.Bot.on('message', this.onCommand.bind(this));
    }

    get Bot(){
        return this.bot;
    }

    get CommandInfoList(){
        return this.commandInfoList;
    }

    get CommandPrefix(){
        return this.commandPrefix;
    }

    onCommand(msg){
        if (!msg.Message.startsWith(this.CommandPrefix))
            return;

        var tokens = msg.Message.split(' ');

        var command = tokens[0].substring(1);
        var args = tokens.slice(1);

        if (command == '')
            return;

        //WTF best idea ever
        this.emit(command, args, msg.User, this.Bot, msg.Source);
    }

    addCommandInfo(command){
        if (!this.commandInfoList.includes(command))
            this.CommandInfoList.push(command);
    }

    removeCommandInfo(command){
        this.CommandInfoList.splice(this.CommandInfoList.indexOf(command), 1);
    }
}