<template>
  <div>
    <v-btn @click="dialog = true">Create Matching</v-btn>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Matching</v-card-title>
        <v-card-text>
          <p>You can pick different import formats.</p>
          <v-text-field label="Title" v-bind="title"></v-text-field>
          <p>Flag the accounts you want to reconcile</p>
          <v-list></v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click="cancel()">Cancel</v-btn>
          <v-btn color="green darken-1" flat="flat" @click="create()">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Account as AccountModel } from '@/models/Account';

type inputType = 'Manual' | 'Excel' | 'Upload';
@Component({})
export default class CreateMatching extends Vue {
    public dialog: boolean = false;
    public title: string = '';
    public inputType: string = '';
    public items: Array<{ title: inputType}> = [
        { title: 'Manual' },
        { title: 'Excel' },
        { title: 'Upload' },
    ];

    private changeType(type: inputType) {
        this.inputType = type;
    }

    private cancel() {
      this.dialog = false;
    }

    private create() {
        this.dialog = false;
        return;
    }
}
</script>

<style lang="scss" scoped>
</style>
