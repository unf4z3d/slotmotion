'use strict';

const config = require('./config');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });
const app = express();
const axios = require('axios');

const validateFirebaseIdToken = (req, res, next) => {
  console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) && !req.cookies.__session) {
    console.error(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    );
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
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedIdToken => {
      console.log('ID Token correctly decoded', decodedIdToken);
      req.user = decodedIdToken;

      next();
    })
    .catch(error => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    });
};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

/**
 * Get User GamePlay.
 */
app.get('/userGamePlay', (req, res) => {
  console.log('Running userGamePlay controller');
  // Get all casinos per user.
  axios
    .get(
      `${config.clientArea}/operators/?${config.clientAuth}`
    )
    .then(response => {
      // Filter casinos per the authenticated user
      admin
        .database()
        .ref('users')
        .child(req.user.uid)
        .on('value', snap => {
          const user = snap.val();
          let casinos = [];

          if (response.data) {
            response.data.forEach(operator => {
              if (operator.id === user.profile.apiId) {
                casinos = casinos.concat(operator.casinos);
              }
            });
          }

          console.log(`number of casinos: ${casinos.length}`);
          if (casinos.length > 0) {
            const strCasinos = `&casino=${casinos.join('&casino=')}`;
            const gamePlayEndpoint =
              `${clientArea}/gameplay/?${config.clientAuth}&start=${req.param('signupDate')}${config.strCasinos}&groupBy=casino`;
            console.log('Endpoint:', gamePlayEndpoint);
            // Get user gameplay for each casino.
            axios
              .get(gamePlayEndpoint)
              .then(response => {
                let totalBet = 0;

                if (response.data) {
                  response.data.forEach(gamePlay => {
                    //filter segment
                    if (user.profile.segments.indexOf(gamePlay.segment) !== -1) {
                      gamePlay.type.forEach(type => {
                        if (type.type === 'WAGER') {
                          totalBet += type.rounds || 0;
                        }
                      });
                    }
                  });
                }

                res.status(200).send({ totalBet });
              })
              .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
              });
          } else {
            res.status(200).send([]);
          }
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});

// This HTTPS endpoint can only be accessed by the Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.smotion = functions.https.onRequest(app);
