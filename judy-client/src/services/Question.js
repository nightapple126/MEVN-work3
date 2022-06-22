import Api from '@/services/Api'
import store from '@/store/store'
export default {
    GetQuestions(){
        return Api().get('guest/question/');
    },
    respondToQuestion(question){
        return Api().post('guest/question/respond',question);
    }
}