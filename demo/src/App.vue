<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span>Resolved |</span>
        <span class="font-weight-light"> Automated Account Reconciliation</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
       <v-btn
          icon
        >
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
      <v-divider></v-divider>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            <h2>Matchings</h2>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-navigation-drawer>
    
    <v-content>
      <v-layout column fill-height justify-space-between>
        <v-layout align-start justify-center row>
          <v-flex>
            <ViewAccount v-bind:account="accounts[0]"/>
          </v-flex>
          <v-flex>
            <ViewAccount v-bind:account="accounts[1]"/>
          </v-flex>
        </v-layout>
        <v-flex>
          <ViewMatching v-bind:matching="matching"/>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import ViewAccount from '@/components/Account.vue';
import ViewMatching from '@/components/Matching.vue';
import { Account as AccountModel } from '@/models/Account';
import { Matching as MatchingModel } from '@/models/Matching';
import { Transaction } from '@/models/Transaction';

@Component({
  components: {
    ViewAccount,
    ViewMatching,
  },
})
export default class App extends Vue {
  private drawer: boolean = false;

  get accounts(): AccountModel[] {
    const result = this.$store.state.account.accounts;
    return result ? result : [];
  }

  get matching(): MatchingModel {
    const result = this.$store.state.matching;
    return result;
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
