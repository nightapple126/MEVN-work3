import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TestComponent from '@/components/TestComponent'
import ConfirmOrder from '@/components/restaurant/ConfirmOrder.guest'
import PlateForm from '@/components/restaurant/PlateForm'
import LoginForm from '@/components/users/LoginForm'
import UserRoutes from '@/router/user.routes'
import BotStats from '@/components/bot/Stats'
import store from '@/store/store'
import  routes  from '@/router/autoloader'
import NotFound from '@/components/404.vue'

Vue.use(Router)

var router =  new Router({
  mode:'history',
  routes: [
    {
      path: '/menu',
      name: 'newPlate',
      component: PlateForm,
      beforeEnter: (to, from, next) => {
        console.log(store.state.token);
        if (store.state.token) return next();
        next('/login')
      }
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/test',
      name: 'Test',
      component: TestComponent
    },
    {
      path: '/confirm',
      name:'ConfirmOrder',
      component: ConfirmOrder
    },
    {
      path: '/bot/stats',
      name:"BotStats",
      component: BotStats
    }
  ]
})


routes.forEach(route => {
  router.addRoutes(route.default)
})

router.addRoutes([{
  path: '*',
  name:"404",
  component: NotFound
}]);


export default router;
