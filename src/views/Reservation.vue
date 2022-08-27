<template>
    <div>
        <el-row>
            <el-col :span="12" :offset="4">
                <el-input v-model="search" size="large" placeholder="输入关键字搜索" clearable autosize @input="inputChange">
                    <el-button icon="el-icon-search" size="small" slot="append" @click="searchFor"></el-button>
                </el-input>
            </el-col>
        </el-row>

        <el-row>
            <el-table :data="reservations" ref="multipleTable" style="width:100%" height="1000" max-height="1200"
                :default-sort="{ prop: 'reservationId', order: 'ascending' }" @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                </el-table-column>
                <el-table-column type="selection" width="55" fixed="left" prop="reservationId">
                </el-table-column>
                <el-table-column prop="reservationId" label="预约ID" width="180" fixed="left" sortable>
                </el-table-column>
                <el-table-column prop="accessToken" label="用户登录凭证" width="150" fixed="left">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="150">
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="150"></el-table-column>
                <el-table-column prop="id" label="身份证号" width="150"></el-table-column>
                <el-table-column width="150" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
                            @click="clickEditButton(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle
                            @click="deleteRecord(scope.row.reservationId)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>



        <el-drawer title="编辑当前预约" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
            ref="drawerEdit" size="30%">
            <div v-loading="editFormLoading">
                <el-form :model="editForm">
                    <el-form-item label="预约ID" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.reservationId" autocomplete="off" size="medium" disabled>
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="用户登录凭证" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.accessToken" autocomplete="off" size="medium" disabled>
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="身份证号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.id" autocomplete="off" size="medium" placeholder="必填!身份证号"
                                >
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
    name: 'Reservation',
    beforeRouteEnter: (to, from, next) => {
        console.log("地址类")
        next((vm) => {
            vm.getReservation();
        })
    },
    data() {
        return {
            reservations: [],
            search: "",
            uselessReservation: [],
            showEditDrawer: false,
            editFormLoading: false,
            currentReservation: {},
            editForm: {
                reservationId: "",
                accessToken: "",
                phone: "",
                name: "",
                id: ""
            },
            multipleSelection: [],
        }
    },
    methods: {
        async getReservation() {
            this.axios.get('http://localhost:8081/reservation/findAll')
                .then(res => {
                    console.log(res)
                    this.reservations = res.data
                }).catch(err => {
                    console.log(err)
                })
        },

        searchFor() {
            var reservations = JSON.parse(JSON.stringify(this.reservations))
            var count = 0
            for (var i = 0; i < reservations.length; i++) {
                var reservationId = reservations[i].reservationId.toString();
                var accessToken = reservations[i].accessToken.toString();
                var id = reservations[i].id;
                var phone = reservations[i].phone;
                var name = reservations[i].name;

                if (reservationId.match(this.search) == null &&
                    accessToken.match(this.search) == null &&
                    id.match(this.search) == null &&
                    phone.match(this.search) == null &&
                    name.match(this.search) == null
                ) {
                    this.uselessReservation.push(this.reservations.splice(i - count, 1));
                    count++;
                }
            }
        },

        inputChange(e) {
            console.log(e)
            var uselessReservation = []
            for (var i = 0; i < this.uselessReservation.length; i++) {
                uselessReservation.push(this.uselessReservation[i][0])
            }
            this.reservations = this.reservations.concat(uselessReservation)
            this.uselessReservation = []
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        clickEditButton(e) {
            this.currentReservation = e
            this.setInitialEditForm(e)
        },

        handleEditFormClose() {
            this.showEditDrawer = false;
        },

        cancelEditForm() {
            this.showEditDrawer = false;
        },

        setInitialEditForm(e) {
            this.editForm.id = e.id
            this.editForm.phone = e.phone
            this.editForm.name = e.name
            this.editForm.reservationId = e.reservationId
            this.editForm.accessToken = e.accessToken

            this.showEditDrawer = true
        },

        async confirmEditForm() {
            this.editFormLoading = true
            await this.axios.put('http://localhost:8081/reservation/update',
                this.editForm).then(res => {
                    console.log(res)
                    this.editFormLoading = false
                    if (res.data == "success") {
                        console.log(111)
                        for (var i = 0; i < this.reservations.length; i++) {
                            if (this.reservations[i].reservationId == this.currentReservation.reservationId) {
                                console.log(123)
                                console.log(this.currentReservation)
                                this.reservations[i].name = this.editForm.name
                                this.reservations[i].phone = this.editForm.phone
                                this.reservations[i].id = this.editForm.id
                                this.reservations[i].accessToken = this.editForm.accessToken
                                this.reservations[i].reservationId = this.editForm.reservationId
                            }
                        }
                        // this.clearEditForm()
                        this.$message({
                            message: "预约修改成功",
                            type: "success",
                        });
                        this.showEditDrawer = false
                    }
                    else {
                        this.$message.error("预约修改失败");
                        // this.clearEditForm()
                        this.showEditDrawer = false
                    }
                }).catch(err => {
                    console.log(err)
                    this.editFormLoading = false
                    this.$message.error("预约修改失败");
                    // this.clearEditForm()
                    this.showEditDrawer = false
                })
        },

        deleteRecord(e) {
            console.log(e)
            var reservationId = [e]

            this.$msgbox({
                title: '提示',
                message: '此操作会删除选中预约, 是否继续?',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',

                 beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        if (this.multipleSelection.length == 0) {
                            this.axios.delete('http://localhost:8081/reservation/delete',
                                { data: reservationId }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除预约成功',
                                            type: 'success'
                                        });
                                        for (var i = 0; i < this.reservations.length; i++) {
                                            if (this.reservations[i].reservationId == e) {
                                                this.reservations.splice(i, 1);
                                            }
                                        }
                                    } else {
                                        this.$message.error('预约删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done()
                                }).catch(err => {
                                    console.log(err)
                                    instance.confirmButtonLoading = false
                                    this.$message.error('预约删除有误');
                                    done()
                                })
                        } else {
                            var ids = []
                            for (var i = 0; i < this.multipleSelection.length; i++) {
                                ids.push(this.multipleSelection[i].reservationId)
                            }
                            console.log(ids)
                            this.axios.delete('http://localhost:8081/reservation/delete',
                                { data: ids }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '预约地址成功',
                                            type: 'success'
                                        });
                                        this.reservations = this.reservations.filter(item => ids.indexOf(item.reservationId) == -1)
                                    } else {
                                        this.$message.error('预约删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done();
                                }).catch(err => {
                                    console.log(err)
                                    this.$message.error('预约删除有误');
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
.create-drawer-footer {
    position: fixed;
    bottom: 30px;
    widows: 80%;
    margin-left: 60px;
}
</style>
