<template>
    <div id="addroom">
        <Card style="width:70%;margin:auto;margin-top:1em"> 
            <p slot="title">Add a room</p>
             <Form  :model="formItem" :label-width="140" >
            <FormItem label="room_number :">
                <Input v-model="formItem.room_number" placeholder="room_number"></Input>
            </FormItem>
            <FormItem label="Floor :">
                <Input v-model="formItem.floor" placeholder="Floor"></Input>
            </FormItem>
            <FormItem style="text-align:right">
                <Button type="ghost" @click.native="submit">Submit</Button>             
            </FormItem>
        </Form>
        </Card>
    </div>
</template>
<script>
    import Room from "@/services/Room";
    import router from "@/router";
    export default {
        name: '',
        data() {
            return {
                formItem:{
                    room_number: '',
                    floor: ''
                }
            }
        },
        methods: {
            submit(){
                if (this.formItem.room_number==''||this.formItem.floor==''){
                    this.$Message.error("Please verify the form fields");
                    return;
                }
                if (( isNaN(this.formItem.room_number) || isNaN(this.formItem.floor) )== true){
                    this.$Message.error("Please verify the form fields");
                    return;
                }
                Room.addRoom(this.formItem).then(resp=>{
                    router.push('/staff/rooms')
                }).catch(err=>{
                    console.log(err);
                })
            }
        },
        mounted() {
            
        }
    }
</script>
<style scoped>

</style>