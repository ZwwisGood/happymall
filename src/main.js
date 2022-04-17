import Vue from 'vue'
import App from './App.vue'
//三级联动组件---全局组件
import TypeNav from '@/components/TypeNav'
//分页器组件---全局组件
import Pagination from '@/components/Pagination'
//elementUI---全局组件
import {Button,MessageBox} from 'element-ui'
//第一个参数：全局组件名字，第二个参数：哪个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Pagination.name, Pagination)
//注册全局组件
Vue.component(Button.name, Button)
//element-ui的另一种注册组件方法：挂在原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
//引入MockServer.js----mock数据
import '@/mock/mockServe'
//全局引入swiper样式
import 'swiper/css/swiper.css'
//引入路由
import router from '@/router'
//引入仓库
import store from '@/store'
//统一接口API里面的全部请求函数
//统一引入
import * as API from '@/api'
//引入图片懒加载插件
import VueLazyLoad from 'vue-lazyload'
//引入懒加载的默认图片
import load from '@/assets/1.gif'
//引入表单验证插件 vee-validate
import '@/plugins/validate'
//注册插件
Vue.use(VueLazyLoad,{
  //懒加载默认图片
  loading: load
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),

  beforeCreate() {
    //注册全局事件总线
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  //注册路由
  //注册路由信息：当这里书写router的时候，组件身上都拥有$route,$router属性
  router,
  //注册仓库,组件实例的身上多个属性$store
  store,
}).$mount('#app')
