<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>Resolved |&nbsp;</span>
        <span class="font-weight-light">Automated Account Reconciliation</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            <h2>Menu</h2>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            <h2>Accounts</h2>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <CreateAccount/>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            <h2>Matchings</h2>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-content>
          <CreateMatching/>
        </v-list-tile-content>
      </v-list-tile>
    </v-navigation-drawer>
    <v-content>
      <v-layout column fill-height justify-space-between>
        <v-layout align-start justify-center row>
          <v-flex v-if="accounts[0]">
            <ViewAccount v-bind:account="accounts[0]"/>
          </v-flex>
          <v-flex v-if="accounts[1]">
            <ViewAccount v-bind:account="accounts[1]"/>
          </v-flex>
        </v-layout>
        <v-flex v-if="matchings.length >= 1">
          <v-layout align-center justify-center>
            <v-btn dark color="primary">Reconcile</v-btn>
          </v-layout>
          <ViewMatching v-bind:matching="matchings[0]"/>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import CreateAccount from '@/components/CreateAccount.vue';
import ViewAccount from '@/components/ViewAccount.vue';
import CreateMatching from '@/components/CreateMatching.vue';
import ViewMatching from '@/components/ViewMatching.vue';
import { Account as AccountModel } from '@/models/Account';
import { Matching as MatchingModel } from '@/models/Matching';
import { Transaction } from '@/models/Transaction';

@Component({
  components: {
    CreateAccount,
    ViewAccount,
    CreateMatching,
    ViewMatching,
  },
})
export default class App extends Vue {
  private drawer: boolean = false;

  get accounts(): AccountModel[] {
    const result = this.$store.state.account.accounts;
    return result ? result : [];
  }

  get matchings(): MatchingModel[] {
    const result = this.$store.state.matching.matchings;
    return result ? result : [];
  }

  private async reconcile() {
    return;
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
