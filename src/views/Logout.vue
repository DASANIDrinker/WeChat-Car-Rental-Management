<template>
    <div id="logout">
        <!-- <span>成功登出</span> -->

        <!-- <span>{{ countDown }}秒后回到登录界面</span> -->
        成功登出
        {{ countDown }}秒后回到登录界面

    </div>
</template>
<script>
export default {
    name: 'Logout',
    mounted() {
        // setTimeout()
    },
    data() {
        return {
            time: 3
        }
    },
    // 计算属性 用来改变数据
    computed: {
        countDown: function () {
            setTimeout(() => {
                this.time = this.time - 1;
            }, 1000)
            return this.time
        }
    },
    // 侦听器 用来检查时间是否归零
    watch: {
        time: function (newCountDown,oldCountDown) {
            // this.fullName = val + ' ' + this.lastName
            if (this.time == 0) {
                this.$router.push({ name: 'Login' })
            }
        },
    }
}
</script>
<style>
#logout {
    margin-top: 100px;
    font-size: xx-large;
    text-align: center;
    /* display: flex; */
    /* justify-content: center; */
    /* align-items: center; */
    font-weight: 700;
    color: #012ea5;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-line;
}
</style>
