import TransactionDto from './TransactionDto';
import RuleDto from './RuleDto';

export default class InstanceDto {
    public transactions: TransactionDto[];
    public merges: RuleDto[];
    public conflicts: RuleDto[];

    constructor(transactions: TransactionDto[], merges: RuleDto[], conflicts: RuleDto[]) {
        this.transactions = transactions;
        this.merges = merges;
        this.conflicts = conflicts;
    }
}
