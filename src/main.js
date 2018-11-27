// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-material-design/scss/bootstrap-material-design.scss'
import VueGoodTable from 'vue-good-table'

// maybe can delete
import vueResource from 'vue-resource'
import vSelect from 'vue-select'
Vue.component('v-select', vSelect)
//

Vue.use(vueResource)
Vue.use(VueGoodTable)
Vue.use(BootstrapVue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
