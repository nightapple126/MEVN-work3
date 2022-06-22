<template>
    <div class="form-event">
      <h2>NEW EVENT FORM</h2>
     <Form ref="formValidate" :model="eventForm" :rules="rules" :label-width="80">
         <div class="left-side">
             <FormItem label="Title" prop="title">
            <Input v-model="eventForm.title" placeholder="Please enter event title"></Input>
            </FormItem>
            <FormItem label="Starting date" prop="start_date">
                <DatePicker type="datetime" :start-date="new Date()" style="width: 100%" :options="startDateValidation" v-model="eventForm.start_date" format="yyyy-MM-dd HH:mm" placeholder="event's starting date and time" ></DatePicker>
            </FormItem>
            <FormItem label="Finishing date" prop="finish_date">
                <DatePicker type="datetime" :start-date="new Date()" :options="finishDateValidation" style="width: 100%" v-model="eventForm.finish_date" format="yyyy-MM-dd HH:mm" placeholder="event's finishing date and time" ></DatePicker>
            </FormItem>
            <FormItem label="Location" prop="location">
                <GoogleMap placeholder="Event location .." @location="getInput"></GoogleMap>
            </FormItem>
         </div>
         <div class="right-side">
             <FormItem label="Type" prop="type">
                <Input v-model="eventForm.type" placeholder="Please enter event type"></Input>
            </FormItem>
            <FormItem label="Audience number" prop="audience_number">
                <Input :number="true" v-model="eventForm.audience_number" placeholder="Please enter event audience number"></Input>
            </FormItem>
            <FormItem label="Description" prop="description">
                <Input v-model="eventForm.description" placeholder="Please enter event description"></Input>
            </FormItem>
            <FormItem label="Organizer" prop="organizer">
                <Input v-model="eventForm.organizer" placeholder="Please enter event organizer"></Input>
            </FormItem>
            <FormItem label="Sponsors" prop="sponsors">
                <Input v-model="eventForm.sponsor" @on-keyup.13="handleAdd" placeholder="Please enter event sponsor"></Input>
                <Tag color="yellow" v-for="item in eventForm.sponsors" :key="item" :name="item" closable @on-close="handleClose2(item)">{{ item  }}</Tag>
            </FormItem>
            <FormItem id="btns">
                <div class="upload">
                  <Upload
                      :before-upload="handleUpload"
                      action="http://localhost:3000/staff/restaurant/upload"
                      name="plate_photo"
                      :headers="headers"
                      >
                      <Button type="ghost" icon="ios-cloud-upload-outline" long>Upload event photo</Button>
                  </Upload>
                  <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>
                </div>
                <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
            </FormItem>
         </div>
    </Form>
    </div>
</template>
<script>
import GoogleMap from "@/components/reusable/GoogleMap";
import Event from "@/services/Event";
import storage from '@/utils/persistence.js';
export default {
  name: "EventForm",
  components: {
    GoogleMap
  },
  data() {
    return {
      eventForm: {
        title: "",
        start_date: "",
        finish_date: "",
        location: "",
        type: "",
        audience_number: 0,
        description: "",
        organizer: "",
        sponsor: "",
        event_image: "",
        sponsors: [],
        location_name: "",
        created_by: ""
      },
      rules: {
        title: [
          {
            required: true,
            message: "the title field is required!",
            trigger: "blur"
          }
        ],
        start_date: [
          {
            required: true,
            type: 'date',
            message: "starting date field is required!",
            trigger: "blur"
          },
          {
            type: "date",
            message: "please check starting date",
            trigger: "blur"
          }
        ],
        finish_date: [
          {
            required: true,
            type: 'date',
            message: "finishing date field is required",
            trigger: "blur"
          },
          {
            type: "date",
            message: "please check finish date",
            trigger: "blur"
          }
        ],
        location_name: [
          {
            required: true,
            message: "event location field is required",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "type of event is required!",
            trigger: "blur"
          }
        ],
        audience_number: [
             {
            required: true,
            type: 'number',
            message: "finishing date field is required",
            trigger: "blur"
          },          
          {
            type: "number",
            message: "this field accepts only number",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "desvription field is required!",
            trigger: "blur"
          }
        ],
        organizer: [
          {
            required: true,
            message: "organizer field is required!",
            trigger: "blur"
          }
        ],
        event_image: [
          {
            required: true,
            message: "image for event is required!",
            trigger: "blur"
          }
        ]
      },
      file: null,
      headers: { Authorization: "Bearer " + this.$store.state.token },
      finishDateValidation: {
        disabledDate(date) {
          const dateEnd = storage.get('start_date')
          return date && date.valueOf() < new Date(dateEnd).valueOf()
        }
      },
      startDateValidation: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now()
        }
      }
    };
  },
  methods: {
    handleSubmit(name) {
        console.log(this.eventForm)
        console.log(this.location_name)
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          console.log('form not valid !');
          
          if (this.eventForm.event_image) {
            console.log('Valid form!!');
             try {
            await Event.post(this.eventForm)
            this.$router.push('/staff/event/all')
            } catch (error) {
              console.log(error)
            }
          }
        } else {
          this.$Message.error('please check the form !')
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleUpload(file) {
      this.file = file;
      return false;
    },
    async upload() {
      try {
        this.loadingStatus = true;
        let formData = new FormData();
        formData.append("event_photo", this.file);
        const data = (await Event.upload(formData)).data;
        this.eventForm.event_image = data.filename;
        setTimeout(() => {
          this.file = null;
          this.loadingStatus = false;
          this.$Message.success("Success");
        }, 1500);
      } catch (e) {
        console.log(e);
      }
    },
     handleAdd () {
          if (this.eventForm.sponsor !== '' && !this.eventForm.sponsors.includes(this.eventForm.sponsor)) {
              this.eventForm.sponsors.push(this.eventForm.sponsor)
          }
          this.eventForm.sponsor = ''
     },
     handleClose2(item) {
         this.eventForm.sponsors = this.eventForm.sponsors.filter(x => x !== item );
     },
     getInput(event) {
         console.log(event);
         this.eventForm.location = event;
         this.eventForm.location_name = event.name
     },
     eventDateValidate(date) {
       if(storage.get('start_date')) {
         storage.remove('start_date')
       }
       storage.set('start_date', date)
     }
  },
  watch: {
    eventForm: function() {
      console.log('hello');
    }
  },
  mounted() {
    this.eventForm.created_by = this.$store.state.user._id
  },
};
</script>
<style scoped>
    .form-event {
        display: flex;
        flex-direction: column;
        flex-grow: 50;
        height: 100%;
        margin: 3em 2em 3em 2em
    }
    form {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-top: 2em;
    }
    .left-side {
        flex-grow: 2;
        margin-right: 2em
    }
    .right-side {
        flex-grow: 2;
        margin-left: 2em;
    }
    #btns {
      display: flex;
      flex-direction: row;
      justify-content: center
    }
</style>

