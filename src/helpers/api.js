import axios from 'axios';

export function callGetUserGameplay(user, date) {
  return axios.get('https://us-central1-slotmotion-42759.cloudfunctions.net/smotion/userGamePlay', {
    params: {
      signupDate: date
    },
    headers: {
      Authorization: `Bearer ${user.idToken}`
    }
  });
}
