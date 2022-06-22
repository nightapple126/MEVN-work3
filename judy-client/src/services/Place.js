import Api from '@/services/Api'
import store from '@/store/store'

export default {
    find(type,radius){
        return Api().post('/guest/places/',{type:type,radius:radius});
    }

}