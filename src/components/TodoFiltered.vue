<template>
  <div>
    <!-- using conditional classes below, and the condition is based on the filter data property -->
    <!-- with the filter buttons now here in their own child component, we change @click="filter = 'all'" and instead now call an event -->
    <button :class="{ active: filter == 'all' }" @click="changeFilter('all')">
      All
    </button>
    <button
      :class="{ active: filter == 'active' }"
      @click="changeFilter('active')"
    >
      Active
    </button>
    <button
      :class="{ active: filter == 'completed' }"
      @click="changeFilter('completed')"
    >
      Completed
    </button>
  </div>
</template>

<script>
export default {
  name: "todo-filtered",

  // change the data property into a computed property now that we're working with Vuex for state management instead of props and events
  computed: {
    filter() {
      return this.$store.state.filter;
    }
  },

  methods: {
    changeFilter(filter) {
      // now using mutations to mutate the state instead of doing it directly like we had done in the code commented out below (we move the logic to the mutations)
      // since we are now working with actions and mutators in store.js, we change .commit() to .dispatch()
      this.$store.dispatch('updateFilter', filter);

      // update this.filter to this.$store.state.filter
      // this.$store.state.filter = filter;
    }
  }
};
</script>