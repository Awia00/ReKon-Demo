import { Transaction } from './Transaction';

export class Account {
    private static IdCounter: number = 0;

    public Id: number;
    public Title: string;
    public Transactions: Transaction[];
    public Internal: boolean;

    constructor();
    constructor(title: string, transactions: Transaction[], internal: boolean);
    constructor(title?: string, transactions?: Transaction[], internal?: boolean) {
        this.Id = Account.IdCounter++;
        this.Title = title !== undefined ? title : '';
        this.Transactions = transactions !== undefined ? transactions : [];
        this.Internal = internal !== undefined ? internal : true;
    }
}
