import { GetterTree, MutationTree, ActionTree, Module } from 'vuex';
import { State as RootState } from '../store';
import { Match as MatchModel, MatchState } from '@/models/Match';
import VueMap from '../VueMap';

export class State {
  public matches: VueMap<MatchModel> = new VueMap<MatchModel>();
  public matchIds: string[] = [];
}

const getterTree: GetterTree<State, RootState> = {
  matchSet(state: State): MatchModel[] {
    return state.matchIds.map((x) => state.matches.get(x)!);
  },

  getMatch: (state: State) => (id: string): MatchModel => {
    return state.matches.get(id)!;
  },

  getMatches: (state: State) => (ids: string[]): MatchModel[] => {
    return ids.map((x) => state.matches.get(x)!);
  },
};

const mutationTree: MutationTree<State> = {
  addMatch(state: State, matchModel: MatchModel) {
    state.matches.set(matchModel.Id.toString(), matchModel);
    state.matchIds.push(matchModel.Id.toString());
  },

  addMatches(state: State, matchModels: MatchModel[]) {
    matchModels.forEach((x) => {
      state.matches.set(x.Id.toString(), x);
      state.matchIds.push(x.Id.toString());
    });
  },
  deleteMatches(state: State, matchIds: string[]) {
    matchIds.forEach((x) => {
      state.matches.delete(x);
    });
    state.matchIds = state.matchIds.filter((x) => matchIds.indexOf(x) === -1);
  },
  setMatchState(
    state: State,
    payload: { matchId: string; matchState: MatchState },
  ) {
    state.matches.get(payload.matchId)!.MatchState = payload.matchState;
  },
};

const actionTree: ActionTree<State, RootState> = {};

export const match: Module<State, RootState> = {
  namespaced: true,
  state: new State(),
  getters: getterTree,
  mutations: mutationTree,
  actions: actionTree,
};
