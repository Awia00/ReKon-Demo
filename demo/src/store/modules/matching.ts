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
import VueMap from '../VueMap';
import { Account as AccountModel } from '@/models/Account';
import { Match } from '@/models/Match';
import { Rule } from '@/models/Rule';
import SolutionDto from '@/api/dtos/SolutionDto';

export class State {
  public matchings: VueMap<MatchingModel> = new VueMap<MatchingModel>();
  public matchingIds: string[] = [];
}

const getterTree: GetterTree<State, RootState> = {
  matchingSet(state: State): MatchingModel[] {
    return state.matchingIds.map((x) => state.matchings.get(x)!);
  },
  getMatching: (state: State) => (id: string): MatchingModel => {
    return state.matchings.get(id)!;
  },
};

const mutationTree: MutationTree<State> = {
  addMatching(state: State, matchingModel: MatchingModel) {
    state.matchings.set(matchingModel.Id.toString(), matchingModel);
    state.matchingIds.push(matchingModel.Id.toString());
  },
  removeMatching(state: State, matchingId: string) {
    const index = state.matchingIds.indexOf(matchingId);
    state.matchings.delete(matchingId);
    state.matchingIds.splice(index, 1);
  },
  setGuuid(state: State, { id, guuid }: { id: string; guuid: string }) {
    const m = state.matchings.get(id);
    if (m !== undefined) {
      m.Guuid = guuid;
    }
  },

  setSolution(
    state: State,
    { id, solution }: { id: string; solution: Match[] },
  ) {
    const m = state.matchings.get(id);
    if (m) {
      m.Matches = solution;
    }
  },

  setMatchingState(
    state: State,
    { id, mState }: { id: string; mState: MatchingState },
  ) {
    const m = state.matchings.get(id);
    if (m) {
      m.State = mState;
    }
  },

  // rules

  addRule(state: State, { mId, rule }: { mId: string, rule: Rule}) {
    if (rule.From === rule.To || !(rule.Type === 'Merge' || rule.Type === 'Conflict')) { return; }
    const m = state.matchings.get(mId);
    if (!m) { return; }

    if (rule.Type === 'Merge') {
      m.Merges.push(rule);
    } else {
      m.Conflicts.push(rule);
    }
  },

  removeRule(state: State, { mId, rule }: { mId: string, rule: Rule}) {
    const m = state.matchings.get(mId);
    if (m) {
      if (rule.Type === 'Merge') {
        m.Merges.splice(m.Merges.indexOf(rule), 1);
      } else {
        m.Conflicts.splice(m.Conflicts.indexOf(rule), 1);
      }
    }
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
    const m = state.matchings.get(matchingId);
    if (m) {
      const id: string = await masterClient.postInstance(m);
      commit('setGuuid', { id: matchingId, guuid: id });
      commit('setMatchingState', { id: matchingId, mState: 'Solving' });
    }
  },

  async syncSolution(
    { commit, state, dispatch }: ActionContext<State, RootState>,
    matchingId: string,
  ) {
    const m = state.matchings.get(matchingId);
    if (m && m.Guuid) {
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
          accountIds: m.Accounts.map((x: AccountModel) => x.Id),
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
    const m = state.matchings.get(matchingId);
    if (m && m.Guuid) {
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
