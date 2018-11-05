import { Transaction } from './Transaction';

export class Account {
    public Title: string;
    public Transactions: Transaction[];
    public Internal: boolean;

    constructor();
    constructor(title: string, transactions: Transaction[], internal: boolean);
    constructor(title?: string, transactions?: Transaction[], internal?: boolean) {
        this.Title = title !== undefined ? title : '';
        this.Transactions = transactions !== undefined ? transactions : [];
        this.Internal = internal !== undefined ? internal : true;
    }
}
