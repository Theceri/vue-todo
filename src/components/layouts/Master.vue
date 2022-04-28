<template>
  <div id="app">
    <!-- global navigation bar that all components shall use -->
    <ul class="nav">
      <!-- <li><a href="/">Home</a></li>
            <li><a href="/">About</a></li>
            <li><a href="/">Login</a></li>
            <li><a href="/">Register</a></li> -->

      <!-- this is the syntax for using Vue Router to link to particular pages -->
      <!-- when we name our routes (like we have done in routes.js by adding the name property), the syntax changes from eg <li><router-link to="/">Home</router-link></li> to <li><router-link :to="{ name: 'home' }">Home</router-link></li> -->
      <!-- :to="{ name: 'home' }" is a prop now -->
      <!-- the advantage of using route names instead of paths is that, if the path changes, the name does not change, and so we do not have to do a bunch of changes to places where the route is used -->
      <li><router-link :to="{ name: 'home' }">Home</router-link></li>
      <li><router-link :to="{ name: 'todo' }">App</router-link></li>
      <li><router-link :to="{ name: 'about' }">About</router-link></li>
      <li v-if="!loggedIn">
        <router-link :to="{ name: 'login' }">Login</router-link>
      </li>
      <li v-if="!loggedIn">
        <router-link :to="{ name: 'register' }">Register</router-link>
      </li>
      <li v-if="loggedIn">
        <router-link :to="{ name: 'logout' }">Logout</router-link>
      </li>
    </ul>

    <!-- any of our content for other pages shall go here -->
    <!-- according to the docs: The <router-view> component is a functional component that renders the matched component for the given path -->
    <!-- we are now wrapping router-view in the transition tags so that we can use the animate.css animation library to fade components in and out when they are loaded (so that they stop loading instantly when they are clicked on, which is not visually applealing) -->
    <!-- mode="out-in": by default, both animations happen at the same time, and it is not visually appealing when you click on a new link and load a new component, so we are specifying the order in which the animations should take place. The Vue documentation for animation can be found here: https://v2.vuejs.org/v2/guide/transitions.html-->
    <!-- to specify the speed of the animation, we wrap each and every page in a class (ours is called page-wrapper) -->
    <transition
      name="router-animation"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
    >
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  // make a new computed property which matches the one we made in the Vuex store (loggedIn)
  // now, in the template above, we shall seek to show the Login and Register navbar items when we are not logged in, and the Logout navbar item when we are logged in
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  }
};
</script>

<style lang="scss">
// importing animate.css animation library so we can use it to animate various elements eg seguing into a page when a component is loaded
@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");

@import url("cxlt-vue2-toastr/dist/css/cxlt-vue2-toastr.css"); /* importing the CSS for cxlt-vue2-toast, the package we are using for toast messages */

/* styling the navbar whose markup is in the template section above */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* this part of the CSS is actually taken from the main template App.vue, which is the original entry point of the app the first time we initialize a Vue app ( so we go to App.vue and comment out the #app{} section of the CSS) */
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 24px;
  height: 100vh;
}

.flex-center {
  display: flex;
  justify-content: center;
}

.nav {
  display: flex;
  list-style: none;
  padding: 15px 0;
  margin: 0;
  justify-content: flex-end;
  background: #f5f8fa;
  border-bottom: 1px solid lightgrey;
  margin-bottom: 24px;
}

.nav a {
  color: #636b6f;
  padding: 0 25px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1rem;
  text-decoration: none;
  text-transform: uppercase;
}

// Auth Pages

label {
  display: block;
  margin-bottom: 4px;
}

.login-heading {
  margin-bottom: 16px;
}

.form-control {
  margin-bottom: 24px;
}

.mb-more {
  margin-bottom: 42px;
}

.login-form {
  max-width: 500px;
  margin: auto;
}

.login-input {
  width: 100%;
  font-size: 16px;
  padding: 12px 16px;
  outline: 0;
  border-radius: 3px;
  border: 1px solid lightgrey;
}

.btn-submit {
  width: 100%;
  padding: 14px 12px;
  font-size: 18px;
  font-weight: bold;
  background: #60bd4f;
  color: white;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: darken(#60bd4f, 10%);
  }

  &:disabled { /* styling the disabled state of the button so that it can work with the CSS spinner */
    background: lighten(#60bd4f, 25%);
    cursor: not-allowed;
  }
}

.server-error {
  margin-bottom: 12px;
  font-size: 16px;
  padding: 10px 16px;
  color: #a94442;
  background: #f3dede;
  border-radius: 4px;
}

.form-error {
  font-size: 16px;
  color: #a94442;
}

.input-error {
  border: 1px solid red;
}

.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  margin-bottom: 12px;
  font-size: 16px;
  padding: 10px 16px;
  border-radius: 4px;
}

.page-wrapper {
  animation-duration: 0.2s; /* duration of the animation when using animate.css to fade in and out of pages when a component is loaded when we click a link */
}

// CSS for the CSS spinner
.lds-ring-container {
  position: absolute;
  right: 50%;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 25px;
  height: 25px;
  // margin: 8px;
  border: 3px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
