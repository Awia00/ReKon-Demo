<template>
  <v-container>
    <h1>{{account.Title}}</h1>
    <v-data-table :headers="headers" :items="transactions" :search="search" class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr v-bind:class="{'open': props.item.State === 'Open', 'active': isActive(props.item)}">
          <td>{{ props.item.Id }}</td>
          <td>{{ props.item.Value }}</td>
          <td v-if="props.item.Date">{{ props.item.Date.toDateString()}}</td>
          <td v-else></td>
          <td>{{ props.item.Text }}</td>
          <td>{{ props.item.State }}</td>
        </tr>
      </template>
      <template slot="footer">
        <td colspan="100%">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Transaction as TransactionModel } from '../models/Transaction';
import { Account as AccountModel } from '../models/Account';

@Component({})
export default class ViewAccount extends Vue {
  @Prop(String)
  private accountId!: string;
  private search: string = '';

  private headers = [
    { text: 'Id', value: 'Id' },
    { text: 'Value', value: 'Value' },
    { text: 'Date', value: 'Date' },
    { text: 'Text', value: 'Text' },
    { text: 'State', value: 'State' },
  ];

  get account(): AccountModel {
    return this.$store.getters['account/getAccount'](this.accountId);
  }
  get transactions() {
    return this.$store.getters['transaction/getTransactions'](this.account.TransactionIds);
  }
  get activeTransactions(): number[] {
    return this.$store.state.transaction.activeTransactions;
  }
  private isActive(t: TransactionModel): boolean {
    return this.activeTransactions.find((x) => x === t.Id) !== undefined;
  }
}
</script>

<style lang="scss" scoped>
.open {
  background-color: #ffb3b3;
}
.active {
  background-color: #ccffcc;
}
</style>
