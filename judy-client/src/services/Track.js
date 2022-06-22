import Api from '@/services/Api'
import store from '@/store/store'

export default {
    searchOnYoutube(q){
        return Api().get('guest/track?q='+q);
    },
    addTrack(track){
        return Api().post('guest/track',track);
    }
}