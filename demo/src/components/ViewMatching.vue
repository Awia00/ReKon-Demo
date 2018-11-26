<template>
  <v-flex>
    <v-layout row align-start>
      <v-flex xs6>
        <v-container @mouseout="clearActiveMatch()">
          <h1>
            <span v-once>{{matching.Title}}</span>
            <v-btn icon @click="deleteMatching">
              <v-icon>delete</v-icon>
            </v-btn>
          </h1>
          <v-data-table :headers="headers" :items="matches" :search="search" class="elevation-1">
            <template slot="items" slot-scope="props">
              <tr @click="showMatch(props.item)" @mouseover="setActiveMatch(props.item)">
                <td>{{ props.item.Id }}</td>
                <td>{{ getListOfIds(props.item.TransactionIds) }}</td>
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
      </v-flex>
      <v-flex xs6>
        <v-container>
          <v-layout row>
            <v-spacer></v-spacer>
            <v-btn
              v-if="matching.State === 'Initial'"
              dark
              color="primary"
              @click="reconcile()"
            >Reconcile</v-btn>
            <div v-if="matching.State === 'Solving'">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
              <v-btn dark color="primary" @click="stop()">Stop</v-btn>
            </div>
            <div v-if="matching.State === 'Finished'" style="display: contents">
              <h2 style="margin: 10px">Finished solving</h2>
              <v-btn @click="resolve()">Resolve</v-btn>
            </div>
          </v-layout>
          <ViewRules :matchingId="matchingId"></ViewRules>
        </v-container>
      </v-flex>
    </v-layout>
    <ViewMatch :showMatchDialog.sync="showMatchDialog" :match="activeMatch"></ViewMatch>
  </v-flex>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Matching as MatchingModel } from '../models/Matching';
import { Match as MatchModel } from '../models/Match';
import { Rule as RuleModel } from '../models/Rule';
import { Transaction as TransactionModel } from '@/models/Transaction';
import ViewRules from './ViewRules.vue';
import ViewMatch from './ViewMatch.vue';

@Component({
  components: {
    ViewRules,
    ViewMatch,
  },
})
export default class ViewMatching extends Vue {
  @Prop(String)
  private matchingId!: string;
  private search: string = '';
  private showMatchDialog: boolean = false;
  private activeMatch: MatchModel | null = null;

  private headers = [{ text: 'Id', value: 'Id' }, { text: 'Transaction Ids', value: 'TransactionIds' }];

  get matching(): MatchingModel {
    const result = this.$store.getters['matching/getMatching'](this.matchingId);
    return result;
  }

  get matches(): MatchModel[] {
    const result = this.$store.getters['match/getMatches'](this.matching.MatchIds);
    return result;
  }

  get rules(): RuleModel[] {
    const result = this.matching.Merges.concat(this.matching.Conflicts);
    return result;
  }

  private showMatch(match: MatchModel) {
    this.activeMatch = match;
    if (this.showMatchDialog) {
      this.showMatchDialog = false;
    }
    this.showMatchDialog = true;
  }

  private async reconcile() {
    await this.$store.dispatch('matching/reconcile', this.matching.Id);
    await this.$store.dispatch('matching/syncSolution', this.matching.Id);
  }

  private async stop() {
    this.$store.dispatch('matching/stopSolving', this.matching.Id);
  }

  private async resolve() {
    this.$store.commit('matching/setSolution', { id: this.matchingId, solution: [] });
    await this.reconcile();
  }

  private async deleteMatching() {
    this.$store.commit('matching/removeMatching', this.matchingId);
  }

  private getListOfIds(transactionIds: number[]): string {
    const result = transactionIds.reduce(
      (state, curr) => state + curr + ', ',
      '',
    );
    return result;
  }

  private clearActiveMatch() {
    this.$store.commit('transaction/setActiveTransactions', []);
  }

  private setActiveMatch(match: MatchModel) {
    this.$store.commit('transaction/setActiveTransactions', match.TransactionIds);
  }
}
</script>

<style lang="scss" scoped>
</style>
