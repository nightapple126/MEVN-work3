import PlateForm from '@/components/restaurant/PlateForm'
import PlateFormEdit from '@/components/restaurant/PlateFormEdit'
import AllPlate from '@/components/restaurant/AllPlate.staff'

export default new Array (
    {
        path: '/plate',
        name: 'addplate',
        component: PlateForm
    },
    {
        path: '/plate/edit/:id',
        name: 'editPlate',
        component: PlateFormEdit
    },
    {
        path: '/plate/all',
        name: 'allPlate',
        component: AllPlate
    }
)