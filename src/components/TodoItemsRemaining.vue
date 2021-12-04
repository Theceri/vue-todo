<template>
    <!-- remaining is going to be a computed property -->
      <div>{{ remaining }} items left</div>
</template>

<script>
export default {
    name: 'todo-items-remaining',
    
    // register the props that are being passed in from the parent component TodoList.vue
    // We now remove the props (eg the one named 'remaining' in this case) because we are now working with the store in Vuex state management, but we do need a computed property with the same name to return the getter in the store, so we create one below:
    computed: {
        remaining() {
            return this.$store.getters.remaining;
            // mine doesn't work btw
        }
    }
    
}
</script>