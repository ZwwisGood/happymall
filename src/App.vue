<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口的地方 -->
    <router-view></router-view>
    <!-- 在Home、Search显示，在登录、注册隐藏 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
//引入
const Header = ()=>import('./components/Header')
const Footer = ()=>import('./components/Footer')
export default {
  name: 'App',
  components: { Header, Footer },
  mounted() {
    //通知Vuex发请求，获取数据，存储于仓库种,只执行一次，用于优化
    this.$store.dispatch('categoryList')
  },
}
</script>

<style>
</style>