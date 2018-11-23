<template>
    <v-dialog scrollable v-model="show" max-width="600">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Account</v-toolbar-title>
            </v-toolbar>
            <v-card-text style="height: 650px">
                <v-data-table
                    :headers="headers"
                    :items="transactions"
                    :search="search"
                    class="elevation-1"
                >
                    <template slot="items" slot-scope="props">
                        <tr
                            v-bind:class="{'open': props.item.State === 'Open', 'active': isActive(props.item)}"
                        >
                            <td>
                                <v-checkbox v-model="marks[props.item.index]"></v-checkbox>
                            </td>
                            <td>{{ props.item.Id }}</td>
                            <td>{{ props.item.Value }}</td>
                            <td v-if="props.item.Date">{{ props.item.Date.toDateString()}}</td>
                            <td v-else></td>
                            <td>{{ props.item.Text }}</td>
                            <td>{{ props.item.State }}</td>
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
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="accent" @click="makeConflict()">Make Conflict</v-btn>
                <v-btn color="secondary" @click="makeMerge()">Make Merge</v-btn>
                <v-btn color="primary" @click="acceptMatch()">Accept Match</v-btn>
                <v-btn color="primary" @click="closeUp()">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';
import { Transaction as TransactionModel } from '@/models/Transaction';
import { Match as MatchModel } from '@/models/Match';

@Component({})
export default class ViewMatch extends Vue {
    @Prop(MatchModel)
    public match!: MatchModel;

    @Prop(Boolean)
    public showMatchDialog!: boolean;

    private search: string = '';
    private show: boolean = false;
    private marks: boolean[] = []; // update when transaction updates.

    private headers = [
        { text: 'Mark', value: 'Mark'},
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
        if(!newVal) {
            this.$emit('update:showMatchDialog', false);
        }
    }

    get transactions(): TransactionModel[] {
        if (!this.match) {
            return [];
        }
        const result = this.$store.getters['transaction/getTransactions'](this.match.TransactionIds);
        return [];
    }

    private acceptMatch() {
        return;
    }

    private makeMerge() {
        return;
    }

    private makeConflict() {
        return;
    }
}
</script>

<style lang="scss" scoped>

</style>
