import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyBYbgaJR_sigGpiExx-5dJ1sZ-0na4brI4",
    authDomain: "smotion-c187f.firebaseapp.com",
    databaseURL: "https://smotion-c187f.firebaseio.com",
    projectId: "smotion-c187f",
    storageBucket: "smotion-c187f.appspot.com",
    messagingSenderId: "216704113839"
})

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth

export const values = {}

