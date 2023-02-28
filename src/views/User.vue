<template>
    <div>
        <!-- 第一行 -->
        <el-row>
            <el-col :span="12" :offset="4">
                <el-input v-model="search" size="large" placeholder="输入关键字搜索" clearable autosize @input="inputChange">
                    <el-button icon="el-icon-search" size="small" slot="append" @click="searchFor"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!-- 第二行 -->
        <el-row>
            <el-table :data="users" ref="multipleTable" style="width:100%" height="1000" max-height="1200"
                :default-sort="{ prop: 'phone', order: 'ascending' }" @selection-change="handleSelectionChange"
                @expand-change="handleExpandChange" :expand-row-keys="currentExpandRow" row-key="accessToken">
                <el-table-column type="selection" width="55" fixed="left" prop="phone">
                </el-table-column>


                <el-table-column type="expand">
                    <template slot-scope="props">
                        <!-- 
                        <el-tree :props="props" :load="loadNode" lazy @check-change="handleCheckChange">
                        </el-tree> -->


                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item v-for="driver in drivers" :key="driver.id" :label="driver.name">
                                <!-- <span>身份证:{{ driver.id }}</span>
                                <span>姓名:{{ driver.name }}</span>
                                <span>生日:{{ driver.birth }}</span>
                                <span>地址:{{ driver.address }}</span>
                                <span>性别:{{ driver.gender }}</span>
                                <span>国籍:{{ driver.nationality }}</span>
                                <span>准驾车型:{{ driver.carClass }}</span> -->

                                <!-- 这个span和上面的slot-scope="props"不能删 因为只有调用了props 数据才能及时更新
                                至于原理 嘿嘿 -->

                                <span>{{props.row.a}}</span>
                                身份证:{{ driver.id }}
                                姓名:{{ driver.name }}
                                生日:{{ driver.birth }}
                                地址:{{ driver.address }}
                                性别:{{ driver.gender }}
                                国籍:{{ driver.nationality }}
                                准驾车型:{{ driver.carClass }}
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>


                <el-table-column prop="phone" label="电话号码" width="200" sortable>
                </el-table-column>

                <el-table-column prop="openId" label="用户唯一标识" width="300">
                </el-table-column>

                <el-table-column prop="sessionKey" label="会话密钥" width="300">
                </el-table-column>

                <el-table-column prop="accessToken" label="用户登录凭证" width="200">
                </el-table-column>
                <el-table-column width="200" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
                            @click="clickEditButton(scope.row)"></el-button>
                        <!-- <el-button type="success" icon="el-icon-circle-plus" circle></el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 用户数据编辑抽屉 -->
        <el-drawer title="编辑用户" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
            ref="drawerEdit" size="30%">
            <div v-loading="editFormLoading">
                <el-form :model="editForm">
                    <el-form-item label="手机号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.phone" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户唯一标识" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.openId" autocomplete="off" size="medium" disabled></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="会话密钥" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.sessionKey" autocomplete="off" size="medium" disabled>
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户登录凭证" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.accessToken" autocomplete="off" size="medium" disabled>
                            </el-input>
                        </el-col>
                    </el-form-item>

                </el-form>
                <div class="create-drawer-footer">
                    <el-button @click="cancelEditForm" style="width: 150px">取 消</el-button>
                    <el-button @click="confirmEditForm" type="primary" style="width: 150px">确定</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>
<script>


export default {
    name: 'User',
    beforeRouteEnter: (to, from, next) => {
        console.log("进入页面之前")
        next((vm) => {
            vm.getUsers();
        })
    },
    data() {
        return {
            users: [],
            //关键字搜索的值
            search: "",
            //存储筛选掉的用户
            uselessUsers: [],

            showEditDrawer: false,
            editFormLoading: false,
            editForm: {
                phone: "",
                openId: "",
                accessToken: 0,
                sessionKey: ""
            },
            currentUser: "",
            multipleSelection: [],

            //当前选中用户的所有司机
            drivers: [],

            currentExpandRow: []

        }
    },
    methods: {
        async getUsers() {
            try {
                // await this.axios.get('http://localhost:8081/user/getAll')
                await this.axios.get('/api/user/getAll')
                    .then(res => {
                        console.log(res)
                        this.users = res.data
                    }).catch(err => {
                        console.log(err)
                    })
            } catch (err) {
                console.log(err)
            }
        },



        //搜索函数
        searchFor() {
            var users = JSON.parse(JSON.stringify(this.users))
            var count = 0
            for (var i = 0; i < users.length; i++) {
                var phone = users[i].phone;
                var openId = users[i].openId;
                var accessToken = users[i].accessToken.toString();
                var sessionKey = users[i].sessionKey
                if (phone.match(this.search) == null &&
                    openId.match(this.search) == null &&
                    accessToken.match(this.search) == null &&
                    sessionKey.match(this.search) == null) {
                    this.uselessUsers.push(this.users.splice(i - count, 1));
                    count++;
                }
            }
        },

        //搜索条输入改变触发的函数
        inputChange(e) {
            console.log(e)
            var uselessUsers = []
            for (var i = 0; i < this.uselessUsers.length; i++) {
                uselessUsers.push(this.uselessUsers[i][0])
            }
            this.users = this.users.concat(uselessUsers)
            this.uselessUsers = []
        },

        clickEditButton(e) {
            this.currentUser = e
            this.setInitialEditForm(e)
        },

        setInitialEditForm(e) {
            this.showEditDrawer = true
            this.editForm.phone = e.phone
            this.editForm.accessToken = e.accessToken
            this.editForm.sessionKey = e.sessionKey
            this.editForm.openId = e.openId
        },

        handleEditFormClose() {
            this.showEditDrawer = false
        },

        cancelEditForm() {
            this.showEditDrawer = false
        },

        async confirmEditForm() {
            var form = {
                phone: this.editForm.phone,
                accessToken: this.editForm.accessToken
            }
            form = this.$qs.stringify(form)
            this.editFormLoading = true
            // await this.axios.put('http://localhost:8081/user/updatePhone',
            await this.axios.post('/api/user/updatePhone',
                form)
                .then(res => {
                    console.log(res)
                    if (res.data == "success") {
                        for (var i = 0; i < this.users.length; i++) {
                            if (this.users[i].accessToken == this.currentUser.accessToken) {
                                this.users[i].phone = this.editForm.phone
                            }
                        }
                        this.$message({
                            message: "用户信息修改成功",
                            type: "success",
                        });
                        this.showEditDrawer = false
                        this.editFormLoading = false
                    } else {
                        this.$message.error("用户信息修改失败");
                        this.showEditDrawer = false
                        this.editFormLoading = false
                    }
                }).catch(err => {
                    console.log(err)
                    this.$message.error("用户信息修改失败");
                    this.showEditDrawer = false
                    this.editFormLoading = false
                })

        },

        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        //展开行
        async handleExpandChange(row, index) {
            console.log(this.currentExpandRow)
            console.log(index)
            console.log(row.accessToken)
            //我们的逻辑是每次只显示一个展开行的数据
            //如果当前的展开行钥匙(this.currentExpandRow)的第一个 也是唯一一个 存在的话
            //说明上次访问的是这个对象 我们现在打开是第二次访问所以直接清空数组 并返回
            const currentAT = this.currentExpandRow[0] ? this.currentExpandRow[0] : ''
            if (currentAT == row.accessToken) {
                this.currentExpandRow = []
                return
            }
            // 如果我们第一次访问的话 那么展开行钥匙为空 我们可以继续进行数据请求
            const newAT = row.accessToken
            this.currentExpandRow = [newAT]
            var accessToken = { accessToken: row.accessToken }
            accessToken = this.$qs.stringify(accessToken);
            // await this.axios.post('http://localhost:8081/driver/getDriversByAT',
            await this.axios.post('/api/driver/getDriversByAT',
                accessToken)
                .then(res => {
                    console.log(res)
                    // var drivers = res.data
                    //如果返回数据为空 
                    if (res.data.length == 0) {
                        //清空本地司机数组
                        this.drivers = []
                    }
                    //如果返回的有数据的话
                    else {
                        var drivers = res.data
                        for (var i = 0; i < drivers.length; i++) {
                            this.$set(this.drivers, i, drivers[i])
                        }
                    }
                    // this.currentExpandRow.push()

                    console.log(this.drivers)
                })
                .catch(err => {
                    console.log(err)
                })

            console.log(this.currentExpandRow)
        },
    }
}
</script>
<style>
.demo-table-expand {
    font-size: 0;
    /* height: 400px; */
}

.demo-table-expand label {
    width: 90px;
    color: black;
    font-size: large;
    font-weight: 550;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 35%;
    height: 350px;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-line;
}
</style>
