import Api from "@/services/Api"

export default {
    register(credentials) {
        return Api().post('guest/users/register', credentials)
    },
    login(credentials) {
        return Api().post('guest/users/login', credentials)
    },
    recognize(photo){
        return Api().post('/guest/users/recognize',{photo:photo});
    },
    enroll(photo){
        return Api().post('/guest/users/enroll',{photo:photo});
    },
    loginWithFacial(photo){
        return Api().post('/guest/users/login/facial',{photo:photo});
    }
}