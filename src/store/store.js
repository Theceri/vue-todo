// the standard name for this file is index.js though
// as your project grows, you may
// - use mapGetters which is a helper function, makes defining things in the component easier to do with much fewer lines of code esp if you have components that make too much reference of getters. also mapActions and mapMutations
// - if you the store.js file is getting too big, you may split it out into separate files eg you can have the getters, mutations, actions each in a separate file to have a cleaner file system
// - have more than one store
// - you can also make use of modules which allow you to have multiple stores unlike the one store we have right now, but we can have a store for module A and a store for module B etc

import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'; // import axios for Ajax requests

Vue.use(Vuex);
axios.defaults.baseURL = 'http://localhost:8000/api/';

// this is where we define the store
export const store = new Vuex.Store({
  // down here we input all the data that was global in the previous version of the app eg the array of todo under the data object in the parent TodoList.vue component eg the filter property and the list of todos
  // after we have created this state, we go to all places where the previous todos list in the TodoList.vue component was referenced and we replace this.todos with this.$store.state.todos. also replace this.filter with this.$store.state.filter
  state: {
    //   even though we have moved the identical property to the child component, we still have this one here because it controls the computed property todosFiltered
    filter: "all",

    //   list of todos
    todos: [ // we now make the array of todos empty (remove the data we had input before) so that we work with the data from the database
      // {
      //   id: 1,
      //   title: "Finish Vue screencast",
      //   completed: false,
      //   editing: false // this is for editing the todo - checks if we are in editing mode or not
      // },
      // {
      //   id: 2,
      //   title: "Take over world",
      //   completed: false,
      //   editing: false
      // }
    ]
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
      // use axios to connect to the Laravel API and fetch all todos for display on the UI
      axios.get('/todos')
        .then(response => {
          // commit a mutation, then go and make that method up here in the mutations
          context.commit('retrieveTodos', response.data);
        })
        .catch(error => {
          console.log(error)
        })
    },

    // simulating an AJAX request using setTimeout (repeated for all other actions below)
    // now there is going to be a delay of 100ms on all the actions eg adding a todo, updating a todo, deleting a todo, etc
    addTodo(context, todo) {
      // use axios to connect to the Laravel API and post a new todo
      // add in the body of the request as an extra parameter
      axios.post('/todos', {
        title: todo.title,
        completed: false // since the natural state of a new task is incomplete, we set it to false automatically when the task is created
      })
        .then(response => {
          // commit a mutation, then go and make that method up here in the mutations
          context.commit('addTodo', response.data);
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateTodo(context, todo) {
      // use axios to connect to the Laravel API and update a todo
      // add in the body of the request as an extra parameter
      // use the patch request method because we are editing
      // add in to the uri the id of the todo we are editing
      axios.patch('/todos/' + todo.id, {
        title: todo.title,
        completed: todo.completed
      })
        .then(response => {
          // commit a mutation, then go and make that method up here in the mutations
          context.commit("updateTodo", response.data);
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteTodo(context, id) {
      // use axios to connect to the Laravel API and delete a todo
      // use the delete http method because we are deleting
      // add in to the uri the id of the todo we are deleting a particular item
      axios.delete('/todos/' + id)
        .then(response => {
          // commit a mutation, then go and make that method up here in the mutations
          context.commit("deleteTodo", id);
        })
        .catch(error => {
          console.log(error)
        })
    },
    checkAll(context, checked) {
      // use axios to connect to the Laravel API and change the completed status of a todo in the database from 0 to 1 if the task is checked on the front-end
      // use the patch http method because we are changing the completed status of the todo
      // pass in the extra parameter of the completed state of the todo
      axios.patch('/todosCheckAll', {
        completed: checked,
      })
        .then(response => {
          // commit a mutation, then go and make that method up here in the mutations
          context.commit("checkAll", checked);
        })
        .catch(error => {
          console.log(error)
        })
    },
    updateFilter(context, filter) {
      context.commit("updateFilter", filter);
    },
    clearCompleted(context) {
      const completed = context.state.todos.filter(todo => todo.completed).map(todo => todo.id)

      // use axios to connect to the Laravel API and delete checked todos from the database
      // use the delete http method because we are deleting
      // here it is a bit different because we first need to parse in the data object when adding the extra parameter
      // based on what we have in the destroyCompleted() method of the TodosController.php in the Laravel API, we are passing in the todos here within the data object
      axios.delete('/todosDeleteCompleted', {
        data: {
          todos: completed
        }
      })
        .then(response => {
          // commit a mutation, then go and make that method up here in the mutations
          context.commit("clearCompleted");
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
});