<template>
    <div class="event-container" @click="showEvent()">
        <Poptip trigger="hover" title="Event" placement="right" :content="event.type">
         <Card :padding="0" style="width:320px">
             <div class="card-body">
                 <div class="event-name">
                     <span>{{ event.title }}</span>
                 </div>
                 <div class="img-event">
                     <img :src="uplaodPath + event.event_image" :alt="event.name">
                </div>
                <div class="date-event">
                    <div class="dateDeb">
                        <p>Start</p>
                        <div class="date-div">
                            <span>{{ start_date.getDate() }}</span>
                            <span> {{ monthNames[start_date.getMonth()] }} </span>
                        </div>
                    </div>
                    <div class="dateFin">
                        <p>End</p>
                        <div class="date-div">
                            <span>{{ finish_date.getDate() }}</span>
                            <span>{{ monthNames[finish_date.getMonth()] }}</span>
                        </div>
                    </div>
                </div>
                <p class="desc">
                    {{ event.description }}
                </p>
                <div class="btns">
                        <Button class="btn" size="large" icon="heart" type="ghost" long>Interested</Button>
                        <Button class="btn" size="large" icon="plus-round" type="ghost" long>Participate</Button>
                </div>
             </div>
         </Card>
         </Poptip>
    </div>
</template>
<script>
import Event from '@/services/Event'
import Config from '@/utils/config'
export default {
    name: 'AllEventStaff',
    props: ['event'],
    data() {
        return {
            uplaodPath: Config.URL + Config.UPLOAD_EVENT_PATH,
            start_date: null,
            finish_date: null,
            monthNames: ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]
        }
    },
    methods: {
        showEvent() {
            this.$router.push({ name: 'EventDetails', params: { id: this.event._id } })
        }
    },
    async mounted() {
        this.start_date = new Date(this.event.start_date)
        this.finish_date = new Date(this.event.finish_date)
    }
}
</script>
<style scoped>
    .pin-event {
        -webkit-box-shadow: -41px 72px 0px -37px rgba(0,0,0,0.75);
        -moz-box-shadow: -41px 72px 0px -37px rgba(0,0,0,0.75);
        box-shadow: -41px 72px 0px -37px rgba(0,0,0,0.75);
    }
    .card-body {
        padding: 0%;
    }
    .img-event {
        height: 11em;
    }
    .img-event img {
        width: 100%;
        top: -.3em;
        left: 3em;
    }
    .date-event {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 320px
    }
    .dateDeb {
        background-color: #22a6b3;
        width: 100%
    }
    .dateFin {
        background-color: #be2edd;
        width: 100%
    }
    .date-div {
        display: flex;
        flex-direction: column
    }
    .date-div span {
        font-weight: 1000;
        font-size: 20px;
        color: white;
        margin-top: -7%
    }
    p {
        color: white;
        font-size: 15px;
        margin: 3% 3% 3% 3%;
    }
    .event-name {
        width: 100%;
        background-color: #2f3542;
        display: flex;
        flex-direction: column;
        color: white;
        font-size: 30px;
        font-weight: bold;
        padding-top: 2%
    }

    .event-name span {
        color: white;
        font-size: 30px;
        font-weight: bold;
    }
    .desc {
        color: black
    }
    .btns {
        display: flex;
        flex-direction: row;
    }
    .btn {
        background-color: #2f3542;
        color: white;
        border: 0;
        border-radius: 0;
        height: 3.5em;
        font-weight: 900
    }
    .btn:hover {
        background-color: #747d8c;
        color: white;
        border: 0;
        border-radius: 0;
    }
</style>