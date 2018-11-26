<template>
  <v-snackbar v-model="activeError" color="error">
    {{ errorMessage }}
    <v-btn dark flat @click="dismiss()">Close</v-btn>
  </v-snackbar>
</template>


<script lang="ts">
import { Prop, Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class Error extends Vue {
    get activeError() {
        return this.$store.state.ui.active;
    }

    public dismiss() {
        this.$store.commit('ui/clearError');
    }

    get errorMessage() {
        return this.$store.state.ui.errorMessage;
    }
}
</script>

<style lang="scss" scoped>

</style>
