import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBYbgaJR_sigGpiExx-5dJ1sZ-0na4brI4",
    authDomain: "smotion-c187f.firebaseapp.com",
    databaseURL: "https://smotion-c187f.firebaseio.com",
    projectId: "smotion-c187f",
    storageBucket: "smotion-c187f.appspot.com",
    messagingSenderId: "216704113839"
};

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth