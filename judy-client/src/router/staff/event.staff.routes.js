import EventForm from '@/components/event/EvenForm.staff'
import EditEvent from '@/components/event/EventEdit'
import All from '@/components/event/AllEvent'

export default new Array (
    {
        path: '/',
        name: 'AddEventForm',
        component: EventForm
    },
    {
        path: '/all',
        name: 'AllEventForStaff',
        component: All
    },
    {
        path: '/edit/:id',
        name: 'EditEvent',
        component: EditEvent
    }
);