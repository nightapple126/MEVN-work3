import Api from '@/services/Api'
import store from '@/store/store'

export default {
    post(data) {
        return Api().post('/staff/service/', data)
    },
    put(data, name) {
        return Api().put('/staff/service?name=' + name, data)
    },
    delete(data) {
        return Api().delete('/staff/service/' + data)
    },
    get() {
        return Api().get('/staff/service')
    },
    getOne(name) {
        return Api().get('/staff/service/' + name)
    }
}