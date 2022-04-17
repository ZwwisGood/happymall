import { reqCategoryList, reqGetBannerList,reqFloorList } from '@/api'
//home模块的小仓库
const actions = {
    //通过API里面的接口函数调用，向服务器发请求，获取数据
    async categoryList(context) {
        let result = await reqCategoryList()
        if (result.code === 200) {
            context.commit('CATEGORYLIST', result.data)
        }
    },
    //获取首页轮播图的数据
    async getBannerList({ commit }) {
        let result = await reqGetBannerList()
        if (result.code === 200) {
            commit('GETBANNERLIST', result.data)
        }
    },
    //获取floor数据
    async getFloorList({ commit }) {
        let result = await reqFloorList()
        if (result.code === 200) {
            commit('GETFLOORLIST', result.data)
        }
    }
}
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state,floorList){
        state.floorList = floorList
    }
}
const state = {
    //state中的数据默认初始值别瞎写，写数组返回数组，写对象返回对象
    //home仓库中三级菜单的数据
    categoryList: [],
    //轮播图数据
    bannerList: [],
    //floor组件数据
    floorList: []
}
const getters = {}

export default {
    actions,
    mutations,
    state,
    getters,
}