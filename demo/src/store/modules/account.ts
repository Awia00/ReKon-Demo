import {
  GetterTree,
  MutationTree,
  ActionTree,
  ActionContext,
  Module,
} from 'vuex';
import { State as RootState } from '../store';
import { Account as AccountModel } from '@/models/Account';
import { Transaction as TransactionModel } from '@/models/Transaction';
import VueMap from '../VueMap';
import SolutionDto from '@/api/dtos/SolutionDto';

export class State {
  public accounts: VueMap<AccountModel> = new VueMap<AccountModel>();
  public accountIds: string[] = [];
  public activeTransactions: number[] = [];
}

const getterTree: GetterTree<State, RootState> = {
  accountSet(state: State): AccountModel[] {
    return state.accountIds.map((x) => state.accounts.get(x)!);
  },

  getAccount: (state: State) => (id: string): AccountModel => {
    return state.accounts.get(id)!;
  },
};

const mutationTree: MutationTree<State> = {
  addAccount(state: State, accountModel: AccountModel) {
    state.accounts.set(accountModel.Id.toString(), accountModel);
    state.accountIds.push(accountModel.Id.toString());
  },

  markOpenItems(
    state: State,
    { accountIds, solution }: { accountIds: number[]; solution: SolutionDto },
  ) {
    const openItems = solution.openItems;
    accountIds.forEach((index) => {
      state.accounts.get(index.toString())!.Transactions.forEach((t: TransactionModel) => {
        if (openItems.find((x) => x === t.Id) !== undefined) {
          t.State = 'Open';
        } else {
          t.State = 'Closed';
        }
      });
    });
  },

  setActiveTransactions(state: State, ids: number[]) {
    state.activeTransactions = ids;
  },
};

const actionTree: ActionTree<State, RootState> = {
  async addAccount(
    { commit }: ActionContext<State, RootState>,
    accountModel: AccountModel,
  ) {
    commit('addAccount', accountModel);
  },

  async markOpenItems(
    { commit }: ActionContext<State, RootState>,
    { accountIds, solution }: { accountIds: number[]; solution: SolutionDto },
  ) {
    commit('markOpenItems', { accountIds, solution });
  },
};

export const account: Module<State, RootState> = {
  namespaced: true,
  state: new State(),
  getters: getterTree,
  mutations: mutationTree,
  actions: actionTree,
};
