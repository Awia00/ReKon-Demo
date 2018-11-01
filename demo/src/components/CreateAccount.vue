<template>
    <div>
        <v-btn @click="dialog = true">Create Account</v-btn>
        <v-dialog v-model="dialog" max-width="800">
            <v-card>
                <v-card-title class="headline">Account</v-card-title>
                <v-card-text>You can pick different import formats.
                    <v-text-field label="Title" v-bind="title"></v-text-field>
                    <v-switch :label="`Internal`" v-model="internal"></v-switch>
                    <v-tabs fixed-tabs>
                        <v-tab :key="Manual">
                            <v-flex>Manual</v-flex>
                        </v-tab>
                        <v-tab :key="Excel">
                            <v-flex>Excel</v-flex>
                        </v-tab>
                        <v-tab :key="Upload">
                            <v-flex>Upload</v-flex>
                        </v-tab>
                        <v-tab-item :key="Manual">
                            <p>Input your data at the table below</p>
                            <v-layout row>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field outline label="Id"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field outline label="Value"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field outline label="Text"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-text-field outline label="Date" :mask="'date-with-time'"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md3>
                                    <v-btn fill>Add</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-tab-item>
                        <v-tab-item :key="Excel">is Unsupported</v-tab-item>
                        <v-tab-item :key="Upload">is Unsupported</v-tab-item>
                    </v-tabs>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat="flat" @click="dialog = false">Cancel</v-btn>
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
export default class CreateAccount extends Vue {
    public dialog: boolean = false;
    public title: string = '';
    public internal: boolean = true;
    public transactions: TransactionModel[] = [];

    private async create() {
        await this.$store.dispatch(
            'account/CreateAccout',
            new AccountModel(this.title, this.transactions, this.internal));

        this.dialog = false;
        return;
    }
}
</script>

<style lang="scss" scoped>
</style>
