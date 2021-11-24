<template>
  <div>
    <input
      type="text"
      class="todo-input"
      placeholder="What needs to be done?"
      v-model="newTodo"
      @keyup.enter="addTodo"
    />

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
      <!-- we moved the check button and made it its own component, and we are using it here with todo-check-all -->
      <!-- the prop :anyRemaining="anyRemaining" was previously on the check button that was here, but now we have it here in the parent component to communicate with the child component that is the check button -->
      <todo-check-all :anyRemaining="anyRemaining"></todo-check-all>

      <!-- since we have create a separate component for the number of items remaining, we now pass it below, and include a prop, :remaining="remaining" to communicate with that child component  -->
      <todo-items-remaining :remaining="remaining"></todo-items-remaining>
    </div>
    <div class="extra-container">
      <todo-filtered></todo-filtered>

      <div>
        <!-- show the button only if there are completed items, so we use the computed property showClearCompletedButton, and then when the button is clicked, run the clearCompleted method to filter the todos to only show those that have not been completed -->
        <transition name="fade">
          <!-- pass a prop to the child component -->
          <todo-clear-completed
            :showClearCompletedButton="showClearCompletedButton"
          ></todo-clear-completed>
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
    TodoClearCompleted,
  },

  data() {
    return {
      newTodo: "",
      idForTodo: 3, // increment this to create unique ids for each todo after the first 2 that existed

      //   even though we have moved the identical property to the child component, we still have this one here because it controls the computed property todosFiltered
      filter: "all",

      //   list of todos
      todos: [
        {
          id: 1,
          title: "Finish Vue screencast",
          completed: false,
          editing: false, // this is for editing the todo - checks if we are in editing mode or not
        },
        {
          id: 2,
          title: "Take over world",
          completed: false,
          editing: false,
        },
      ],
    };
  },

  // listening for events from any component in this created section
  // since we are now using the event bus named eventBus defined in main.js, we remove @removedTodo="removeTodo" and @finishedEdit="finishedEdit" from <todo-item></todo-item> above when listening for events fired from the event bus named eventBus, and instead define them here
  created() {
    //   this is where we receive the various events fired from the child elements and act on them eg run a particular function
    eventBus.$on("removedTodo", (index) => this.removeTodo(index));
    eventBus.$on("finishedEdit", (data) => this.finishedEdit(data));
    eventBus.$on("checkAllChanged", (checked) => this.checkAllTodos(checked));
    eventBus.$on("filterChanged", (filter) => (this.filter = filter));
    eventBus.$on("clearCompletedTodos", () => this.clearCompleted());
  },

  //we have, therefore, to make sure that we remove the various event listeners up here right before they are destroyed, which is what we are doing below
  //   clean up the event handlers if we no longer need them
  beforeDestroy() {
    eventBus.$off("removedTodo", (index) => this.removeTodo(index));
    eventBus.$off("finishedEdit", (data) => this.finishedEdit(data));
    eventBus.$off("checkAllChanged", (checked) => this.checkAllTodos(checked));
    eventBus.$off("filterChanged", (filter) => (this.filter = filter));
    eventBus.$off("clearCompletedTodos", () => this.clearCompleted());
  },

  computed: {
    //a computed property is for computing new data derived from other data 1) they should not mutate any of your data 2) they should not accept paramenters 3) they should always return something

    // grab our todos, filter down to those that are not completed, and then count them
    remaining() {
      return this.todos.filter((todo) => !todo.completed).length;
    },
    anyRemaining() {
      return this.remaining != 0;
    },
    todosFiltered() {
      // Caused by the buttons we have included in the bottom for All, Active, and Completed - filter the list of todos so that we loop through and list all todos if the All button is clicked, loop through and list only those that are not completed if the Active button is clicked, and loop through and list only those that are completed if the Completed button is clicked
      if (this.filter == "all") {
        return this.todos;
      } else if (this.filter == "active") {
        return this.todos.filter((todo) => !todo.completed);
      } else if (this.filter == "completed") {
        return this.todos.filter((todo) => todo.completed);
      }

      return this.todos;
    },
    showClearCompletedButton() {
      return this.todos.filter((todo) => todo.completed).length > 0;
    },
  },

  methods: {
    addTodo() {
      //   check that the todo being added is not empty
      if (this.newTodo.trim().length == 0) {
        return;
      }

      //  add the new todo to the todos array
      this.todos.push({
        id: this.idForTodo,
        title: this.newTodo,
        completed: false,
      });

      //  after running the above function, make the newTodo empty again, and increment the idForTodo so that the next todo added is given a unique id that is higher than the previous todo
      this.newTodo = "";
      this.idForTodo++;
    },
    removeTodo(index) {
      //   remove the todo at the given index. the splice method removes the item at the given index, and returns the item that was removed. the second argument is the number of items to remove.
      this.todos.splice(index, 1);
    },
    checkAllTodos() {
      this.todos.forEach((todo) => (todo.completed = event.target.checked)); // well, mine doesn't work | kinda works now, error was me typing foreach instead of forEach
    },
    clearCompleted() {
      this.todos = this.todos.filter((todo) => !todo.completed);
    },
    // this method takes in the parameter data, which is the data that we passed when creating the event named finishedEdit in the child component, so we have data.index and data.todo
    finishedEdit(data) {
      // update the todos, which is the single source of truth. the index is coming in as the data.index, we are replacing one item, and we are replacing it with data.todo. we have updated the single source of truth, so everything is now in sync

      // according to the syntax of the javascript .splice() method, the first argument is the index of the item to remove, and the second argument is the number of items to remove, and the third argument is the item(s) to add in its place
      this.todos.splice(data.index, 1, data.todo);
    },
  },
};
</script>

<style lang="scss">
/* indicate that we shall be using scss */
// importing animate.css animation library so we can use it to animate various elements
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");

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

button {
  font-size: 14px;
  background-color: white;
  appearance: none;

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
</style>
