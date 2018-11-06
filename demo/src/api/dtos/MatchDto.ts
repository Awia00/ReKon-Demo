export default class MatchDto {
  public ids: number[];

  constructor(ids: number[]) {
    this.ids = ids.sort((a: number, b: number) => a - b);
  }
}
