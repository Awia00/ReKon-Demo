import Axios, { AxiosError } from 'axios';
import SolutionDto from './dtos/SolutionDto';
import InstanceDto from './dtos/InstanceDto';

export class ReconciliationClient {
    private readonly host = `${process.env.VUE_APP_REKON_SERVER}:${
        process.env.VUE_APP_REKON_SERVERPORT
    }/api/`;
    /**
     * Returns an Id for the instance
     */
    public async postInstance(instance: InstanceDto): Promise<string> {
        try {
            const response = await Axios.post(`${this.host}instances`, instance);
            const { data }: { data: string } = await response;
            return data;
        } catch (error) {
            throw await this.extractError(error);
        }
    }

    public async getIsFinished(guid: string): Promise<boolean> {
        try {
            const response = await Axios.get(`${this.host}instances/${guid}/finished`);
            const { data }: { data: boolean } = await response;
            return data;
        } catch (error) {
            throw await this.extractError(error);
        }
    }

    public async putIsFinished(guid: string): Promise<void> {
        try {
            const response = await Axios.put(`${this.host}instances/${guid}/finished`);
            await response;
        } catch (error) {
            throw await this.extractError(error);
        }
    }

    // todo make websocket based.
    public async getSolution(guid: string): Promise<SolutionDto> {
        try {
            const response = await Axios.get(`${this.host}instances/${guid}/solutions`);
            const { data }: { data: SolutionDto } = await response;
            return data;
        } catch (error) {
            throw await this.extractError(error);
        }
    }

    private async extractError(error: Promise<AxiosError>): Promise<AxiosError> {
        const e = await error;
        const extra = e.response ? ': ' + e.response.data : '';
        e.message += extra;
        return e;
    }
}
