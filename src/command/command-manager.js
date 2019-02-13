import { EventEmitter } from "events";

export default class CommandManager extends EventEmitter {
    constructor(bot){
        super();

        this.bot = bot;
        
        this.commandPrefix = '*';
        this.spliter = ' ';

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
        if (!msg.Text.startsWith(this.CommandPrefix))
            return;

        var commandIndex = msg.Text.indexOf(this.spliter);

        if (commandIndex == -1)
            commandIndex = msg.Text.length;
    
        var command = msg.Text.substring(this.CommandPrefix.length, commandIndex);
        if (command == '')
            return;

        let commandList = this.getCommandInfo(command);

        if (commandList.length < 1) {
            return;
        }

        var rawArgument = msg.Text.substring(commandIndex + this.spliter.length);

        for (let commandInfo of commandList) {
            commandInfo.onCommand(commandInfo.Parser ? commandInfo.Parser.parse(rawArgument) : rawArgument, msg.User, this.Bot, msg.Source);
        }

        //deprecated
        /*
        var args = [];
        
        if (rawArgument != '') {
            args = rawArgument.split(' ');
        }

        this.emit(command, args, msg.User, this.Bot, msg.Source);
        */
    }

    addCommandInfo(command){
        if (!this.commandInfoList.includes(command))
            this.CommandInfoList.push(command);
    }

    //text: string
    //return commandinfo array
    getCommandInfo(text) {
        let commandList = [];
        for (let command of this.CommandInfoList) {
            if (command.Aliases && command.Aliases.includes(text)) {
                commandList.push(command);
            }
        }

        return commandList;
    }

    removeCommandInfo(command){
        this.CommandInfoList.splice(this.CommandInfoList.indexOf(command), 1);
    }
}
