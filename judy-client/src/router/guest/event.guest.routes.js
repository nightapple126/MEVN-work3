import EventDetails from '@/components/event/EventDetails'
import AllEvent from "@/components/event/AllEvent.guest";

export default new Array (
    {
        path: '/:id',
        component: EventDetails,
        name: 'EventDetails'
    },
    {
        path: '/',
        component: AllEvent,
        name: 'AllEventForGuest' 
    }
)