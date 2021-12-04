<template>
  <div>
    <label>
      <!-- we want the checkbox automatically checked if all todos are checked, and not checked otherwise, so we use the computed property anyRemaining -->
      <!-- we want all items to be automatically checked if I check this checkbox, so we use the @change event (represents clicking the checkbox), which calls the allChecked method which we define in the methods section below -->
      <input type="checkbox" :checked="!anyRemaining" @change="allChecked" />
      Check All
    </label>
  </div>
</template>

<script>
export default {
  name: "todo-check-all",

  computed: {
    // instead of being a property under a prop (prop from the parent component), anyRemaining is now a computed property that returns the getters from the store (in particular the anyRemaining getter)
    anyRemaining() {
      return this.$store.getters.anyRemaining;
    }
  },

  methods: {
    allChecked() {
      // we put this code here and move the previous logic (that was mutating the state directly) in the mutator
      // since we are now working with actions and mutators in store.js, we change .commit() to .dispatch()
      this.$store.dispatch("checkAll", event.target.checked);
    }
  }
};
</script>
