import { Match } from './Match';
import moment from 'moment';

export class Transaction {
    public static parse(dynObject: { Id: string | undefined, Value: string, Date?: string, Text?: string }) {
        const date = dynObject.Date !== undefined ? new Date(dynObject.Date.trim()) : undefined!;
        return new Transaction(
            dynObject.Id!,
            parseInt(dynObject.Value, 10),
            date,
            dynObject.Text!,
        );
    }
    private static IdCounter: number = 0;

    public Id: string;
    public Value: number;
    public Date: Date | undefined;
    public Text: string | undefined;

    constructor();
    constructor(id: string, value: number, date: Date, text: string);
    constructor(id?: string, value?: number, date?: Date, text?: string) {
        this.Id = id ? id : 'Transaction ' + (Transaction.IdCounter++).toString();
        this.Value = value ? value : 0;
        this.Date = date;
        this.Text = text ? text.trim() : text;
    }
}
