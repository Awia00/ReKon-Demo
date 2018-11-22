import {
    GetterTree,
    MutationTree,
    ActionTree,
    Module,
  } from 'vuex';
import { State as RootState } from '../store';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Account as AccountModel } from '@/models/Account';
import VueMap from '../VueMap';
import SolutionDto from '@/api/dtos/SolutionDto';
import TransactionDto from '@/api/dtos/TransactionDto';

export class State {
    public transactions: VueMap<TransactionModel> = new VueMap<TransactionModel>();
    public transactionIds: string[] = [];
    public activeTransactions: string[] = [];

  }

const getterTree: GetterTree<State, RootState> = {
    transactionSet(state: State): TransactionModel[] {
      return state.transactionIds.map((x) => state.transactions.get(x)!);
    },

    getTransaction: (state: State) => (id: string): TransactionModel => {
      return state.transactions.get(id)!;
    },

    getTransactions: (state: State) => (ids: string[]): TransactionModel[] => {
        return ids.map((x) => state.transactions.get(x)!);
    },

    getTransactionDtos: (state: State) => (account: AccountModel): TransactionDto[] => {
        const multiplier = account.Internal ? 1 : -1;
        return account.TransactionIds.map((id) => {
            const t = state.transactions.get(id)!;
            return new TransactionDto(t.Id, t.Value * multiplier);
        });
    },
  };

const mutationTree: MutationTree<State> = {
    addTransaction(state: State, transactionModel: TransactionModel) {
        state.transactions.set(transactionModel.Id.toString(), transactionModel);
        state.transactionIds.push(transactionModel.Id.toString());
    },

    addTransactions(state: State, transactionModels: TransactionModel[]) {
        transactionModels.forEach((x) => {
            state.transactions.set(x.Id.toString(), x);
            state.transactionIds.push(x.Id.toString());
        });
    },

    setActiveTransactions(state: State, ids: string[]) {
        state.activeTransactions = ids;
    },

    markOpenItems(
        state: State,
        { accounts, solution }: { accounts: AccountModel[]; solution: SolutionDto },
      ) {
        const openItems = solution.openItems;
        accounts.forEach((a) => {
            a.TransactionIds.forEach((tId) => {
                const t = state.transactions.get(tId)!;
                if (openItems.find((x) => x === t.Id) !== undefined) {
                    t.State = 'Open';
                } else {
                    t.State = 'Closed';
                }
            });
        });
      },
  };

const actionTree: ActionTree<State, RootState> = {
};

export const transaction: Module<State, RootState> = {
    namespaced: true,
    state: new State(),
    getters: getterTree,
    mutations: mutationTree,
    actions: actionTree,
  };

