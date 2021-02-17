export default class state {
    constructor(name) {
        this.name = name;
        this.potentialReads = new Array();
        this.ActionsOnRead = new Array();
    }

    addPotentialRead(char, write, direction, nextState) {
            console.log("full");
    }

    addPotentialRead(char, direction, nextState) {
        console.log("missing write");
    }
}