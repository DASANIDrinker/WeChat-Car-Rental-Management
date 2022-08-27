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
        <el-button type="success" icon="el-icon-circle-plus" circle size="medium" @click="showCreateDrawer = true">
        </el-button>
      </el-col>
    </el-row>

    <!-- 单独的创造数据的Drawer -->
    <el-drawer title="创建新车辆" :before-close="handleCreateFormClose" :visible.sync="showCreateDrawer" direction="ltr"
      custom-class="demo-drawer" ref="drawerCreate" size="30%">
      <div v-loading="createFormLoading">
        <el-form :model="createForm">
          <el-form-item label="车牌号" label-width="100px">
            <el-col :span="16">
              <el-input v-model="createForm.plateNumber" autocomplete="off" size="medium"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="ETC" label-width="100px">
            <el-select v-model="createForm.etc" placeholder="请选择有无ETC">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行车记录仪" label-width="100px">
            <el-select v-model="createForm.recorder" placeholder="请选择有无行车记录仪">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机支架" label-width="100px">
            <el-select v-model="createForm.mount" placeholder="请选择有无手机支架">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="雨伞" label-width="100px">
            <el-select v-model="createForm.umbrella" placeholder="请选择有无雨伞">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="租用状态" label-width="100px">
            <el-select v-model="createForm.occupied" placeholder="请选择租用状态">
              <el-option label="租用中" value="true"></el-option>
              <el-option label="空闲" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆品牌" label-width="100px">
            <el-select v-model="createForm.vehicleTypeId" placeholder="请选择车辆的品牌">
              <el-option v-for="type in vehicleTypeData" :key="type.vehicleTypeId" :label="type.brand + type.model"
                :value="type.vehicleTypeId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="create-drawer-footer">
          <el-button @click="cancelCreateForm" style="width: 150px">取 消</el-button>
          <el-button @click="confirmCreateForm" type="primary" style="width: 150px">确定</el-button>
        </div>
      </div>
    </el-drawer>

    <el-row>
      <el-table :data="vehiclesData" ref="multipleTable" style="width: 100%" height="1000" max-height="1200"
        :default-sort="{ prop: 'plateNumber', order: 'ascending' }" @selection-change="handleSelectionChange">
        <!-- 选择器列 -->
        <el-table-column type="selection" width="55" fixed="left" prop="vehicleId">
        </el-table-column>
        <!-- 车牌号列 -->
        <el-table-column prop="plateNumber" label="车牌号" width="150" fixed="left" sortable :filters="[
          { text: '京A', value: '京A' },
          { text: '京C', value: '京C' },
          { text: '京E', value: '京E' },
          { text: '京F', value: '京F' },
          { text: '京H', value: '京H' },
          { text: '京J', value: '京J' },
          { text: '京K', value: '京K' },
          { text: '京L', value: '京L' },
          { text: '京M', value: '京M' },
          { text: '京N', value: '京N' },
          { text: '京P', value: '京P' },
          { text: '京Q', value: '京Q' },
          { text: '京G', value: '京G' },
          { text: '京Y', value: '京Y' },
        ]" :filter-method="filterPlate">
        </el-table-column>
        <!-- ETC列 -->
        <el-table-column prop="isETC" label="ETC" width="150" :filters="[
          { text: '有', value: 'true' },
          { text: '无', value: 'false' },
        ]" :filter-method="filterETC" :formatter="formatter">
          <!-- <template slot-scope="scope">
        <el-select v-model="value" clearable :placeholder="scope.row.etc.toString()">
          <el-option value="有" label="有">有</el-option>
          <el-option value="无" label="无">无</el-option>
        </el-select>
      </template> -->
        </el-table-column>
        <!-- 手机支架列 -->
        <el-table-column prop="isMount" label="手机支架" width="150" :filters="[
          { text: '有', value: 'true' },
          { text: '无', value: 'false' },
        ]" :filter-method="filterMount" :formatter="formatter">
          <!-- <template slot-scope="scope">
        <el-select v-model="value" clearable :placeholder="scope.row.mount.toString()">
          <el-option value="有" label="有">有</el-option>
          <el-option value="无" label="无">无</el-option>
        </el-select>
      </template> -->
        </el-table-column>
        <!-- 行车记录仪列 -->
        <el-table-column prop="isRecorder" label="行车记录仪" width="150" :filters="[
          { text: '有', value: 'true' },
          { text: '无', value: 'false' },
        ]" :filter-method="filterRecorder" :formatter="formatter">
          <!-- <template slot-scope="scope">
        <el-select v-model="value" clearable :placeholder="scope.row.recorder.toString()">
          <el-option value="有" label="有">有</el-option>
          <el-option value="无" label="无">无</el-option>
        </el-select>
      </template> -->
        </el-table-column>
        <!-- 雨伞列 -->
        <el-table-column prop="isUmbrella" label="雨伞" width="150" :filters="[
          { text: '有', value: 'true' },
          { text: '无', value: 'false' },
        ]" :filter-method="filterUmbrella" :formatter="formatter">
          <!-- <template slot-scope="scope">
        <el-select v-model="value" clearable :placeholder="scope.row.umbrella.toString()">
          <el-option value="有" label="有">有</el-option>
          <el-option value="无" label="无">无</el-option>
        </el-select>
      </template> -->
        </el-table-column>
        <!-- 汽车品牌列 -->
        <el-table-column prop="vehicleType.brand" label="汽车品牌" width="150" :filters="vehicleBrandList"
          :filter-method="filterBrand">
          <!-- <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.vehicleType.brand.toString() }}</span>
      </template> -->
        </el-table-column>
        <!-- 汽车型号列 -->
        <el-table-column prop="vehicleType.model" label="汽车型号" width="150" :filters="vehicleModelList"
          :filter-method="filterModel">
          <!-- <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.vehicleType.model.toString() }}</span>
      </template> -->
        </el-table-column>
        <!-- 租用状态列 -->
        <el-table-column prop="isOccupied" label="租用状态" width="150" :filters="[
          { text: '空闲', value: 'false' },
          { text: '租用中', value: 'true' },
        ]" :filter-method="filterOccupied" :formatter="formatterOccupied">
        </el-table-column>
        <!-- <template slot-scope="scope">
        <el-select v-model="value" clearable :placeholder="scope.row.etc.toString()">
          <el-option value="空闲" label="空闲">有</el-option>
          <el-option value="租用中" label="租用中">无</el-option>
        </el-select>
      </template> -->
        <!-- 修改 删除列 -->
        <!-- 通过scope.row.vehicleId来获取当前行的汽车ID 从而用来删除 修改 -->
        <el-table-column width="150" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
              @click="clickEditButton(scope.row.vehicleId)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteRecord(scope.row.vehicleId)">
            </el-button>
            <!-- <el-button type="success" icon="el-icon-circle-plus" circle></el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 单独的修改数据的Drawer -->
    <el-drawer title="编辑车辆" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
      ref="drawerEdit" size="30%">
      <div v-loading="editFormLoading">
        <el-form :model="editForm">
          <el-form-item label="车牌号" label-width="100px">
            <el-col :span="16">
              <el-input v-model="editForm.plateNumber" autocomplete="off" size="medium" :disabled="true"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="ETC" label-width="100px">
            <el-select v-model="editForm.etc" placeholder="请选择有无ETC">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="行车记录仪" label-width="100px">
            <el-select v-model="editForm.recorder" placeholder="请选择有无行车记录仪">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机支架" label-width="100px">
            <el-select v-model="editForm.mount" placeholder="请选择有无手机支架">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="雨伞" label-width="100px">
            <el-select v-model="editForm.umbrella" placeholder="请选择有无雨伞">
              <el-option label="有" value="true"></el-option>
              <el-option label="无" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="租用状态" label-width="100px">
            <el-select v-model="editForm.occupied" placeholder="请选择租用状态">
              <el-option label="租用中" value="true"></el-option>
              <el-option label="空闲" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="车辆品牌" label-width="100px">
            <el-select v-model="editForm.vehicleTypeId" placeholder="请选择车辆的品牌">
              <el-option v-for="type in vehicleTypeData" :key="type.vehicleTypeId" :label="type.brand + type.model"
                :value="type.vehicleTypeId" :disabled="true">
              </el-option>
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
  name: "Vehicle",
  beforeRouteEnter: (to, from, next) => {
    console.log("进入车辆页面之前");
    next((vm) => {
      vm.getVehicle();
    });
  },
  beforeRouteLeave: (to, from, next) => {
    console.log("离开车辆页面之前");
    next();
  },
  data() {
    return {
      //所有汽车的数据
      vehiclesData: [],
      //   所有汽车品种数据
      vehicleTypeData: [],
      //   用来存放被筛选掉的数据
      uselessVehiclesData: [],
      //el-select 绑定的参数 可以获取选择器选择的值
      value: "",
      //不知道干啥的 貌似是多选的参数
      multipleSelection: [],
      //筛选汽车品牌的参数数组
      vehicleBrandList: [],
      // 筛选汽车型号的参数数组
      vehicleModelList: [],
      //搜索值
      search: "",
      //   显示编辑数据的Drawer的flag
      showEditDrawer: false,
      // 显示创造数据的Drawer的flag
      showCreateDrawer: false,
      // 创建数据的form 需要向里面填入数据
      createForm: {
        plateNumber: "",
        etc: "",
        mount: "",
        occupied: "",
        recorder: "",
        umbrella: "",
        vehicleTypeId: "",
      },
      //   创建车辆form的加载flag
      createFormLoading: false,
      // 修改数据的form 需要向里面填入数据
      editForm: {
        etc: "",
        mount: "",
        occupied: "",
        recorder: "",
        umbrella: "",
      },
      // 编辑车辆的加载flag
      editFormLoading: false,
      // 当前要修改或删除的行的vehicleId
      currentId: "",
      //行数的选择器
      multipleSelection: []
    };
  },
  props: {
    vehiclesProps: [],
  },
  methods: {
    //进入页面之前执行的函数
    //获取车辆
    async getVehicle() {
      try {
        await this.axios({
          method: "GET",
          url: "http://localhost:8081/vehicle/getAll",
        }).then((res) => {
          console.log(res);
          this.vehiclesData = res.data;
          for (var i = 0; i < this.vehiclesData.length; i++) {
            console.log(this.vehiclesData[i].plateNumber);
          }
        });
        await this.axios({
          method: "GET",
          url: "http://localhost:8081/vehicle/getAllType",
        }).then((res) => {
          this.vehicleTypeData = res.data;
        });
        // await this.translateData();
        await this.getFilterList();
      } catch (err) {
        console.log(err);
      }
    },
    //将车辆数据转化为方便阅读的中文
    translateData() {
      console.log(111);
      for (var i = 0; i < this.vehiclesData.length; i++) {
        if (this.vehiclesData[i].etc) {
          this.vehiclesData[i].etc = "有";
        } else {
          this.vehiclesData[i].etc = "无";
        }
        if (this.vehiclesData[i].mount) {
          this.vehiclesData[i].mount = "有";
        } else {
          this.vehiclesData[i].mount = "无";
        }
        if (this.vehiclesData[i].umbrella) {
          this.vehiclesData[i].umbrella = "有";
        } else {
          this.vehiclesData[i].umbrella = "无";
        }
        if (this.vehiclesData[i].recorder) {
          this.vehiclesData[i].recorder = "有";
        } else {
          this.vehiclesData[i].recorder = "无";
        }
        if (this.vehiclesData[i].occupied) {
          this.vehiclesData[i].occupied = "租用中";
        } else {
          this.vehiclesData[i].occupied = "空闲";
        }
      }
    },
    // 获取汽车品牌和汽车型号的筛选数组
    getFilterList() {
      var uniqueBrandList = [];
      var uniqueModelList = [];
      for (var i = 0; i < this.vehiclesData.length; i++) {
        console.log(this.vehiclesData[i].vehicleType);
        // 检查uniqueBrandList里面是否有当前的brand 如果没有则录入uniqueBrandList数组
        if (
          uniqueBrandList.indexOf(this.vehiclesData[i].vehicleType.brand) == -1
        ) {
          uniqueBrandList.push(this.vehiclesData[i].vehicleType.brand);
        }
        if (
          uniqueModelList.indexOf(this.vehiclesData[i].vehicleType.model) == -1
        ) {
          uniqueModelList.push(this.vehiclesData[i].vehicleType.model);
        }
      }
      for (var i = 0; i < uniqueBrandList.length; i++) {
        uniqueBrandList[i] = {
          text: uniqueBrandList[i],
          value: uniqueBrandList[i],
        };
      }
      for (var i = 0; i < uniqueModelList.length; i++) {
        uniqueModelList[i] = {
          text: uniqueModelList[i],
          value: uniqueModelList[i],
        };
      }
      this.vehicleBrandList = uniqueBrandList;
      this.vehicleModelList = uniqueModelList;
      console.log(this.vehicleBrandList);
      console.log(this.vehicleModelList);
    },

    //处理多选的函数
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
      console.log(this.multipleSelection)
    },

    //格式化内容函数
    //修改table里的数据的展示方式 true=>有 false=>无
    formatter(row, column, cellValue, index) {
      //   console.log(row);
      //   console.log(column);
      if (row[column.property] === true) {
        return "有";
      } else {
        return "无";
      }
    },
    //修改table里的数据的展示方式 true=>租用中 false=>空闲
    formatterOccupied(row, column, cellValue, index) {
      if (row[column.property] === true) {
        return "租用中";
      } else {
        return "空闲";
      }
    },

    //筛选函数
    //筛选车牌号
    filterPlate(value, row, column) {
      //这一行为固定流程
      const property = column["property"];
      //检查每一行是否有table columns里的filters里面的value
      var flag = row[property].match(value);
      //flag返回value在row[peoperty]里的位置
      //如果位置不为null 也就是存在的话 返回true 当前行显示
      if (flag != null) {
        return true;
      }
      //否则返回false 不显示当前行
      else {
        return false;
      }
    },
    //筛选ETC
    filterETC(value, row, column) {
      const property = column["property"];
      return row[property].toString() === value;
    },
    //筛选行车记录仪
    filterRecorder(value, row, column) {
      const property = column["property"];
      return row[property].toString() === value;
    },
    //筛选手机支架
    filterMount(value, row, column) {
      const property = column["property"];
      return row[property].toString() === value;
    },
    //筛选雨伞
    filterUmbrella(value, row, column) {
      console.log(column["property"]);
      const property = column["property"];
      return row[property].toString() === value;
    },
    //筛选租用状态
    filterOccupied(value, row, column) {
      const property = column["property"];
      return row[property].toString() === value;
    },
    // 筛选汽车品牌
    filterBrand(value, row, column) {
      // console.log(row)
      // console.log(column)
      // console.log(value)
      return row["vehicleType"].brand === value;
    },
    // 筛选汽车型号
    filterModel(value, row, column) {
      //   console.log(property);
      return row["vehicleType"].model === value;
    },

    //搜索函数
    searchFor() {
      var search = this.search;
      console.log(search);
      //深拷贝避免浅拷贝将两个数组都修改
      var vehiclesData = JSON.parse(JSON.stringify(this.vehiclesData));
      console.log(vehiclesData);
      //用来储存切过的次数
      var count = 0;
      for (var i = 0; i < vehiclesData.length; i++) {
        var plateNumber = vehiclesData[i].plateNumber;
        var mount = vehiclesData[i].isMount.toString();
        var etc = vehiclesData[i].isETC.toString();
        var recorder = vehiclesData[i].isRecorder.toString();
        var umbrella = vehiclesData[i].isUmbrella.toString();
        var occupied = vehiclesData[i].isOccupied.toString();
        var vehicleBrand = vehiclesData[i].vehicleType.brand;
        var vehicleModel = vehiclesData[i].vehicleType.model;

        console.log(vehicleModel);

        // 如果所有选项均不含关键词 那就将其放入uselessVehicle数组
        //uselessVehicle数组用来储存筛选掉的数组
        if (
          plateNumber.match(search) == null &&
          mount.match(search) == null &&
          etc.match(search) == null &&
          recorder.match(search) == null &&
          umbrella.match(search) == null &&
          occupied.match(search) == null &&
          vehicleBrand.match(search) == null &&
          vehicleModel.match(search) == null
        ) {
          this.uselessVehiclesData.push(this.vehiclesData.splice(i - count, 1));
          count++;
        }
      }
      console.log(this.vehiclesData);
      console.log(this.uselessVehiclesData);
      console.log(this.search);
    },

    //输入改变的函数
    //强制刷新搜索输入的值 因为嵌套的缘故 输入的搜索值不显示
    inputChange(e) {
      //假如输入有变化的话 将无用数组重新放回主数组vehiclesData
      var uselessVehiclesData = [];
      console.log(this.uselessVehiclesData);
      for (var i = 0; i < this.uselessVehiclesData.length; i++) {
        uselessVehiclesData.push(this.uselessVehiclesData[i][0]);
      }
      this.vehiclesData = this.vehiclesData.concat(uselessVehiclesData);
      this.uselessVehiclesData = [];

      //强制刷新
      //   this.$forceUpdate();
    },

    //Drawer函数 对应Create Drawer
    handleCreateFormClose() {
      this.showCreateDrawer = false;
    },
    // 点击Create Drawer里面的确认按钮
    async confirmCreateForm() {
      this.createFormLoading = true;
      console.log(this.createForm);
      await this.axios({
        url: "http://localhost:8081/vehicle/insert",
        data: {
          plateNumber: JSON.stringify(this.createForm.plateNumber),
          etc: JSON.stringify(this.createForm.etc),
          mount: JSON.stringify(this.createForm.mount),
          recorder: JSON.stringify(this.createForm.recorder),
          umbrella: JSON.stringify(this.createForm.umbrella),
          occupied: JSON.stringify(this.createForm.occupied),
          vehicleTypeId: JSON.stringify(this.createForm.vehicleTypeId),
        },
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        method: "POST",
      })
        .then((res) => {
          console.log(res);
          this.createFormLoading = false;
          if (res.status == 200) {
            this.$message({
              message: "车辆创造成功",
              type: "success",
            });

            this.showCreateDrawer = false;
            var newVehicle = {
              isETC: this.createForm.etc == "true" ? true : false,
              isMount: this.createForm.mount == "true" ? true : false,
              isOccupied: this.createForm.occupied == "true" ? true : false,
              isRecorder: this.createForm.recorder == "true" ? true : false,
              isUmbrella: this.createForm.umbrella == "true" ? true : false,
              plateNumber: this.createForm.plateNumber,
              vehicleId: res.data,
              vehicleType: this.createForm.vehicleType
            };
            console.log(newVehicle)
            this.vehiclesData.push(newVehicle);
            this.clearCreateForm();
          } else {
            this.$message.error("车辆创造失败");
            this.showCreateDrawer = false
            this.clearCreateForm();
          }

        })
        .catch((err) => {
          this.createFormLoading = false;
          this.$message.error("车辆创造失败");
          console.log(err);
          this.showCreateDrawer = false
          this.clearCreateForm();
        });
    },
    // 点击Create Drawer里面的取消按钮
    cancelCreateForm() {
      this.showCreateDrawer = false;
      this.clearCreateForm();
    },

    //清空createForm
    clearCreateForm() {
      this.createForm.plateNumber = "";
      this.createForm.etc = "";
      this.createForm.mount = "";
      this.createForm.occupied = "";
      this.createForm.recorder = "";
      this.createForm.umbrella = "";
      this.createForm.vehicleTypeId = "";
    },


    //对应Edit Drawer
    //Edit Drawer关闭函数
    handleEditFormClose() {
      this.showEditDrawer = false;
    },
    //编辑界面的取消按钮函数
    cancelEditForm() {
      this.showEditDrawer = false;
    },
    //确定界面的确定按钮函数
    confirmEditForm() {
      this.editFormLoading = true;
      console.log(this.editForm);
      var stringifyData = this.$qs.stringify({
        etc: this.editForm.etc,
        mount: this.editForm.mount,
        recorder: this.editForm.recorder,
        umbrella: this.editForm.umbrella,
        occupied: this.editForm.occupied,
        vehicleId: this.currentId,
      });
      console.log(stringifyData);
      this.axios.put(
        'http://localhost:8081/vehicle/update',
        stringifyData
        // {params: {}},
      )
        .then((res) => {
          console.log(res);
          this.editFormLoading = false;
          if (res.data == "success") {
            console.log(this.currentId)
            for (var i = 0; i < this.vehiclesData.length; i++) {
              if (this.vehiclesData[i].vehicleId == this.currentId) {
                this.vehiclesData[i].isETC = (this.editForm.etc === 'true')
                this.vehiclesData[i].isRecorder = (this.editForm.recorder === 'true')
                this.vehiclesData[i].isMount = (this.editForm.mount === 'true')
                this.vehiclesData[i].isUmbrella = (this.editForm.umbrella === 'true')
                this.vehiclesData[i].isOccupied = (this.editForm.occupied === 'true')
                console.log(this.vehiclesData[i])
              }
            }
            this.clearEditForm()
            this.$message({
              message: "车辆修改成功",
              type: "success",
            });
            this.showEditDrawer = false
          } else {
            this.$message.error("车辆修改失败");
            this.clearEditForm()
            this.showEditDrawer = false
          }
          this.showEditDrawer = false;
        })
        .catch((err) => {
          this.editFormLoading = false;
          this.$message.error("车辆编辑失败");
          console.log(err);
          this.showEditDrawer = false;
        });
    },
    //点击编辑按钮
    clickEditButton(e) {
      this.showEditDrawer = true;
      console.log(e);
      this.currentId = e;
      console.log(this.currentId);
    },
    // 清空编辑栏
    clearEditForm() {
      this.editForm.etc = "";
      this.editForm.mount = "";
      this.editForm.occupied = "";
      this.editForm.recorder = "";
      this.editForm.umbrella = "";
    },

    //删除车辆按钮函数
    deleteRecord(e) {
      console.log(e)
      var vehicleID = [e]
      console.log(vehicleID)
      // var stringifyData = this.$qs.stringify({ vehicleId: vehicleID });
      // console.log(stringifyData)
      // 提示框
      this.$msgbox({
        title: '提示',
        message: '此操作会删除选中车辆, 是否继续?',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // done函数代表关闭 提示框
        beforeClose: (action, instance, done) => {
          // 如果点击确认
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            // 如果没有多选的话 只删除选中的那一个
            if (this.multipleSelection.length == 0) {
              this.axios.delete(
                'http://localhost:8081/vehicle/delete',
                { data: vehicleID },
              ).then(res => {
                console.log(res)
                if (res.data == "success") {
                  this.$message({
                    message: '删除车辆成功',
                    type: 'success'
                  });
                  for (var i = 0; i < this.vehiclesData.length; i++) {
                    if (this.vehiclesData[i].vehicleId == e) {
                      this.vehiclesData.splice(i, 1);
                    }
                  }

                } else {
                  this.$message.error('车辆删除有误');
                }
                instance.confirmButtonLoading = false
                done();
              }).catch(err => {
                console.log(err)
                done()
                instance.confirmButtonLoading = false
                this.$message.error('车辆删除有误');
              })

            }
            // 如果是多选的话
            else {
              console.log(1111)
              var vehicleIds = []
              for (var i = 0; i < this.multipleSelection.length; i++) {
                // var element = {vehicleId:this.multipleSelection[i].vehicleId}
                vehicleIds.push(this.multipleSelection[i].vehicleId);
              }
              console.log(vehicleIds)
              this.axios.delete(
                'http://localhost:8081/vehicle/delete',
                { data: vehicleIds }
              ).then(res => {
                console.log(res)
                if (res.data == "success") {
                  this.vehiclesData = this.vehiclesData.filter(item => vehicleIds.indexOf(item.vehicleId) == -1)
                  console.log(this.vehiclesData)
                  this.$message({
                    message: '删除车辆成功',
                    type: 'success'
                  });
                } else {
                  this.$message.error('车辆删除有误');
                }
                instance.confirmButtonLoading = false
                done();
              }).catch(err => {
                console.log(err)
                done()
                instance.confirmButtonLoading = false
                this.$message.error('车辆删除有误');
              })
            }

          }
          // 如果点击取消
          if (action === 'cancel') {
            done()
          }
        }
      }).catch(() => { })

    },
  },
};
</script>
<style>
.create-drawer-footer {
  position: fixed;
  bottom: 30px;
  widows: 80%;
  margin-left: 60px;
}

body {
  margin: 0;
}
</style>
