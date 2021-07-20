import Vue from 'vue'
import Vuex from 'vuex'

//state：组件状态
const state = {
    chatContent: '',
};

//mutation：同步提交对state的修改
const mutations = {
    setChatContent(state, value) {
        Vue.set(state, 'chatContent', value)
    },
};

//异步获取组件状态，可筛选
const getters = {};
//异步提交对state的修改
const actions = {};

const store = new Vuex.Store({
    state,
    mutations,
    getters,
    actions
});

export default store;

