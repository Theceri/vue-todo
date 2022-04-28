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

// the package we are using for client side validation
import VeeValidate from 'vee-validate'

// the package we are using for toast messages
import CxltToastr from 'cxlt-vue2-toastr'

// again, the package we are using for toast messages
const toastrConfigs = {
  position: 'bottom right', /* changed from default top right to bottom right so as not to obfuscate navbar items when the toast message displays*/
  showDuration: 2000,
  timeOut: 5000, /* the property that defines how long the toast message stays on */
  progressBar: true,
}

// define a global event bus
// ensure that the name (eventBus in this case) is unique otherwise you may overwrite something else on the window object
window.eventBus = new Vue()

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VeeValidate) /* we are now using the VeeValidate package for client side validation */
Vue.use(CxltToastr, toastrConfigs) /* again, the package we are using for toast messages */

const router = new VueRouter({
  routes, // this is ES6 for routes: routes
  
  // gets rid of the default # in the URL (eg http://localhost:8080/#/register now becomes http://localhost:8080/register)
  mode: 'history'
})

// from the documentation of VueRouter 3 (which goes with Vue 2): https://v3.router.vuejs.org/guide/advanced/meta.html
// we define the navigational guards here so that we can specify in the routes what routes can be accessed when the user is logged in
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        name: 'login',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.getters.loggedIn) {
      next({
        name: 'todo',
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
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
