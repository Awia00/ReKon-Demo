import { Transaction } from './Transaction';
export class Match {
    private static IdCounter: number = 0;

    public Id: string;
    public Transactions: Transaction[];

    constructor();
    constructor(id: string, transactions: Transaction[]);
    constructor(id?: string, transactions?: Transaction[]) {
        this.Id = id ? id : 'Match' + (Match.IdCounter++).toString();
        this.Transactions = transactions ? transactions : [];
    }
}
