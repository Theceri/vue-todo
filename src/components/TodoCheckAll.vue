<template>
  <div>
    <label>
      <!-- we want the checkbox automatically checked if all todos are checked, and not checked otherwise, so we use the computed property anyRemaining -->
      <!-- we want all items to be automatically checked if I check this checkbox, so we use the @change event (represents clicking the checkbox), which calls the allChecked method which we define in the methods section below -->
      <input type="checkbox" :checked="!anyRemaining" @change="allChecked"/>
      Check All
    </label>
  </div>
</template>

<script>
export default {
  name: "todo-check-all",

  // register the props that are being passed in from the parent component TodoList.vue
  props: {
    anyRemaining: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    //   this method fires an event named checkAllChanged from this child component to the parent component TodoList.vue
      allChecked() {
        eventBus.$emit('checkAllChanged', this.anyRemaining);
      }
  }
};
</script>
