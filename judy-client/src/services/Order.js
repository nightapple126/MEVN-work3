import Api from '@/services/Api'
import  axios  from 'axios'

export default {
        order(order){
            return Api().post('/guest/order',order);
        },
        myOrders(){
            return Api().get('/guest/order');
        },
        confirm(order_id){
            return Api().put('/guest/order/'+order_id);
        }
}
