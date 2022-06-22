<template>
    <div id="viewrooms">
        <Table :columns="columns" :data="rooms"></Table>
         <Modal
            v-model="deleting"
            title="Confirmation"
            @on-ok="ok">
            <p>Do you really want to delete this room ?</p>
        </Modal>
    </div>
</template>
<script>
    import Room from '@/services/Room';
    export default {
        name: '',
        data() {
            return {
                deleting: false,
                toDelete : '',
                rooms: [],
                columns: [
                    {
                        title:"Room number",
                        key: "room_number"
                    },
                    {
                        title:"Floor",
                        key: "floor"
                    },
                    {
                        title:"Action",
                        key:"_id",
                        render: (h,params)=>{
                            
                            return h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                        
                                    },
                                    on:{
                                        click: ()=>{
                                            this.delete(params.row._id);
                                        }
                                    }
                            }, 'Delete')
                        }
                    }
                ]
            }
        },
        methods: {
            delete(id){
                this.toDelete=id;
                this.deleting= true;
            },
            ok(){
                Room.delete(this.toDelete).then(res=>{
                    var r=  this.rooms.filter(room=>room._id==this.toDelete)[0];
                    this.rooms.splice(this.rooms.indexOf(r),1);
                    this.toDelete="";
                }).catch(err=>{

                });
            }
        },
        mounted() {
            Room.getRooms().then(res=>{
                this.rooms= res.data;
            }).catch(err=>{
                console.log(err);
            })
        }
    }
</script>
<style scoped>

</style>