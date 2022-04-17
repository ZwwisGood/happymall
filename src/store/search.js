import { reqGetSearchInfo } from "@/api"
//search模块的小仓库
const actions = {
    //获取search模块数据
    async getSearchList({commit},params={}){
        //params形参:用户派发action时,传的第二个参数
        let result = await reqGetSearchInfo(params)
        if(result.code==200){
            commit('GETSEARCHLIST',result.data)
        }
    }
}
const mutations = {
    GETSEARCHLIST(state,searchList){
        state.searchList = searchList
    }
}
const state = {
    searchList:{}
}
//计算属性,为了简化数据而生
const getters = {
    //这里的参数state是这一个store的state
    goodsList(state){
        //如果服务器数据回来了,则是goodsList
        //如果没网或者网太慢,goodsList返回的是undefined,遍历undefined会报错
        //所以没有返回goodsList时,返回一个空数组,空数组可以遍历
        return state.searchList.goodsList||[]
    },
    attrsList(state){
        return state.searchList.attrsList
    },
    trademarkList(state){
        return state.searchList.trademarkList
    }
}

export default {
    actions,
    mutations,
    state,
    getters,
}