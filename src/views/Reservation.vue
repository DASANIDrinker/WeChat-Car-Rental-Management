<template>
  <div>
    <el-row>
      <el-col :span="12" :offset="4">
        <el-input
          v-model="search"
          size="large"
          placeholder="输入关键字搜索"
          clearable
          autosize
          @input="inputChange"
        >
          <el-button
            icon="el-icon-search"
            size="small"
            slot="append"
            @click="searchFor"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

    <el-row>
      <el-table
        :data="reservations"
        ref="multipleTable"
        style="width: 100%"
        height="1000"
        max-height="1200"
        :default-sort="{ prop: 'reservationId', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand"> </el-table-column>
        <el-table-column
          type="selection"
          width="55"
          fixed="left"
          prop="reservationId"
        >
        </el-table-column>
        <el-table-column
          prop="reservationId"
          label="预约ID"
          width="180"
          fixed="left"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="accessToken"
          label="用户登录凭证"
          width="150"
          fixed="left"
        >
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="150">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="id"
          label="身份证号"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="paymentOrderInfo.outTradeNo"
          label="商户订单号"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="pickupLocation.locationBrief"
          label="取车地址"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="dropoffLocation.locationBrief"
          label="还车地址"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="startDate"
          label="取车日期"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="endDate"
          label="还车日期"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="vehicle.plateNumber"
          label="车牌号"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="vehicle.vehicleId"
          label="车辆ID"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="vehicleType.vehicleTypeId"
          label="车型ID"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="vehicleType.brand"
          label="车辆品牌"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="vehicleType.model"
          label="车辆型号"
          width="150"
        ></el-table-column>
        <el-table-column width="150" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              style="margin-left: 20px"
              @click="clickEditButton(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteRecord(scope.row.reservationId)"
            >
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-drawer
      title="编辑当前预约"
      :before-close="handleEditFormClose"
      :visible.sync="showEditDrawer"
      direction="ltr"
      ref="drawerEdit"
      size="30%"
    >
      <div v-loading="editFormLoading">
        <el-form :model="editForm">
          <el-form-item label="预约ID" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.reservationId"
                autocomplete="off"
                size="medium"
                disabled
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="身份证号" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.id"
                autocomplete="off"
                size="medium"
                placeholder="必填!身份证号"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="电话号码" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.phone"
                autocomplete="off"
                size="medium"
                placeholder="例:136XXXXXXXX"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="姓名" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.name"
                autocomplete="off"
                size="medium"
                placeholder="例:刘伟"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="汽车类型选择" label-width="100px">
            <el-col :span="16">
              <!-- v-model是将选择的值绑定到v-model对应的变量里 -->
              <el-select v-model="editForm.vehicleTypeId" placeholder="请选择">
                <el-option
                  v-for="item in vehicleTypes"
                  :key="item.vehicleTypeId"
                  :label="item.name"
                  :value="item.vehicleTypeId"
                  @click.native="changeVehicleType"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="车辆选择" label-width="100px">
            <el-col :span="16">
              <el-select v-model="editForm.vehicleId" placeholder="请选择">
                <el-option
                  v-for="item in vehicles"
                  :key="item.vehicleId"
                  :label="item.plateNumber"
                  :value="item.vehicleId"
                  :disabled="item.disabled"
                  @click.native="changeVehicle"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="取车日期" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.startDate"
                autocomplete="off"
                size="medium"
                placeholder="YYYY-MM-DD HH:mm"
              ></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="还车日期" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.endDate"
                autocomplete="off"
                size="medium"
                placeholder="YYYY-MM-DD HH:mm"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="取车地点" label-width="100px">
            <el-col :span="16">
              <el-select
                v-model="editForm.pickupLocation"
                disabled
                placeholder="请选择"
              >
                <el-option
                  v-for="item in locations"
                  :key="item.locationId"
                  :label="item.locationBrief"
                  :value="item.locationId"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="还车地点" label-width="100px">
            <el-col :span="16">
              <el-select
                v-model="editForm.dropoffLocation"
                disabled
                placeholder="请选择"
              >
                <el-option
                  v-for="item in locations"
                  :key="item.locationId"
                  :label="item.locationBrief"
                  :value="item.locationId"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="租用天数" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.days"
                autocomplete="off"
                size="medium"
                placeholder="天"
              >
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="总金额" label-width="100px">
            <el-col :span="16">
              <el-input
                v-model="editForm.total"
                autocomplete="off"
                size="medium"
                placeholder="¥"
              >
              </el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <div class="create-drawer-footer">
          <el-button @click="cancelEditForm" style="width: 130px"
            >取 消</el-button
          >
          <el-button
            @click="confirmEditForm"
            type="primary"
            style="width: 130px"
            >确定</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "Reservation",
  beforeRouteEnter: (to, from, next) => {
    console.log("地址类");
    next((vm) => {
      vm.getReservation();
      vm.getVehicleTypes();
      vm.getVehicles();
      vm.getLocations();
      vm.getOrderStatus();
    });
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
        phone: "",
        name: "",
        id: "",
        days: "",
        startDate: "",
        endDate: "",
        vehicleTypeId: "",
        vehicleId: "",
        total: "",
        pickupLocation: "",
        dropoffLocation: "",
      },
      multipleSelection: [],
      uselessVehicles:[],
      vehicleTypes:[],
      vehicles:[],
      locations:[]
    };
  },
  methods: {
    async getReservation() {
      // this.axios.get('http://localhost:8081/reservation/findAll')
      this.axios
        .get("/api/reservation/findAll")
        .then((res) => {
          console.log(res);
          this.reservations = res.data;
          //遍历所有订单 将后端返回的ISO格式时间 转化为YYYY:MM:DD HH:mm格式
          for (var i = 0; i < this.reservations.length; i++) {
            this.reservations[i].startDate = new Date(
              this.reservations[i].startDate
            );
            this.reservations[i].endDate = new Date(
              this.reservations[i].endDate
            );
            this.reservations[i].startDate = this.formateDate(
              this.reservations[i].startDate,
              "yyyy-MM-dd hh:mm"
            );
            this.reservations[i].endDate = this.formateDate(
              this.reservations[i].endDate,
              "yyyy-MM-dd hh:mm"
            );
            console.log(this.reservations[i].startDate);
            console.log(this.reservations[i].endDate);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    async getVehicleTypes() {
      try {
        // await this.axios.get('http://localhost:8081/location/getAll')
        await this.axios.get("/api/vehicle/getAllType").then((res) => {
          this.vehicleTypes = res.data;
          console.log(this.vehicleTypes);
          for (var i = 0; i < this.vehicleTypes.length; i++) {
            this.vehicleTypes[i].name =
              this.vehicleTypes[i].brand + this.vehicleTypes[i].model;
          }
          console.log(this.vehicleTypes);
        });
      } catch (err) {
        console.log(err);
      }
    },

    async getVehicles() {
      try {
        // await this.axios.get('http://localhost:8081/location/getAll')
        await this.axios.get("/api/vehicle/getAll").then((res) => {
          this.vehicles = res.data;
          console.log(this.vehicles);
        });
      } catch (err) {
        console.log(err);
      }
    },

    async getLocations() {
      try {
        // await this.axios.get('http://localhost:8081/location/getAll')
        await this.axios.get("/api/location/getAll").then((res) => {
          this.locations = res.data;
          console.log(this.locations);
        });
      } catch (err) {
        console.log(err);
      }
    },

    async getOrderStatus() {
      try {
        // await this.axios.get('http://localhost:8081/location/getAll')
        await this.axios.get("/api/orderstatus/getAll").then((res) => {
          this.orderStatus = res.data;
          console.log(this.orderStatus);
        });
      } catch (err) {
        console.log(err);
      }
    },

    searchFor() {
      var reservations = JSON.parse(JSON.stringify(this.reservations));
      var count = 0;
      for (var i = 0; i < reservations.length; i++) {
        var reservationId = reservations[i].reservationId.toString();
        var accessToken = reservations[i].accessToken.toString();
        var id = reservations[i].id;
        var phone = reservations[i].phone;
        var name = reservations[i].name;
        var outTradeNo = reservations[i].paymentOrderInfo.outTradeNo;
        var startDate = reservations[i].startDate;
        var endDate = reservations[i].endDate;
        var pickupLocation = reservations[i].pickupLocation.locationBrief;
        var dropoffLocation = reservations[i].dropoffLocation.locationBrief;
        var total = reservations[i].total.toString();
        var plateNumber = reservations[i].vehicle.plateNumber.toString();
        var brand = reservations[i].vehicleType.brand;
        var model = reservations[i].vehicleType.model;

        if (
          reservationId.match(this.search) == null &&
          accessToken.match(this.search) == null &&
          id.match(this.search) == null &&
          phone.match(this.search) == null &&
          name.match(this.search) == null &&
          outTradeNo.match(this.search) == null &&
          startDate.match(this.search) == null &&
          endDate.match(this.search) == null &&
          pickupLocation.match(this.search) == null &&
          dropoffLocation.match(this.search) == null &&
          total.match(this.search) == null &&
          plateNumber.match(this.search) == null &&
          brand.match(this.search) == null &&
          model.match(this.search) == null
        ) {
          this.uselessReservation.push(this.reservations.splice(i - count, 1));
          count++;
        }
      }
    },

    inputChange(e) {
      console.log(e);
      var uselessReservation = [];
      for (var i = 0; i < this.uselessReservation.length; i++) {
        uselessReservation.push(this.uselessReservation[i][0]);
      }
      this.reservations = this.reservations.concat(uselessReservation);
      this.uselessReservation = [];
    },

    //将ISO时间转为YYYY:MM:DD HH:mm格式
    formateDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          );
        }
      }
      return fmt;
    },

    // 左边补0函数
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    clickEditButton(e) {
      this.currentReservation = e;
      this.setInitialEditForm(e);
    },

    handleEditFormClose() {
      this.showEditDrawer = false;
    },

    cancelEditForm() {
      this.showEditDrawer = false;
    },

    setInitialEditForm(e) {
      this.editForm.reservationId = this.currentReservation.reservationId;
      this.editForm.id = e.id;
      this.editForm.phone = e.phone;
      this.editForm.name = e.name;
      this.editForm.vehicleTypeId = e.vehicleType.vehicleTypeId;
      this.editForm.vehicleId = e.vehicle.vehicleId;
      this.editForm.startDate = e.startDate;
      this.editForm.endDate = e.endDate;
      this.editForm.pickupLocation = e.pickupLocation.locationId;
      this.editForm.dropoffLocation = e.dropoffLocation.locationId;
      this.editForm.days = e.days;
      this.editForm.total = e.total;
      this.showEditDrawer = true;
    },

    clearEditForm() {
      this.editForm.reservationId = "";
      this.editForm.id = "";
      this.editForm.phone = "";
      this.editForm.vehicleTypeId = "";
      this.editForm.vehicleId = "";
      this.editForm.startDate = "";
      this.editForm.endDate = "";
      this.editForm.pickupLocation = "";
      this.editForm.dropoffLocation = "";
      this.editForm.orderStatus = "";
      this.editForm.days = "";
      this.editForm.total = "";
      this.editForm.name = "";
    },

    async confirmEditForm() {
      this.editFormLoading = true;
      var form = this.$qs.stringify(this.editForm);
      // await this.axios.put('http://localhost:8081/reservation/update',
      await this.axios
        .post("/api/reservation/update", form)
        .then((res) => {
          console.log(res);
          this.editFormLoading = false;
          if (res.data == "success") {
            console.log(111);
            for (var i = 0; i < this.reservations.length; i++) {
              if (
                this.reservations[i].reservationId ==
                this.currentReservation.reservationId
              ) {
                console.log(123);
                console.log(this.currentReservation);
                // this.reservations[i].name = this.editForm.name;
                // this.reservations[i].phone = this.editForm.phone;
                // this.reservations[i].id = this.editForm.id;
                // this.reservations[i].accessToken = this.editForm.accessToken;
                // this.reservations[i].reservationId = this.reservationId;

                this.reservations[i].reservationId = this.currentReservation.reservationId;
                this.reservations[i].id = this.editForm.id;
                this.reservations[i].phone = this.editForm.phone;
                this.reservations[i].name = this.editForm.name;
                this.reservations[i].vehicleType.vehicleTypeId = this.editForm.vehicleTypeId;
                this.reservations[i].vehicle.vehicleId = this.editForm.vehicleId;
                this.reservations[i].startDate = this.editForm.startDate;
                this.reservations[i].endDate = this.editForm.endDate;
                this.reservations[i].pickupLocation.pickupLocationId = this.editForm.pickupLocation;
                this.reservations[i].dropoffLocation.dropoffLocationId = this.editForm.dropoffLocation;
                this.reservations[i].days = this.editForm.days;
                this.reservations[i].total = this.editForm.total;
              }
            }
            // this.clearEditForm()
            this.$message({
              message: "预约修改成功",
              type: "success",
            });
            this.showEditDrawer = false;
          } else {
            this.$message.error("预约修改失败");
            // this.clearEditForm()
            this.showEditDrawer = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.editFormLoading = false;
          this.$message.error("预约修改失败");
          // this.clearEditForm()
          this.showEditDrawer = false;
        });
    },

    deleteRecord(e) {
      console.log(e);
      var reservationId = [e];

      this.$msgbox({
        title: "提示",
        message: "此操作会删除选中预约, 是否继续?",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",

        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            if (this.multipleSelection.length == 0) {
              // this.axios.delete('http://localhost:8081/reservation/delete',
              this.axios
                .delete("/api/reservation/delete", { data: reservationId })
                .then((res) => {
                  console.log(res);
                  if (res.data == "success") {
                    this.$message({
                      message: "删除预约成功",
                      type: "success",
                    });
                    for (var i = 0; i < this.reservations.length; i++) {
                      if (this.reservations[i].reservationId == e) {
                        this.reservations.splice(i, 1);
                      }
                    }
                  } else {
                    this.$message.error("预约删除有误");
                  }
                  instance.confirmButtonLoading = false;
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  instance.confirmButtonLoading = false;
                  this.$message.error("预约删除有误");
                  done();
                });
            } else {
              var ids = [];
              for (var i = 0; i < this.multipleSelection.length; i++) {
                ids.push(this.multipleSelection[i].reservationId);
              }
              console.log(ids);
              // this.axios.delete('http://localhost:8081/reservation/delete',
              this.axios
                .delete("/api/reservation/delete", { data: ids })
                .then((res) => {
                  console.log(res);
                  if (res.data == "success") {
                    this.$message({
                      message: "预约地址成功",
                      type: "success",
                    });
                    this.reservations = this.reservations.filter(
                      (item) => ids.indexOf(item.reservationId) == -1
                    );
                  } else {
                    this.$message.error("预约删除有误");
                  }
                  instance.confirmButtonLoading = false;
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  this.$message.error("预约删除有误");
                  instance.confirmButtonLoading = false;
                  done();
                });
            }
          }
          if (action === "cancel") {
            done();
          }
        },
      });
    },

    //感知汽车类型选择变化的函数
    changeVehicleType(e) {
      //将uselessVehicles的数据重新放回vehicles数组中 以便完整的搜索
      var uselessVehicles = [];
      for (var i = 0; i < this.uselessVehicles.length; i++) {
        uselessVehicles.push(this.uselessVehicles[i][0]);
      }
      this.vehicles = this.vehicles.concat(uselessVehicles);
      this.uselessVehicles = [];


      //这是将所有汽车里面不符合汽车类型ID的汽车全部放入uselessVehicles 
      //将符合汽车类型ID的汽车放入vehicles中
        var count = 0
        //创建一个新的vehicles数组 这个数组与this.vehicles为两个完全
        //不相关的数组
        var vehicles = JSON.parse(JSON.stringify(this.vehicles));
      for (var i = 0; i < vehicles.length; i++) {
        var vehicleTypeId = vehicles[i].vehicleType.vehicleTypeId
        if (
          vehicles[i].vehicleType.vehicleTypeId !=
          this.editForm.vehicleTypeId
        ) {
            this.uselessVehicles.push(this.vehicles.splice(i - count, 1));
            count++;
        }
      }
      console.log(this.vehicles)
      console.log(this.uselessVehicles)
    },

    //感知汽车选择变化的函数
    changeVehicle() {
      console.log(this.editForm.vehicleId);
      for (var i = 0; i < this.vehicles.length; i++) {
        if (
          this.editForm.vehicleId == this.vehicles[i].vehicleId &&
          this.vehicles[i].vehicleType.vehicleTypeId ==
            this.editForm.vehicleTypeId
        ) {
          console.log(this.vehicles[i].vehicleType.vehicleTypeId);
        }
      }
    },
  },
};
</script>
<style>
/* .create-drawer-footer {
    position: fixed;
    bottom: 30px;
    widows: 80%;
    margin-left: 60px;
} */
</style>
