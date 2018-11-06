export default class TransactionDto {
    public value: number;
    public id: number;

    public get Id(): number {
        return this.id;
    }

    public set Id(val: number) {
        this.id = parseInt(val.toFixed(0), 10);
    }

    constructor(id: number, value: number) {
        this.id = parseInt(id.toFixed(0), 10);
        this.value = value;
    }
}
