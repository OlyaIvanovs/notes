import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import * as firebase from 'firebase'
import App from './App'
import router from './router'
import { store } from './store'
import dateFilter from './filters/date'
import DeleteMemory from './components/memories/dialogs/DeleteMemory.vue'
import EditMemory from './components/memories/dialogs/EditMemory.vue'
import AddMember from './components/memories/dialogs/AddMember.vue'
import DeleteMember from './components/memories/dialogs/DeleteMember.vue'
import EditPhotoMemory from './components/memories/dialogs/EditPhotoMemory.vue'
import Alert from './components/shared/Alert.vue'

Vue.use(Vuetify, { theme: {
  primary: '#ff1744',
  secondary: '#424242',
  accent: '#c2185b ',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}})

Vue.filter('date', dateFilter)
Vue.component('app-delete-dialog', DeleteMemory)
Vue.component('app-add-member-dialog', AddMember)
Vue.component('app-delete-member-dialog', DeleteMember)
Vue.component('app-edit-dialog', EditMemory)
Vue.component('app-edit-photo-dialog', EditPhotoMemory)
Vue.component('app-alert', Alert)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store: store,
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAsYC9qxdcWeaH-2zcy3oIGvPnQtptXRN4',
      authDomain: 'makenotedaily.firebaseapp.com',
      databaseURL: 'https://makenotedaily.firebaseio.com',
      projectId: 'makenotedaily',
      storageBucket: 'makenotedaily.appspot.com'
    })

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })
  }
})
