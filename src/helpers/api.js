import axios from 'axios'

export function callGetCasinos (user) {
    return axios.get('https://us-central1-smotion-c187f.cloudfunctions.net/smotion/getCasinos', {headers: {'Authorization': `Bearer ${user.idToken} `}})
}

export function callGetUserGameplay (date, casinos) {
    return axios.get(`https://cca.sh/clientarea/gameplay/?auth%5Busr%5D=clientarea&auth%5Bpassw%5D=a490e2ded90bc3e5e0cab8bb96210fcbac470e24&start=${date}&${casinos}&groupBy=casino`)
}

