import firebase from 'firebase'

firebase.initializeApp({
    apiKey: "AIzaSyAtEOpaOt6xSIzkn7mYE7D_frYJbBlX3tw",
    authDomain: "slotmotion-42759.firebaseapp.com",
    databaseURL: "https://slotmotion-42759.firebaseio.com/",
    projectId: "slotmotion-42759",
    storageBucket: "slotmotion-42759.appspot.com",
    messagingSenderId: "214176741118"
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
        inactive: 4,
        publish: 5,
        deleted: 6,
        awarded: 7,
    }
}