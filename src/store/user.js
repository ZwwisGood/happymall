//登录与注册的模块
import { reqGetCode, reqUserRegister, reqUserLogin,reqUserInfo,reqLogout } from '@/api'
import {setToken,getToken,removeToken} from '@/utils/token'
const actions = {
    //获取验证码
    async getCode({ commit }, phone) {
        //获取验证码这个接口，正常情况是后台把验证码发到手机。但是要钱
        let result = await reqGetCode(phone)
        if (result.code === 200) {
            commit('GETCODE', result.data)
            return 'ok'
        } else {
            return Promise.reject(new Error('failed'))
        }
    },
    //用户注册
    async userRegister({ commit }, user) {
        let result = await reqUserRegister(user)
        if(result.code === 200){
            return 'ok'
        }else{
            return Promise.reject(new Error('failed'))
        }
    },
    //用户登录
    async userLogin({ commit }, data) {
        let result = await reqUserLogin(data)
        //服务器下发的token，是用户的唯一标识
        //会经常通过带token找服务器获取用户信息进行展示（如显示用户名）
        if(result.code === 200){
            commit('USERLOGIN',result.data.token)
            setToken(result.data.token)
            return 'ok'
        }else{
            return Promise.reject(new Error('failed'))
        }
    },
    //获取用户信息
    async getUserInfo({commit}){
        let result = await reqUserInfo()
        if(result.code === 200){
            //提交用户信息
            commit('GETUSERINFO',result.data)
            return 'ok'
        }else{
            return Promise.reject(new Error('failed'))
        }
    },
    //退出登录
    async userLogout({ commit}){
        //向服务器发请求，清除token
        let result = await reqLogout()
        if(result.code === 200){
            commit('CLEAR')
            return 'ok'
        }else{
            return Promise.reject(new Error('failed'))
        }
    }
}
const mutations = {
    GETCODE(state, code) {
        state.code = code
    },
    USERLOGIN(state,token){
        state.token = token
    },
    GETUSERINFO(state,userInfo){
        state.userInfo = userInfo
    },
    CLEAR(state){
        //仓库信息清空
        state.token = '',
        state.userInfo = {},
        //本地存储清空
        removeToken()
    }
}
const state = {
    code: '',
    token: getToken(),
    userInfo: {}

}
const getters = {}
export default {
    actions,
    mutations,
    state,
    getters,
}