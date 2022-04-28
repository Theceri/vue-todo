<template>
  <div class="page-wrapper login-form">
    <h2 class="login-heading">Login</h2>

    <form action="#" @submit.prevent="login">
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <!-- passing in the dataSuccessMessage prop from the Register component -->

      <div v-if="serverError" class="server-error">
        {{ serverError }}
      </div>
      <div class="form-control">
        <label for="email">Username/Email</label>
        <input
          type="email"
          name="username"
          id="username"
          class="login-input"
          v-model="username"
        />
      </div>

      <div class="form-control mb-more">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          class="login-input"
          v-model="password"
        />
      </div>

      <div class="form-control">
        <button type="submit" class="btn-submit" :disabled="loading"> <!-- bind the disabled attribute to the loading state so that the button is disabled when the loading state is true and the CSS spinner is running -->
          <div class="lds-ring-container" v-if="loading"> <!-- only show the CSS spinner when the loading state is set to true -->
            <div class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "login",
  props: {
    dataSuccessMessage: {
      type: String
    }
  },
  data() {
    return {
      username: "",
      password: "",
      serverError: "",
      successMessage: this.dataSuccessMessage, /* we want to clear out the success message after registering so that it doesn't stay on the page...so go and change dataSuccessMessage to successMessage in the HTML, and then if there is an error, we can set successMessage to an empty string (so that we don't have both an error message alert and a success message alert at the same time) */
      loading: false, /* for working with the CSS spinner */
    };
  },
  methods: {
    login() {
      this.loading = true; /* first make the loading state true when the login method is called */
      this.$store
        .dispatch("retrieveToken", {
          /* Now we have to go to store.js and wrap the whole retrieveToken() logic in a promise */
          username: this.username,
          password: this.password
        })
        .then(response => {
          this.loading = false /* when the promise is resolved, we want to set the loading state to false */
          /* we are doing this so that, after login, we can redirect to the page containing the list of todos */
          this.$router.push({
            name: "todo"
          }); /* We are using name 'todo' as the route name instead of using the route path - good practice */
        })
        .catch(error => {
          this.loading = false /* when the promise is resolved, we want to set the loading state to false */
          this.serverError = error.response.data;
          this.password = ""; /* clear the password when there is an error */
          this.successMessage = "";
        });
    }
  }
};
</script>
