<template>
    <!-- remaining is going to be a computed property -->
      <div>{{ remaining }} items left</div>
</template>

<script>
export default {
    name: 'todo-items-remaining',
    
    // register the props that are being passed in from the parent component TodoList.vue
    props: {
        remaining: {
            type: Number,
            required: true
        }
    }
}
</script>