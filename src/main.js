// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import VueRouter from 'vue-router'

import routes from './routes'

// import App from './App' // We are no longer using it as the entry point to our app, but rather now using the new component Master.vue. We are only keeping it because, in the router, we have indicated that it is the component we shall use for the URI /todo

// we are now going to use the component Master.vue as the new entry point to our app instead of the App.vue component
import Master from './components/layouts/Master'

// when working with Vuex for state management, ensure to import the store here and use it like below. we are destructuring by using {store} instead of just store
import {store} from './store/store'

// define a global event bus
// ensure that the name (eventBus in this case) is unique otherwise you may overwrite something else on the window object
window.eventBus = new Vue()

Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
  routes, // this is ES6 for routes: routes
  
  // gets rid of the default # in the URL (eg http://localhost:8080/#/register now becomes http://localhost:8080/register)
  mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  // when working with Vuex for state management, we have imported the store above and now we are using it here. since we have used destructuring when importing above, we have the option of store, instead of store: store,
  store: store,
  components: { Master },// for this property and the one below, replace App with Master because Master.vue is the new entry point to our app, replacing App.vue
  template: '<Master/>'
})
