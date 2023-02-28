<template>
    <div id="login">
        <el-form ref="form" :model="form" :rules="rules" class="login-box">
            <h3 class="login-title">欢迎登录</h3>
            <el-form-item label="账号" prop="name">
                <el-input type="text" placeholder="请输入用户名" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item class="login-button">
                <el-button typp="primary" @click="submitForm('form')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "Login",
    beforeRouteLeave: (to, from, next) => {
        // console.log(this.$store.state.user)
        next((vm) => {
            vm.saveState()
        })
        // this.saveState();
    },

    data() {
        return {
            form: {
                name: "",
                password: "",
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur",
                    },
                    {
                        min: 11,
                        max: 11,
                        message: "用户名为手机号长度必须为11个字符",
                        trigger: "blur"
                    },
                ],
                password: [
                    {
                        required: true,
                        message: "请输入密码",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 10,
                        message: "长度在 2 到 10 个字符",
                        trigger: "blur"
                    }
                ],
            },
        };
    },
    methods: {
         async submitForm(formName) {
            this.$refs[formName].validate(async valid => {
                if (valid) {
                    let isValid = await this.checkUserValid(this.form);
                    console.log(isValid)
                    // if (this.checkUserValid(this.form)) {
                    if (isValid) {
                        // 设置登录状态缓存
                        sessionStorage.setItem('isLogin', 'true');
                        // 设置vuex中的全局变量user的值
                        this.$store.dispatch("asyncUpdateUser", { name: this.form.name })
                        // 向Main组件导航 并且将用户名通过params传参到Main
                        this.$router.push({ name: 'Main', params: { name: this.form.name } })
                    } else {
                        this.$message.error('用户名或密码错误,请重新输入');
                    }
                } else {
                    this.$message.error('用户名或密码格式错误,请重新输入');
                    // return false;
                }
            });
        },

        async checkUserValid(e) {
            var form = {
                userName: e.name,
                passWord: e.password
            }
            let result = false
            // return new Promise((resolve, reject) => {
                await this.axios.post('/api/admin/check', form)
                // await this.axios.post('http://192.168.64.130:8081/admin/check', form)
                    .then(res => {
                        console.log(res.data)
                        if (res.data == 'success') {
                            // return true
                            result = true
                        } else {
                            // return false
                            result = false
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        // return false
                        result = false
                    })
            // });
            return result;
        },
    },
};
</script>

<style language ="scss" scoped>
.login-box {
    width: 350px;
    margin: 120px auto;
    border: 1px solid #dcdef6;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 30px #dcdef6;
}

.login-title {
    text-align: center;
}

.login-button {
    /* display: flex;
    justify-content: center; */
    text-align: center;
}
</style>