import Vue from 'vue';
import {
  GetterTree,
  MutationTree,
  ActionTree,
  ActionContext,
  Module,
} from 'vuex';
import { State as RootState } from '../store';
import { Matching as MatchingModel, MatchingState } from '@/models/Matching';
import { ReconciliationClient } from '@/api/ReconciliationClient';
import IdMap from '../IdMapper';
import { Match } from '@/models/Match';
import SolutionDto from '@/api/dtos/SolutionDto';

export class State {
  public matchings: IdMap<MatchingModel> = {};
  public matchingIds: string[] = [];
}

const getterTree: GetterTree<State, RootState> = {
  matchingSet(state: State): MatchingModel[] {
    return state.matchingIds.map((x) => state.matchings[x]);
  },
  getMatching: (state: State) => (id: string): MatchingModel => {
    return state.matchings[id];
  },
};

const mutationTree: MutationTree<State> = {
  addMatching(state: State, matchingModel: MatchingModel) {
    // Object.assign is neccesary for adding new fields for vuex to be reactive
    state.matchings = Object.assign({}, state.matchings, {
      [matchingModel.Id]: matchingModel,
    });
    state.matchingIds.push(matchingModel.Id.toString());
  },
  removeMatching(state: State, matchingId: string) {
    const index = state.matchingIds.indexOf(matchingId);
    Vue.delete(state.matchings, matchingId);
    state.matchingIds.splice(index, 1);
  },
  setGuuid(state: State, { id, guuid }: { id: string; guuid: string }) {
    state.matchings[id].Guuid = guuid;
  },

  setSolution(
    state: State,
    { id, solution }: { id: string; solution: Match[] },
  ) {
    state.matchings[id].Matches = solution;
  },

  setMatchingState(
    state: State,
    { id, mState }: { id: string; mState: MatchingState },
  ) {
    state.matchings[id].State = mState;
  },
};

const masterClient = new ReconciliationClient();
const actionTree: ActionTree<State, RootState> = {
  async addMatching(
    { commit, state }: ActionContext<State, RootState>,
    matchingModel: MatchingModel,
  ) {
    commit('addMatching', matchingModel);
  },

  async reconcile(
    { commit, state }: ActionContext<State, RootState>,
    matchingId: string,
  ) {
    const m = state.matchings[matchingId];
    const id: string = await masterClient.postInstance(m);
    commit('setGuuid', { id: matchingId, guuid: id });
    commit('setMatchingState', { id: matchingId, mState: 'Solving' });
  },

  async syncSolution(
    { commit, state, dispatch }: ActionContext<State, RootState>,
    matchingId: string,
  ) {
    const m = state.matchings[matchingId];
    if (m.Guuid) {
      const solution: SolutionDto = await masterClient.getSolution(m.Guuid);
      if (m.Matches.length < solution.incumbent) {
        const mappedSolution = solution.matches.map(
          (match) => new Match(match.ids),
        );
        commit('setSolution', { id: matchingId, solution: mappedSolution });
      }
      const isFinished = masterClient.getIsFinished(m.Guuid);
      dispatch(
        'account/markOpenItems',
        {
          accountIds: m.Accounts.map((x) => x.Id),
          solution,
        },
        { root: true },
      );
      if (!await isFinished) {
        setTimeout(() => dispatch('syncSolution', matchingId), 2000);
      } else {
        commit('setMatchingState', { id: matchingId, mState: 'Finished' });
      }
    }
  },

  async stopSolving(
    { commit, state }: ActionContext<State, RootState>,
    matchingId: string,
  ) {
    const m = state.matchings[matchingId];
    if (m.Guuid) {
      await masterClient.putIsFinished(m.Guuid);
      commit('setMatchingState', { id: matchingId, mState: 'Finished' });
    }
  },
};

export const matching: Module<State, RootState> = {
  namespaced: true,
  state: new State(),
  getters: getterTree,
  mutations: mutationTree,
  actions: actionTree,
};
