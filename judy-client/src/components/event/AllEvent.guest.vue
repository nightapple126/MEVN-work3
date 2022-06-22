<template>
    <div class="events-container">
        <EventCard v-if="events.length != 0" v-for="event in events" :key="event._id" :event="event"></EventCard>
        <h1 v-if="events.length == 0" >No Event available starting from today!</h1>
    </div>
</template>
<script>
import Event from '@/services/Event'
import EventCard from '@/components/event/EventCard.component'

export default {
    name: 'AllEventStaff',
    components: {
        EventCard
    },
    data() {
        return {
            events: [],
        }
    },
    methods: {

    },
    async mounted() {
         try {
            this.events = (await Event.getAllForGuest()).data.events
            console.log(this.events)
        } catch (error) {
            console.log(error)
        }
    }
}
</script>
<style scoped>
    .events-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin: 4%;
        justify-content: flex-start
    }
    h1 {
        margin-left: 30%
    }
</style>