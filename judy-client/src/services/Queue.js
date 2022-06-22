import Api from '@/services/Api'
import store from '@/store/store'

export default {
    Queue(){
        return Api().get('guest/queue/')
    },
    AddToQueue(track,qid){
        return Api().post('guest/queue/add?qid='+qid,track);
    },
    RemoveFromQue(track,qid){
        return Api().get('guest/queue/removeFromQue?trackid='+track+"&qid="+qid);
    },
    SetCurrent(trackindex,qid){
        return Api().get('guest/queue/SetCurrent?trackindex='+trackindex+'&qid='+qid);
    }
}