<template>
  <div>
    <!-- using conditional classes below, and the condition is based on the filter data property -->
    <!-- with the filter buttons now here in their own child component, we change @click="filter = 'all'" and instead now call an event -->
    <button :class="{ active: filter == 'all' }" @click="changeFilter('all')">
      All
    </button>
    <button :class="{ active: filter == 'active' }" @click="changeFilter('active')">
      Active
    </button>
    <button :class="{ active: filter == 'completed' }" @click="changeFilter('completed')">
      Completed
    </button>
  </div>
</template>

<script>
export default {
  name: "todo-filtered",

  data() {
    return {
      // filter is a computed property that returns the filter value (was previously in the parent component)
      filter: 'all',
    }
  },

  methods: {
    //   this method fires an event named checkAllChanged from this child component to the parent component TodoList.vue
    changeFilter(filter) {
      this.filter = filter;
      eventBus.$emit("filterChanged", filter);
    }
  }
};
</script>
