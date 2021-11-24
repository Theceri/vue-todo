<template>
  <div class="todo-item">
    <div class="todo-item-left">
      <!-- checkbox to mark the todo item as complete. when you click on it, the completed property of the todo changes to true -->
      <!-- since checking off a todo as done is not updating the single source of truth (the todos array in this case), with @change="doneEdit", we want to fire up the doneEdit method that we have previously created, and the most important part of it is firing the event named finishedEdit which passes data to the parent component that updates the single source of truth -->
      <input type="checkbox" v-model="completed" @change="doneEdit" />

      <!-- v-if and v-else in the div and input respectively below check if we are in editing mode or not. the div displays by default because the opposite of the default editing mode of false is true -->

      <!-- we also have an event listener (runs the editTodo method) on the div to change it do editing once we double click it -->

      <!-- we are using :class, which means a conditional class, to add the  completed class (and therefore apply the associated styling) if the todo is completed, ie if todo.completed is true -->

      <!-- we remove any references to todo in this component eg todo.title becomes title, and doneEdit(todo) becomes just doneEdit -->
      <div
        v-if="!editing"
        @dblclick="editTodo"
        class="todo-item-label"
        :class="{ completed: completed }"
      >
        {{ title }}
      </div>

      <!-- adding this one for purposes of editing the todo -->

      <!-- after we double click on an item to edit it and are now working with this input element, we want, after editing, to revert the item to non-editing state either when we click outside the editing text box or when we press enter and raise they key after editing, and so we look out for the @blur and the @keup.enter events respectively - we revert the item to non-editing state [calls the method doneEdit in either case] ie remove the text box and use the div above instead -->

      <!-- we are looking to sort out focus issues by creating a custom directive called v-focus, and we are using it here to get the focus right -->

      <!-- We want, when editing a todo, if we press the Esc button, to stop editing and revert the todo to what it was before we started editing, and so we use the @keyup.esc event below to run the cancelEdit method that we create -->
      <input
        v-else
        class="todo-item-edit"
        type="text"
        v-model="title"
        @blur="doneEdit"
        @keyup.enter="doneEdit"
        @keyup.esc="cancelEdit"
        v-focus
      />
    </div>

    <!-- we are adding this other div so we can demonstrate communication between child components with a fancy but impractical example here where we pluralize a todo -->
    <div>
      <button @click="pluralize">Plural</button>

      <!-- when we click the 'x' button, it runs the removeTodo method in the methods below and deletes the item -->
      <span class="remove-item" @click="removeTodo(index)">
        &times;
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "todo-item",
  //   here we are accepting the props passed in from the parent component eg :todo="todo" :index="index" :checkAll="!anyRemaining"
  // we could have done props: ['todo', 'index'], but we have chosen to use the recommended Vue style guide for props (https://vuejs.org/v2/style-guide/#Prop-definitions-essential) like below
  props: {
    todo: {
      // if we forget to pass it in, or if we are not passing in the correct type, then Vue gives us very specific warnings and it's easier to debug our code
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    checkAll: {
      type: Boolean,
      required: true
    }
  },
  // when you are in an instance in which you have to mutate props (eg we have to mutate a prop because we're gonna edit the title and the completed status of a todo at some point) we have to take the props in as data like so:
  data() {
    return {
      id: this.todo.id, // we are not going to mutate the id, but we're passing it in anyway and assigning it to the prop
      title: this.todo.title,
      completed: this.todo.completed,
      editing: this.todo.editing,
      // we not bring the beforeEditCache property to here
      beforeEditCache: ""
    };
  },

  //   listens to the event emitted from the pluralize method below and runs the handlePluralize method in response
  created() {
    eventBus.$on("pluralize", this.handlePluralize);
  },

  // a weird side effect of demonstrating communication between child components by pluralizing a all todos using the Plural button on one todo is that in the case where you add a bunch of todos, and check off some, and delete them, then click the Plural button to pluralize the todos, some of the deleted items shall come back to the list of todos
  // this is because the event handler for the deleted item is still alive even though we deleted that component already. we have, therefore, to make sure that we remove that event listener right before it is destroyed, which is what we are doing below
//   clean up the event handlers if we no longer need them
  beforeDestroy() {
    eventBus.$off("pluralize", this.handlePluralize);
  },

  // we have an issue where we click the check all box, but the checkboxes for the individual todos are not checked as a result, but the 'Clear Completed' button shows and the 'x items left' also updates. As a results, the single source of truth is updated (the completed property for the tasks is updated to True) but the data for the individual todos on the Vue Dev tools on the browser indicates that the completed property is still false. We therefore use a watcher. A watcher is a way to watch props and when they change. We are going to listed for when the above checkAll prop changes, and if it's true, set the completed property for this todo item to True.
  watch: {
    checkAll() {
      // with this, if we check the Check All checkbox, then all the check boxes for the indiviaual todos are checked
      //   if (this.checkAll) {
      // this.completed = true;
      //   } else {
      /* with the else, if we uncheck the Check All checkbox, then all the check boxes for the indiviaual todos get unchecked */
      // this.completed = this.todo.completed;
      //   }

      //   replacing the above statement with a ternary operator to make it simpler
      this.completed = this.checkAll ? true : this.todo.completed;
    }
  },

  // after we finish editing the todo and want to revert back to non-editing mode by clicking outside the text box or pressing enter, we are having issues with focus especially when working with multiple todos, so we are going to register a custom directive called v-focus that we can use to get the right item in focus during and after editing
  directives: {
    focus: {
      // directive definition
      inserted: function(el) {
        el.focus();
      }
    }
  },

  methods: {
    // since we don't have access to the todos array, we can therefore emit an event, and listen for that event in the parent component so that the parent can do what needs to be done. to call an event, you use the $emit method, and to listen for an event, you use the $on method.
    // the two parameters for the $emit method are the name of the event, and the data that you want to pass to the event. the $on method takes two parameters, the name of the event, and a callback function that will be run when the event is emitted.
    removeTodo(index) {
      // since we are now using the global event bus called eventBus we created in main.js, we switch from this.$emit to eventBus.$emit
      eventBus.$emit("removedTodo", index);
    },
    // we have moved this method from the parent component to here
    // we no longer use any reference to todo because now we are using local data, so editTodo(todo) becomes editTodo() and todo.title becomes this.title
    editTodo() {
      // grabs the title before we edit it and stores it in the beforeEditCache property that we set in the data() method
      this.beforeEditCache = this.title;

      //  set the todo to editing mode when we double click on it - the item shall look exactly the same, just with a text box to edit it, but under the hood they are two different items that are being alternated between (v-if and v-else) depending on the editing state
      this.editing = true;
    },

    // we no longer use any reference to todo because now we are using local data
    // now that we have brought this method here from the parent component TodoList.vue, we need to emit an event to the parent component so that the parent component can update the todos array
    doneEdit() {
      // check that after editing the todo, the text box is not empty
      if (this.title.trim() == "") {
        this.title = this.beforeEditCache;
      }

      //  set the todo to non-editing mode when we click outside the text box or press enter after editing
      this.editing = false;

      //   emit an event to the parent component so that the parent component can update the todos array (since we are passing in as a prop here, we have to notify the parent that it has changed)
      //   however if we only do this we shall be in a state where the todo item and the single source of truth todos are in different states. so we have to replace the todo in todos in the parent component with the updated todo we updated here in the child component

      // since we are now using the global event bus called eventBus we created in main.js, we switch from this.$emit to eventBus.$emit
      eventBus.$emit("finishedEdit", {
        index: this.index,
        todo: {
          id: this.id,
          title: this.title,
          completed: this.completed,
          editing: this.editing
        }
      });
    },

    // we no longer use any reference to todo because now we are using local data
    cancelEdit() {
      // set it to the beforeEditCache property that we create in the data method and which we give a value in the editTodo method when we grab the title before we edit the todo **mine doesn't currently work though**
      this.title = this.beforeEditCache;

      // we set the todo to non-editing mode when we press the Esc button
      this.editing = false;
    },

    pluralize() {
      eventBus.$emit("pluralize");
    },

    handlePluralize() {
      this.title = this.title + "s";

      // the above changes only the todo item but does not change the single source of truth. to change the single source of truth too, we emit another event named finishedEdit (similar to the one above) and pass in the updated todo item
      eventBus.$emit("finishedEdit", {
        index: this.index,
        todo: {
          id: this.id,
          title: this.title,
          completed: this.completed,
          editing: this.editing
        }
      });
    }
  }
};
</script>
