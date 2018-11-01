<template>
    <div>
        <v-btn @click="dialog = true">Create Account</v-btn>
        <v-dialog v-model="dialog" max-width="600">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-toolbar-title>Account</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn-toggle class="transparent" v-model="toggle">
                        <v-btn :value="0" flat @click="type = 'Manual'">Manual</v-btn>
                        <v-btn :value="1" flat @click="type = 'Excel'">Excel</v-btn>
                        <v-btn :value="2" flat @click="type = 'Upload'">Upload</v-btn>
                    </v-btn-toggle>
                </v-toolbar>
                <v-card-text>
                    <v-layout row>
                        <v-flex>
                            <v-text-field label="Title" v-model="title"></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-switch :label="'Internal'" v-model="internal"></v-switch>
                        </v-flex>
                    </v-layout>
                    <div v-if="type==='Manual'">
                        <v-flex>
                            <p>Input your data at the table below</p>
                            <v-layout row>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field label="Id" v-model="manualTransaction.Id"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field
                                        label="Value"
                                        :mask="'#######'"
                                        v-model="manualTransaction.Value"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field label="Text" v-model="manualTransaction.Text"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field
                                        label="Date"
                                        :mask="'date-with-time'"
                                        v-model="manualTransaction.Date"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-btn @click="addManualTransaction()">Add</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </div>
                    <div v-if="type==='Excel'">Excel</div>
                    <div v-if="type==='Upload'">Upload</div>
                    <v-divider></v-divider>
                    <h2>Transactions</h2>
                    <v-data-table :headers="headers" :items="transactions">
                        <template slot="items" slot-scope="props">
                            <td>{{ props.item.Id }}</td>
                            <td>{{ props.item.Value }}</td>
                            <td>{{ props.item.Date }}</td>
                            <td>{{ props.item.Text }}</td>
                        </template>
                    </v-data-table>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Account as AccountModel } from '@/models/Account';
import { mapActions } from 'vuex';

type inputType = 'Manual' | 'Excel' | 'Upload';
@Component({})
export default class CreateAccount extends Vue {
    public dialog: boolean = false;
    public toggle: number = 0;
    public type: inputType = 'Manual';
    public title: string = '';
    public internal: boolean = true;
    public transactions: TransactionModel[] = [];
    public manualTransaction =  { Id: '', Value: 0, Date: new Date(), Text: '' };
    private headers = Object.keys(new TransactionModel()).map((prop) => {
        return {text: prop, value: prop};
    });

    private async addManualTransaction() {
        this.transactions.push(new TransactionModel(
            this.manualTransaction.Id,
            this.manualTransaction.Value,
            this.manualTransaction.Date,
            this.manualTransaction.Text,
        ));
        this.manualTransaction.Id = '';
        this.manualTransaction.Value = 0;
        this.manualTransaction.Date = new Date();
        this.manualTransaction.Text = '';
    }

    private async create() {
        await this.$store.dispatch(
            'account/CreateAccout',
            new AccountModel(this.title, this.transactions, this.internal));

        this.dialog = false;
        return;
    }
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.0s;
}
.fade-element {
  position: absolute;
}
</style>
