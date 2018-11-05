<template>
  <v-container>
    <h1>{{account.Title}}</h1>
    <v-data-table :headers="headers" :items="transactions" hide-actions class="elevation-1">
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
  </v-container>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Transaction as TransactionModel } from '../models/Transaction';
import { Account as AccountModel } from '../models/Account';

@Component({})
export default class ViewAccount extends Vue {
  @Prop(AccountModel)
  private account!: AccountModel;

  private headers = Object.keys(new TransactionModel()).map((prop) => {
    return { text: prop, value: prop };
  });
  private transactions = this.account.Transactions;
}
</script>

<style lang="scss" scoped>
</style>
