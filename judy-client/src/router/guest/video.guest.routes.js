import VideoStream from '@/components/streaming/video'
import videoList from '@/components/streaming/videolist'

export default new Array (
    {
        path: '/stream/:id',
        name: 'Stream',
        component: VideoStream,
        
    },
    {
        path: '/all',
        name: 'Movies',
        component: videoList
    }
)