import Axios from 'axios';

export class ReconciliationService {
    private readonly host = `http://${process.env.REKON_SERVER}:${
        process.env.REKON_SERVERPORT
    }/`;
    public async saveMatching() {
        try {
            const { data }: { data: string } = await await Axios.get(this.host + 'solve');
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('Error from Server: ' + error);
        }
        return;
    }

    public async startSolving() {
        try {
            const { data }: { data: string } = await await Axios.get(this.host + 'solve');
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('Error from Server: ' + error);
        }
        return;
    }

    // todo make websocket based.
    public async getSolution() {
        try {
            const { data }: { data: string } = await await Axios.get(this.host + 'solve');
        } catch (error) {
            // tslint:disable-next-line:no-console
            console.log('Error from Server: ' + error);
        }
        return;
    }
}
