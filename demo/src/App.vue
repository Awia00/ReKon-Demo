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
            <span>Menu</span>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-divider></v-divider>
    </v-navigation-drawer>
    
    <v-content>
      <v-layout row>
        <Account v-bind:account="accounts[0]"/>
        <Account v-bind:account="accounts[1]"/>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import Account from './components/Account.vue';
import { Account as AccountModel } from './models/Account';
import { Transaction } from '@/models/Transaction';

@Component({
  components: {
    Account,
  },
})
export default class App extends Vue {
  private drawer: boolean = false;
  private accounts: AccountModel[] = [
    new AccountModel('Internal Ledger', [new Transaction(), new Transaction()]),
    new AccountModel('Bank Account', [new Transaction()]),
  ];
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
