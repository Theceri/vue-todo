<template>
  <button v-if="showClearCompletedButton" @click="clearCompleted">
    Clear Completed
  </button>
</template>

<script>
export default {
  name: "todo-clear-completed",

  // register the props that are being passed in from the parent component TodoList.vue
  computed: {
    showClearCompletedButton() {
      return this.$store.getters.showClearCompletedButton;
    }
  },

  methods: {
    //   moving the logic here from the parent component (instead of firing an event from here to the parent component like we had done before) since we are now using Vuex state management instead of props and events
    // further, instead of now having the logic we have moved here and mutating the state directly (commenting it out), use mutations to update the state
    // since we are now working with actions and mutators in store.js, we change .commit() to .dispatch()
    clearCompleted() {
      this.$store.dispatch('clearCompleted');
      // this.$store.state.todos = this.$store.state.todos.filter(
      //   todo => !todo.completed
      // );
    }
  }
};
</script>
