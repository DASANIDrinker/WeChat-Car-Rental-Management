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

        <el-drawer title="创建新地址" :before-close="handleCreateFormClose" :visible.sync="showCreateDrawer" direction="ltr"
            ref="drawerCreate" size="30%">
            <div v-loading="createFormLoading">
                <el-form :model="createForm">
                    <el-form-item label="地址概括" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.locationBrief" autocomplete="off" size="medium"
                                placeholder="地址概括">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="省份" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.province" autocomplete="off" size="medium"
                                placeholder="例:河北省"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="城市" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.city" autocomplete="off" size="medium" placeholder="例:保定市">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="区" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.district" autocomplete="off" size="medium"
                                placeholder="例:丰台区">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="街道" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.street" autocomplete="off" size="medium"
                                placeholder="例:金星西路19号"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="小区" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.community" autocomplete="off" size="medium"
                                placeholder="我爱我家小区">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="楼" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.building" autocomplete="off" size="medium"
                                placeholder="例:12号楼">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="门牌号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.room" autocomplete="off" size="medium" placeholder="例:401">
                            </el-input>
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
            <el-table :data="locations" ref="multipleTable" style="width:100%" height="1000" max-height="1200"
                :default-sort="{ prop: 'locationId', order: 'ascending' }" @selection-change="handleSelectionChange">
                <el-table-column type="expand">
                </el-table-column>
                <el-table-column type="selection" width="55" fixed="left" prop="locationId">
                </el-table-column>
                <el-table-column prop="locationId" label="地址ID" width="180" fixed="left" sortable>
                </el-table-column>
                <el-table-column prop="locationBrief" label="地址概括" width="150"></el-table-column>
                <el-table-column prop="province" label="省" width="150"></el-table-column>
                <el-table-column prop="city" label="市" width="150"></el-table-column>
                <el-table-column prop="district" label="区" width="150"></el-table-column>
                <el-table-column prop="street" label="街道" width="150"></el-table-column>
                <el-table-column prop="community" label="小区" width="150"></el-table-column>
                <el-table-column prop="building" label="楼" width="150"></el-table-column>
                <el-table-column prop="room" label="房间" width="150"></el-table-column>
                <el-table-column width="150" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
                            @click="clickEditButton(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle
                            @click="deleteRecord(scope.row.locationId)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-row>

        <el-drawer title="编辑地址" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
            ref="drawerEdit" size="30%">
            <div v-loading="editFormLoading">
                <el-form :model="editForm">
                    <el-form-item label="地址概括" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.locationBrief" autocomplete="off" size="medium"
                                placeholder="地址概括">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="省份" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.province" autocomplete="off" size="medium" placeholder="例:河北省">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="城市" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.city" autocomplete="off" size="medium" placeholder="例:保定市">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="区" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.district" autocomplete="off" size="medium" placeholder="例:丰台区">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="街道" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.street" autocomplete="off" size="medium"
                                placeholder="例:金星西路19号"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="小区" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.community" autocomplete="off" size="medium"
                                placeholder="我爱我家小区">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="楼" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.building" autocomplete="off" size="medium" placeholder="例:12号楼">
                            </el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="门牌号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.room" autocomplete="off" size="medium" placeholder="例:401">
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
    name: 'Address',
    beforeRouteEnter: (to, from, next) => {
        console.log("地址类")
        next((vm) => {
            vm.getLocations();
        })
    },
    data() {
        return {
            locations: [],
            search: "",
            uselessLocations: [],
            showCreateDrawer: false,
            createFormLoading: false,
            createForm: {
                locationBrief: "",
                province: "",
                city: "",
                district: "",
                street: "",
                community: "",
                building: "",
                room: ""
            },
            showEditDrawer: false,
            editFormLoading: false,
            currentLocation: {},
            editForm: {
                locationId: "",
                locationBrief: "",
                province: "",
                city: "",
                district: "",
                street: "",
                community: "",
                building: "",
                room: ""
            },
            multipleSelection: [],
        }
    },
    methods: {
        async getLocations() {
            try {
                await this.axios.get('http://localhost:8081/location/getAll')
                    .then(res => {
                        this.locations = res.data
                        console.log(this.locations)
                    })
            } catch (err) {
                console.log(err)
            }
        },

        inputChange(e) {
            var uselessLocation = []
            for (var i = 0; i < this.uselessLocations.length; i++) {
                uselessLocation.push(this.uselessLocations[i][0])
            }
            this.locations = this.locations.concat(uselessLocation)
            this.uselessLocations = []
        },

        searchFor() {
            var locations = JSON.parse(JSON.stringify(this.locations))
            var count = 0
            for (var i = 0; i < locations.length; i++) {
                console.log(i)
                var locationId = locations[i].locationId.toString()
                var locationBrief = locations[i].locationBrief
                var province = locations[i].province
                var city = locations[i].city
                var district = locations[i].district
                var street = locations[i].street
                var community = locations[i].community
                var building = locations[i].building
                var room = locations[i].room

                //如果内容为null的话返回true 否则返回判断的值
                if ((locationId ? (locationId.match(this.search) == null) : true) &&
                    (locationBrief ? (locationBrief.match(this.search) == null) : true) &&
                    (province ? (province.match(this.search) == null) : true) &&
                    (city ? (city.match(this.search) == null) : true) &&
                    (district ? (district.match(this.search) == null) : true) &&
                    (street ? (street.match(this.search) == null) : true) &&
                    (community ? (community.match(this.search) == null) : true) &&
                    (building ? (building.match(this.search) == null) : true) &&
                    (room ? (room.match(this.search) == null) : true)) {
                    this.uselessLocations.push(this.locations.splice(i - count, 1));
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
            await this.axios.post('http://localhost:8081/location/insert',
                this.createForm).then(res => {
                    console.log(res)
                    this.createFormLoading = false
                    if (res.status == 200) {
                        this.$message({
                            message: "地址创造成功",
                            type: "success",
                        });
                        this.showCreateDrawer = false
                        var newLocation = {
                            locationId: res.data,
                            locationBrief: this.createForm.locationBrief,
                            province: this.createForm.province,
                            city: this.createForm.city,
                            district: this.createForm.district,
                            street: this.createForm.street,
                            community: this.createForm.community,
                            building: this.createForm.building,
                            room: this.createForm.room
                        }
                        this.locations.push(newLocation);
                        this.clearCreateForm();
                    } else {
                        this.createFormLoading = false
                        this.$message.error("地址创造失败");
                        this.showCreateDrawer = false
                        this.clearCreateForm();
                    }
                }).catch(err => {
                    console.log(err)
                    this.$message.error("地址创造失败");
                    this.createFormLoading = false
                    this.createFormLoading = false
                    this.clearCreateForm();
                })

        },

        clearCreateForm() {
            // this.createForm.locationId = "",
            this.createForm.locationBrief = "",
                this.createForm.province = "",
                this.createForm.city = "",
                this.createForm.district = "",
                this.createForm.street = "",
                this.createForm.community = "",
                this.createForm.building = "",
                this.createForm.room = ""
        },

        clickEditButton(e) {
            this.currentLocation = e
            this.setInitialEditForm(e)
        },

        setInitialEditForm(e) {
            this.showEditDrawer = true
            this.editForm.locationId = e.locationId,
                this.editForm.locationBrief = e.locationBrief,
                this.editForm.province = e.province,
                this.editForm.city = e.city,
                this.editForm.district = e.district,
                this.editForm.street = e.street,
                this.editForm.community = e.community,
                this.editForm.building = e.building,
                this.editForm.room = e.room
        },

        handleEditFormClose() {
            this.showEditDrawer = false
        },

        cancelEditForm() {
            this.showEditDrawer = false
        },

        async confirmEditForm() {
            this.editFormLoading = true
            await this.axios.put('http://localhost:8081/location/update',
                this.editForm).then(res => {
                    console.log(res)
                    this.editFormLoading = false
                    if (res.data == "success") {
                        console.log(111)
                        for (var i = 0; i < this.locations.length; i++) {
                            if (this.locations[i].locationId == this.currentLocation.locationId) {
                                // console.log(123)
                                console.log(this.currentLocation)
                                this.locations[i].locationBrief = this.editForm.locationBrief
                                this.locations[i].province = this.editForm.province
                                this.locations[i].city = this.editForm.city
                                this.locations[i].district = this.editForm.district
                                this.locations[i].street = this.editForm.street
                                this.locations[i].community = this.editForm.community
                                this.locations[i].building = this.editForm.building
                                this.locations[i].room = this.editForm.room
                            }
                        }
                        this.clearEditForm()
                        this.$message({
                            message: "地址修改成功",
                            type: "success",
                        });
                        this.showEditDrawer = false
                    }
                    else {

                        this.$message.error("地址修改失败");
                        this.clearEditForm()
                        this.showEditDrawer = false
                    }
                }).catch(err => {
                    this.editFormLoading = false
                    this.$message.error("地址修改失败");
                    this.clearEditForm()
                    this.showEditDrawer = false
                })

        },

        clearEditForm() {
            this.editForm.locationId = "",
                this.editForm.locationBrief = "",
                this.editForm.province = "",
                this.editForm.city = "",
                this.editForm.district = "",
                this.editForm.street = "",
                this.editForm.community = "",
                this.editForm.building = "",
                this.editForm.room = ""
        },

        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        deleteRecord(e) {
            console.log(e)
            var locationId = [e]

            this.$msgbox({
                title: '提示',
                message: '此操作会删除选中地址, 是否继续?',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',

                 beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true
                        if (this.multipleSelection.length == 0) {
                            this.axios.delete('http://localhost:8081/location/delete',
                                { data: locationId }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除地址成功',
                                            type: 'success'
                                        });
                                        for (var i = 0; i < this.locations.length; i++) {
                                            if (this.locations[i].locationId == e) {
                                                this.locations.splice(i, 1);
                                            }
                                        }
                                    } else {
                                        this.$message.error('地址删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done()
                                }).catch(err => {
                                    console.log(err)
                                    instance.confirmButtonLoading = false
                                    this.$message.error('地址删除有误');
                                    done()
                                })
                        } else {
                            var ids = []
                            for (var i = 0; i < this.multipleSelection.length; i++) {
                                ids.push(this.multipleSelection[i].locationId)
                            }
                            console.log(ids)
                            this.axios.delete('http://localhost:8081/location/delete',
                                { data: ids }).then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除地址成功',
                                            type: 'success'
                                        });
                                        this.locations = this.locations.filter(item => ids.indexOf(item.locationId) == -1)
                                    } else {
                                        this.$message.error('地址删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done();
                                }).catch(err => {
                                    console.log(err)
                                    this.$message.error('地址删除有误');
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
