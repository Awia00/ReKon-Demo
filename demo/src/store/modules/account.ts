import { GetterTree, MutationTree, ActionTree, ActionContext, Module } from 'vuex';
import { State as RootState } from '../store';
import { Account as AccountModel } from '@/models/Account';
import { Transaction } from '@/models/Transaction';

export class State {
    public accounts: AccountModel[] = [
        new AccountModel('Internal Ledger', [new Transaction(), new Transaction()], true),
    ];
}

const getterTree: GetterTree<State, RootState> = {
};

const mutationTree: MutationTree<State> = {
    addAccount(state: State, accountModel: AccountModel) {
        state.accounts.push(accountModel);
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
