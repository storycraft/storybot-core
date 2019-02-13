import ArgumentParser from "./argument-parser";

export default class DefaultParser extends ArgumentParser {

    constructor() {
        super();
    }

    parse(arg) {
        var args = [];
        
        if (arg != '') {
            args = arg.split(' ');
        }

        return args;
    }
}