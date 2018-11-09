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
          <v-layout column fill-height>
            <v-flex>
              <v-layout row>
                <v-flex>
                  <v-text-field
                    :rules="[rules.required, rules.maxLength]"
                    label="Title"
                    v-model="title"
                  ></v-text-field>
                </v-flex>
                <v-flex>
                  <v-switch :label="'Is internal'" v-model="internal"></v-switch>
                </v-flex>
              </v-layout>
              <v-divider></v-divider>
              <div v-if="type==='Manual'">
                <p>Write input freemform</p>
                <v-layout row align-start>
                  <v-textarea
                    box
                    label="Freeform input, supporting input styles: csv, algorithmic"
                    hint="Transactions updates automatically when the input parses"
                    v-model="freeform"
                  ></v-textarea>
                  <v-tooltip bottom>
                    <v-icon slot="activator">info</v-icon>
                    <span>Input format must be either</span>
                    <p>
                      <span>csv:</span>
                      <br>
                      <span>Value, Text, Date</span>
                      <br>
                      <span>99.99, hello1, 2018-10-10</span>
                      <br>
                      <span>199.99, hello2, 2018-10-10</span>
                    </p>
                    <p>
                      <span>algoFormat [metadataId value]:</span>
                      <br>
                      <span>1, 99.99</span>
                      <br>
                      <span>2, 199.99</span>
                    </p>
                  </v-tooltip>
                </v-layout>
                <v-flex>
                  <p>Input individual transactions in the table below</p>
                  <v-layout row>
                    <v-flex xs12 sm6 md3>
                      <v-text-field
                        label="Value"
                        v-model="manualTransaction.Value"
                        :rules="[rules.required, rules.twoPointDecimal]"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md3>
                      <v-text-field
                        :rules="[rules.maxLength]"
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
            <v-flex>
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
                  <td>
                    <v-btn flat icon @click="deleteTransaction(props.index)">
                      <v-icon>delete_outline</v-icon>
                    </v-btn>
                  </td>
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
import { Watch, Prop, Component, Vue } from 'vue-property-decorator';
import FileUpload from './FileUpload.vue';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Account as AccountModel } from '@/models/Account';
import { mapActions } from 'vuex';
import Papa, { ParseResult } from 'papaparse';

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
  private rules = {
    required: (value: string) => !!value || 'Required',
    maxLength: (value: string) => value.length <= 30 || 'Maximum 30 characters',
    twoPointDecimal: (value: string) =>
      (!isNaN(parseFloat(value)) &&
        parseFloat(value) === Number(parseFloat(value).toFixed(2))) ||
      'Number with atmost 2 decimals',
  };

  // MODEL
  private title: string = ' ';
  private internal: boolean = true;
  private transactions: TransactionModel[] = [];
  private manualTransaction = { Value: '0', Date: '', Text: '' };
  private freeform: string = '';

  // METHODS
  private async fileResult(data: any[]) {
    this.transactions = data.map((dp) => {
      return TransactionModel.parse(dp);
    });
  }

  private getDateFromNumber(input: string) {
    const year: number = parseInt(
      input.substring(0, 4),
      10,
    );
    const month: number = parseInt(
      input.substring(4, 6),
      10,
    );
    const day: number = parseInt(
      input.substring(6, 8),
      10,
    );
    const hour: number = parseInt(
      input.substring(8, 10),
      10,
    );
    const min: number = parseInt(
      input.substring(10, 12),
      10,
    );
    const seconds: number = parseInt(
      input.substring(12, 14),
      10,
    );
    return new Date(year, month, day, hour, min, seconds);
  }

  private parsePromise = (content: string): Promise<ParseResult> => {
    let data: ParseResult;
    return new Promise( (resolve) => {
      Papa.parse(content, {
        header: true,
        trimHeaders: true,
        skipEmptyLines: true,
        complete: (results) => {
          data = results;
        },
      });
      resolve(data);
    });
  }

  private algoFormatRead(content: string): { transactions: TransactionModel[], errors: string[] } {
    try {
      const transactions = content.split('\n').map((line) => {
        const words = line.split(' ');
        const metadataId = words[0];
        const value = Number(words[1]);
        if (isNaN(value)) {
          throw Error('Value not a number');
        }
        return new TransactionModel(value, new Date(''), metadataId);
      });
      return  { transactions, errors: [] };
    } catch (error) {
      return { transactions: [], errors: [error] };
    }
  }

  @Watch('freeform')
  private async freeformChange(newVal: string, oldVal: string) {
    const csvResult = await this.parsePromise(newVal);
    if (csvResult.errors.length === 0) {
      this.fileResult(csvResult.data);
      return;
    }
    const algoResult = this.algoFormatRead(newVal);
    if (algoResult.errors.length === 0) {
      this.transactions = algoResult.transactions;
    }
  }

  private async addManualTransaction() {
    this.transactions.push(
      new TransactionModel(
        Number(this.manualTransaction.Value),
        this.getDateFromNumber(this.manualTransaction.Date),
        this.manualTransaction.Text,
      ),
    );
    this.manualTransaction.Value = '0';
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

  private deleteTransaction(index: number) {
    this.transactions.splice(index, 1);
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
