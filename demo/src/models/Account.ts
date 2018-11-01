import { Transaction } from './Transaction';

export class Account {
    public Title: string;
    public Transactions: Transaction[];
    public Internal: boolean;

    constructor();
    constructor(title: string, transactions: Transaction[], internal: boolean);
    constructor(title?: string, transactions?: Transaction[], internal?: boolean) {
        this.Title = title ? title : '';
        this.Transactions = transactions ? transactions : [];
        this.Internal = internal ? internal : true;
    }
}
