import { Match } from './Match';

export class Transaction {
    private static IdCounter: number = 0;

    public Id: string;
    public Value: number;
    public Date: Date;
    public Text: string;

    constructor();
    constructor(id: string, value: number, date: Date, text: string);
    constructor(id?: string, value?: number, date?: Date, text?: string) {
        this.Id = id ? id : 'Transaction ' + (Transaction.IdCounter++).toString();
        this.Value = value ? value : 0;
        this.Date = date ? date : new Date();
        this.Text = text ? text : '';
    }
}
