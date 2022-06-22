import Api from "@/services/Api";
import store from '@/store/store'

export default {
    upload(data) {
        return Api().
        post('/staff/event/upload/',
        data,
        { headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + store.state.token
        }});
    },
    post(data) {
        return Api().post('/staff/event/', data)
    },
    getAllForGuest() {
        return Api().get('/guest/event/')
    },
    getOneForGuest(id) {
        return Api().get('/guest/event/' + id)
    },
    put(id, data) {
        return Api().put('/staff/event/' + id, data)
    },
    getAllForStaff() {
        return Api().get('/staff/event/')
    },
    delete(id) {
        return Api().delete('/staff/event/' + id)
    },
    participate(event) {
        return Api().post('/guest/event/participate', event)
    },
    unparticipate(event) {
        return Api().post('/guest/event/unparticipate', event)
    },
    interrested(event) {
        return Api().post("/guest/event/interresting", event);
    },
    uninterrested(event) {
        return Api().post("/guest/event/uninterresting", event);
    }
}