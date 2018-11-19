import Axios from 'axios';
import { Account } from '@/models/Account';
import SolutionDto from './dtos/SolutionDto';
import TransactionDto from './dtos/TransactionDto';
import InstanceDto from './dtos/InstanceDto';
import { Matching } from '@/models/Matching';
import RuleDto from './dtos/RuleDto';

export class ReconciliationClient {
    private readonly host = `${process.env.VUE_APP_REKON_SERVER}:${
        process.env.VUE_APP_REKON_SERVERPORT
    }/api/`;
    /**
     * Returns an Id for the instance
     */
    public async postInstance(matching: Matching): Promise<string> {
        try {
            const transactions = matching.Accounts.reduce((state: TransactionDto[], current: Account) => {
                return state.concat(this.convertAccount(current));
            }, []);
            const merges = matching.Merges.map((x) => new RuleDto(x.From, x.To, x.Type));
            const conflicts = matching.Conflicts.map((x) => new RuleDto(x.From, x.To, x.Type));
            const instance = new InstanceDto(transactions, merges, conflicts);
            const { data }: { data: string } = await await Axios.post(`${this.host}instances`, instance);
            return data;
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('(postInstance) Error from Server: ' + error);
            throw error;
        }
    }

    public async getIsFinished(guid: string): Promise<boolean> {
        try {
            const { data }: { data: boolean } = await await Axios.get(`${this.host}instances/${guid}/finished`);
            return data;
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('(getIsFinished) Error from Server: ' + error);
            throw error;
        }
    }

    public async putIsFinished(guid: string): Promise<void> {
        try {
            await Axios.put(`${this.host}instances/${guid}/finished`);
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('(putIsFinished) Error from Server: ' + error);
            throw error;
        }
    }

    // todo make websocket based.
    public async getSolution(guid: string): Promise<SolutionDto> {
        try {
            const { data }: { data: SolutionDto } = await await Axios.get(`${this.host}instances/${guid}/solutions`);
            return data;
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('(getSolution) Error from Server: ' + error);
            throw error;
        }
    }

    private convertAccount(account: Account): TransactionDto[]  {
        return account.Transactions.map(((t) => new TransactionDto(t.Id, t.Value * (account.Internal ? 1 : -1))));
    }
}
