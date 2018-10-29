export class Transaction {
    public Id: string;
    public Value: number;
    public Date: Date;
    public Text: string;

    constructor() {
        this.Id = '';
        this.Value = 0;
        this.Date = new Date();
        this.Text = '';
    }
}
