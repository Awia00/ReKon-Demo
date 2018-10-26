<template>
  <v-container>
    <h1>{{accountName}}</h1>
     <v-data-table
      :headers="headers"
      :items="transactions"
      hide-actions
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.Id }}</td>
        <td>{{ props.item.Value }}</td>
        <td>{{ props.item.Date }}</td>
        <td>{{ props.item.Text }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import Transaction from '../models/Transaction';

@Component({
  components: {
  },
})
export default class Account extends Vue {
  @Prop()
  public accountName: string = '';

  private headers = Object.keys(Transaction).forEach((element) => {
    return element;
  });

  private transactions = [new Transaction(), new Transaction()];
}
</script>

<style lang="scss" scoped>

</style>
