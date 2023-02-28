<template>
    <el-container id="main">
        <el-aside width="200px">
            <el-menu :default-openeds="['1', '2', '3', '4', '5', '6', '7', '8']">
                <el-submenu index="1">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>业务逻辑</template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1">
                            <router-link to="/logic">业务逻辑说明</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>车辆管理</template>
                    <el-menu-item-group>
                        <!-- <el-menu-item index="1-1">
                            <router-link to="/vehicle">租用车辆</router-link>
                        </el-menu-item>
                        <el-menu-item index="1-2">
                            <router-link to="/vehicle">闲置车辆</router-link>
                        </el-menu-item> -->
                        <el-menu-item index="2-1">
                            <router-link to="/vehicle">车辆</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>车辆种类管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="3-1">
                            <router-link to="/vehicletype">车辆种类</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>用户管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="4-1">
                            <router-link to="/user">用户</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>司机管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="5-1">
                            <router-link to="/driver">司机</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <!-- <el-submenu index="6">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>证件管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="6-1">
                            <router-link to="/identification">证件</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu> -->
                <el-submenu index="7">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>地址管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="7-1">
                            <router-link to="/address">地址</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="8">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>订单管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="8-1">
                            <router-link to="/order">订单</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="9">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>预定管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="9-1">
                            <router-link to="/reservation">车辆预定</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="10">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>支付订单管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="10-1">
                            <router-link to="/paymentOrder">支付订单</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="11" v-if="$store.state.user.user.name == 13901054449">
                    <template slot="title" class="title"><i class="el-icon-s-tools"></i>管理员管理</template>
                    <el-menu-item-group>
                        <el-menu-item index="11-1">
                            <router-link to="/admin">管理员</router-link>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item>用户中心</el-dropdown-item> -->
                        <el-dropdown-item @click.native="logOut">退出登录</el-dropdown-item>
                        <!-- <el-dropdown-item>删除</el-dropdown-item> -->
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- 接收来自login的用户名 -->
                <!-- <span>{{ $route.params.name }}</span> -->
                <span>{{ $store.getters.getUser.name }}</span>
            </el-header>

            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    name: "Main",
    // beforeRouteEnter: (to, from, next) => {
        
    // },
    mounted(){
        console.log(this.$store.state)
    },
    methods: {
        //保存登录用户的信息
        saveState() {
            sessionStorage.setItem('state', JSON.stringify(this.$store.state.user))
            console.log(JSON.stringify(this.$store.state))
            console.log(JSON.parse(sessionStorage.getItem('state')))
            console.log(sessionStorage.getItem('state'))
            console.log(this.$store.state)
        },

        logOut(){
            console.log("登出中")
            this.$router.push({ name: 'Logout'})
        }
    }


};
</script>

<style>
.el-header {
    background-color: rgba(253, 185, 39, 255);
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.title {
    font-size: large;
    font-weight: 500;
}
</style>