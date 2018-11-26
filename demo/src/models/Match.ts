import { Transaction } from './Transaction';
export class Match {
    private static IdCounter: number = 0;

    public Id: string;
    public TransactionIds: number[];
    public MatchingId: string;

    constructor(matchingId: string);
    // tslint:disable-next-line:unified-signatures
    constructor(matchingId: string, transactionsIds?: number[]);
    constructor(matchingId: string, transactionsIds?: number[], id?: string) {
        this.Id = id ? id : (Match.IdCounter++).toString();
        this.TransactionIds = transactionsIds ? transactionsIds : [];
        this.MatchingId = matchingId;
    }
}
