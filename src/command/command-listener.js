import DefaultParser from "./parser/default-parser";

export default class CommandListener {
    constructor(){

    }

    get Description(){
        return '';
    }

    get Aliases(){
        return [];
    }

    get Parser() {
        return new DefaultParser();
    }

    onCommand(args, user, bot, source) {

    }
    
}