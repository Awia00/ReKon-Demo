import { ruleType } from '@/models/Rule';

export default class RuleDto {
    public from: number;
    public to: number;
    public type: ruleType;

    constructor(from: number, to: number, type: ruleType) {
        this.from = from;
        this.to = to;
        this.type = type;
    }
}
