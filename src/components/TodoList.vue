<template>
  <div>
    <div class="name-container">Welcome, {{ name }}</div>
    <input
      type="text"
      class="todo-input"
      placeholder="What needs to be done?"
      v-model="newTodo"
      @keyup.enter="addTodo"
    />

    <!-- this is the markup for the loading spinner for when we are waiting for tasks to load -->
    <!-- we want the spinner to show only if the loading property of the state object in store.js is set to true ie show when the tasks are being loaded from the database, and stop showing when the tasks are loaded from the database -->
    <div v-if="$store.state.loading" class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>

    <!-- changing the list to filter from todos to todosFiltered, which shall be a computed property. With the three buttons we have added at the bottom (All, Active and Completed), instead of looping through and displaying tasks statically like before, we shall now loop through and diplay tasks based on this computed property todosFiltered, which is dependend on the filter  -->
    <!-- the transition-group involves using the animate.css library for animations - here we are animating the list of tasks eg an animation when we add a new task -->
    <transition-group
      name="fade"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <!-- code that was inside the below div moved to the TodoItem.vue component. now instead of looping using the <div></div>, we shall loop using the <todo-item></todo-item>, which is the tag for the component. we also remove the class="todo-item" because now it is in the component -->

      <!-- :todo="todo" and :index="index" are props representing the current todo we are iterating over (props are used for communication from parent to child component, custom events are used for communication from child to parent component). these props are accepted in the child component via the props property -->

      <!-- :checkAll="" is a prop passed down to the child template TodoItem.vue -->

      <!-- since we are now using the event bus named eventBus defined in main.js, we remove @removedTodo="removeTodo" and @finishedEdit="finishedEdit" and instead define them in the script section under created() -->
      <todo-item
        v-for="(todo, index) in todosFiltered"
        :key="todo.id"
        :todo="todo"
        :index="index"
        :checkAll="!anyRemaining"
      >
      </todo-item>
    </transition-group>

    <div class="extra-container">
      <todo-check-all></todo-check-all>

      <!-- since we have create a separate component for the number of items remaining, we now pass it below, and include a prop, :remaining="remaining" to communicate with that child component  -->
      <!-- We now remove the prop :remaining="remaining" because we are now working with the store in Vuex state management -->
      <todo-items-remaining></todo-items-remaining>
    </div>
    <div class="extra-container">
      <todo-filtered></todo-filtered>

      <div>
        <!-- show the button only if there are completed items, so we use the computed property showClearCompletedButton, and then when the button is clicked, run the clearCompleted method to filter the todos to only show those that have not been completed -->
        <transition name="fade">
          <!-- pass a prop to the child component -->
          <todo-clear-completed></todo-clear-completed>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import TodoCheckAll from "./TodoCheckAll.vue";
import TodoItem from "./TodoItem";
import TodoItemsRemaining from "./TodoItemsRemaining.vue";
import TodoFiltered from "./TodoFiltered";
import TodoClearCompleted from "./TodoClearCompleted";

export default {
  name: "todo-list",

  components: {
    TodoItem,
    TodoItemsRemaining,
    TodoCheckAll,
    TodoFiltered,
    TodoClearCompleted
  },

  data() {
    return {
      newTodo: "",
      idForTodo: 3, // increment this to create unique ids for each todo after the first 2 that existed
      data: ""
    };
  },

  // add a new created lifecycle hook to this component
  // for the purpose of fetching todos from the database
  created() {
    // dispatch an action to the store to get the todos from the local storage (note that if we were not using Vuex, we would have made the Axios Ajax call from here, grab the todos, and set them to the todos array)
    this.$store.dispatch("retrieveTodos");

    // on the API, we have the uri /api/user, which gets the info of the currently logged in user. we can get the item on the name field, and use it to get the name of the user and display it on the page. so we make an ajax request when the component is loaded to do just that
    this.$store.dispatch("retrieveName").then(response => {
      this.name = response.data.name;
    });
  },

  computed: {
    //a computed property is for computing new data derived from other data 1) they should not mutate any of your data 2) they should not accept paramenters 3) they should always return something
    anyRemaining() {
      return this.$store.getters.anyRemaining;
    },
    todosFiltered() {
      return this.$store.getters.todosFiltered;
    }
  },

  methods: {
    addTodo() {
      //   check that the todo being added is not empty
      if (this.newTodo.trim().length == 0) {
        return;
      }

      // here where we are adding a new todo and pushing it to the todos array (instead of doing it the old way by mutating state directly[which we have commented out below], we are using a mutator, which is the recommended way), this is where we need to call a mutation. you use the commit method, which takes in parameters ie the name of the mutation and the payload. the payload is the data that you want to pass to the mutation. we then go to store.js and define the 'addTodo' mutation there.
      // now when you add an item and, using Vue Dev tools on Google Chrome, in the Vuex section, you can see the state changing when we add a new todo
      // since we are now working with actions and mutators in store.js, we change .commit() to .dispatch()
      this.$store.dispatch("addTodo", {
        id: this.idForTodo,
        title: this.newTodo
      });

      //  add the new todo to the todos array
      // this.$store.state.todos.push({
      //   id: this.idForTodo,
      //   title: this.newTodo,
      //   completed: false
      // });

      //  after running the above function, make the newTodo empty again, and increment the idForTodo so that the next todo added is given a unique id that is higher than the previous todo
      this.newTodo = "";
      this.idForTodo++;
    }
  }
};
</script>

<style lang="scss">
/* indicate that we shall be using scss */

.todo-input {
  width: 100%;
  padding: 10px 18px;
  font-size: 18px;
  margin-bottom: 16px;

  &:focus {
    outline: 0;
  }
}

.todo-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //   making the animations with animate.css faster
  animation-duration: 0.3s;
}

.remove-item {
  cursor: pointer;
  margin-left: 14px;
  &:hover {
    color: black;
  }
}

.todo-item-left {
  display: flex;
  align-items: center;
}

.todo-item-label {
  padding: 10px;
  border: 1px solid white;
  margin-left: 12px;
}

.todo-item-edit {
  font-size: 24px;
  color: #2c3e50;
  margin-left: 12px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc; //overrides defaults ie the border in the todo-item-label
  font-family: "Avenir", Helvetica, Arial, sans-serif;

  &:focus {
    outline: none;
  }
}

// the css that changes to the todo once you click on the checkbox to mark the todo as completed - we want to apply the style to the todo label
.completed {
  text-decoration: line-through;
  color: grey;
}

.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid lightgrey;
  padding-top: 14px;
  margin-bottom: 14px;
}

.name-container {
  margin-bottom: 16px;
}

button {
  font-size: 14px;
  background-color: white;
  appearance: none;
  padding: 4px;

  &:hover {
    background: lightgreen;
  }

  &:focus {
    outline: none;
  }
}

.active {
  background: lightgreen;
}

// CSS transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// CSS for the spinning loader that shows when we are waiting for the todos to load from the database
.lds-ring {
  display: block;
  position: relative;
  width: 80px;
  height: 80px;
  margin: auto;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid grey;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: grey transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
