import { Match } from './Match';
import moment from 'moment';

export class Transaction {
    public static parse(dynObject: { Value: string, Date?: string, Text?: string }) {
        const date = dynObject.Date !== undefined ? new Date(dynObject.Date.trim()) : undefined!;
        return new Transaction(
            parseInt(dynObject.Value, 10),
            date,
            dynObject.Text,
        );
    }
    private static IdCounter: number = 0;

    public Id: number;
    public Value: number;
    public Date: Date | undefined;
    public Text: string | undefined;

    constructor();
    constructor(value: number, date: Date, text?: string);
    constructor(value?: number, date?: Date, text?: string) {
        this.Id = Transaction.IdCounter++;
        this.Value = value ? value : 0;
        this.Date = date;
        this.Text = text ? text.trim() : text;
    }
}
