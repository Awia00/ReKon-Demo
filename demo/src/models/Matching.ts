import { Account } from './Account';
import { Match } from './Match';
export class Matching {
    private static IdCounter: number = 0;

    public Id: string;
    public Matches: Match[];
    public Accounts: ReadonlyArray<Account>;

    constructor();
    constructor(id: string, accounts: ReadonlyArray<Account>, matches: Match[]);
    constructor(id?: string, accounts?: ReadonlyArray<Account>, matches?: Match[]) {
        this.Id = id ? id : 'Matching ' + (Matching.IdCounter++).toString();
        this.Accounts = accounts ? accounts : [];
        this.Matches = matches ? matches : [];
    }
}
