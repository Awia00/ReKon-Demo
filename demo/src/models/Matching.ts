import { Match } from './Match';
export class Matching {
    private static IdCounter: number = 0;

    public Id: string;
    public Matches: Match[];

    constructor();
    constructor(id: string, matches: Match[]);
    constructor(id?: string, matches?: Match[]) {
        this.Id = id ? id : 'Matching ' + (Matching.IdCounter++).toString();
        this.Matches = matches ? matches : [];
    }
}
