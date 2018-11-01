<template>
  <v-container>
    <h1>{{matching.Id}}</h1>
     <v-data-table
      :headers="headers"
      :items="matches"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Id }}</td>
        <td>{{ props.item.Transactions.map(x => x.id) }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Matching as MatchingModel } from '../models/Matching';
import { Transaction as TransactionModel} from '@/models/Transaction';

@Component({})
export default class ViewMatching extends Vue {
  @Prop(MatchingModel)
  private matching!: MatchingModel;

  private headers = Object.keys(new MatchingModel()).map((prop) => {
    return {text: prop, value: prop};
  });
  private matches = this.matching.Matches;

  private getListOfIds(transactions: TransactionModel[]): string {
    const result = transactions.reduce((state, curr) => state + curr.Id + ', ', '');
    return result;
  }
}
</script>

<style lang="scss" scoped>
</style>
