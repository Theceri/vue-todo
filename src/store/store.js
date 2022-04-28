// the standard name for this file is index.js though
// as your project grows, you may
// - use mapGetters which is a helper function, makes defining things in the component easier to do with much fewer lines of code esp if you have components that make too much reference of getters. also mapActions and mapMutations
// - if you the store.js file is getting too big, you may split it out into separate files eg you can have the getters, mutations, actions each in a separate file to have a cleaner file system
// - have more than one store
// - you can also make use of modules which allow you to have multiple stores unlike the one store we have right now, but we can have a store for module A and a store for module B etc

import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

axios.defaults.baseURL = 'http://localhost:8000/api/';

// this is where we define the store
export const store = new Vuex.Store({
  // down here we input all the data that was global in the previous version of the app eg the array of todo under the data object in the parent TodoList.vue component eg the filter property and the list of todos
  // after we have created this state, we go to all places where the previous todos list in the TodoList.vue component was referenced and we replace this.todos with this.$store.state.todos. also replace this.filter with this.$store.state.filter
  state: {
    // for the token
    token: localStorage.getItem('access_token') || null,

    // this is for the loading spinner that shows as we wait for the todos to be fetched from the database
    // loading: true,

    //   even though we have moved the identical property to the child component, we still have this one here because it controls the computed property todosFiltered
    filter: "all",

    //   list of todos
    todos: []
  },
  getters: { /* A getter is like a computed property */

    // as part of the rules when using Vuex for state management, computed properties come here into the store as getters: here we paste all the computed properties from the main TodoList.vue component
    // also, all getters take state as a parameter, and so everything 'this.$store.state....' changes to 'state....'
    // the computed properties from the man TodoList.vue component were mainly for filtering out the todos and then performing some operation on the filtered todos

    // a getter/computed property that holds the state of whether or not we are logged in. The criteria for checking this is whether the token is null or not
    loggedIn(state) {
      return state.token !== null /* We are, of course, logged in if the token is not null */
    },

    // grab our todos, filter down to those that are not completed, and then count them
    remaining(state) {
      return state.todos.filter(todo => !todo.completed).length;
    },
    //   for example before changing, return this.remaining != 0 was just referring to the above getter named remaining, but now we change that and add getters as one of the paramenters, and then instead of this.remaining, we use getters.remaining
    anyRemaining(state, getters) {
      return getters.remaining != 0;
    },
    todosFiltered(state) {
      // Caused by the buttons we have included in the bottom for All, Active, and Completed - filter the list of todos so that we loop through and list all todos if the All button is clicked, loop through and list only those that are not completed if the Active button is clicked, and loop through and list only those that are completed if the Completed button is clicked
      if (state.filter == "all") {
        return state.todos;
      } else if (state.filter == "active") {
        return state.todos.filter(todo => !todo.completed);
      } else if (state.filter == "completed") {
        return state.todos.filter(todo => todo.completed);
      }

      return state.todos;
    },
    showClearCompletedButton(state) {
      return state.todos.filter(todo => todo.completed).length > 0;
    }
  },

  // mutating the state directly is bad practice. so every time we are mutating the state (in this case the array of todos - indicated above), we need to use a mutation, and the mutation properties are defined below
  mutations: {
    addTodo(state, todo) {
      state.todos.push({
        id: todo.id,
        title: todo.title,
        completed: false,
        timestamp: new Date(),
        editing: false
      });
    },
    updateTodo(state, todo) {
      // we are replacing every 'this' with 'todo' eg this.id becomes todo.id

      const index = state.todos.findIndex(item => item.id == todo.id);

      state.todos.splice(index, 1, {
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        editing: todo.editing
      });
    },
    deleteTodo(state, id) {
      const index = state.todos.findIndex(item => item.id == id);

      // console.log(index)

      // One of the problems we are having when working to implement the Firebase Realtime Database (which ensures that changes reflect in all clients [eg browsers and mobile devices] when the data in the store is updated) is that once we delete an item, two items get deleted instead, ie the item we have deleted, and the last item. This behaviour is confirmed when we console.log() the index of the deleted item like we have done above, and we get two indexes, it the index of the item and -1, which is the index of the last item. That's the reason why we put the below code in a conditional statement, so that if the index is -1, we don't delete anything.
      if (index > 0) {
        state.todos.splice(index, 1);
      }
    },

    checkAll(state, checked) {
      state.todos.forEach(todo => (todo.completed = checked));
    },

    updateFilter(state, filter) {
      state.filter = filter;
    },

    clearCompleted(state) {
      state.todos = state.todos.filter(todo => !todo.completed);
    },

    // define it after you reference it from the action retrieveTodos below
    retrieveTodos(state, todos) {
      state.todos = todos;
    },

    retrieveToken(state, token) {
      // set the token in our state
      state.token = token
    },

    destroyToken(state) {
      state.token = null // just set the token to null when logging out
    },
    
    clearTodos(state) {
      state.todos = []
    },
  },

  // actions are similar to mutations but they include asynchronous code, usually used when working with AJAX...just use it where you know you are going to do an AJAX call, leave the rest of the stuff in the mutations
  // we shall simulate AJAX calls here with setTimeout
  // anything that's modifying state and you know that finally we shall put it in/through the database (eg addTodo, updateTodo, deleteTodo - some of the others are just local to the app, but we're going to grab all of them for now and put them here under actions etc)
  // instead of the state, we are now taking in context as the parameter
  actions: {
    // for when we want the name in the TodoList.vue component, so that when a user is logged in, we can display the name of the user that is logged in
    retrieveName(context) {
      // getting an 401 Unauthorized error because we are not including headers in the axios request, so we need to include the headers in the axios request
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

      return new Promise((resolve, reject) => {
        axios.get('/user')
          .then(response => {
            resolve(response) /* To let the parent know if it's either resolved or rejected */
          })
          .catch(error => {
            reject(error) /* To let the parent know if it's either resolved or rejected */
          })
      })
    },

    //   since, when we log out of one user and login with another user, we briefly see the tasks of the previous user flash before loading the tasks for the current user logged in, we inspected the Vuex store and found that the state array has not been updated, therefore we need to clear the array when the user logs out before another user is logged in
    clearTodos(context) {
      context.commit('clearTodos')
    },

    // for when registering as a user on the application
    register(context, data) {
      return new Promise((resolve, reject) => {
        axios.post('/register', {
          name: data.name,
          email: data.email,
          password: data.password,
        })
          .then(response => {
            resolve(response) /* To let the parent know if it's either resolved or rejected */
          })
          .catch(error => {
            reject(error) /* To let the parent know if it's either resolved or rejected */
          })
      })
    },

    // destroy token when logging out
    destroyToken(context) {
      // we are passing the hader because without the header the token was not deleted on the server side (the database), it was only deleted on the client side (the browser)
      // we pass in the header with the format of 'Authorization: Bearer <token>'
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token;

      if (context.getters.loggedIn) { /* we only want to do this when we are logged in */
        // return a new Promise so that the parent can call .then() and respond accordingly after a successful Ajax request
        return new Promise((resolve, reject) => {
          axios.post('/logout')
            .then(response => {
              localStorage.removeItem('access_token')

              // we also update the mutations accordingly
              context.commit('destroyToken')

              resolve(response) /* To let the parent know if it's either resolved or rejected */
            })
            .catch(error => { /* This .catch() part handles the case where someone tries to enter their own local storage key - it just removes it if it's invalid */
              localStorage.removeItem('access_token')

              // we also update the mutations accordingly
              context.commit('destroyToken')

              reject(error) /* To let the parent know if it's either resolved or rejected */
            })
        })
      }
    },
    // here we make an ajax request when the user is trying to log in to retrieve the authentication token. this derives from the login methods in the Login.vue component, where we pass in the username and the password
    retrieveToken(context, credentials) {
      // return a new Promise so that the parent can call .then() and respond accordingly after a successful Ajax request
      return new Promise((resolve, reject) => {
        axios.post('/login', {
          username: credentials.username,
          password: credentials.password,
        })
          .then(response => {
            // we have defined the token in the state above (set it as null initially), and we come and set it here
            const token = response.data.access_token

            // There are two options for storing the token - either on local storage, or as a cookie.
            // The most common way is to store it in local storage, but be aware that if your site is susceptible to cross site scripting, then your token can easily be stolen by a maliciout user.
            // On the other hand, if you are using cookies, you are protected from cross site scripting attacks, but are vulnerable to CSRF attacks
            // here we are going to use local storage
            // on the browser there is an object called localStorage, on which we use the method setItem, give the name as the first parameter, and the token we want to store as the second parameter.
            localStorage.setItem('access_token', token)

            // we also update the mutations accordingly
            context.commit('retrieveToken', token)

            resolve(response) /* To let the parent know if it's either resolved or rejected */
          })
          .catch(error => {
            console.log(error);

            reject(error) /* To let the parent know if it's either resolved or rejected */
          })
      })
    },

    retrieveTodos(context) {
      // getting an 401 Unauthorized error because we are not including headers in the axios request, so we need to include the headers in the axios request
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

      axios.get('/todos')
        .then(response => {
          context.commit('retrieveTodos', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    addTodo(context, todo) {
      axios.post('/todos', {
        title: todo.title,
        completed: false,
      })
        .then(response => {
          context.commit('addTodo', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    updateTodo(context, todo) {
      axios.patch('/todos/' + todo.id, {
        title: todo.title,
        completed: todo.completed,
      })
        .then(response => {
          context.commit('updateTodo', response.data)
        })
        .catch(error => {
          console.log(error)
        })
    },

    deleteTodo(context, id) {
      axios.delete('/todos/' + id)
        .then(response => {
          context.commit('deleteTodo', id)
        })
        .catch(error => {
          console.log(error)
        })
    },

    checkAll(context, checked) {
      axios.patch('/todosCheckAll', {
        completed: checked,
      })
        .then(response => {
          context.commit('checkAll', checked)
        })
        .catch(error => {
          console.log(error)
        })
    },

    updateFilter(context, filter) {
      context.commit('updateFilter', filter)
    },

    clearCompleted(context) {
      const completed = context.state.todos
        .filter(todo => todo.completed)
        .map(todo => todo.id)

      axios.delete('/todosDeleteCompleted', {
        data: {
          todos: completed
        }
      })
        .then(response => {
          context.commit('clearCompleted')
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
});