<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>Resolved |&nbsp;</span>
        <span class="font-weight-light">Automated Account Reconciliation</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <h3 slot="activator" class="font-weight-light">[Demo Build]</h3>
        <span>
          Interested in more? Contact us at
          <b>awis@itu.dk</b>
        </span>
      </v-tooltip>
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
    <v-content height="100%">
      <v-layout column fill-height justify-space-between>
        <v-layout v-if="accounts.length === 0" row align-center justify-center>
          <h2
            class="font-weight-light"
          >Click the hamburger menu in the upper left corner to add accounts and matchings</h2>
        </v-layout>
        <v-layout v-if="accounts.length !== 0" align-start justify-center row>
          <v-flex v-if="accounts[0]">
            <ViewAccount v-bind:accountId="accounts[0]"/>
          </v-flex>
          <v-flex v-if="accounts[1]">
            <ViewAccount v-bind:accountId="accounts[1]"/>
          </v-flex>
        </v-layout>
        <v-flex v-if="matchings.length >= 1">
          <ViewMatching v-bind:matchingId="matchings[0]"/>
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
import { setTimeout, setInterval, clearInterval } from 'timers';

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

  get accounts(): number[] {
    const result: number[] = this.$store.state.account.accountIds;
    return result ? result : [];
  }

  get matchings(): number[] {
    const result: number[] = this.$store.state.matching.matchingIds;
    return result ? result : [];
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
