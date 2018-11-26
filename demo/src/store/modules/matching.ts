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
import InstanceDto from '@/api/dtos/InstanceDto';
import TransactionDto from '@/api/dtos/TransactionDto';
import RuleDto from '@/api/dtos/RuleDto';

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
      m.MatchIds = solution.map((x) => x.Id);
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

    // validate that merges and conflicts are valid.
    if (rule.Type === 'Merge') {
      if (m.Merges.find((x) => x.equals(rule)) === undefined) {
        m.Merges.push(rule);
      }
    } else {
      if (m.Conflicts.find((x) => x.equals(rule)) === undefined) {
        m.Conflicts.push(rule);
      }
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
    { commit, state, rootGetters }: ActionContext<State, RootState>,
    matchingId: string,
  ) {
    const m = state.matchings.get(matchingId);
    if (m) {
      const accounts = rootGetters['account/getAccounts'](m.AccountIds);
      const transactions = accounts.reduce((prev: TransactionDto[], curr: AccountModel) => {
        return prev.concat(rootGetters['transaction/getTransactionDtos'](curr));
      }, []);
      const merges = m.Merges.map((x) => new RuleDto(x.From, x.To, x.Type));
      const conflicts = m.Conflicts.map((x) => new RuleDto(x.From, x.To, x.Type));

      const instance = new InstanceDto(transactions, merges, conflicts);
      const id: string = await masterClient.postInstance(instance);
      commit('setGuuid', { id: matchingId, guuid: id });
      commit('setMatchingState', { id: matchingId, mState: 'Solving' });
    }
  },

  async syncSolution(
    { commit, state, dispatch, rootGetters }: ActionContext<State, RootState>,
    matchingId: string,
  ) {
    const m = state.matchings.get(matchingId);
    if (m && m.Guuid) {
      const solution: SolutionDto = await masterClient.getSolution(m.Guuid);
      if (m.MatchIds.length < solution.incumbent) {
        const mappedSolution = solution.matches.map(
          (match) => new Match(matchingId, match.ids),
        );
        commit('match/deleteMatches', m.MatchIds, { root: true });
        commit('match/addMatches', mappedSolution, { root: true });
        commit('setSolution', { id: matchingId, solution: mappedSolution });
        commit(
          'transaction/markOpenItems',
          {
            accounts: rootGetters['account/getAccounts'](m.AccountIds),
            solution,
          },
          { root: true },
        );
      }

      const isFinished = masterClient.getIsFinished(m.Guuid);
      if (!await isFinished) {
        setTimeout(async () => await dispatch('syncSolution', matchingId), 2000);
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
