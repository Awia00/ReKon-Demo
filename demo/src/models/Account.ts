import { Transaction } from './Transaction';

export class Account {
    public Title: string;
    public Transactions: Transaction[];

    constructor();
    constructor(title: string, transactions: Transaction[]);
    constructor(title?: string, transactions?: Transaction[]) {
        this.Title = title ? title : '';
        this.Transactions = transactions ? transactions : [];
    }
}
