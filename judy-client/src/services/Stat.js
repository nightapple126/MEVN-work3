import Api from '@/services/Api'
import store from '@/store/store'

export default {
    post(data) {
        return Api().post('/guest/stat', data)
    },
    get() {
        return Api().get('/guest/stat')
    },
   
}