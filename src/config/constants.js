import firebase from 'firebase';

export const projectId = 'slotmotion-42759';
export const domain = `${projectId}.firebaseapp.com`;
export const firebaseFunctions = `https://us-central1-${projectId}.cloudfunctions.net`;
export const constants = {
  formatDate: 'mmm d, yyyy', // -> 'dddd, mmmm dS, yyyy, h:MM:ss TT'
  promotionsStatus: {
    pending: 0,
    declined: 1,
    forfeited: 2,
    active: 3,
    inactive: 4,
    publish: 5,
    deleted: 6,
    awarded: 7
  }
};

firebase.initializeApp({
  apiKey: 'AIzaSyAtEOpaOt6xSIzkn7mYE7D_frYJbBlX3tw',
  authDomain: domain,
  databaseURL: `https://${projectId}.firebaseio.com/`,
  projectId: projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: '214176741118'
});

export const firabaseDB = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export const firebaseStorage = firebase.storage;
