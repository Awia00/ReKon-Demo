import Vue from 'vue';
import Vuex, { GetterTree, MutationTree, ActionTree } from 'vuex';
import { account } from './modules/account';
import { Matching } from '@/models/Matching';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export class State {
  public matching: Matching = new Matching();
}

const getterTree: GetterTree<State, any> = {};

const mutationTree: MutationTree<State> = {};

const actionTree: ActionTree<any, any> = {};

export default new Vuex.Store({
  strict: debug,
  modules: {
    account,
  },
  state: new State(),
  getters: getterTree,
  mutations: mutationTree,
  actions: actionTree,
});
