import axios from 'axios'

export function callGetUserGameplay (user, date) {
    return axios.get('https://us-central1-smotion-c187f.cloudfunctions.net/smotion/userGamePlay', {
            params: { 
                signupDate: date 
            }, 
            headers: {
                'Authorization': `Bearer ${user.idToken}`
            }
        })
}

