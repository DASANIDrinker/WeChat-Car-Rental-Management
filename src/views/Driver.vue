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

        <el-drawer title="创建新司机" :before-close="handleCreateFormClose" :visible.sync="showCreateDrawer" direction="ltr"
            ref="drawerCreate" size="30%">
            <div v-loading="createFormLoading">
                <el-form :model="createForm">
                    <el-form-item label="身份证号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.id" autocomplete="off" size="medium" placeholder="必填!身份证号">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="电话号码" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.phone" autocomplete="off" size="medium"
                                placeholder="例:136XXXXXXXX"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="姓名" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.name" autocomplete="off" size="medium" placeholder="例:刘伟">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="准驾车型" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.carClass" autocomplete="off" size="medium" placeholder="例:C1">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="生日" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.birth" autocomplete="off" size="medium"
                                placeholder="例:1966-06-02"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="地址" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.address" autocomplete="off" size="medium"
                                placeholder="北京市丰台区东方时尚"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="性别" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.gender" autocomplete="off" size="medium" placeholder="例:男">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="民族" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.nationality" autocomplete="off" size="medium" placeholder="汉">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户登录凭证" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.accessToken" autocomplete="off" size="medium"
                                placeholder="必填!请参考用户里的用户登录凭证"></el-input>
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
            <el-table :data="drivers" ref="multipleTable" style="width:100%" height="1000" max-height="1200"
                :default-sort="{ prop: 'id', order: 'ascending' }" @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                </el-table-column>
                <el-table-column type="selection" width="55" fixed="left" prop="vehicleTypeId">
                </el-table-column>
                <el-table-column prop="id" label="身份证号" width="180" fixed="left" sortable>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="150" fixed="left">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="150" fixed="left">
                </el-table-column>
                <el-table-column prop="carClass" label="准驾车型" width="150"></el-table-column>
                <el-table-column prop="birth" label="生日" width="150"></el-table-column>
                <el-table-column prop="address" label="地址" width="150"></el-table-column>
                <el-table-column prop="gender" label="性别" width="150"></el-table-column>
                <el-table-column prop="nationality" label="国籍" width="150"></el-table-column>
                <el-table-column prop="accessToken" label="用户登录凭证" width="150"></el-table-column>
                <el-table-column width="150" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
                            @click="clickEditButton(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="deleteRecord(scope.row.id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <el-drawer title="编辑当前司机" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
            ref="drawerEdit" size="30%">
            <div v-loading="editFormLoading">
                <el-form :model="editForm">
                    <el-form-item label="身份证号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.id" autocomplete="off" size="medium" placeholder="必填!身份证号"
                                :disabled="true">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="电话号码" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.phone" autocomplete="off" size="medium"
                                placeholder="例:136XXXXXXXX"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="姓名" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.name" autocomplete="off" size="medium" placeholder="例:刘伟">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="准驾车型" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.carClass" autocomplete="off" size="medium" placeholder="例:C1">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="生日" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.birth" autocomplete="off" size="medium"
                                placeholder="例:1966-06-02"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="地址" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.address" autocomplete="off" size="medium"
                                placeholder="北京市丰台区东方时尚"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="性别" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.gender" autocomplete="off" size="medium" placeholder="例:男">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="民族" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.nationality" autocomplete="off" size="medium" placeholder="汉">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户登录凭证" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.accessToken" autocomplete="off" size="medium"
                                placeholder="必填!请参考用户里的用户登录凭证" :disabled="true"></el-input>
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
    name: 'Driver',
    beforeRouteEnter: (to, from, next) => {
        console.log("司机类")
        next((vm) => {
            vm.getDrivers();
        })
    },
    data() {
        return {
            drivers: [],
            search: "",
            uselessDrivers: [],
            showCreateDrawer: false,
            createFormLoading: false,
            createForm: {
                id: "",
                phone: "",
                name: "",
                carClass: "",
                birth: "",
                address: "",
                gender: "",
                nationality: "",
                accessToken: ""
            },
            showEditDrawer: false,
            editFormLoading: false,
            currentDriver: {},
            editForm: {
                id: "",
                phone: "",
                name: "",
                carClass: "",
                birth: "",
                address: "",
                gender: "",
                nationality: "",
                accessToken: ""
            },
            multipleSelection: [],
        }
    },
    methods: {
        async getDrivers() {
            try {
                await this.axios.get('http://localhost:8081/driver/getAll')
                    .then(res => {
                        console.log(res);
                        this.drivers = res.data;
                    }).catch(err => {
                        console.log(err)
                    })
            } catch (err) {
                console.log(err)
            }
        },

        searchFor() {
            var drivers = JSON.parse(JSON.stringify(this.drivers))
            var count = 0
            for (var i = 0; i < drivers.length; i++) {
                var id = drivers[i].id;
                var phone = drivers[i].phone;
                var name = drivers[i].name;
                var carClass = drivers[i].carClass;
                var birth = drivers[i].birth;
                var address = drivers[i].address;
                var gender = drivers[i].gender;
                var nationality = drivers[i].nationality;

                if (id.match(this.search) == null &&
                    phone.match(this.search) == null &&
                    name.match(this.search) == null &&
                    carClass.match(this.search) == null &&
                    birth.match(this.search) == null &&
                    address.match(this.search) == null &&
                    gender.match(this.search) == null &&
                    nationality.match(this.search) == null) {
                    this.uselessDrivers.push(this.drivers.splice(i - count, 1));
                    count++;
                }
            }
        },

        inputChange(e) {
            console.log(e)
            var uselessDrivers = []
            for (var i = 0; i < this.uselessDrivers.length; i++) {
                uselessDrivers.push(this.uselessDrivers[i][0])
            }
            this.drivers = this.drivers.concat(uselessDrivers)
            this.uselessDrivers = []
        },

        handleCreateFormClose() {
            this.showCreateDrawer = false
        },

        cancelCreateForm() {
            this.showCreateDrawer = false
        },

        async confirmCreateForm() {
            this.createFormLoading = true
            await this.axios.post('http://localhost:8081/driver/uploadDriver',
                this.createForm
            ).then(res => {
                this.createFormLoading = false
                console.log(res)
                if (res.status == 200) {
                    this.$message({
                        message: "司机创造成功",
                        type: "success",
                    });
                    this.showCreateDrawer = false
                    var newDriver = {
                        id: this.createForm.id,
                        phone: this.createForm.phone,
                        name: this.createForm.name,
                        carClass: this.createForm.carClass,
                        birth: this.createForm.birth,
                        address: this.createForm.address,
                        gender: this.createForm.gender,
                        nationality: this.createForm.nationality,
                        accessToken: this.createForm.accessToken
                    }
                    this.drivers.push(newDriver);
                    this.clearCreateForm();
                } else {
                    this.$message.error("司机创造失败");
                    this.showCreateDrawer = false
                    this.clearCreateForm();
                }
            }).catch(err => {
                console.log(err)
                this.$message.error("车辆品种创造失败");
                this.createFormLoading = false
                this.createFormLoading = false
                this.clearCreateForm();
            })
        },

        clearCreateForm() {
            this.createForm.id = "",
                this.createForm.phone = "",
                this.createForm.name = "",
                this.createForm.carClass = "",
                this.createForm.birth = "",
                this.createForm.address = "",
                this.createForm.gender = "",
                this.createForm.nationality = "",
                this.createForm.accessToken = ""
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        clickEditButton(e) {
            this.currentDriver = e
            this.setInitialEditForm(e)
        },

        handleEditFormClose() {
            this.showEditDrawer = false;
        },

        cancelEditForm() {
            this.showEditDrawer = false;
        },

        async confirmEditForm() {
            this.editFormLoading = true
            await this.axios.put('http://localhost:8081/driver/update',
                this.editForm).then(res => {
                    console.log(res)
                    this.editFormLoading = false
                    if (res.data == "success") {
                        console.log(111)
                        for (var i = 0; i < this.drivers.length; i++) {
                            if (this.drivers[i].id == this.currentDriver.id) {
                                console.log(123)
                                console.log(this.currentDriver)
                                this.drivers[i].name = this.editForm.name
                                this.drivers[i].phone = this.editForm.phone
                                this.drivers[i].birth = this.editForm.birth
                                this.drivers[i].address = this.editForm.address
                                this.drivers[i].gender = this.editForm.gender
                                this.drivers[i].nationality = this.editForm.nationality
                                this.drivers[i].carClass = this.editForm.carClass
                            }
                        }
                        this.clearEditForm()
                        this.$message({
                            message: "用户修改成功",
                            type: "success",
                        });
                        this.showEditDrawer = false
                    }
                    else {
                        this.$message.error("用户修改失败");
                        this.clearEditForm()
                        this.showEditDrawer = false
                    }
                }).catch(err => {
                    console.log(err)
                    this.editFormLoading = false
                    this.$message.error("用户修改失败");
                    this.clearEditForm()
                    this.showEditDrawer = false
                })
        },

        setInitialEditForm(e) {
            this.editForm.id = e.id
            this.editForm.phone = e.phone
            this.editForm.name = e.name
            this.editForm.carClass = e.carClass
            this.editForm.birth = e.birth
            this.editForm.address = e.address
            this.editForm.gender = e.gender
            this.editForm.nationality = e.nationality
            this.editForm.accessToken = e.accessToken
            this.showEditDrawer = true
        },

        clearEditForm() {
            this.editForm.id = "",
                this.editForm.phone = "",
                this.editForm.name = "",
                this.editForm.carClass = "",
                this.editForm.birth = "",
                this.editForm.address = "",
                this.editForm.gender = "",
                this.editForm.nationality = "",
                this.editForm.accessToken = ""
        },

        deleteRecord(e) {
            console.log(e)
            var id = [e]

            this.$msgbox({
                title: '提示',
                message: '此操作会删除选中司机, 是否继续?',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',

                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        if (this.multipleSelection.length == 0) {
                            this.axios.delete('http://localhost:8081/driver/delete',
                                { data: id }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除司机成功',
                                            type: 'success'
                                        });
                                        for (var i = 0; i < this.drivers.length; i++) {
                                            if (this.drivers[i].id == e) {
                                                this.drivers.splice(i, 1);
                                            }
                                        }
                                    } else {
                                        this.$message.error('司机删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done()
                                }).catch(err => {
                                    console.log(err)
                                    instance.confirmButtonLoading = false
                                    this.$message.error('司机删除有误');
                                    done()
                                })
                        } else {
                            var ids = []
                            for (var i = 0; i < this.multipleSelection.length; i++) {
                                ids.push(this.multipleSelection[i].id)
                            }
                            console.log(ids)
                            this.axios.delete('http://localhost:8081/driver/delete',
                                { data: ids }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除司机成功',
                                            type: 'success'
                                        });
                                        this.drivers = this.drivers.filter(item => ids.indexOf(item.id) == -1)
                                    } else {
                                        this.$message.error('司机删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done();
                                }).catch(err => {
                                    console.log(err)
                                    this.$message.error('司机删除有误');
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
        },



    }
}
</script>
<style>
</style>
