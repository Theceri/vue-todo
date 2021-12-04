// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// when working with Vuex for state management, ensure to import the store here and use it like below. we are destructuring by using {store} instead of just store
import {store} from './store/store'

// define a global event bus
// ensure that the name (eventBus in this case) is unique otherwise you may overwrite something else on the window object
window.eventBus = new Vue()

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // when working with Vuex for state management, we have imported the store above and now we are using it here. since we have used destructuring when importing above, we have the option of store, instead of store: store,
  store: store,
  components: { App },
  template: '<App/>'
})
