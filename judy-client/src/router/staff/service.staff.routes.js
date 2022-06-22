import ServiceForm from '@/components/service/ServiceForm'
import AllService from '@/components/service/AllServices'
import ServiceEditForm from '@/components/service/ServiceEditForm'
import Feedback from '@/components/feedback/FeedBackForm'

export default new Array (
    {
        path: '/add',
        name: 'newService',
        component: ServiceForm
    },
    {
        path: '/all',
        name: 'allService',
        component: AllService
    },
    {
        path: '/edit/:name',
        name: 'editService',
        component: ServiceEditForm
    },
    {
        path: '/test',
        name: 'test',
        component: Feedback
    }

)