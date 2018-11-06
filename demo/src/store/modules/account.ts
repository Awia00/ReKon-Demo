import { GetterTree, MutationTree, ActionTree, ActionContext, Module } from 'vuex';
import { State as RootState } from '../store';
import { Account as AccountModel } from '@/models/Account';
import { Transaction } from '@/models/Transaction';
import IdMap from '../IdMapper';

export class State {
    public accounts: IdMap<AccountModel> = {};
    public accountIds: string[] = [];
}

const getterTree: GetterTree<State, RootState> = {
    accountSet(state: State): AccountModel[] {
        return state.accountIds.map((x) => state.accounts[x]);
    },
};

const mutationTree: MutationTree<State> = {
    addAccount(state: State, accountModel: AccountModel) {
        state.accounts[accountModel.Id] = (accountModel);
        state.accountIds.push(accountModel.Id.toString());
    },
};

const actionTree: ActionTree<State, RootState> = {
    async addAccount({ commit, rootState }: ActionContext<State, RootState>, accountModel: AccountModel) {
        commit('addAccount', accountModel);
    },
};

export const account: Module<State, RootState> = {
    namespaced: true,
    state: new State(),
    getters: getterTree,
    mutations: mutationTree,
    actions: actionTree,
};
