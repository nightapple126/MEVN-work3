
import axios from 'axios'
axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
});
import store from '@/store/store'
import https from 'https';  
const config = require('../../config/config.json')


export default () => {
    return axios.create({
        baseURL: config.URL,
        timeout: 100000,
        headers: { 'Authorization': 'Bearer ' + store.state.token }
       
    });
}