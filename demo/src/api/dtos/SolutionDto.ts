import MatchDto from './MatchDto';

export default class SolutionDto {
  public matches: MatchDto[];
  public get incumbent(): number {
    return this.matches.length;
  }
  public openItems: number[];

  constructor();
  constructor(matches: MatchDto[], openItems: number[]);
  constructor(matches?: MatchDto[], openItems?: number[]) {
    this.matches = matches || [];
    this.openItems = openItems || [];
  }
}
