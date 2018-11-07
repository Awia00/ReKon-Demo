import Vue from 'vue';
import { GetterTree, MutationTree, ActionTree, ActionContext, Module } from 'vuex';
import { State as RootState } from '../store';
import { Matching as MatchingModel } from '@/models/Matching';
import { ReconciliationClient } from '@/api/ReconciliationClient';
import IdMap from '../IdMapper';
import { Match } from '@/models/Match';
import SolutionDto from '@/api/dtos/SolutionDto';

export class State {
    public matchings: IdMap<MatchingModel> = {};
    public matchingIds: string[] = [];
}

const getterTree: GetterTree<State, RootState> = {
    matchingSet(state: State): MatchingModel[] {
        return state.matchingIds.map((x) => state.matchings[x]);
    },
    getMatching: (state: State) => (id: string): MatchingModel => {
        return state.matchings[id];
    },
};

const mutationTree: MutationTree<State> = {
    addMatching(state: State, matchingModel: MatchingModel) {
        state.matchings = Object.assign({}, state.matchings, { [matchingModel.Id]: matchingModel });
        state.matchingIds.push(matchingModel.Id.toString());
    },
    setGuuid(state: State, { matchingModel, guuid }: { matchingModel: MatchingModel, guuid: string }) {
        state.matchings[matchingModel.Id].Guuid = guuid;
    },
    setSolution(state: State, { matchingModel, solution }: { matchingModel: MatchingModel, solution: Match[] }) {
        state.matchings[matchingModel.Id].Matches = solution;
    },
};


const masterClient = new ReconciliationClient();

const actionTree: ActionTree<State, RootState> = {
    async addMatching(
        { commit, state }: ActionContext<State, RootState>, matchingModel: MatchingModel) {
        commit('addMatching', matchingModel);
    },
    async reconcile(
        { commit, state }: ActionContext<State, RootState>, matchingId: string) {
        const m = state.matchings[matchingId];
        const id: string = await masterClient.postInstance(m);
        commit('setGuuid', { matchingModel: m, guuid: id });
    },
    async syncSolution(
        { commit, state }: ActionContext<State, RootState>, matchingId: string) {
        const m = state.matchings[matchingId];
        if (m.Guuid) {
            const solution = await masterClient.getSolution(m.Guuid);
            const mappedSolution = solution.matches.map((match) => new Match(match.ids));
            commit('setSolution', { matchingModel: m, solution: mappedSolution });
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
