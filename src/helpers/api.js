import axios from 'axios';
import { firebaseFunctions } from '../config/constants';

export function callGetUserGameplay(user, date) {
  return axios.get(`${firebaseFunctions}/smotion/userGamePlay`, {
    params: {
      signupDate: date
    },
    headers: {
      Authorization: `Bearer ${user.idToken}`
    }
  });
}
