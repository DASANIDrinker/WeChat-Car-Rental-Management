import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login'
import Main from '../views/Main'
import Vehicle from '../views/Vehicle'
import VehicleType from '../views/VehicleType'
import User from '../views/User'
import Driver from '../views/Driver'
import Identification from '../views/Identification'
import Address from '../views/Address'
import Order from '../views/Order'
import Reservation from '../views/Reservation'
import Admin from '../views/Admin'
import NotFound from '../views/NotFound'
import Logic from '../views/Logic'
import Logout from '../views/Logout'

Vue.use(Router);

export default new Router({
    // 不显示路径里的#
    mode:'history',
    routes:[
    {
        //登录页
        // path需要设置为当前这样 如果是/login就没用
        path:'/',
        name:'Login',
        component:Login
    },
    {
        //首页
        path:'/main',
        name:'Main',
        component:Main,
        children:[
            {
                path:'/vehicle',
                name:'Vehicle',
                component:Vehicle
            },
            {
                path:'/vehicletype',
                name:'VehicleType',
                component:VehicleType
            },
            {
                path:'/user',
                name:'User',
                component:User
            },
            {
                path:'/driver',
                name:'Driver',
                component:Driver
            },
            {
                path:'/identification',
                name:'Identification',
                component:Identification
            },
            {
                path:'/address',
                name:'Address',
                component:Address
            },
            {
                path:'/order',
                name:'Order',
                component:Order
            },
            {
                path:'/reservation',
                name:'Reservation',
                component:Reservation
            },
            {
                path:'/admin',
                name:'Admin',
                component:Admin
            },
            {
                path:'/logic',
                name:'Logic',
                component:Logic
            }
        ]
    },
    {
        path:'/logout',
        name:'Logout',
        component:Logout
    },
    // 404异常页
    {
        path:'*',
        component:NotFound
    }

]
})