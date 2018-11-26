import Vue from 'vue';
import Vuex, { GetterTree, MutationTree, ActionTree } from 'vuex';
import { account } from './modules/account';
import { matching } from './modules/matching';
import { transaction } from './modules/transaction';
import { match } from './modules/match';
import { ui } from './modules/ui';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export class State {}

const getterTree: GetterTree<State, any> = {};

const mutationTree: MutationTree<State> = {};

const actionTree: ActionTree<any, any> = {};

export default new Vuex.Store({
  strict: debug,
  modules: {
    account,
    matching,
    match,
    transaction,
    ui,
  },
  state: new State(),
  getters: getterTree,
  mutations: mutationTree,
  actions: actionTree,
});
