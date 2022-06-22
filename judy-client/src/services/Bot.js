import Api from "@/services/Api"

export default {
    query(command){
        return Api().post('guest/bot_interaction/query', {query:command});
    },
    stats(){
        return Api().get('guest/bot_interaction/stats');
    },
    delete(filename){
        return Api().post('guest/bot_interaction/destroy',{filename:filename});
    },
    getInteractions(user){
        return Api().get('guest/bot_interaction?user='+user._id);
    }

}