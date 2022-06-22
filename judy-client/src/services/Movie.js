import Api from '@/services/Api'
import store from '@/store/store'

export default {
    upload(formdata) {
        return Api().post('/staff/movie/upload', formdata,
        { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + store.state.token } });
    },
    post(movie) {
//console.log(movie);
        return Api().post('/staff/movie/add', plate);
    },
    loadMovies(){
        return Api().get('guest/movie/all');
    },
    loadMovie(id){
        return Api().get('guest/movie/watch?id='+id);
    }
}