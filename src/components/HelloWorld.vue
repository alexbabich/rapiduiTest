<template>
  <div class="rp-input-wrapper">
    <b-container fluid>
      <div class="mt-2 ml-5 rp-logo"></div>
    </b-container>
    <b-container fluid>
      <b-tabs class="pt-2 pb-2 pl-5 pr-5">
        <b-tab title="Tests table" active>
          <vue-good-table
            title="Tests table columns"
            :columns="fieldsTestTable"
            :rows="rowsTestTable"
            :lineNumbers="false"
            :globalSearch="false"
            :paginate="true"
            styleClass="table condensed table-bordered table-striped">

            <template slot="table-column" slot-scope="props">
              <span v-if="props.column.label  =='SelectAll'">
                <label class="checkbox">
                  <input type="checkbox" @click="selectAllItems()">
                </label>
              </span>
              <span v-else>
                  {{props.column.label}}
              </span>
            </template>

            <template slot="table-row" slot-scope="props">
              <td>
                <input type="checkbox" v-model="rowsTestTable[props.row.originalIndex].checkbox" :value="props.row.id" :name="props.row.checkbox" />
              </td>
              <td class="rp-category"><span v-for="category in props.row.categories">{{category}}</span></td>
              <td>{{ props.row.name }}</td>
              <td>{{ props.row.last_run_time | formatDate }}</td>
              <td>{{ props.row.last_run_branch }}</td>
              <td>
                <select :class="props.row.last_run_status | formatStatusClass | isEmpty" class="rp-status custom-select rp-status-select">
                  <template v-for="stat in statusVariant">
                    <option :key="stat.id" v-bind:disabled="stat.text == props.row.last_run_status" v-bind:selected="stat.text == props.row.last_run_status" :value="stat.value">{{stat.text | formatStatus }}</option>
                  </template>
                </select>
              </td>
              <td>{{ props.row.lastTimeDefault | isEmpty }}</td>
              <td>
                <select :class="props.row.status | formatStatusClass | isEmpty" class="rp-status custom-select rp-status-select">
                  <template v-for="stat in statusVariant">
                    <option :key="stat.id" v-bind:disabled="stat.text == props.row.status" v-bind:selected="stat.text == props.row.status" :value="stat.value">{{stat.text | formatStatus }}</option>
                  </template>
                </select>
              </td>
              <td>
                <b-link :href="props.row.link" role="button" class="btn btn-outline-primary btn-sm " target="_blank"><i class="fas fa-info-circle"></i> Open preview</b-link>
              </td>
              <td>
                <b-button @click.stop="openBranchNow( props.row.id )" variant="primary" size="sm" class="btn-raised btn-secondary">
                  <i class="fas fa-external-link-alt"></i>Run now</b-button>
              </td>
            </template>
          </vue-good-table>

          <!-- Info modal -->

          <b-modal id="openBranchNow" @hide="resetRunBranch" hide-footer>
            <b-row class="justify-content-md-center">
              <p>Enter branch name and url then press button</p>
            </b-row>
            <b-row class="justify-content-md-center">
              <input type="text" class="col-8" placeholder="Please type branch name" v-model="runBranchName"/>
            </b-row>
            <b-row class="justify-content-md-center">
              <input type="text" class="col-8 mt-2" placeholder="Please type url" v-model="runUrl"/>
            </b-row>
            <b-row class="mt-2 justify-content-md-center">
              <b-button size="sm" class="col-8 btn-raised btn-success" @click="runBranch()"><i class="far fa-share-square"></i> run branch</b-button>
            </b-row>
          </b-modal>
        </b-tab>
        <b-tab title="Runs table">
          <div class="rp-table-wrapper">
            <b-button variant="primary" size="sm" class="btn-raised btn-secondary rp-run-all" v-show="allSelected2">
              <i class="fas fa-retweet"></i> rerun all
            </b-button>
            <b-button variant="primary" size="sm" class="btn-raised btn-secondary rp-run-all2" v-show="!allSelected2">
              <i class="fas fa-retweet"></i> rerun checked
            </b-button>
            <vue-good-table
              title="Runs table columns"
              :columns="fieldsRunTable"
              :rows="rowsRunTable"
              :lineNumbers="false"
              :globalSearch="false"
              :paginate="true"
              styleClass="table condensed table-bordered table-striped">

              <template slot="table-column" slot-scope="props">
                <span v-if="props.column.label  =='SelectAll'">
                  <label class="checkbox">
                    <input type="checkbox" @click="selectAllItems2()">
                  </label>
                </span>
                <span v-else>
                    {{props.column.label}}
                </span>
              </template>

              <template slot="table-row" slot-scope="props">
                <td>
                  <input type="checkbox" v-model="rowsRunTable[props.row.originalIndex].checkbox" :value="props.row.id" :name="props.row.checkbox" />
                </td>
                <td>{{ props.row.category | isEmpty }}</td>
                <td>{{ props.row.name | isEmpty}}</td>
                <td>{{ props.row.branch}}</td>
                <td>{{ props.row.start_time | formatDate }}</td>
                <td>{{ getResult(props.row.id) }}</td>
                <td>
                  <select :class="props.row.status | formatStatusClass | isEmpty" class="rp-status custom-select rp-status-select">
                    <template v-for="stat in statusVariant">
                      <option :key="stat.id" v-bind:disabled="stat.text == props.row.status" v-bind:selected="stat.text == props.row.status" :value="stat.value">{{stat.text | formatStatus }}</option>
                    </template>
                  </select>
                </td>
                <td>
                  <b-link :href="props.row.link" role="button" class="btn btn-outline-primary btn-sm " target="_blank"><i class="fas fa-info-circle"></i> Open preview</b-link>
                </td>
                <td>
                  <b-button variant="primary" size="sm" @click.stop="showLog(props.row.name, props.row.id, $event.target)" class="mr-1 btn-raised btn-secondary">
                    <i class="far fa-share-square"></i> Show log
                  </b-button>
                </td>
                <td>
                  <b-button @click.stop="openBranchNow2()" variant="primary" size="sm" class="btn-raised btn-secondary">
                    <i class="fas fa-external-link-alt"></i> Run now
                  </b-button>
                </td>
              </template>
            </vue-good-table>
          </div>

          <!-- Info modals -->

          <b-modal id="modalInfoLog" @hide="resetModalLog" ok-only>
            <p>{{ modalInfoLog.content }}</p>
          </b-modal>

          <b-modal id="openBranchNow2" @hide="resetRunBranch2" hide-footer>
            <b-row class="justify-content-md-center">
              <p>Enter branch name and url then press button</p>
            </b-row>
            <b-row class="justify-content-md-center">
              <input type="text" class="col-8" placeholder="Please type branch name" v-model="runBranchName2"/>
            </b-row>
            <b-row class="justify-content-md-center">
              <input type="text" class="col-8 mt-2" placeholder="Please type url" v-model="runUrl2"/>
            </b-row>
            <b-row class="mt-2 justify-content-md-center">
              <b-button size="sm" class="col-8 btn-raised btn-success" @click="runBranch2()"><i class="far fa-share-square"></i> run branch</b-button>
            </b-row>
          </b-modal>
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
// import Qs from 'qs'
import {API} from '@/api_connection'
import moment from 'moment'

const fieldsTestTable = [
  {
    label: 'SelectAll',
    field: 'checkbox',
    sortable: false
  },
  {
    label: 'Category',
    field: 'categories',
    filterable: true
  },
  {
    label: 'Name',
    field: 'name',
    filterable: true
  },
  {
    label: 'Last run time',
    field: 'last_run_time',
    filterable: true
  },
  {
    label: 'Last run branch',
    field: 'last_run_branch',
    filterable: true
  },
  {
    label: 'Last run status',
    field: 'last_run_status',
    html: false
  },
  {
    label: 'Last run time on default',
    field: 'last_run_time_default',
    filterable: true
  },
  {
    label: 'Last run on default status',
    field: 'last_status_default'
  },
  {
    label: 'Open preview',
    field: 'previewButton',
    html: false,
    sortable: false
  },
  {
    label: 'Run now',
    field: 'nowButton',
    html: false,
    sortable: false
  }
]

const fieldsRunTable = [
  {
    label: 'SelectAll',
    field: 'checkbox',
    sortable: false
  },
  {
    label: 'Category',
    field: 'category',
    filterable: true
  },
  {
    label: 'Name',
    field: 'name',
    filterable: true
  },
  {
    label: 'Branch of run',
    field: 'branch',
    filterable: true
  },
  {
    label: 'Run start',
    field: 'start_time',
    filterable: true
  },
  {
    label: 'Execution time',
    field: 'result',
    type: 'number',
    filterable: true
  },
  {
    label: 'Run status',
    field: 'status'
  },
  {
    label: 'Open preview',
    field: 'link',
    html: false,
    sortable: false
  },
  {
    label: 'Show log',
    field: 'nowButton',
    html: false,
    sortable: false
  },
  {
    label: 'Rerun button',
    field: 'rerunButton',
    html: false,
    sortable: false
  }
]

// const config = [{
//   responseType: 'json',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
// }]

export default {
  name: 'HelloWorld',
  data () {
    return {
      runBranchName: '',
      runUrl: '',
      runBranchName2: '',
      runUrl2: '',
      selected: null,
      statusVariant: [
        { value: '1', text: 'success' },
        { value: '2', text: 'finished' },
        { value: '3', text: 'start' },
        { value: '4', text: 'in_progress' }
      ],
      errors: [],
      allSelected: false,
      allSelected2: false,
      fieldsTestTable: fieldsTestTable,
      fieldsRunTable: fieldsRunTable,
      rowsTestTable: '',
      rowsRunTable: '',
      modalInfoLog: { title: '', content: '' }
    }
  },
  filters: {
    isEmpty: (value) => {
      if (value === '' || value == null) return 'absent'
      else return value
    },
    formatDate: (value) => {
      if (value) return moment(value).format('DD/MM/YYYY hh:mm')
    },
    formatStatus: (value) => {
      switch (value) {
        case 'start':
          return 'start'
        case 'success':
          return 'success'
        case 'finished':
          return 'finished'
        case 'in_progress':
          return 'in progress'
        default:
          return 'absent'
      }
    },
    formatStatusClass: (value) => {
      switch (value) {
        case 'start':
          return 'text-success'
        case 'success':
          return 'text-success'
        case 'in_progress':
          return 'text-danger'
        case 'finished':
          return 'text-danger'
        default:
          return 'absent'
      }
    }
  },
  mounted: {
  },
  methods: {
    runBranch (testId) {
      let pushedData = {
        testUrl: this.runUrl,
        branch: this.runBranchName,
        test_id: testId
      }
      // axios.post(`http://34.192.233.68:8080/startTask`, JSON.stringify(pushedData), config)
      //   .then(response => {
      //     console.log(response)
      //     console.log('saved successfully')
      //   })
      //   .catch(e => {
      //     this.errors.push(e)
      //   })
      // let self = this
      // axios({
      //   method: 'post',
      //   url: 'http://34.192.233.68:8080/startTask',
      //   data: JSON.stringify({
      //     testUrl: self.runUrl,
      //     branch: self.runBranchName,
      //     test_id: testId
      //   }
      // })
      this.$http.post('http://34.192.233.68:8080/startTask', JSON.stringify(pushedData))
        .then(function (res) {
          console.log(res)
          console.log('saved successfully')
        }, function (res) {
        })
      this.$root.$emit('bv::hide::modal', 'openBranchNow')
    },
    runBranch2 (testId) {
      axios.post(`startTask`, {
        testUrl: this.runUrl2,
        branch: this.runBranchName2,
        test_id: testId
      })
        .then(response => {
        })
        .catch(e => {
          this.errors.push(e)
        })
      this.$root.$emit('bv::hide::modal', 'openBranchNow2')
    },
    resetRunBranch () {
      this.runUrl = ''
      this.runBranchName = ''
    },
    resetRunBranch2 () {
      this.runUrl2 = ''
      this.runBranchName2 = ''
    },
    openBranchNow (index, button) {
      this.$root.$emit('bv::show::modal', 'openBranchNow', button)
    },
    selectAllItems () {
      this.allSelected = !this.allSelected
      this.rowsTestTable.forEach(row => {
        if (this.allSelected) {
          row.checkbox = true
        } else {
          row.checkbox = false
        }
      })
    },
    openBranchNow2 (index, button) {
      this.$root.$emit('bv::show::modal', 'openBranchNow2', button)
    },
    selectAllItems2 () {
      this.allSelected2 = !this.allSelected2
      this.rowsRunTable.forEach(row => {
        if (this.allSelected2) {
          row.checkbox = true
        } else {
          row.checkbox = false
        }
      })
    },
    showLog (item, index, button) {
      this.modalInfoLog.title = `Row index: ${index}`
      this.modalInfoLog.content = this.getPayload(index)
      this.$root.$emit('bv::show::modal', 'modalInfoLog', button)
    },
    resetModalLog () {
      this.modalInfoLog.title = ''
      this.modalInfoLog.content = ''
    },
    getResult (idTest) {
      let ty = this.rowsRunTable.filter(res => { return res.id === idTest && res.result }).map(res => res.result.exec_time)[0]
      return ty || '0'
    },
    getPayload (idTest) {
      let itemPayload = this.rowsRunTable.filter(res => { return res.id === idTest && res.result }).map(res => res.result.payload)[0]
      let itemStatus = this.rowsRunTable.filter(res => { return res.id === idTest && res.result }).map(res => res.result.status)[0]
      return itemPayload || itemStatus || 'none'
    }
  },
  computed: {
  },
  created () {
    API.get(`test`)
      .then(response => {
        this.rowsTestTable = response.data.data.map(function (incident) {
          return incident
        })
      })
      .catch(e => {
        this.errors.push(e)
      })

    API.get(`run`)
      .then(response => {
        this.rowsRunTable = response.data.data.map(function (incident) {
          // console.log(incident)
          return incident
        })
      })
      .catch(e => {
        this.errors.push(e)
      })
  }
}
</script>

<style lang="scss">
  @import '../assets/css/general';

  /* begin style for select rp-status-select */
  .rp-status-select {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    font-size: 16px !important;
    padding: 0 !important;
    cursor: pointer;
  }
  /* end style for select rp-status-select */

  .rp-category {

    span {
      position: relative;
      display: inline-block;
      margin-right: 5px;

      &::after {
        content: ',';
        position: relative;
      }

      &:last-child::after {
        display: none;
      }
    }
  }

  .modal-content {

    .modal-header {
      padding: 10px 20px 0;
    }

    .modal-body {
      padding: 0 24px 24px;
    }
  }
</style>
