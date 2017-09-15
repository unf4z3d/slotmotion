import axios from 'axios'

export function callGetCasinos () {
    return axios.get('https://ng.cca.sh/clientarea/operators/?auth%5Busr%5D=clientarea&auth%5Bpassw%5D=a490e2ded90bc3e5e0cab8bb96210fcbac470e24')
}

export function callGetUserGameplay (date, casinos) {
    return axios.get(`https://cca.sh/clientarea/gameplay/?auth%5Busr%5D=clientarea&auth%5Bpassw%5D=a490e2ded90bc3e5e0cab8bb96210fcbac470e24&start=${date}&${casinos}&groupBy=casino`)
}

