import { Transaction } from './Transaction';
export class Match {
    private static IdCounter: number = 0;

    public Id: string;
    public TransactionIds: number[];

    constructor();
    // tslint:disable-next-line:unified-signatures
    constructor(transactionsIds?: number[]);
    constructor(transactionsIds?: number[], id?: string) {
        this.Id = id ? id : 'Match' + (Match.IdCounter++).toString();
        this.TransactionIds = transactionsIds ? transactionsIds : [];
    }
}
