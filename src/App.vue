<template>
  <div id="app">
    <router-view></router-view>

  </div>
</template>

<script>


export default {
  name: 'App',
  mounted() {
    //监听页面刷新事件
    window.addEventListener('unload', this.saveState());
    window.addEventListener('beforeunload', this.saveState());
    // window.addEventListener('')
    // window.addEventListener('unload',console.log(this.$store.state))
  },
  methods: {
    //用于存储user的state 因为Vue是单页面应用 一旦刷新
    //之前保存的user state就会消失 所以我们在刷新时将它存在缓存里 
    //刷新之后再取出来 
    saveState() {
      sessionStorage.setItem('state', JSON.stringify(this.$store.state.user))
      console.log(JSON.stringify(this.$store.state))
      console.log(JSON.parse(sessionStorage.getItem('state')))
      console.log(sessionStorage.getItem('state'))
      console.log(this.$store.state)
    }
  }
}

</script>

<style>
</style>
