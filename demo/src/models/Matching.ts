import { Account } from './Account';
import { Match } from './Match';
export class Matching {
    private static IdCounter: number = 0;

    public Guuid: string | undefined;
    public Id: number;
    public Title: string;
    public Matches: Match[];
    public Accounts: ReadonlyArray<Account>;

    constructor();
    constructor(title: string, accounts: ReadonlyArray<Account>, matches: Match[]);
    constructor(title?: string, accounts?: ReadonlyArray<Account>, matches?: Match[]) {
        this.Id = Matching.IdCounter++;
        this.Title = title ? title : 'Matching ' + (this.Id);
        this.Accounts = accounts ? accounts : [];
        this.Matches = matches ? matches : [];
    }
}
