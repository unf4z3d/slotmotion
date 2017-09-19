'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
const axios = require('axios');

const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !req.cookies.__session) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>',
        'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get('/getCasinos', (req, res) => {
    console.log('Running getCasinos controller');
    axios.get('https://ng.cca.sh/clientarea/operators/?auth[usr]=clientarea&auth[passw]=a490e2ded90bc3e5e0cab8bb96210fcbac470e24')
    .then(function(response){
        console.log('Response:', response);
        res.status(200).send(response.data);
    })
    .catch( function(error){            
        console.error(error);
        res.status(500).send('Internal Server Error');
    });

    /*console.log('Running getCasinos controller');
    rp('ng.cca.sh/clientarea/operators/?auth[usr]=clientarea&auth[passw]=a490e2ded90bc3e5e0cab8bb96210fcbac470e24')
    .then(function(response){
        console.log('Response:', response);
        res.status(200).send(response.data);
    })
    .catch( function(error){            
        console.error(error);
        res.status(500).send('Internal Server Error');
    });*/


});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.smotion = functions.https.onRequest(app);