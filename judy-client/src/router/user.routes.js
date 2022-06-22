import LoginForm from '@/components/users/LoginForm'
import Bot from '@/components/users/Bot'
import Profile from '@/components/users/Profile'

import store from '@/store/store'

export default new Array(
    {
      path: '/login',
      name: 'login',
      component: LoginForm,
      beforeEnter: (to, from, next) => {
        if(store.state.isUserLoggedIn===false) return next()
        return next('/')
      }
    },
    {
      path: '/register',
      name: 'register',
      component: LoginForm
    },
    {
      path:'/bot',
      name:"bot",
      component: Bot,
      beforeEnter: (to, from, next) => {
        if(store.state.isUserLoggedIn!==false) return next()
        return next('/login')
      }
    },
    {
      path:'/profile',
      name:"profile",
      component: Profile,
      beforeEnter: (to, from, next) => {
        if(store.state.isUserLoggedIn!==false) return next()
        return next('/login')
      }
    }
  )
