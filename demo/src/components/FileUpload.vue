<template>
  <div>
    <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving"></form>
    <div class="dropbox" v-if="isInitial">
      <input
        type="file"
        :disabled="isSaving"
        @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
        accept=".csv"
        class="input-file"
      >
      <p v-if="isInitial">Drag your file here to begin
        <br>or click to browse
      </p>
      <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
    </div>
    <div v-if="isSuccess">
      <p>Upload successfull.</p>
      <v-btn @click="reset()">Upload again</v-btn>
    </div>
    <div v-if="isFailed">
      <p>Uploaded failed.</p>
      <v-btn @click="reset()">Upload again</v-btn>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import Papa from 'papaparse';
type STATUS =
  | 'STATUS_INITIAL'
  | 'STATUS_SAVING'
  | 'STATUS_SUCCESS'
  | 'STATUS_FAILED';

@Component({})
export default class FileUpload extends Vue {
  private status: STATUS = 'STATUS_INITIAL';
  private fileCount: number = 0;
  private error: string | null = null;
  private currentStatus: string | null = null;

  public mounted() {
    this.reset();
  }

  get isInitial() {
    return this.status === 'STATUS_INITIAL';
  }
  get isSaving() {
    return this.status === 'STATUS_SAVING';
  }
  get isSuccess() {
    return this.status === 'STATUS_SUCCESS';
  }
  get isFailed() {
    return this.status === 'STATUS_FAILED';
  }

  private reset() {
    this.status = 'STATUS_INITIAL';
    this.error = null;
  }

  private save(formData: FormData) {
    this.currentStatus = 'STATUS_SAVING';
  }

  private fileParsed(results: Papa.ParseResult, file: File) {
    if (results.errors.length === 0) {
      this.status = 'STATUS_SUCCESS';
      this.$emit('fileResult', results.data);
    } else {
      this.status = 'STATUS_FAILED';
      this.error = results.errors[0].message;
    }
  }

  private filesChange(fieldName: string, files: File[]) {
    this.status = 'STATUS_SAVING';
    this.error = null;
    if (files.length === 1) {
      const file = files[0];
      Papa.parse(file, {
        header: true,
        trimHeaders: true,
        skipEmptyLines: true,
        complete: this.fileParsed,
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
