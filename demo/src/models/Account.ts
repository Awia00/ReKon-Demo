import { Transaction } from './Transaction';

export class Account {
    private static IdCounter: number = 0;

    public Id: number;
    public Title: string;
    public TransactionIds: string[];
    public Internal: boolean;

    constructor();
    constructor(title: string, transactions: string[], internal: boolean);
    constructor(title?: string, transactions?: string[], internal?: boolean) {
        this.Id = Account.IdCounter++;
        this.Title = title !== undefined ? title : '';
        this.TransactionIds = transactions !== undefined ? transactions : [];
        this.Internal = internal !== undefined ? internal : true;
    }
}
