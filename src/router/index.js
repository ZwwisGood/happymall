//配置路由的地方
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
//使用插件
Vue.use(VueRouter)
//引入路由配置信息
import routes from './routes'
//先把VueRouter原型对象的push，保存一份
let orginPush = VueRouter.prototype.push
let orginReplace = VueRouter.prototype.replace

//重写push|replace
//第一个参数，告诉原来的push方法，跳转的地址（传递哪些参数）
//第二个：成功回调
//第三个：失败回调
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        orginPush.call(this, location, resolve, reject)
    } else {
        orginPush.call(this, location, () => { }, () => { })
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        orginReplace.call(this, location, resolve, reject)
    } else {
        orginReplace.call(this, location, () => { }, () => { })
    }
}


//对外暴露VueRouter类的实例
let router = new VueRouter({
    //配置路由
    routes,
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { y: 0 }
    },
})

//全局守卫
router.beforeEach(async (to, from, next) => {
    //to:可以获取到要跳转到的路由信息
    //from:可以获取导航正要离开的路由
    //next:放行函数   1.next()放行  2.next(path)放行到指定路由，如next('/login')  3.next(false)中断
    //用户登录了才有token，否则一定没
    let token = store.state.user.token
    //用户信息
    let name = store.state.user.userInfo.name
    if (token) {
        //用户已经登录后，不允许跳转到login页面，停留在首页
        if (to.path == '/login') {
            next('/home')
        } else {
            //登录后，去其他页面
            //如果有用户名，放行
            if (name) {
                next()
            } else {
                //没有用户名(刷新页面之后，仓库清空，user信息里的name也被清除)
                //则再次向服务器发请求获取用户信息(带着token)
                try {
                    await store.dispatch('getUserInfo')
                    //此时已获取到用户信息(用户名)
                    next()
                } catch (error) {
                    //token过期，失效，获取不到用户信息
                    //调用退出登录的action，来清除token
                    await store.dispatch('userLogout')
                    //跳转到登录界面，让用户重新登陆
                    next('/login')                 
                }
            }
        }
    } else {
        //未登录,不能去交易相关、支付相关、个人中心页面
        //自动跳转到登录页面
        let toPath = to.path
        if(toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1){
            //把想去没去成的地址放在query参数中，登录后直接跳到该地址（login组件中设置）
            next(`/login?redirect=${toPath}`)
        }else if(toPath.indexOf('cart') != -1){
            next('/login')
        }
        else{
            //其他页面放行
            next()
        }
    }
})

export default router