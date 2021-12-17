// import firebase from 'firebase' is the old method, but with firebase version 9, you use import like below:
import firebase from 'firebase/compat/app';

// I am using firebase version 9.6.1 and so I use compat, but before version 9, all you needed to import was import 'firebase/firestore'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCymzy9Y9V_JZz3LDWQ13fxx017wOpSmf8",
    authDomain: "todos-6ac89.firebaseapp.com",
    projectId: "todos-6ac89",
    storageBucket: "todos-6ac89.appspot.com",
    messagingSenderId: "265202018958",
    appId: "1:265202018958:web:ad7090056643e31746f7df",
    measurementId: "G-M72H1LWD8H"
  }

const firebaseApp = firebase.initializeApp(firebaseConfig)

const firestore = firebaseApp.firestore()

// add this setting so that console error doesn't appear (the console error usually asks you do the below)
firestore.settings({ timestampsInSnapshots: true })

export default firestore