<template>
  <div>
    <v-btn @click="open()">Create Matching</v-btn>
    <v-dialog v-model="dialog" max-width="500" scrollable>
      <v-card height="500">
        <v-toolbar dark color="primary">
          <v-toolbar-title>Matching</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field label="Title" v-model="title"></v-text-field>
          <h2>Accounts</h2>
          <p>Flag the accounts you want to reconcile</p>
          <v-list two-line subheader>
            <template v-for="(item, index) in accounts">
              <v-list-tile :key="index" @click>
                <v-list-tile-action>
                  <v-checkbox v-model="item.checked"></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content @click="item.checked = !item.checked">
                  <v-list-tile-title v-html="item.account.Title"></v-list-tile-title>
                  <v-list-tile-sub-title v-if="item.account.Internal">Internal</v-list-tile-sub-title>
                  <v-list-tile-sub-title v-else>External</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
          <v-list></v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="cancel()">Cancel</v-btn>
          <v-btn color="primary" @click="create()">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Account as AccountModel } from '@/models/Account';
import { Matching as MatchingModel } from '@/models/Matching';

@Component({})
export default class CreateMatching extends Vue {
  public dialog: boolean = false;
  public title: string = '';
  public accounts: Array<{ account: AccountModel; checked: boolean }> = [];

  private open() {
    this.accounts = this.$store.getters['account/accountSet'].map(
      (a: AccountModel) => {
        return { account: a, checked: false };
      },
    );
    this.dialog = true;
  }

  private cancel() {
    this.dialog = false;
  }

  private async create() {
    const toSave = this.accounts.filter((a) => a.checked).map((a) => a.account.Id.toString());
    await this.$store.dispatch(
      'matching/addMatching',
      new MatchingModel(this.title, toSave, []),
    );
    this.dialog = false;
    return;
  }
}
</script>

<style lang="scss" scoped>
</style>
