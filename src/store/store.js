// the standard name for this file is index.js though
// as your project grows, you may
// - use mapGetters which is a helper function, makes defining things in the component easier to do with much fewer lines of code esp if you have components that make too much reference of getters. also mapActions and mapMutations
// - if you the store.js file is getting too big, you may split it out into separate files eg you can have the getters, mutations, actions each in a separate file to have a cleaner file system
// - have more than one store
// - you can also make use of modules which allow you to have multiple stores unlike the one store we have right now, but we can have a store for module A and a store for module B etc

// we no longer need to import axios any more because we are now using firebase

import { QuerySnapshot } from "@firebase/firestore";
import Vue from "vue";
import Vuex from "vuex";
import db from '../firebase'

Vue.use(Vuex);

// we no longer need this since we are using firebase
// axios.defaults.baseURL = 'http://localhost:8000/api/';

// this is where we define the store
export const store = new Vuex.Store({
  // down here we input all the data that was global in the previous version of the app eg the array of todo under the data object in the parent TodoList.vue component eg the filter property and the list of todos
  // after we have created this state, we go to all places where the previous todos list in the TodoList.vue component was referenced and we replace this.todos with this.$store.state.todos. also replace this.filter with this.$store.state.filter
  state: {
    // this is for the loading spinner that shows as we wait for the todos to be fetched from the database
    loading: true,

    //   even though we have moved the identical property to the child component, we still have this one here because it controls the computed property todosFiltered
    filter: "all",

    //   list of todos
    todos: [],
  },
  getters: {
    // as part of the rules when using Vuex for state management, computed properties come here into the store as getters: here we paste all the computed properties from the main TodoList.vue component
    // also, all getters take state as a parameter, and so everything 'this.$store.state....' changes to 'state....'
    // the computed properties from the man TodoList.vue component were mainly for filtering out the todos and then performing some operation on the filtered todos

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
        editing: false
      });
    },
    updateTodo(state, todo) {
      // we are replacing every 'this' with 'todo' eg this.id becomes todo.id

      const index = state.todos.findIndex(item => item.id == todo.id);

      state.todos.splice(index, 1, {
        'id': todo.id,
        'title': todo.title,
        'completed': todo.completed,
        'editing': todo.editing
      });
    },
    deleteTodo(state, id) {
      const index = state.todos.findIndex(item => item.id == id);

      state.todos.splice(index, 1);
      // mine doesn't work though, when I delete an item it deletes the next item or the previous item on the todo list instead of that item - look into it
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
    }
  },

  // actions are similar to mutations but they include asynchronous code, usually used when working with AJAX...just use it where you know you are going to do an AJAX call, leave the rest of the stuff in the mutations
  // we shall simulate AJAX calls here with setTimeout
  // anything that's modifying state and you know that finally we shall put it in/through the database (eg addTodo, updateTodo, deleteTodo - some of the others are just local to the app, but we're going to grab all of them for now and put them here under actions etc)
  // instead of the state, we are now taking in context as the parameter
  actions: {
    retrieveTodos(context) {
      // again, for the loading spinner that shows when we are waiting for the todos to be fetched from the database
      context.state.loading = true

      // we want to fetch the todos from firebase and populated them to the todos array in the state (object) above
      db.collection('todos').get()/* returns a promise */
        .then(querySnapshot => {/* a querySnapshot is each document in a collection, so we have to iterate over it */

          // create a temporary list to store todos
          let tempTodos = []

          querySnapshot.forEach(doc => {
            console.log(doc.data())

            // build an object for each iteration
            const data = {
              id: doc.id, /* we don't use .data() because id is generated by firebase automatically and isn't part of the data we're storing */
              title: doc.data().title,
              completed: doc.data().completed,
              timestamp: doc.data().timestamp,
            }
            
            // push the data to the temporary list tempTodos that we have created above
            tempTodos.push(data) // .push pushes a new item to the end of an array
          })

          // again, for the loading spinner that shows when we are waiting for the todos to be fetched from the database - set it to false when done loading the todos from the database
          context.state.loading = false

          // the only reason we are having to do this is because Firebase does not have auto-incrementing ID's, and so tasks are only randomly ordered, and so it may happen that when you refresh your app, the todos are ordered randomly each time. that's why we added timestamps, and we want to order our todos using the timestamps like below
          // as for the callback function, learnt how it works from here https://youtu.be/MWD-iKzR2c8
          const tempTodosSorted = tempTodos.sort((a, b) => {
            return a.timestamp.seconds - b.timestamp.seconds
          })

          // we are now using firebase instead of axios
          context.commit('retrieveTodos', tempTodosSorted)
        })
    },

    addTodo(context, todo) {
      db.collection('todos').add({
        title: todo.title, // the id is automatically generated by Firebase
        completed: false,
        timestamp: new Date(),
      }) /* grab the promise */
        .then(docRef => {/* take reference of the document that was returned */
          context.commit('addTodo', {
            /* now we need the id because this is local and we need the id */
            id: docRef.id,
            title: todo.title,
            completed: false,
          })
        })
    },
    updateTodo(context, todo) {
      db.collection('todos').doc(todo.id).set({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
        timestamp: new Date(),
      })
        .then(() => {
          context.commit("updateTodo", todo)
        })
    },
    deleteTodo(context, id) {
      db.collection('todos').doc(id).delete()
        .then(() => {
          context.commit("deleteTodo", id)
        })
    },
    checkAll(context, checked) {
      db.collection('todos').get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              completed: checked
            })
              .then(() => {
                context.commit("checkAll", checked)
              })
          })
        })
    },
    updateFilter(context, filter) {
      context.commit("updateFilter", filter);
    },
    clearCompleted(context) {
      db.collection('todos').where('completed', '==', true).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete()
              .then(() => {
                context.commit("clearCompleted");
              })
          })
        })
    }
  }
});