import Api from '@/services/Api'


export default  {
    addRoom(room){
        return Api().post('/staff/room',room);
    },
    getRooms(){
        return Api().get('/staff/room');
    },
    getAvailableRooms(from,to){
        return Api().post('/staff/room/available',{from:from,to:to});
    },
    delete(id){
        return Api().delete('/staff/room/'+id);
    }
}