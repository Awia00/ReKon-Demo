<template>
  <v-dialog scrollable v-model="show" max-width="600">
    <v-card v-if="match">
      <v-toolbar dark color="primary">
        <v-toolbar-title>Match "{{match.Id}}"</v-toolbar-title>
      </v-toolbar>
      <v-card-text style="height: 650px">
        <p
          class="headline"
        >Mark elements wrongly matched elements (conflict) or correctly (merge), or accept the entire match.</p>
        <v-data-table
          v-model="marks"
          :headers="headers"
          :items="transactions"
          :search="search"
          select-all
          item-key="Id"
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td>
              <v-flex>
                <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
              </v-flex>
            </td>
            <td class="text-xs-right">{{ props.item.Id }}</td>
            <td class="text-xs-right">{{ props.item.Value }}</td>
            <td class="text-xs-right">
              <span v-if="props.item.Date">{{ props.item.Date.toDateString()}}</span>
            </td>
            <td class="text-xs-right">{{ props.item.Text }}</td>
            <td class="text-xs-right">{{ props.item.State }}</td>
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
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="makeConflict()">Make Conflict</v-btn>
        <v-btn color="secondary" @click="makeMerge()">Make Merge</v-btn>
        <v-btn color="primary" @click="acceptMatch()">Accept Match</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Match as MatchModel } from '@/models/Match';
import { Rule as RuleModel } from '@/models/Rule';

@Component({})
export default class ViewMatch extends Vue {
  @Prop(MatchModel)
  public match!: MatchModel;

  @Prop(Boolean)
  public showMatchDialog: boolean = false;

  private search: string = '';
  private show: boolean = false;
  private marks: MatchModel[] = []; // update when transaction updates.

  private headers = [
    { text: 'Id', value: 'Id' },
    { text: 'Value', value: 'Value' },
    { text: 'Date', value: 'Date' },
    { text: 'Text', value: 'Text' },
    { text: 'State', value: 'State' },
  ];

  @Watch('showMatchDialog')
  private showMatchDialogChange(newVal: boolean, oldVal: boolean) {
    this.show = newVal;
  }

  @Watch('show')
  private showChange(newVal: boolean, oldVal: boolean) {
    if (!newVal) {
      this.$emit('update:showMatchDialog', false);
    } else {
      this.resetMarks();
    }
  }

  get transactions(): TransactionModel[] {
    if (!this.match) {
      return [];
    }
    const result = this.$store.getters['transaction/getTransactions'](
      this.match.TransactionIds,
    );
    return result;
  }

  get enabled(): boolean {
    const numberOfTrues = this.marks.reduce(
      (st, curr) => (curr ? st++ : st),
      0,
    );
    return numberOfTrues >= 2;
  }

  private resetMarks() {
    this.marks = [];
  }

  private async acceptMatch() {
    await this.$store.dispatch('matching/acceptMatch', {
      matchingId: this.match.MatchingId,
      matchIdToAccept: this.match.Id,
    });
    this.show = false;
  }

  private makeMerge() {
    if (this.marks.length >= 2) {
      for (let i = 0; i < this.marks.length; i++) {
        const from = parseInt(this.marks[i].Id, 10);
        for (let j = i + 1; j < this.marks.length; j++) {
          const to = parseInt(this.marks[j].Id, 10);
          this.$store.commit('matching/addRule', {
            mId: this.match.MatchingId,
            rule: new RuleModel(from, to, 'Merge'),
          });
        }
      }
      this.resetMarks();
    }
  }

  private async makeConflict() {
    if (this.marks.length >= 2) {
      for (let i = 0; i < this.marks.length; i++) {
        const from = parseInt(this.marks[i].Id, 10);
        for (let j = i + 1; j < this.marks.length; j++) {
          const to = parseInt(this.marks[j].Id, 10);
          this.$store.commit('matching/addRule', {
            mId: this.match.MatchingId,
            rule: new RuleModel(from, to, 'Conflict'),
          });
        }
      }
      await this.$store.dispatch('matching/rejectMatch', {
        matchingId: this.match.MatchingId,
        matchIdToReject: this.match.Id,
      });
      this.resetMarks();
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
