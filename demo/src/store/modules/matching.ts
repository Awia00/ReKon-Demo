import { GetterTree, MutationTree, ActionTree, ActionContext, Module } from 'vuex';
import { State as RootState } from '../store';
import { Matching as MatchingModel } from '@/models/Matching';
import { Transaction } from '@/models/Transaction';

export class State {
    public matchings: MatchingModel[] = [];
}

const getterTree: GetterTree<State, RootState> = {
};

const mutationTree: MutationTree<State> = {
    addMatching(state: State, accountModel: MatchingModel) {
        state.matchings.push(accountModel);
    },
};

const actionTree: ActionTree<State, RootState> = {
    async addMatching({ commit, rootState }: ActionContext<State, RootState>, accountModel: MatchingModel) {
        commit('addMatching', accountModel);
    },
};

export const matching: Module<State, RootState> = {
    namespaced: true,
    state: new State(),
    getters: getterTree,
    mutations: mutationTree,
    actions: actionTree,
};
