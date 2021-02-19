export default class machine {
    constructor(input, blank, start, accept, states_Set) {
        this.states = new Array();
        this.input = input;
        this.blank = blank;
        this.start = start;
        this.accept = accept;
        this.numStates = states_Set.length;
        this.result = input;

        for(let i = 0; i < this.numStates;i++)
        {
            this.states[i] = new Array(states_Set[i][0], states_Set[i][1], states_Set[i][2]);
        }
    }
}