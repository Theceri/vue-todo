<template>
  <div class="page-wrapper login-form">
    <h2 class="login-heading">Register</h2>
    <form action="#" @submit.prevent="validateBeforeSubmit">
      <!-- we want our form to NOT submit data until after we do client side validation using Vee Validate, so instead of using the register() method, we now use the validateBeforeSubmit method from the Vee Validate documentation (codesandbox example here: https://codesandbox.io/s/y3504yr0l1?initialpath=/%23/form&module=/src/components/Form.vue&file=/src/components/Form.vue:2512-2771)-->

      <!-- <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div> -->

      <div v-if="serverErrors" class="server-error">
        <div v-for="(value, key) in serverErrors" :key="key">
          {{ value[0] }}
          <!-- printing out the first thing in the array  -->
        </div>
      </div>

      <div class="form-control">
        <label for="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          class="login-input"
          :class="{ 'input-error': errors.has('name') }"
          v-model="name"
          v-validate="'required'"
        />
        <span class="form-error">{{ errors.first("name") }}</span>
      </div>

      <div class="form-control">
        <label for="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          class="login-input"
          :class="{ 'input-error': errors.has('email') }"
          v-model="email"
          v-validate="'required|email'"
        />
        <span class="form-error">{{ errors.first("email") }}</span>
      </div>

      <div class="form-control mb-more">
        <label for="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          class="login-input"
          :class="{ 'input-error': errors.has('password') }"
          v-model="password"
          v-validate="'required|min:6'"
        />
        <span class="form-error">{{ errors.first("password") }}</span>
      </div>

      <div class="form-control">
        <button type="submit" class="btn-submit">Create Account</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      serverErrors: "",
      successMessage: ""
    };
  },
  methods: {
    // we want our form to NOT submit data until after we do client side validation using Vee Validate, so instead of using the register() method, we now use the validateBeforeSubmit method from the Vee Validate documentation (codesandbox example here: https://codesandbox.io/s/y3504yr0l1?initialpath=/%23/form&module=/src/components/Form.vue&file=/src/components/Form.vue:2512-2771)
    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          // eslint-disable-next-line
          // alert('Form Submitted!');

          // instead of alerting that the form has been submitted like above, just call the register() method below
          this.register();

          // return;
        }

        // alert('Correct them errors!');
      });
    },
    register() {
      this.$store
        .dispatch("register", {
          name: this.name,
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.successMessage = "Registered Successfully!";
          this.$router.push({
            name: "login",
            params: { dataSuccessMessage: this.successMessage }
          }); /* passing parameters to a different route when redirecting. dataSuccessMessage shall be accepted as a prop in our Login component when we redirect to Login...therefore go to routes file and make the login route to accept props (add a props field and set it to true) */
          this.$toast.success({
            title: this.successMessage,
            message: "You can login here"
          });
        })
        .catch(error => {
          this.serverErrors = Object.values(error.response.data.errors);
        });
    }
  }
};
</script>
