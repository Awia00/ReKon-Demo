<template>
    <v-data-table :headers="headers" :items="rules" :search="search" class="elevation-1">
        <template slot="items" slot-scope="props">
            <tr>
                <td>{{ props.item.From }}</td>
                <td>{{ props.item.To }}</td>
                <td>
                    <span>{{ props.item.Type }}</span>
                    <v-btn flat icon @click="deleteRule(props.item)">
                        <v-icon>delete_outline</v-icon>
                    </v-btn>
                </td>
            </tr>
        </template>
        <template slot="footer">
            <td colspan="100%">
                <v-layout row>
                    <v-text-field single-line hide-details label="From" v-model="from"></v-text-field>
                    <v-text-field single-line hide-details label="To" v-model="to"></v-text-field>
                    <v-select single-line hide-details :items="types" label="Type" v-model="type"></v-select>
                    <v-btn :disabled="!enabled" @click="addRule()">Add</v-btn>
                    <v-text-field
                        v-model="search"
                        append-icon="search"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-layout>
            </td>
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Matching as MatchingModel } from '../models/Matching';
import { Rule as RuleModel, ruleType, Rule } from '../models/Rule';
import { isNumber } from 'util';

@Component({})
export default class ViewRules extends Vue {

    @Prop(String)
    public matchingId!: string;
    private from: string = '';
    private to: string = '';
    private type: ruleType | null = null;

    private types: string[] = ['Merge', 'Conflict'];
    private search: string = '';

    get matching(): MatchingModel {
        const result = this.$store.getters['matching/getMatching'](this.matchingId);
        return result;
    }

    get rules(): RuleModel[] {
        const result = this.matching.Merges.concat(this.matching.Conflicts);
        return result;
    }

    get enabled(): boolean {
        const fromCheck = !!this.from && !isNaN(Number(this.from));
        const toCheck = !!this.to && !isNaN(Number(this.to));
        const typeCheck = (this.type === 'Merge' || this.type === 'Conflict');
        return fromCheck && toCheck && typeCheck;
    }

    private headers = Object.keys(new RuleModel(0, 0, 'Merge')).map((prop) => {
        return { text: prop, value: prop };
    });

    private addRule() {
        if (this.enabled) {
            const rule = new RuleModel(parseInt(this.from!, 10), parseInt(this.to!, 10), this.type!);
            this.$store.commit('matching/addRule', { mId: this.matchingId, rule});
            this.from = '';
            this.to = '';
        }
    }

    private deleteRule(rule: RuleModel) {
        this.$store.commit('matching/removeRule', { mId: this.matchingId, rule});
    }
}
</script>

<style lang="scss" scoped>

</style>
