
import Api from '@/services/Api'


export default {
    addGuest(c) {
        return Api().post('/guest/users/checkin',c);
    }
}