import { GetterTree, MutationTree, ActionTree, ActionContext, Module } from 'vuex';
import { State as RootState } from '../store';
import { Account as AccountModel } from '@/models/Account';
import { Transaction } from '@/models/Transaction';

export class State {
    public accounts: AccountModel[] = [
        new AccountModel('Internal Ledger', [new Transaction(), new Transaction()]),
        new AccountModel('Bank Account', [new Transaction()]),
    ];
}

const getterTree: GetterTree<State, RootState> = {};

const mutationTree: MutationTree<State> = {};

const actionTree: ActionTree<State, RootState> = {};

export const account: Module<State, RootState> = {
    namespaced: true,
    state: new State(),
    getters: getterTree,
    mutations: mutationTree,
    actions: actionTree,
};
