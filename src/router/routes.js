// //引入一级路由组件
//使用路由懒加载
// import Home from '@/pages/Home'
// import Search from '@/pages/Search'
// import Login from '@/pages/Login'
// import Register from '@/pages/Register'
// import Detail from '@/pages/Detail'
// import AddCartSuccess from '@/pages/AddCartSuccess'
// import ShopCart from '@/pages/ShopCart'
// import Trade from '@/pages/Trade'
// import Pay from '@/pages/Pay'
// import PaySuccess from '@/pages/PaySuccess'
// import Center from '@/pages/Center'
// //引入二级路由组件
// import MyOrder from '@/pages/Center/myOrder/myOrder'
// import GroupOrder from '@/pages/Center/groupOrder/groupOrder'
//路由的配置信息
export default [
    {
        path: '/center',
        component: () => import('@/pages/Center'),
        meta: { show: true },
        //二级路由组件
        children: [
            {
                path: 'myorder',
                component: () => import('@/pages/Center/myOrder/myOrder'),
            },
            {
                path: 'grouporder',
                component: () => import('@/pages/Center/groupOrder/groupOrder'),
            },
            {
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        path: '/paysuccess',
        component: () => import('@/pages/PaySuccess'),
        meta: { show: true },
        //路由独享守卫
        beforeEnter(to, from, next) {
            //去支付成功页面必须是从支付页面发起的路由跳转请求
            if (from.path == '/pay' || '/paysuccess') {
                next()
            } else {
                //其他停留的当前页面
                next(false)
            }
        }
    },
    {
        path: '/pay',
        component: () => import('@/pages/Pay'),
        meta: { show: true },
        //路由独享守卫
        beforeEnter(to, from, next) {
            //去支付页面必须是从交易页面发起的路由跳转请求
            if (from.path == '/trade' || '/pay') {
                next()
            } else {
                //其他停留的当前页面
                next(false)
            }
        }
    },
    {
        path: '/trade',
        component: () => import('@/pages/Trade'),
        meta: { show: true },
        //路由独享守卫
        beforeEnter(to, from, next) {
            //去交易页面必须是从购物车发起的路由跳转请求
            if (from.path == '/shopcart' || '/trade') {
                next()
            } else {
                //其他停留的当前页面
                next(false)
            }
        }
    },
    {
        path: '/shopcart',
        name: 'shopcart',
        component: () => import('@/pages/ShopCart'),
        meta: { show: true }
    },
    {
        path: '/addcartsuccess',
        name: 'addcartsuccess',
        component: () => import('@/pages/AddCartSuccess'),
        meta: { show: true }
    },
    {
        path: '/detail/:skuid',
        component: () => import('@/pages/Detail'),
        meta: { show: true }
    },
    {
        path: '/home',
        component: () => import('@/pages/Home'),
        // 路由元信息
        meta: { show: true }
    },
    {
        name: 'search',
        path: '/search/:keyword?',
        component: () => import('@/pages/Search'),
        meta: { show: true },
    },
    {
        path: '/login',
        component: () => import('@/pages/Login'),
    },
    {
        path: '/register',
        component: () => import('@/pages/Register'),
    },
    //重定向,在项目跑起来的时候，访问/，立马定向到首页
    {
        path: '/',
        redirect: '/home'
    }
]