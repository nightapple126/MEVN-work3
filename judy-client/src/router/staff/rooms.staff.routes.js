import AddRoom from '@/components/rooms/AddRoom.staff.vue'
import Viewrooms from '@/components/rooms/Viewrooms.staff.vue'

export default new Array (
    {
        path: '/add',
        name: 'AddRoom',
        component: AddRoom
    },
    {
        path: '/',
        name: 'Viewrooms',
        component: Viewrooms
    }
)