import AddGuest from '@/components/guests/AddGuest.staff.vue'
import AllGuests from '@/components/guests/ViewGuests.staff.vue'

export default new Array (
    {
        path: '/checkin',
        name: 'checkin',
        component: AddGuest
    },
    {
        path: '/',
        name: 'viewguests',
        component: AllGuests
    }
)