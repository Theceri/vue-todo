import App from './App' // We are no longer using it as the entry point to our app, but rather now using the new component Master.vue. We are only keeping it because, in the router, we have indicated that it is the component we shall use for the URI /todo
import LandingPage from './components/marketing/LandingPage'
import About from './components/marketing/About'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import TestTodosVariable from './components/marketing/TestTodosVariable'

const routes = [
    // adding the names of routes also is recommended like we used to do in Laravel, so we add the name property
    {
        path: '/',
        name: 'home',
        component: LandingPage
    },
    {
        path: '/todo',
        name: 'todo',
        component: App
    },
    {
        path: '/about',
        name: 'about',
        component: About
    },
    {
        path: '/login',
        name: 'login', 
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },

    // with this one, we want to illustrate the concept of route variables
    {
        path: '/todos/:id', // the syntax for route variables is :id
        name: 'todos',
        component: TestTodosVariable
    },
]

// remember to export so we can go to main.js and import the routes
export default routes