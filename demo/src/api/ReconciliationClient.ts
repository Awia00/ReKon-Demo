import Axios from 'axios';
import { Account } from '@/models/Account';
import SolutionDto from './dtos/SolutionDto';
import TransactionDto from './dtos/TransactionDto';
import { Matching } from '@/models/Matching';

export class ReconciliationClient {
    private readonly host = `http://${process.env.VUE_APP_REKON_SERVER}:${
        process.env.VUE_APP_REKON_SERVERPORT
    }/api/`;
    /**
     * Returns an Id for the instance
     */
    public async postInstance(matching: Matching): Promise<string> {
        try {
            const instance = matching.Accounts.reduce((state: TransactionDto[], current: Account) => {
                return state.concat(this.convertAccount(current));
            }, []);
            const { data }: { data: string } = await await Axios.post(`${this.host}instances`, instance);
            return data;
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('Error from Server: ' + error);
            throw error;
        }
    }

    public async getIsFinished(guid: string): Promise<boolean> {
        try {
            const { data }: { data: boolean } = await await Axios.get(`${this.host}instances/${guid}/finished`);
            return data;
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.error('Error from Server: ' + error);
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
            console.error('Error from Server: ' + error);
            throw error;
        }
    }

    private convertAccount(account: Account): TransactionDto[]  {
        return account.Transactions.map(((t) => new TransactionDto(t.Id, t.Value * (account.Internal ? 1 : -1))));
    }
}
