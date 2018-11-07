<template>
    <div>
        <v-btn @click="open()">Create Account</v-btn>
        <v-dialog scrollable v-model="dialog" max-width="600">
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
                <v-card-text style="height: 650px">
                    <v-layout column>
                        <v-flex>
                            <v-layout row>
                                <v-flex>
                                    <v-text-field label="Title" v-model="title"></v-text-field>
                                </v-flex>
                                <v-flex>
                                    <v-switch :label="'Is internal'" v-model="internal"></v-switch>
                                </v-flex>
                            </v-layout>
                            <div v-if="type==='Manual'">
                                <v-flex>
                                    <p>Input your data at the table below</p>
                                    <v-layout row>
                                        <v-flex xs12 sm6 md3>
                                            <v-text-field
                                                label="Value"
                                                :mask="'#######'"
                                                v-model="manualTransaction.Value"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3>
                                            <v-text-field
                                                label="Text"
                                                v-model="manualTransaction.Text"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3>
                                            <v-text-field
                                                label="Date"
                                                :mask="'####-##-## ##:##:##'"
                                                v-model="manualTransaction.Date"
                                            ></v-text-field>
                                        </v-flex>
                                        <v-flex xs12 sm6 md3>
                                            <v-btn @click="addManualTransaction()">Add</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </div>
                            <div v-if="type==='Excel'">
                                <p>Excel is not supported yet</p>
                            </div>
                            <div v-if="type==='Upload'">
                                <h2>Upload</h2>
                                <!--v-if for destroy + rebuild fileupload hack-->

                                <FileUpload v-if="dialog" v-on:fileResult="fileResult($event)"/>
                            </div>
                        </v-flex>
                        <v-divider></v-divider>
                        <v-flex align-content-start justify-start>
                            <h2>Transactions</h2>
                            <v-data-table :headers="headers" :items="transactions">
                                <template slot="items" slot-scope="props">
                                    <td>{{ props.item.Id }}</td>
                                    <td>{{ props.item.Value }}</td>
                                    <td
                                        v-if="props.item.Date"
                                    >{{ props.item.Date.toDateString() + ' ' + props.item.Date.toTimeString() }}</td>
                                    <td v-else></td>
                                    <td>{{ props.item.Text }}</td>
                                </template>
                            </v-data-table>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="cancel()">Cancel</v-btn>
                    <v-btn @click="create()" color="primary">Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import FileUpload from './FileUpload.vue';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Account as AccountModel } from '@/models/Account';
import { mapActions } from 'vuex';
import moment from 'moment';

type inputType = 'Manual' | 'Excel' | 'Upload';
@Component({
  components: {
    FileUpload,
  },
})
export default class CreateAccount extends Vue {
  // UI
  private dialog: boolean = false;
  private toggle: number = 0;
  private type: inputType = 'Manual';
  private headers = [
    { text: 'Id', value: 'Id' },
    { text: 'Value', value: 'Value' },
    { text: 'Date', value: 'Date' },
    { text: 'Text', value: 'Text' },
  ];

  // MODEL
  private title: string = '';
  private internal: boolean = true;
  private transactions: TransactionModel[] = [];
  private manualTransaction = { Value: 0, Date: '', Text: '' };

  // METHODS
  private async fileResult(data: any[]) {
    this.transactions = data.map((dp) => {
      return TransactionModel.parse(dp);
    });
  }

  private async addManualTransaction() {
    const year: number = parseInt(
      this.manualTransaction.Date.substring(0, 4),
      10,
    );
    const month: number = parseInt(
      this.manualTransaction.Date.substring(4, 6),
      10,
    );
    const day: number = parseInt(
      this.manualTransaction.Date.substring(6, 8),
      10,
    );
    const hour: number = parseInt(
      this.manualTransaction.Date.substring(8, 10),
      10,
    );
    const min: number = parseInt(
      this.manualTransaction.Date.substring(10, 12),
      10,
    );
    const seconds: number = parseInt(
      this.manualTransaction.Date.substring(12, 14),
      10,
    );
    this.transactions.push(
      new TransactionModel(
        this.manualTransaction.Value,
        new Date(year, month, day, hour, min, seconds),
        this.manualTransaction.Text,
      ),
    );
    this.manualTransaction.Value = 0;
    this.manualTransaction.Date = '';
    this.manualTransaction.Text = '';
  }

  private open() {
    this.dialog = true;
    this.transactions = [];
    this.title = '';
    this.internal = true;
    this.type = 'Upload';
    this.toggle = 2;
  }

  private cancel() {
    this.dialog = false;
  }

  private async create() {
    await this.$store.dispatch(
      'account/addAccount',
      new AccountModel(this.title, this.transactions, this.internal),
    );

    this.dialog = false;
    this.transactions = [];
    this.title = '';
    this.internal = true;
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
  opacity: 0s;
}
.fade-element {
  position: absolute;
}
</style>
