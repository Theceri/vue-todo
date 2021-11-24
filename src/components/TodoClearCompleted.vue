<template>
  <button v-if="showClearCompletedButton" @click="clearCompleted">Clear Completed</button>
</template>

<script>
export default {
  name: "todo-clear-completed",

  // register the props that are being passed in from the parent component TodoList.vue
  props: {
    showClearCompletedButton: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    //   this method fires an event named clearCompletedTodos from this child component to the parent component TodoList.vue
      clearCompleted() {
        eventBus.$emit('clearCompletedTodos', this.anyRemaining);
      }
  }
};
</script>
