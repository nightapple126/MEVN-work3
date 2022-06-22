import store from '@/store/store'

const fs = require('fs')
//const requireContext = require('require-context')
const routes = require.context(__dirname, true, /\.routes\.js$/)

function autoload() {
    
    var allRoutes = [];
    routes.keys().forEach( (route) => { 
        
        if (route.includes('staff')) {
          
            (routes(route)).default.forEach(path => {
                path.beforeEnter = function (to, from, next) {
                    
                    if(store.state.user) {
                        if(store.state.user.role === 'STAFF') {
                            return next();
                        }
                        return next('/');
                    }
                }
                path.path = '/' + route.substr(2, route.indexOf('.staff') - 2) + path.path
                
            })
        }
        if (route.includes('guest') && !route.includes("guests")) {
            (routes(route)).default.filter(f => !f.path.includes('login')).forEach(path => {
                path.beforeEnter = function (to, from, next) {
                    if( store.state.isUserLoggedIn) {
                        
                        return next();
                    } 
                    return next('/login');
                }
                path.path = '/' + route.substr(2, route.indexOf('.guest') - 2) + path.path
            })
        }
        allRoutes.push(routes(route)) 
    });
    console.log(allRoutes)
    return allRoutes;
}



export default autoload();
