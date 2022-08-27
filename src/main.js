// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/icon.css'
import axios from 'axios'
import qs from 'qs'
import Vuex from 'vuex'
import store from './store'
import axiosLogin from './util/util'

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(Vuex);

Vue.config.productionTip = false
// 引用axios
Vue.prototype.axios = axios;
// Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs
Vue.prototype.$store = store
Vue.prototype.$axiosLogin = axiosLogin


router.beforeEach((to, from, next) => {
  console.log("LOGIN")
  //获取登录状态的缓存
  let isLogin = sessionStorage.getItem('isLogin');

  //如果登出
  if (to.path == '/logout') {
    //清空缓存
    sessionStorage.clear();
  }
  //如果登录
  else if (to.path == '/login') {
    // 如果登录状态存在的话
    if (isLogin != null) {
      // 前往main
      next({ path: '/main' });
      console.log("登录状态存在" + isLogin)
    }
    // 如果登录状态不存在的话
    else {
      // 前往main 重新登录
      next({ path: '/login' });
    }
  }

  next();

})




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// new Vue({
//   el: '#login',
//   router,
//   components: { Login },
// })
