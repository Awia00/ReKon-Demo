import {
    GetterTree,
    MutationTree,
    ActionTree,
    Module,
  } from 'vuex';
import { State as RootState } from '../store';

export class State {
    public errorMessage: string = '';
    public active: boolean = false;
}

const getterTree: GetterTree<State, RootState> = {

};

const mutationTree: MutationTree<State> = {
    setError(state: State, error: Error) {
        state.active = true;
        if (error.message) {
            state.errorMessage = error.message;
        } else {
            state.errorMessage = 'Unknown error occured';
        }
    },
    clearError(state: State) {
        state.active = false;
    },
};

const actionTree: ActionTree<State, RootState> = {
};

export const ui: Module<State, RootState> = {
    namespaced: true,
    state: new State(),
    getters: getterTree,
    mutations: mutationTree,
    actions: actionTree,
  };

