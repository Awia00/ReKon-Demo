export type ruleType = 'Merge' | 'Conflict';
export class Rule {
    public From: number;
    public To: number;
    public Type: ruleType;

    constructor(from: number, to: number, type: ruleType) {
        this.From = from;
        this.To = to;
        this.Type = type;
    }
}
