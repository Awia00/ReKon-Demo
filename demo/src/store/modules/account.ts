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

export class State {
  public accounts: VueMap<AccountModel> = new VueMap<AccountModel>();
  public accountIds: string[] = [];
}

const getterTree: GetterTree<State, RootState> = {
  accountSet(state: State): AccountModel[] {
    return state.accountIds.map((x) => state.accounts.get(x)!);
  },

  getAccount: (state: State) => (id: string): AccountModel => {
    return state.accounts.get(id)!;
  },

  getAccounts: (state: State) => (ids: string[]): AccountModel[] => {
    return ids.map((x) => state.accounts.get(x)!);
  },
};

const mutationTree: MutationTree<State> = {
  addAccount(state: State, accountModel: AccountModel) {
    state.accounts.set(accountModel.Id.toString(), accountModel);
    state.accountIds.push(accountModel.Id.toString());
  },
};

const actionTree: ActionTree<State, RootState> = {
  async addAccount(
    { commit }: ActionContext<State, RootState>,
    payload: {
      account: AccountModel,
      transactions: TransactionModel[],
    },
  ) {
    commit('addAccount', payload.account);
    commit('transaction/addTransactions', payload.transactions, { root: true });
  },
};

export const account: Module<State, RootState> = {
  namespaced: true,
  state: new State(),
  getters: getterTree,
  mutations: mutationTree,
  actions: actionTree,
};
