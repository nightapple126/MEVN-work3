<template>
    <div id="add-guest">
            <Card style="width:80%;margin:auto;margin-top:1em">
                <p slot="extra">
                     <Button  type="primary" @click.native="submit">Submit</Button>
                </p>
                <p slot="title"> 
                    Checkin form
                </p>
                
                 <Row style="margin:1em"> 
                <Col span="12"> 
                     <Card>
                        <p slot="title">Personal informations</p>
                        <Form  :model="formItem" :label-width="140" >
                                <FormItem label="Full name :">
                                    <Input v-model="formItem.fullname" placeholder="Full Name"></Input>
                                </FormItem>
                                <FormItem label="User name :">
                                    <Input v-model="formItem.username" placeholder="User Name"></Input>
                                </FormItem>
                                <FormItem label="Email address :">
                                    <Input v-model="formItem.email" placeholder="Email"></Input>
                                </FormItem>
                                <FormItem label="Password :">
                                    <Input type="password" v-model="formItem.password" placeholder="Password"></Input>
                                </FormItem>
                                <FormItem label="Birthdate :"> 
                                    <DatePicker v-model="formItem.birthdate" type="date" placement="bottom-end" placeholder="Select date" style="width:100%"></DatePicker>
                                </FormItem>
                                <FormItem style="text-align:right">
                                    <Button type="ghost" @click.native="addGuest">Add guest</Button>
                                   
                                </FormItem>

                            </Form>
                    </Card>
                </Col>

                <Col offset="1" span="11">
                    <Card>
                        <p slot="title">Stay</p>
                        <Form  :model="formItem" :label-width="140" >
                                <FormItem label="Checkin and checkout dates :"> 
                                    <DatePicker @on-change="handleChange" v-model="range" type="daterange" placement="bottom-end" placeholder="Select date" style="width:100%"></DatePicker>
                                </FormItem>
                                <FormItem label="Room :">
                                    <Select v-model="room">
                                        <Option :value="''">Select a room</Option>
                                        <Option v-for="(room,index) in rooms" :key=index :value="room._id">Room {{room.room_number}}, Floor {{room.floor}}</Option>
                                    </Select>      
                                </FormItem>
                        </Form>
                        
                    </Card>
                     <Row style="margin:auto;margin-top:1em">
                        <Col span="7" offset="1" v-for="(guest,index) in guests" :key=index>
                            <Avatar style="color: #f56a00;background-color: #fde3cf">{{guest.fullname[0]}}</Avatar> 
                            <p>{{guest.fullname}}</p>
                        </Col>

                    </Row>
                </Col>
                

            </Row>

           
            </Card>
           
           
         
    </div>

    
</template>
<script>
import Room from "@/services/Room";
import Guest from '@/services/Guest';
import router from '@/router';
export default {
  name: "",
  data() {
    return {
      rooms: [],
      formItem: {
        fullname: "",
        username: "",
        password: "",
        email: "",
        birthdate: ""
      },
      guests: [],
      checkoutDate: "",
      checkinDate: "",
      range: "",
      room: ""
    };
  },
  methods: {
    async handleChange(date) {
      try {
        var res = await Room.getAvailableRooms(this.range[0], this.range[1]);
        this.rooms = res.data;
      } catch (err) {
        console.log(err);
        this.rooms = [];
      }
    },
    submit() {
      this.checkinDate = this.range[0];
      this.checkoutDate = this.range[1];
      if (this.validateForm()) {
        var params = [];
        this.guests.forEach(guest => {
          var g = {
            fullname: guest.fullname,
            username: guest.username,
            password: guest.password,
            email: guest.email,
            birthdate: guest.birthdate
          };
          g.checkin = this.checkinDate;
          g.checkout = this.checkoutDate;
          g.room_id = this.room;
          params.push(g);
        });
        Guest.addGuest(params).then(res=>{
            this.$Message.success("Guest successfully registered");
            router.push('/');
            console.log(res);
        }).catch(err=>{
            console.log(err);
        })
      } else {
        this.$Message.error("Please fill out all the fields");
      }
    },
    validateForm() {
      if (this.guests.length == 0) {
        return false;
      }
      if (this.checkoutDate == "" || this.checkinDate == "") {
        return false;
      }
      return true;
    },
    addGuest() {
      if (this.isValid()) {
        this.guests.push(this.formItem);
        this.resetForm();
      } else {
        this.$Message.error("Please fill out all the fields");
      }
    },
    resetForm() {
      this.formItem = {
        fullname: "",
        username: "",
        password: "",
        email: "",
        birthdate: ""
      };
    },
    isValid() {
      var valid = true;
      Object.values(this.formItem).forEach(value => {
        if (value == "" || value === undefined || value == null) {
          console.log(value);
          valid = false;
        }
      });
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return valid && re.test(this.formItem.email.toLowerCase());
    }
  },
  mounted() {},
  computed: {}
};
</script>
<style scoped>

</style>