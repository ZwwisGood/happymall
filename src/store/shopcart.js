import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from '@/api'
const actions = {
    //获取购物车列表数据
    async getCartList({ commit }) {
        let result = await reqCartList()
        if (result.code === 200) {
            commit('GETCARTLIST', result.data)
        }
    },
    //删除购物车某一个商品
    async deleteCartListBySkuId({ commit }, skuId) {
        let result = await reqDeleteCartById(skuId)
        if (result.code === 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    //切换购物车商品的选中状态
    async updateCheckedById({ commit }, { skuId, isChecked }) {
        let result = await reqUpdateCheckedById(skuId, isChecked)
        if (result.code === 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    //删除全部勾选的商品
    deleteAllCheckedCart({dispatch,getters}){
        //利用context小仓库，dispatch、getters（有购物车数据）
        //获取购物车中全部产品（数组）
        let PromiseAll = []   //创建一个数组，用于当作Promise.all的参数

        getters.cartList.cartInfoList.forEach(item=>{
            //选中的商品，带上ID发送请求，否则带空串
            let promise = item.isChecked == 1? dispatch('deleteCartListBySkuId',item.skuId):0
            //将每个promise对象依次放入数组
            PromiseAll.push(promise)
        })
        //全成功，返回成功结果；有一个失败，返回失败结果
        return Promise.all(PromiseAll)
    },
    //修改全部商品的状态
    updateAllCartIsChecked({dispatch,state},isChecked){
        let PromiseAll = []   //创建一个数组，用于当作Promise.all的参数
        state.cartList[0].cartInfoList.forEach(item=>{
        let promise = dispatch('updateCheckedById',{skuId:item.skuId,isChecked})
        PromiseAll.push(promise)
        })
        //返回最终结果
        return Promise.all(PromiseAll)
    }
}
const mutations = {
    GETCARTLIST(state, cartList) {
        state.cartList = cartList
    }
}
const state = {
    cartList: []
}
const getters = {
    cartList(state) {
        return state.cartList[0] || {}
    },
}

export default {
    actions,
    mutations,
    state,
    getters,
}