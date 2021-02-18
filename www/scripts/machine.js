export default class machine {
    constructor(input, blank, start, accept, states_Set) {
        this.states = states_Set;
        this.input = input;
        this.blank = blank;
        this.start = start;
        this.accept = accept;
        this.numStates = states_Set.length;
        this.result = input;
    }
}