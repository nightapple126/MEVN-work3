import Api from '@/services/Api'
import store from '@/store/store'

export default {
    menu() {
        return Api().get('/guest/restaurant/plate')
    },
    upload(formdata) {
        return Api().post('/staff/restaurant/upload', formdata,
        { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + store.state.token } });
    },
    post(plate) {
        plate.basic_ingredient = plate.basic_ingredient.split(',');
        console.log(plate);
        return Api().post('/staff/restaurant/', plate);
    },
    put(plate, id) {
        plate.basic_ingredient = plate.basic_ingredient.split(',');
        return Api().put('/staff/restaurant/' + id, plate);
    },
    getOne(id) {
        return Api().get('/staff/restaurant/' + id);
    },
    get() {
        return Api().get('/staff/restaurant/');
    },
    delete(id) {
        return Api().delete('/staff/restaurant/' + id);
    },
    getForGuest() {
        return Api().get('/guest/restaurant/');
    },
    likePlate(data) {
        return Api().post('/guest/restaurant/like', data);
    },
    unlikePlate(data) {
        return Api().post('/guest/restaurant/unlike', data);
    },
    doILikeThisPlate(data) {
        return Api().get('/guest/restaurant/like/check?plateId=' + data.plate._id + '&userId=' + data.user._id)
    },
    getPlateByLabem(query) {
        return Api().get('/guest/restaurant/bot_query?label=' + query);
    },
    ratePlate(data) {
        console.log(data);
        return Api().post('/guest/restaurant/rate', data);
    },
    getRateUser(data) {
        return Api().get('/guest/restaurant/get/rate?plateId=' + data.plate._id + '&userId=' + data.user._id)
    }
}