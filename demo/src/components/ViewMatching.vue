<template>
  <v-container>
    <v-layout row>
      <h1>{{matching.Title}}</h1>
      <v-spacer></v-spacer>
      <v-btn v-if="matching.State === 'Initial'" dark color="primary" @click="reconcile()">Reconcile</v-btn>
      <div v-if="matching.State === 'Solving'">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <v-btn dark color="primary" @click="stop()">Stop</v-btn>
      </div>
      <h2 v-if="matching.State === 'Finished'">Finished solving</h2>
    </v-layout>
    <v-data-table :headers="headers" :items="matches" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Id }}</td>
        <td>{{ getListOfIds(props.item.TransactionIds) }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Matching as MatchingModel } from '../models/Matching';
import { Match as MatchModel } from '../models/Match';
import { Transaction as TransactionModel} from '@/models/Transaction';

@Component({})
export default class ViewMatching extends Vue {
  @Prop(String)
  private matchingId!: string;

  private headers = Object.keys(new MatchModel()).map((prop) => {
    return {text: prop, value: prop};
  });

  get matching(): MatchingModel {
    const result = this.$store.getters['matching/getMatching'](this.matchingId);
    return result;
  }

  get matches(): MatchModel[] {
    const result = this.matching.Matches;
    return result;
  }

  private async reconcile() {
    this.$store.dispatch('matching/reconcile', this.matching.Id);
    this.$store.dispatch('matching/syncSolution', this.matching.Id);
  }

  private async stop() {
    this.$store.dispatch('matching/stopSolving', this.matching.Id);
  }

  private getListOfIds(transactionIds: number[]): string {
    const result = transactionIds.reduce((state, curr) => state + curr + ', ', '');
    return result;
  }
}
</script>

<style lang="scss" scoped>
</style>
