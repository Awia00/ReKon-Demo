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

    public equals(o: Rule) {
        return this.Type === o.Type && (
            (this.From === o.From && this.To === o.To) ||
            (this.From === o.To && this.To === o.From));
    }
}
