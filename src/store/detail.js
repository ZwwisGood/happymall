import { reqGoodsInfo,reqAddOrUpdateShopCart } from "@/api"
//封装临时游客身份模块 uuid--生成一个随机字符串（不再变化）
import {getUUID} from '@/utils/uuid_token'
const actions = {
    //获取产品信息的action
    async getGoodInfo({ commit }, skuid) {
        let result = await reqGoodsInfo(skuid)
        if (result.code == 200) {
            commit('GETGOODINFO', result.data)
        }
    },
    //将产品添加到购物车中
    async addOrUpdateShopCart({commit},{skuId,skuNum}){
        //加入购物车以后（发请求），前台将数据带给服务器
        //服务器写入数据成功，不用返回其他数据，只要返回code=200，表明操作成功
        //所以不需要三连环存储数据
        let result = await reqAddOrUpdateShopCart(skuId,skuNum)
        //如果服务器加入购物车成功
        if(result.code==200){
            //函数加了async，返回一个Promise对象
            //返回任意一个非 promise 的值都会被包裹成 成功的 promise 对象
            //此处等于return Promise.resolve('ok')
            return 'ok'
        }else{
            return Promise.reject(new Error('failed'))
        }
    }
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
const state = {
    goodInfo: {},
    uuid_token: getUUID()
}
const getters = {
    //路径导航简化的数据
    categoryView(state) {
        //state.goodInfo初始状态为空对象，空对象的categoryView属性值为undefined
        //所以控制台会报一个假的错误，所以如果数据没返回时，返回一个空对象
        return state.goodInfo.categoryView || {}
    },
    //简化产品信息的数据
    skuInfo(state) {
        return state.goodInfo.skuInfo || {}
    },
    //产品售卖属性的简化
    spuSaleAttrList(state) {
        return state.goodInfo.spuSaleAttrList || []
    }
}
export default {
    actions,
    mutations,
    state,
    getters
}