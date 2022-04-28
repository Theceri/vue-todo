<template> </template>

<script>
export default {
  // when we log out, we need to destroy the token both on the browser and on the server (we have an endpoint for deleting the tokens on the server)
  // we are going to do this using the create() lifecycle hook so that the action is taken once the component is created
  created() {
    //   since, when we log out of one user and login with another user, we briefly see the tasks of the previous user flash before loading the tasks for the current user logged in, we inspected the Vuex store and found that the state array has not been updated, therefore we need to clear the array when the user logs out before another user is logged in
    this.$store.dispatch("clearTodos")

    this.$store.dispatch("destroyToken")
    .then(response => {
      /* we are doing this so that, after clicking on the Logout button, we are redirected to the homepage */
      this.$router.push({ name: "home" }); /* We are using name 'home' as the route name instead of using the route path - good practice */
    }); /* Now go and do the mutation in store.js */
  }
};
</script>
