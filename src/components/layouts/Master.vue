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
            <li><router-link :to="{ name: 'login' }">Login</router-link></li>
            <li><router-link :to="{ name: 'register' }">Register</router-link></li>
        </ul>

        <!-- any of our content for other pages shall go here -->
        <!-- according to the docs: The <router-view> component is a functional component that renders the matched component for the given path -->
        <router-view></router-view>
    </div>
</template>

<script>
export default {

}
</script>

<style>
/* styling the navbar whose markup is in the template section above */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* this part of the CSS is actually taken from the main template App.vue, which is the original entry point of the app the first time we initialize a Vue app ( so we go to App.vue and comment out the #app{} section of the CSS) */
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
    background: #F5F8FA;
    border-bottom: 1px solid lightgrey;
    margin-bottom: 24px;
}

.nav a {
    color: #636b6f;
    padding: 0 25px;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: .1rem;
    text-decoration: none;
    text-transform: uppercase;
}
</style>