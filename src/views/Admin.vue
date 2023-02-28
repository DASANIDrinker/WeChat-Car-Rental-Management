<template>
    <div>
        <el-row>
            <el-col :span="12" :offset="4">
                <el-input v-model="search" size="large" placeholder="输入关键字搜索" clearable autosize @input="inputChange">
                    <el-button icon="el-icon-search" size="small" slot="append" @click="searchFor"></el-button>
                </el-input>
            </el-col>
            <el-col :span="2" :offset="1">
                <el-button type="success" icon="el-icon-circle-plus" circle size="medium"
                    @click="showCreateDrawer = true">
                </el-button>
            </el-col>
        </el-row>

        <el-drawer title="创建新管理员" :before-close="handleCreateFormClose" :visible.sync="showCreateDrawer" direction="ltr"
            ref="drawerCreate" size="30%">
            <div v-loading="createFormLoading">
                <el-form :model="createForm">
                    <el-form-item label="管理员用户名" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.userName" autocomplete="off" size="medium"
                                placeholder="例:我是管理员" maxlength="11" minlength="1">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="管理员密码" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.passWord" autocomplete="off" size="medium"
                                placeholder="例:123456789" maxlength="10" minlength="1"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
                <div class="create-drawer-footer">
                    <el-button @click="cancelCreateForm" style="width: 150px">取 消</el-button>
                    <el-button @click="confirmCreateForm" type="primary" style="width: 150px">确定</el-button>
                </div>
            </div>
        </el-drawer>


        <el-row>
            <el-table :data="admins" ref="multipleTable" style="width:100%" height="1000" max-height="1200"
                :default-sort="{ prop: 'adminId', order: 'ascending' }" @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                </el-table-column>
                <el-table-column type="selection" width="55" fixed="left" prop="locationId">
                </el-table-column>
                <el-table-column prop="adminId" label="管理员ID" width="200" fixed="left" sortable>
                </el-table-column>
                <el-table-column prop="userName" label="管理员用户名" width="250"></el-table-column>
                <el-table-column prop="passWord" label="管理员密码" width="250"></el-table-column>
                <el-table-column width="150" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
                            @click="clickEditButton(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="deleteRecord(scope.row.adminId)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-row>


        <el-drawer title="编辑当前管理员" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
            ref="drawerEdit" size="30%">
            <div v-loading="editFormLoading">
                <el-form :model="editForm">
                    <el-form-item label="管理员ID" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.adminId" autocomplete="off" size="medium" placeholder="例:我是管理员"
                                maxlength="11" minlength="1" disabled>
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="管理员用户名" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.userName" autocomplete="off" size="medium" placeholder="例:我是管理员"
                                maxlength="11" minlength="1">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="管理员密码" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.passWord" autocomplete="off" size="medium"
                                placeholder="例:123456789" maxlength="10" minlength="1"></el-input>
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
    name: 'Admin',
    beforeRouteEnter: (to, from, next) => {
        console.log("管理员类")
        next((vm) => {
            vm.getAdmins();
        })
    },
    data() {
        return {
            admins: [],
            search: "",
            uselessAdmins: [],
            showCreateDrawer: false,
            createFormLoading: false,
            createForm: {
                userName: "",
                passWord: ""
            },
            showEditDrawer: false,
            editFormLoading: false,
            currentAdmin: {},
            editForm: {
                adminId: "",
                userName: "",
                passWord: ""
            },
            multipleSelection: [],
        }
    },
    methods: {
        async getAdmins() {
            // await this.axios.get('http://localhost:8081/admin/getAll')
            await this.axios.get('/api/admin/getAll')
                .then(res => {
                    this.admins = res.data
                    console.log(this.admins)
                }).catch(err => {
                    console.log(err)
                })
        },

        inputChange(e) {
            var uselessAdmins = []
            for (var i = 0; i < this.uselessAdmins.length; i++) {
                uselessAdmins.push(this.uselessAdmins[i][0])
            }
            this.admins = this.admins.concat(uselessAdmins)
            this.uselessAdmins = []
        },

        searchFor() {
            var admins = JSON.parse(JSON.stringify(this.admins))
            var count = 0
            for (var i = 0; i < admins.length; i++) {
                console.log(i)
                var adminId = admins[i].adminId.toString()
                var userName = admins[i].userName
                var passWord = admins[i].passWord

                //如果内容为null的话返回true 否则返回判断的值
                if ((adminId ? (adminId.match(this.search) == null) : true) &&
                    (userName ? (userName.match(this.search) == null) : true) &&
                    (passWord ? (passWord.match(this.search) == null) : true)) {
                    this.uselessAdmins.push(this.admins.splice(i - count, 1));
                    count++;
                }
            }
        },

        handleCreateFormClose() {
            this.showCreateDrawer = false
        },

        cancelCreateForm() {
            this.showCreateDrawer = false
        },

        async confirmCreateForm() {
            this.createFormLoading = true
            // await this.axios.post('http://localhost:8081/admin/createAdmin',
            await this.axios.post('/api/admin/createAdmin',
                this.createForm).then(res => {
                    console.log(res)
                    this.createFormLoading = false
                    if (res.status == 200) {
                        this.$message({
                            message: "管理员创造成功",
                            type: "success",
                        });
                        this.showCreateDrawer = false
                        var newAdmin = {
                            adminId: res.data.adminId,
                            userName: this.createForm.userName,
                            passWord: this.createForm.passWord,
                        }
                        this.admins.push(newAdmin);
                        this.clearCreateForm();
                    } else {
                        this.createFormLoading = false
                        this.$message.error("管理员创造失败");
                        this.showCreateDrawer = false
                        this.clearCreateForm();
                    }
                }).catch(err => {
                    console.log(err)
                    this.$message.error("管理员创造失败");
                    this.createFormLoading = false
                    this.createFormLoading = false
                    this.clearCreateForm();
                })

        },

        clearCreateForm() {
            this.createForm.userName = "",
                this.createForm.passWord = ""
        },


        clickEditButton(e) {
            this.currentAdmin = e
            this.setInitialEditForm(e)
        },

        setInitialEditForm(e) {
            this.showEditDrawer = true
            this.editForm.adminId = e.adminId,
                this.editForm.userName = e.userName,
                this.editForm.passWord = e.passWord
        },


        handleEditFormClose() {
            this.showEditDrawer = false
        },

        cancelEditForm() {
            this.showEditDrawer = false
        },

        async confirmEditForm() {
            this.editFormLoading = true
            // await this.axios.put('http://localhost:8081/admin/update',
            await this.axios.put('/api/admin/update',
                this.editForm).then(res => {
                    console.log(res)
                    this.editFormLoading = false
                    if (res.data == "success") {
                        console.log(111)
                        for (var i = 0; i < this.admins.length; i++) {
                            if (this.admins[i].adminId == this.currentAdmin.adminId) {
                                // console.log(123)
                                console.log(this.cu)
                                this.admins[i].adminId = this.editForm.adminId
                                this.admins[i].userName = this.editForm.userName
                                this.admins[i].passWord = this.editForm.passWord
                            }
                        }
                        // this.clearEditForm()
                        this.$message({
                            message: "管理员修改成功",
                            type: "success",
                        });
                        this.showEditDrawer = false
                    }
                    else {

                        this.$message.error("管理员修改失败");
                        // this.clearEditForm()
                        this.showEditDrawer = false
                    }
                }).catch(err => {
                    this.editFormLoading = false
                    this.$message.error("管理员修改失败");
                    // this.clearEditForm()
                    this.showEditDrawer = false
                })

        },

         handleSelectionChange(val) {
            this.multipleSelection = val
        },

        deleteRecord(e) {
            console.log(e)
            var adminId = [e]

            this.$msgbox({
                title: '提示',
                message: '此操作会删除选中管理员, 是否继续?',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',

                 beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        if (this.multipleSelection.length == 0) {
                            // this.axios.delete('http://localhost:8081/admin/delete',
                            this.axios.delete('/api/admin/delete',
                                { data: adminId }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除管理员成功',
                                            type: 'success'
                                        });
                                        for (var i = 0; i < this.admins.length; i++) {
                                            if (this.admins[i].adminId == e) {
                                                this.admins.splice(i, 1);
                                            }
                                        }
                                    } else {
                                        this.$message.error('管理员删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done()
                                }).catch(err => {
                                    console.log(err)
                                    instance.confirmButtonLoading = false
                                    this.$message.error('管理员删除有误');
                                    done()
                                })
                        } else {
                            var ids = []
                            for (var i = 0; i < this.multipleSelection.length; i++) {
                                ids.push(this.multipleSelection[i].adminId)
                            }
                            console.log(ids)
                            // this.axios.delete('http://localhost:8081/admin/delete',
                            this.axios.delete('/api/admin/delete',
                                { data: ids }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除管理员成功',
                                            type: 'success'
                                        });
                                        this.admins = this.admins.filter(item => ids.indexOf(item.adminId) == -1)
                                    } else {
                                        this.$message.error('管理员删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done();
                                }).catch(err => {
                                    console.log(err)
                                    this.$message.error('管理员删除有误');
                                    instance.confirmButtonLoading = false
                                    done();
                                })
                        }
                    }
                    if(action === 'cancel'){
                        done()
                    }
                }
            })
        }
    }
}
</script>
<style>
</style>
