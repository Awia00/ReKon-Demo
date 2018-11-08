export default class TransactionDto {
    public value: number;
    public id: number;

    public get Id(): number {
        return this.id;
    }

    public set Id(val: number) {
        this.id = val;
    }

    constructor(id: number, value: number) {
        this.id = id;
        this.value = value;
    }
}
