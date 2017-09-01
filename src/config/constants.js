import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyBYbgaJR_sigGpiExx-5dJ1sZ-0na4brI4",
    authDomain: "smotion-c187f.firebaseapp.com",
    databaseURL: "https://smotion-c187f.firebaseio.com",
    projectId: "smotion-c187f",
    storageBucket: "smotion-c187f.appspot.com",
    messagingSenderId: "216704113839"
})

export const firabaseDB = firebase.database().ref()
export const firebaseAuth = firebase.auth
export const firebaseStorage = firebase.storage


export const constants = {
    formatDate : 'mmm d, yyyy', // -> 'dddd, mmmm dS, yyyy, h:MM:ss TT'
    promotionsStatus:{
        pending: 0,
        declined: 1,
        forfeited: 2,
        active: 3,
    }
}