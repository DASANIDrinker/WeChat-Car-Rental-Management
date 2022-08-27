<template>
    <div>
        <!-- 第一行 搜索和添加行 -->
        <el-row>
            <el-col :span="12" :offset="4">
                <el-input v-model="search" size="large" placeholder="输入关键字搜索" clearable autosize @input="inputChange">
                    <el-button icon="el-icon-search" size="small" slot="append" @click="searchFor"></el-button>
                </el-input>
            </el-col>
            <el-col :span="2" :offset="1">
                <el-button type="success" icon="el-icon-circle-plus" circle size="medium"
                    @click="showCreateDrawer = true"></el-button>
            </el-col>
        </el-row>

        <!-- 创造车辆品种的抽屉 -->
        <el-drawer title="创建新品类" :before-close="handleCreateFormClose" :visible.sync="showCreateDrawer" direction="ltr"
            ref="drawerCreate" size="30%">
            <div v-loading="createFormLoading">
                <el-form :model="createForm">
                    <el-form-item label="车辆品牌" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.brand" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="车辆型号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.model" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="排量" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.displacement" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="厢数" label-width="100px">
                        <el-select v-model="createForm.boxes" placeholder="请选择车辆厢数">
                            <el-option label="三厢" value="三厢"></el-option>
                            <el-option label="两厢" value="两厢"></el-option>
                            <el-option label="SUV" value="SUV"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="动力" label-width="100px">
                        <el-select v-model="createForm.power" placeholder="请选择车辆动力类型">
                            <el-option label="油车" value="油车"></el-option>
                            <el-option label="电车" value="电车"></el-option>
                            <el-option label="混合动力" value="混合动力"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="变速" label-width="100px">
                        <el-select v-model="createForm.auto" placeholder="请选择车辆变速">
                            <el-option label="手动挡" value="false"></el-option>
                            <el-option label="自动挡" value="true"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="座位数" label-width="100px">
                        <el-select v-model="createForm.seats" placeholder="请选择车辆座位数">
                            <el-option label="四座" value="4"></el-option>
                            <el-option label="五座" value="5"></el-option>
                            <el-option label="六座" value="6"></el-option>
                            <el-option label="七座" value="7"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="风格" label-width="100px">
                        <el-select v-model="createForm.style" placeholder="请选择车辆风格">
                            <el-option label="推荐" value="推荐"></el-option>
                            <el-option label="经济型" value="经济型"></el-option>
                            <el-option label="纯电动" value="纯电动"></el-option>
                            <el-option label="舒适型" value="舒适型"></el-option>
                            <el-option label="SUV" value="SUV"></el-option>
                            <el-option label="商务型" value="商务型"></el-option>
                            <el-option label="豪华型" value="豪华型"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否租满" label-width="100px">
                        <el-select v-model="createForm.full" placeholder="请选择租用情况">
                            <el-option label="已租满" value="true"></el-option>
                            <el-option label="空闲" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每天费用" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.feePerDay" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="车系" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="createForm.nation" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="全景天窗" label-width="100px">
                        <el-select v-model="createForm.sunroof" placeholder="请选择有无全景天窗">
                            <el-option label="有" value="true"></el-option>
                            <el-option label="无" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="真皮座椅" label-width="100px">
                        <el-select v-model="createForm.leather" placeholder="请选择有无真皮座椅">
                            <el-option label="有" value="true"></el-option>
                            <el-option label="无" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="倒车影像" label-width="100px">
                        <el-select v-model="createForm.camera" placeholder="请选择有无倒车影像">
                            <el-option label="有" value="true"></el-option>
                            <el-option label="无" value="false"></el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
                <div class="create-drawer-footer">
                    <el-button @click="cancelCreateForm" style="width: 150px">取 消</el-button>
                    <el-button @click="confirmCreateForm" type="primary" style="width: 150px">确定</el-button>
                </div>
            </div>

        </el-drawer>

        <!-- 第二行 数据展示行 包括table -->
        <el-row>
            <el-table :data="vehicleTypes" ref="multipleTable" style="width: 100%" height="1000" max-height="1200"
                :default-sort="{ prop: 'feePerDay', order: 'ascending' }" @selection-change="handleSelectionChange">
                <!-- 选择器列 -->
                <el-table-column type="selection" width="55" fixed="left" prop="vehicleTypeId">
                </el-table-column>
                <!-- 品牌列 -->
                <el-table-column prop="brand" label="品牌" width="150" fixed="left" :filters="brandFilterList"
                    :filter-method="filterBrand">
                </el-table-column>
                <!-- 型号列 -->
                <el-table-column prop="model" label="型号" width="150" fixed="left" :filters="modelFilterList"
                    :filter-method="filterModel"></el-table-column>
                <!-- 价格列 -->
                <el-table-column prop="feePerDay" label="价格/天" width="150" sortable>
                </el-table-column>
                <!-- 排量列 -->
                <el-table-column prop="displacement" label="排量" width="150" :filters="displacementFilterList"
                    :filter-method="filterDisplacement"></el-table-column>
                <!-- 是否为自动挡列  -->
                <el-table-column prop="isAuto" label="自动挡" width="150" :filters="[
                    { text: '自动挡', value: 'true' },
                    { text: '手动挡', value: 'false' },
                ]" :filter-method="filterTrueFalse" :formatter="formatterAuto"></el-table-column>
                <!-- 厢数列 -->
                <el-table-column prop="boxes" label="厢数" width="150" :filters="[
                    { text: '三厢', value: '三厢' },
                    { text: '两厢', value: '两厢' },
                    { text: 'SUV', value: 'SUV' }
                ]" :filter-method="filterBoxes">
                </el-table-column>
                <!-- 动力类型列 -->
                <el-table-column prop="power" label="动力类型" width="150" :filters="[
                    { text: '油车', value: '油车' },
                    { text: '电车', value: '电车' },
                    { text: '混合动力', value: '混合动力' }
                ]" :filter-method="filterPower">
                </el-table-column>
                <!-- 座位数 -->
                <el-table-column prop="seats" label="座位数" width="150" :filters="[
                    { text: '四座', value: '4' },
                    { text: '五座', value: '5' },
                    { text: '六座', value: '6' }
                ]" :filter-method="filterSeats">
                </el-table-column>
                <!-- 风格列 -->
                <el-table-column prop="style" label="风格" width="150" :filters="styleFilterList"
                    :filter-method="filterStyle">
                </el-table-column>
                <!-- 出租状态 -->
                <el-table-column prop="isFull" label="出租状态" width="150" :filters="[
                    { text: '满租', value: 'true' },
                    { text: '有闲车', value: 'false' }
                ]" :filter-method="filterIsFull" :formatter="formatterIsFull">
                </el-table-column>
                <!-- 车系 列 -->
                <el-table-column prop="nation" label="车系" width="150" :filters="nationFilterList"
                    :filter-method="filterNation">
                </el-table-column>
                <!-- 倒车影像列 -->
                <el-table-column prop="isCamera" label="倒车影像" width="150" :filters="[
                    { text: '有', value: 'true' },
                    { text: '无', value: 'false' },
                ]" :filter-method="filterTrueFalse" :formatter="formatter">
                </el-table-column>
                <!-- 全景天窗列 -->
                <el-table-column prop="isSunroof" label="全景天窗" width="150" :filters="[
                    { text: '有', value: 'true' },
                    { text: '无', value: 'false' },
                ]" :filter-method="filterTrueFalse" :formatter="formatter">
                </el-table-column>
                <!-- 真皮座椅列 -->
                <el-table-column prop="isLeather" label="真皮座椅" width="150" :filters="[
                    { text: '有', value: 'true' },
                    { text: '无', value: 'false' },
                ]" :filter-method="filterTrueFalse" :formatter="formatter">
                </el-table-column>
                <!-- 编辑按钮和删除按钮列 -->
                <el-table-column width="150" fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
                            @click="clickEditButton(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle
                            @click="deleteRecord(scope.row.vehicleTypeId)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>

        <!-- 编辑车辆品种的抽屉 -->
        <el-drawer title="编辑车辆" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
            ref="drawerEdit" size="30%">
            <div v-loading="editFormLoading">
                <el-form :model="editForm">
                    <el-form-item label="车辆品牌" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.brand" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="车辆型号" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.model" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="排量" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.displacement" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="厢数" label-width="100px">
                        <el-select v-model="editForm.boxes" placeholder="请选择车辆的厢数">
                            <el-option label="三厢" value="三厢"></el-option>
                            <el-option label="两厢" value="两厢"></el-option>
                            <el-option label="SUV" value="SUV"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="动力" label-width="100px">
                        <el-select v-model="editForm.power" placeholder="请选择车辆动力类型">
                            <el-option label="油车" value="油车"></el-option>
                            <el-option label="电车" value="电车"></el-option>
                            <el-option label="混合动力" value="混合动力"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="变速" label-width="100px">
                        <el-select v-model="editForm.isAuto" placeholder="请选择车辆变速">
                            <el-option label="手动挡" value="false"></el-option>
                            <el-option label="自动挡" value="true"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="座位数" label-width="100px">
                        <el-select v-model="editForm.seats" placeholder="请选择车辆座位数">
                            <el-option label="四座" value="4"></el-option>
                            <el-option label="五座" value="5"></el-option>
                            <el-option label="六座" value="6"></el-option>
                            <el-option label="七座" value="7"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="风格" label-width="100px">
                        <el-select v-model="editForm.style" placeholder="请选择车辆风格">
                            <el-option label="推荐" value="推荐"></el-option>
                            <el-option label="经济型" value="经济型"></el-option>
                            <el-option label="纯电动" value="纯电动"></el-option>
                            <el-option label="舒适型" value="舒适型"></el-option>
                            <el-option label="SUV" value="SUV"></el-option>
                            <el-option label="商务型" value="商务型"></el-option>
                            <el-option label="豪华型" value="豪华型"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否租满" label-width="100px">
                        <el-select v-model="editForm.isFull" placeholder="请选择租用情况">
                            <el-option label="已租满" value="true"></el-option>
                            <el-option label="空闲" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每天费用" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.feePerDay" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="车系" label-width="100px">
                        <el-col :span="16">
                            <el-input v-model="editForm.nation" autocomplete="off" size="medium"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="全景天窗" label-width="100px">
                        <el-select v-model="editForm.isSunroof" placeholder="请选择有无全景天窗">
                            <el-option label="有" value="true"></el-option>
                            <el-option label="无" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="真皮座椅" label-width="100px">
                        <el-select v-model="editForm.isLeather" placeholder="请选择有无真皮座椅">
                            <el-option label="有" value="true"></el-option>
                            <el-option label="无" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="倒车影像" label-width="100px">
                        <el-select v-model="editForm.isCamera" placeholder="请选择有无倒车影像">
                            <el-option label="有" value="true"></el-option>
                            <el-option label="无" value="false"></el-option>
                        </el-select>
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
    name: "VehicleType",
    beforeRouteEnter: (to, from, next) => {
        console.log("车辆品种类")
        next((vm) => {
            vm.getVehicleType();
        });
    },
    data() {
        return {
            // 所有汽车类型数据
            vehicleTypes: [],
            // 用来存放被筛选掉的数据
            uselessVehicleTypes: [],
            //各种筛选条件数组
            brandFilterList: [],
            modelFilterList: [],
            displacementFilterList: [],
            styleFilterList: [],
            nationFilterList: [],
            //搜索条
            search: "",
            //选择器选中数组
            multipleSelection: [],
            //显示创造抽屉
            showCreateDrawer: false,
            //创造抽屉
            createForm: {
                auto: "",
                boxes: "",
                brand: "",
                camera: "",
                displacement: "",
                feePerDay: "",
                full: "",
                leather: "",
                model: "",
                nation: "",
                power: "",
                seats: "",
                style: "",
                sunroof: ""
            },
            //创造抽屉的显示开关
            createFormLoading: false,
            showEditDrawer: false,
            editFormLoading: false,
            editForm: {
                isAuto: "",
                boxes: "",
                brand: "",
                isCamera: "",
                displacement: "",
                feePerDay: "",
                isFull: "",
                isLeather: "",
                model: "",
                nation: "",
                power: "",
                seats: "",
                style: "",
                isSunroof: ""
            },

            //当前选中的编辑行的vehicleTypeId
            currentType: ""

        }
    },
    methods: {
        // 获取车辆品种函数
        async getVehicleType() {
            try {
                await this.axios.get('http://localhost:8081/vehicle/getAllType')
                    .then(res => {
                        console.log(res)
                        this.vehicleTypes = res.data
                        for (var i = 0; i < this.vehicleTypes.length; i++) {
                            if (this.vehicleTypes[i].displacement == null) {
                                this.vehicleTypes[i].displacement = "无"
                            }
                        }
                        this.getFilterLists()
                    }).catch(err => {
                        console.log(err)
                    })
            } catch (err) {

            }
        },
        //获取车辆品种的型号 品牌 排量 风格 车系的筛选条件
        getFilterLists() {
            var uniqueBrandList = []
            var uniqueModelList = []
            var uniqueDisplacementList = []
            var uniqueStyleList = []
            var uniqueNationList = []
            for (var i = 0; i < this.vehicleTypes.length; i++) {

                if (uniqueBrandList.indexOf(this.vehicleTypes[i].brand) == -1) {
                    uniqueBrandList.push(this.vehicleTypes[i].brand);
                }
                if (uniqueModelList.indexOf(this.vehicleTypes[i].model) == -1) {
                    uniqueModelList.push(this.vehicleTypes[i].model);
                }
                if (uniqueDisplacementList.indexOf(this.vehicleTypes[i].displacement) == -1) {
                    uniqueDisplacementList.push(this.vehicleTypes[i].displacement);
                }
                if (uniqueStyleList.indexOf(this.vehicleTypes[i].style) == -1) {
                    uniqueStyleList.push(this.vehicleTypes[i].style);
                }
                if (uniqueNationList.indexOf(this.vehicleTypes[i].nation) == -1) {
                    uniqueNationList.push(this.vehicleTypes[i].nation);
                }
            }
            for (var i = 0; i < uniqueBrandList.length; i++) {
                uniqueBrandList[i] = {
                    text: uniqueBrandList[i],
                    value: uniqueBrandList[i]
                }
            }
            for (var i = 0; i < uniqueModelList.length; i++) {
                uniqueModelList[i] = {
                    text: uniqueModelList[i],
                    value: uniqueModelList[i]
                }
            }
            for (var i = 0; i < uniqueDisplacementList.length; i++) {
                uniqueDisplacementList[i] = {
                    text: uniqueDisplacementList[i],
                    value: uniqueDisplacementList[i]
                }
            }
            for (var i = 0; i < uniqueStyleList.length; i++) {
                uniqueStyleList[i] = {
                    text: uniqueStyleList[i],
                    value: uniqueStyleList[i]
                }
            }
            for (var i = 0; i < uniqueNationList.length; i++) {
                uniqueNationList[i] = {
                    text: uniqueNationList[i],
                    value: uniqueNationList[i]
                }
            }

            this.brandFilterList = uniqueBrandList
            this.modelFilterList = uniqueModelList
            this.displacementFilterList = uniqueDisplacementList
            this.styleFilterList = uniqueStyleList
            this.nationFilterList = uniqueNationList
        },



        // 格式化数据函数
        // 格式化普通true false函数
        formatter(row, column, cellValue, index) {
            // console.log(row[column.property])
            if (row[column.property] === true) {
                return "有"
            } else {
                return "无"
            }
        },
        //格式化车辆租赁状态函数
        formatterIsFull(row, column, cellValue, index) {
            // console.log(row)
            if (row[column.property] === true) {
                return "满租"
            } else {
                return "有空车"
            }
        },

        //格式化自动挡函数
        formatterAuto(row, column, cellValue, index) {
            if (row[column.property] === true) {
                return "自动挡"
            } else {
                return "手动挡"
            }
        },
        //格式化排量
        // formatterDisplacement(row,column,cellValue,index){
        //     if(row[column.property] === null){
        //         return "无"
        //     }else{
        //         return row[column.property];
        //     }
        // },


        //筛选函数
        filterBrand(value, row, column) {
            const property = column.property;
            var flag = row[property].match(value);
            if (flag != null) {
                return true
            } else {
                return false
            }
        },

        filterModel(value, row, column) {
            const property = column.property;
            var flag = row[property].match(value);
            if (flag != null) {
                return true
            } else {
                return false
            }
        },

        filterDisplacement(value, row, column) {
            const property = column.property;
            var flag = row[property].match(value);
            if (flag != null) {
                return true
            } else {
                return false
            }
        },

        filterTrueFalse(value, row, column) {
            console.log(value)
            const property = column.property;
            return row[property].toString() === value;
        },

        filterBoxes(value, row, column) {
            console.log(value)
            const property = column.property;
            var flag = row[property].match(value);
            if (flag != null) {
                return true
            } else {
                return false
            }
        },

        filterPower(value, row, column) {
            console.log(row.vehicleTypeId)
            console.log(row.brand)
            console.log(row.model)
            console.log(value)
            const property = column.property;
            var flag = row[property].match(value);
            if (flag != null) {
                return true
            } else {
                return false
            }
        },

        filterSeats(value, row, column) {
            console.log(row)
            console.log(value)
            const property = column.property;
            return row[property] == value
        },

        filterIsFull(value, row, column) {
            const property = column.property;
            return row[property].toString() === value;
        },

        filterNation(value, row, column) {
            const property = column.property;
            var flag = row[property].match(value);
            if (flag != null) {
                return true
            } else {
                return false
            }
        },

        filterStyle(value, row, column) {
            const property = column.property;
            return row[property] == value
        },

        //搜索函数
        searchFor() {
            var search = this.search
            var vehicleTypes = JSON.parse(JSON.stringify(this.vehicleTypes))
            var count = 0
            for (var i = 0; i < vehicleTypes.length; i++) {
                var auto = vehicleTypes[i].isAuto.toString()
                var boxes = vehicleTypes[i].boxes.toString()
                var brand = vehicleTypes[i].brand
                var camera = vehicleTypes[i].isCamera.toString()
                var displacement = vehicleTypes[i].displacement
                var feePerDay = vehicleTypes[i].feePerDay.toString()
                var full = vehicleTypes[i].isFull.toString()
                var leather = vehicleTypes[i].isLeather.toString()
                var model = vehicleTypes[i].model
                var nation = vehicleTypes[i].nation
                var power = vehicleTypes[i].power
                var seats = vehicleTypes[i].seats.toString()
                var style = vehicleTypes[i].style
                var sunroof = vehicleTypes[i].isSunroof.toString()

                if (
                    auto.match(search) == null &&
                    boxes.match(search) == null &&
                    brand.match(search) == null &&
                    camera.match(search) == null &&
                    displacement.match(search) == null &&
                    feePerDay.match(search) == null &&
                    full.match(search) == null &&
                    leather.match(search) == null &&
                    model.match(search) == null &&
                    nation.match(search) == null &&
                    power.match(search) == null &&
                    seats.match(search) == null &&
                    style.match(search) == null &&
                    sunroof.match(search) == null
                ) {

                    this.uselessVehicleTypes.push(this.vehicleTypes.splice(i - count, 1));
                    count++;
                }
            }
        },

        //搜索条输入改变触发的函数
        inputChange(e) {
            var uselessVehicleTypes = []
            for (var i = 0; i < this.uselessVehicleTypes.length; i++) {
                uselessVehicleTypes.push(this.uselessVehicleTypes[i][0]);
            }
            this.vehicleTypes = this.vehicleTypes.concat(uselessVehicleTypes)
            this.uselessVehicleTypes = []
        },


        //处理多选的函数
        handleSelectionChange(val) {
            console.log(val);
            this.multipleSelection = val;
            console.log(this.multipleSelection)
        },

        //创造车辆品牌的关闭函数
        handleCreateFormClose() {
            this.showCreateDrawer = false;
        },

        // 创造车辆品种抽屉的关闭按钮
        cancelCreateForm() {
            this.showCreateDrawer = false
        },

        // 创造车辆品种抽屉的确认按钮
        async confirmCreateForm() {
            console.log(this.createForm)
            var form = this.createForm

            // form = this.$qs.stringify(form);
            console.log(form)
            this.createFormLoading = true
            await this.axios.post('http://localhost:8081/vehicle/insertType',
                {
                    brand: form.brand,
                    model: form.model,
                    displacement: form.displacement,
                    isAuto: form.auto,
                    feePerDay: form.feePerDay,
                    boxes: form.boxes,
                    seats: form.seats,
                    style: form.style,
                    isFull: form.full,
                    nation: form.nation,
                    isCamera: form.camera,
                    isSunroof: form.sunroof,
                    isLeather: form.leather,
                    power: form.power
                }
            ).then(res => {
                this.createFormLoading = false;
                console.log(res)
                if (res.status == 200) {
                    this.$message({
                        message: "车辆品种创造成功",
                        type: "success",
                    });
                    this.showCreateDrawer = false
                    var newType = {
                        brand: form.brand,
                        model: form.model,
                        displacement: form.displacement,
                        isAuto: form.auto == "true" ? true : false,
                        feePerDay: form.feePerDay,
                        boxes: form.boxes,
                        seats: form.seats,
                        style: form.style,
                        isFull: form.full == "true" ? true : false,
                        nation: form.nation,
                        isCamera: form.camera == "true" ? true : false,
                        isSunroof: form.sunroof == "true" ? true : false,
                        isLeather: form.leather == "true" ? true : false,
                        power: form.power,
                        vehicleTypeId: res.data
                    }
                    this.vehicleTypes.push(newType)
                    console.log(this.vehicleTypes)
                    this.clearCreateForm();
                } else {
                    this.$message.error("车辆品种创造失败");
                    this.showCreateDrawer = false
                    this.clearCreateForm();
                }

            }).catch(err => {
                console.log(err)
                this.$message.error("车辆品种创造失败");
                this.showCreateDrawer = false
                this.clearCreateForm();
            })
        },

        //清空创建新品种的表单
        clearCreateForm() {
            this.createForm.auto = "";
            this.createForm.boxes = "";
            this.createForm.brand = "";
            this.createForm.camera = "";
            this.createForm.displacement = "";
            this.createForm.feePerDay = "";
            this.createForm.full = "";
            this.createForm.leather = "";
            this.createForm.model = "";
            this.createForm.nation = "";
            this.createForm.power = "";
            this.createForm.seats = "";
            this.createForm.style = "";
            this.createForm.sunroof = "";
        },



        //编辑车辆函数
        //编辑车辆品种的函数
        clickEditButton(e) {
            console.log(e)
            this.currentType = e
            console.log(this.currentType)
            this.setInitialEditForm(e)
            console.log(this.currentType.vehicleTypeId)
        },

        //设置每次点击编辑的当前行的数据 用于展示在editDrawer上
        setInitialEditForm(e) {
            this.showEditDrawer = true
            this.editForm.brand = e.brand
            this.editForm.model = e.model
            this.editForm.displacement = e.displacement
            this.editForm.boxes = e.boxes
            this.editForm.power = e.power
            this.editForm.isAuto = (e.isAuto == true ? "自动挡" : "手动挡")
            this.editForm.seats = e.seats
            this.editForm.style = e.style
            console.log(e.isFull)

            this.editForm.isFull = (e.isFull == true ? "已租满" : "空闲")
            console.log(this.editForm.isFull)
            this.editForm.feePerDay = e.feePerDay
            this.editForm.nation = e.nation
            this.editForm.isSunroof = (e.isSunroof == true ? "有" : "无")
            this.editForm.isLeather = (e.isLeather == true ? "有" : "无")
            this.editForm.isCamera = (e.isCamera == true ? "有" : "无")
            console.log(e)
        },

        async confirmEditForm() {

            var form = this.editForm
            console.log(form)
            this.editFormLoading = true
            await this.axios.put('http://localhost:8081/vehicle/updateType',
                {

                    brand: form.brand,
                    model: form.model,
                    displacement: form.displacement,
                    isAuto: form.isAuto,
                    feePerDay: form.feePerDay,
                    boxes: form.boxes,
                    seats: form.seats,
                    style: form.style,
                    isFull: form.isFull,
                    nation: form.nation,
                    isCamera: form.isCamera,
                    isSunroof: form.isSunroof,
                    isLeather: form.isLeather,
                    power: form.power,
                    vehicleTypeId: this.currentType.vehicleTypeId
                }).then(res => {
                    console.log(res)
                    if (res.data == "success") {
                        for (var i = 0; i < this.vehicleTypes.length; i++) {
                            if (this.vehicleTypes[i].vehicleTypeId == this.currentType.vehicleTypeId) {
                                this.vehicleTypes[i].brand = form.brand
                                this.vehicleTypes[i].model = form.model
                                this.vehicleTypes[i].displacement = form.displacement
                                this.vehicleTypes[i].isAuto = form.isAuto
                                this.vehicleTypes[i].feePerDay = form.feePerDay
                                this.vehicleTypes[i].boxes = form.boxes
                                this.vehicleTypes[i].seats = form.seats
                                this.vehicleTypes[i].style = form.style
                                this.vehicleTypes[i].isFull = form.isFull
                                this.vehicleTypes[i].nation = form.nation
                                this.vehicleTypes[i].isCamera = form.isCamera
                                this.vehicleTypes[i].isLeather = form.isLeather
                                this.vehicleTypes[i].isSunroof = form.isSunroof
                                this.vehicleTypes[i].power = form.power
                            }
                        }
                        // this.clearEditForm()
                        this.$message({
                            message: "车辆品类修改成功",
                            type: "success",
                        });
                        this.showEditDrawer = false
                        this.editFormLoading = false
                    } else {
                        this.$message.error("车辆修改失败");
                        // this.clearEditForm()
                        this.showEditDrawer = false
                        this.editFormLoading = false
                    }
                }).catch(err => {
                    console.log(err)
                    this.$message.error("车辆修改失败");
                    // this.clearEditForm()
                    this.showEditDrawer = false
                    this.editFormLoading = false
                })

        },

        cancelEditForm() {
            this.showEditDrawer = false
        },

        handleEditFormClose() {
            this.showEditDrawer = false
        },

        clearEditForm() {
            this.editForm.brand = ""
            this.editForm.model = ""
            this.editForm.displacement = ""
            this.editForm.boxes = ""
            this.editForm.power = ""
            this.editForm.isAuto = ""
            this.editForm.seats = ""
            this.editForm.style = ""
            this.editForm.isFull = ""
            this.editForm.feePerDay = ""
            this.editForm.nation = ""
            this.editForm.isSunroof = ""
            this.editForm.isLeather = ""
            this.editForm.isCamera = ""
        },
        //删除车辆品种的函数
        deleteRecord(e) {
            var vehicleType = [e]
            this.$msgbox({
                title: '提示',
                message: '此操作会删除选中车辆类型, 是否继续?',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        if (this.multipleSelection.length == 0) {
                            this.axios.delete('http://localhost:8081/vehicle/deleteType',
                                { data: vehicleType })
                                .then(res => {
                                    console.log(res)
                                    if (res.data == "success") {
                                        this.$message({
                                            message: '删除车辆类型成功',
                                            type: 'success'
                                        });
                                        for (var i = 0; i < this.vehicleTypes.length; i++) {
                                            if (this.vehicleTypes[i].vehicleTypeId == e) {
                                                this.vehicleTypes.splice(i, 1);
                                            }
                                        }
                                    } else {
                                        this.$message.error('车辆类型删除有误');
                                    }
                                    instance.confirmButtonLoading = false
                                    done()
                                }).catch(err => {
                                    console.log(err)
                                    this.$message.error('车辆类型删除有误');
                                    instance.confirmButtonLoading = false
                                    done()
                                })
                        } else {
                            console.log(111)
                            var vehicleTypes = []
                            for (var i = 0; i < this.multipleSelection.length; i++) {
                                vehicleTypes.push(this.multipleSelection[i].vehicleTypeId)
                            }
                            console.log(vehicleTypes)
                            this.axios.delete('http://localhost:8081/vehicle/deleteType',
                                { data: vehicleTypes }).then(res => {
                                    if (res.data == "success") {
                                        var tempTypes = JSON.parse(JSON.stringify(this.vehicleTypes))
                                        var count = 0
                                        console.log(this.vehicleTypes)
                                        //vehicleTypes为所有要删除的车辆的vehicleTypeId
                                        //this.vehicleTypes为所有车辆的实例
                                        //只有vehicleTypes.indexOf(item.vehicleTypeId) == -1为true的实例才留下
                                        //
                                        this.vehicleTypes = this.vehicleTypes.filter(item => vehicleTypes.indexOf(item.vehicleTypeId) == -1)
                                        console.log(this.vehicleTypes)
                                        this.$message({
                                            message: '删除车辆类型成功',
                                            type: 'success'
                                        });
                                        console.log(this.vehicleTypes)

                                    } else {
                                        this.$message.error('车辆类型删除有误');

                                    }
                                    instance.confirmButtonLoading = false
                                    done()
                                }).catch(err => {
                                    this.$message.error('车辆类型删除有误');
                                    instance.confirmButtonLoading = false
                                    done()
                                })
                        }
                    }
                    if (action === 'cancel') {
                        done()
                    }
                }
            })
        }
    }
};
</script>
<style>
.create-drawer-footer {
    /* position: fixed; */
    margin-bottom: 30px;
    widows: 80%;
    margin-left: 60px;
}
</style>
