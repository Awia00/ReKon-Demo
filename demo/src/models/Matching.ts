import { Account } from './Account';
import { Match } from './Match';
import { Rule } from './Rule';

export type MatchingState = 'Initial' | 'Solving' | 'Finished';
export class Matching {
    private static IdCounter: number = 0;

    public Guuid: string | undefined;
    public Id: number;
    public Title: string;
    public Matches: Match[];
    public Accounts: ReadonlyArray<Account>; // todo id array
    public Conflicts: Rule[];
    public Merges: Rule[];
    public State: MatchingState;

    constructor();
    constructor(title: string, accounts: ReadonlyArray<Account>, matches: Match[]);
    constructor(title?: string, accounts?: ReadonlyArray<Account>, matches?: Match[]) {
        this.Id = Matching.IdCounter++;
        this.Title = title ? title : 'Matching ' + (this.Id);
        this.Accounts = accounts ? accounts : [];
        this.Matches = matches ? matches : [];
        this.State = 'Initial';
        this.Guuid = undefined; // to ensure vue can update it.
        this.Conflicts = [];
        this.Merges = [];
    }
}
