const user = {
    //此为未实施的理想逻辑
    //全局对象 用于保存所有组件的公共数据
    //每次调用时 检查缓存的state是否等于本次登陆的state 如果相同的话 说明是同一个用户的登录 用缓存的数据
    //如果没有的话证明上次登录和本次登陆为不同的用户 那么设置新的state 

    //现在的逻辑为
    //全局对象 用于保存所有组件的公共数据
    //每次调用时 检查是否有缓存的user state
    //如果有的话 直接使用
    //如果没有的话创建一个空的user state

    // const isNewLogin = sessionStorage.getItem('state') == this.$store.state ? JSON.parse(sessionStorage.getItem('state')) : this.$store.state;
    // const state = sessionStorage.getItem('state')?(JSON.parse(sessionStorage.getItem('state'))):{
     state : sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {
        user: {
            name: '',
            passWord:''
        }
    },

    //用于监听state对象的值的最新状态(计算属性)
     getters : {
        getUser(state) {
            return state.user
        }
    },

//唯一一个可以修改state值的方法(同步执行)
 mutations : {
        updateUser(state, user) {
            state.user = user
        }
    },

    //异步执行mutations方法
     actions : {
        asyncUpdateUser(context, user) {
            context.commit("updateUser", user);
        }
    }


}


export default user;