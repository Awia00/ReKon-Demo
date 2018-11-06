import TransactionDto from './TransactionDto';

export default class Instance {
    public transactions: TransactionDto[];

    constructor() {
        this.transactions = [];
    }
}
