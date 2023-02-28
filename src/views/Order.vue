<template>
  <div>
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

    <el-row>
      <el-table :data="orders" ref="multipleTable" style="width: 100%" height="1000" max-height="1200"
        :default-sort="{ prop: 'orderId', order: 'descending' }" @selection-change="handleSelectionChange">
        <el-table-column type="expand"> </el-table-column>
        <el-table-column prop="orderId" type="selection" width="55" fixed="left">
        </el-table-column>
        <el-table-column prop="orderId" label="订单号" width="180" fixed="left" sortable>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150" fixed="left">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="150" fixed="left">
        </el-table-column>
        <el-table-column prop="accessToken" label="用户登录凭证" width="150"></el-table-column>
        <el-table-column prop="paymentOrderInfo.outTradeNo" label="商户订单号" width="150"></el-table-column>
        <el-table-column prop="startDate" label="租车日期" width="150"></el-table-column>
        <el-table-column prop="endDate" label="还车日期" width="150"></el-table-column>
        <el-table-column prop="pickupLocation.locationBrief" label="提车地点" width="150"></el-table-column>
        <el-table-column prop="dropoffLocation.locationBrief" label="还车地点" width="150"></el-table-column>
        <el-table-column prop="vehicle.plateNumber" label="车牌号" width="150"></el-table-column>
        <el-table-column prop="vehicle.vehicleId" label="车辆ID" width="150"></el-table-column>
        <el-table-column prop="vehicleType.vehicleTypeId" label="车辆类型ID" width="150"></el-table-column>
        <el-table-column prop="vehicleType.brand" label="品牌" width="150"></el-table-column>
        <el-table-column prop="vehicleType.model" label="型号" width="150"></el-table-column>
        <el-table-column prop="days" label="租用天数" width="150"></el-table-column>
        <el-table-column prop="total" label="总金额" width="150"></el-table-column>
        <!-- <el-table-column prop="vehicle.vehicleId" label="车辆ID" width="150"></el-table-column> -->

        <el-table-column width="150" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
              @click="clickEditButton(scope.row)"></el-button>
            <!-- <el-button type="danger" icon="el-icon-delete" circle @click="deleteRecord(scope.row.id)">
                        </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 编辑订单 -->
    <el-drawer title="编辑当前司机" :before-close="handleEditFormClose" :visible.sync="showEditDrawer" direction="ltr"
      ref="drawerEdit" size="30%">
      <div v-loading="editFormLoading">
        <el-form :model="editForm">
          <el-form-item label="身份证号" label-width="100px">
            <el-col :span="16">
              <el-input v-model="editForm.id" autocomplete="off" size="medium" placeholder="必填!身份证号">
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
          <el-form-item label="汽车类型选择" label-width="100px">
            <el-col :span="16">
              <!-- v-model是将选择的值绑定到v-model对应的变量里 -->
              <el-select v-model="editForm.vehicleTypeId" placeholder="请选择" @change="openVehicleTypeSelection">
                <el-option ref="vehicleTypeOptions" v-for="item in vehicleTypes" :key="item.vehicleTypeId"
                  :label="item.name" :value="item.vehicleTypeId" @click.native="changeVehicleType(item)">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="车辆选择" label-width="100px">
            <el-col :span="16">
              <el-select v-model="editForm.vehicleId" placeholder="请选择" @change="openVehicleSelection"
                ref="vehicleOptions">
                <el-option v-for="item in vehicles" :key="item.vehicleId" :label="item.plateNumber"
                  :value="item.vehicleId" :disabled="item.disabled" @click.native="changeVehicle(item)">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="取车日期" label-width="100px">
            <el-col :span="16">
              <el-input v-model="editForm.startDate" autocomplete="off" size="medium"
                placeholder="YYYY-MM-DD HH:mm"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="还车日期" label-width="100px">
            <el-col :span="16">
              <el-input v-model="editForm.endDate" autocomplete="off" size="medium" placeholder="YYYY-MM-DD HH:mm">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="取车地点" label-width="100px">
            <el-col :span="16">
              <el-select v-model="editForm.pickupLocation" disabled placeholder="请选择">
                <el-option v-for="item in locations" :key="item.locationId" :label="item.locationBrief"
                  :value="item.locationId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="还车地点" label-width="100px">
            <el-col :span="16">
              <el-select v-model="editForm.dropoffLocation" disabled placeholder="请选择">
                <el-option v-for="item in locations" :key="item.locationId" :label="item.locationBrief"
                  :value="item.locationId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="订单状态" label-width="100px">
            <el-col :span="16">
              <el-select v-model="editForm.orderStatus" placeholder="请选择">
                <el-option v-for="item in orderStatus" :key="item.orderStatusId" :label="item.orderDescription"
                  :value="item.orderStatusId">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="租用天数" label-width="100px">
            <el-col :span="16">
              <el-input v-model="editForm.days" autocomplete="off" size="medium" placeholder="天">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="总金额" label-width="100px">
            <el-col :span="16">
              <el-input v-model="editForm.total" autocomplete="off" size="medium" placeholder="¥">
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
import { ref } from 'vue'

export default {
  setup() {
    let vehicleTypess = ref(this.vehicleTypes)
    let vehicless = ref(this.vehicles)
    return {
      vehicleTypess,
      vehicless
    }
  },
  name: "Order",
  beforeRouteEnter: (to, from, next) => {
    console.log("订单类");
    next((vm) => {
      vm.getOrders();
      vm.getVehicleTypes();
      vm.getVehicles();
      vm.getLocations();
      vm.getOrderStatus();
    });
  },
  data() {
    return {
      orders: [],
      search: "",
      uselessOrders: [],
      // showCreateDrawer: false,
      // createFormLoading:false,
      showEditDrawer: false,
      editFormLoading: false,
      editForm: {
        orderId: "",
        id: "",
        phone: "",
        vehicleTypeId: "",
        vehicleId: "",
        startDate: "",
        endDate: "",
        pickupLocation: "",
        dropoffLocation: "",
        orderStatus: "",
        days: "",
        total: "",
        name: "",
      },
      multipleSelection: [],
      vehicleTypes: [],
      vehicles: [],
      locations: [],
      orderStatus: [],
      currentOrder: Object,
      uselessVehicles: []
      //   vehicleTypess,
      // vehicless
    };
  },
  methods: {
    async getOrders() {
      try {
        // await this.axios.get('http://localhost:8081/location/getAll')
        await this.axios.get("/api/orders/getAll").then((res) => {
          this.orders = res.data;
          console.log(this.orders);

          //遍历所有订单 将后端返回的ISO格式时间 转化为YYYY:MM:DD HH:mm格式
          for (var i = 0; i < this.orders.length; i++) {
            this.orders[i].startDate = new Date(this.orders[i].startDate);
            this.orders[i].endDate = new Date(this.orders[i].endDate);
            this.orders[i].startDate = this.formateDate(
              this.orders[i].startDate,
              "yyyy-MM-dd hh:mm"
            );
            this.orders[i].endDate = this.formateDate(
              this.orders[i].endDate,
              "yyyy-MM-dd hh:mm"
            );
            console.log(this.orders[i].startDate);
            console.log(this.orders[i].endDate);
          }
        });
      } catch (err) {
        console.log(err);
      }
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

    inputChange(e) {
      var uselessOrders = [];
      for (var i = 0; i < this.uselessOrders.length; i++) {
        uselessOrders.push(this.uselessOrders[i][0]);
      }
      this.orders = this.orders.concat(uselessOrders);
      this.uselessOrders = [];
    },

    searchFor() {
      var orders = JSON.parse(JSON.stringify(this.orders));
      var count = 0;
      for (var i = 0; i < orders.length; i++) {
        var orderId = orders[i].orderId.toString();
        var phone = orders[i].phone;
        var vehicle = orders[i].vehicle;
        var vehicleId = vehicle.vehicleId.toString();
        var isRecorder = vehicle.isRecorder.toString();
        var isETC = vehicle.isETC.toString();
        var isMount = vehicle.isMount.toString();
        var isUmbrella = vehicle.isUmbrella.toString();
        var isOccupied = vehicle.isOccupied.toString();
        var plateNumber = vehicle.plateNumber.toString();

        var vehicleType = orders[i].vehicleType;
        var brand = vehicleType.brand;
        var model = vehicleType.model;
        var displacement = vehicleType.displacement;
        var feePerDay = vehicleType.feePerDay.toString();
        var boxes = vehicleType.boxes;
        var power = vehicleType.power;
        var seats = vehicleType.seats;
        var style = vehicleType.style;
        var nation = vehicleType.nation;
        var isAuto = vehicleType.isAuto.toString();
        var isFull = vehicleType.isFull.toString();
        var isCamera = vehicleType.isCamera.toString();
        var isSunroof = vehicleType.isSunroof.toString();
        var isLeather = vehicleType.isLeather.toString();

        var id = orders[i].id;
        var accessToken = orders[i].accessToken;
        var startDate = orders[i].startDate;
        var endDate = orders[i].endDate;

        var pickupLocation = orders[i].pickupLocation;
        var pLocationId = pickupLocation.locationId.toString();
        var plocationBrief = pickupLocation.locationBrief;
        var pprovince = pickupLocation.province;
        var pcity = pickupLocation.city;
        var pdistrict = pickupLocation.district;
        var pstreet = pickupLocation.street;
        var pcommunity = pickupLocation.community;
        var pbuilding = pickupLocation.building;
        var proom = pickupLocation.room;

        var dropoffLocation = orders[i].dropoffLocation;
        var dLocationId = dropoffLocation.locationId.toString();
        var dlocationBrief = dropoffLocation.locationBrief;
        var dprovince = dropoffLocation.province;
        var dcity = dropoffLocation.city;
        var ddistrict = dropoffLocation.district;
        var dstreet = dropoffLocation.street;
        var dcommunity = dropoffLocation.community;
        var dbuilding = dropoffLocation.building;
        var droom = dropoffLocation.room;

        var orderStatus = orders[i].orderStatus;
        var orderStatusId = orderStatus.orderStatusId.toString();
        var orderDescription = orderStatus.orderDescription;

        var days = orders[i].days.toString();
        var total = orders[i].total.toString();

        var paymentOrderInfo = orders[i].paymentOrderInfo;
        var outTradeNo = paymentOrderInfo.outTradeNo;
        var totalFee = paymentOrderInfo.totalFee;
        var openId = paymentOrderInfo.openId;

        var name = orders[i].name;

        //如果内容为null的话返回true 否则返回判断的值
        if (
          (orderId ? orderId.match(this.search) == null : true) &&
          (phone ? phone.match(this.search) == null : true) &&
          // (vehicleId ? (vehicleId.match(this.search) == null) : true) &&
          // (isRecorder ? (isRecorder.match(this.search) == null) : true) &&
          // (isETC ? (isETC.match(this.search) == null) : true) &&
          // (isMount ? (isMount.match(this.search) == null) : true) &&
          // (isUmbrella ? (isUmbrella.match(this.search) == null) : true) &&
          // (isOccupied ? (isOccupied.match(this.search) == null) : true) &&
          (plateNumber ? plateNumber.match(this.search) == null : true) &&
          (brand ? brand.match(this.search) == null : true) &&
          (model ? model.match(this.search) == null : true) &&
          // (displacement ? (displacement.match(this.search) == null) : true) &&
          (feePerDay ? feePerDay.match(this.search) == null : true) &&
          // (boxes ? (boxes.match(this.search) == null) : true) &&
          // (power ? (power.match(this.search) == null) : true) &&
          // (seats ? (seats.match(this.search) == null) : true) &&
          // (style ? (style.match(this.search) == null) : true) &&
          (nation ? nation.match(this.search) == null : true) &&
          // (isAuto ? (isAuto.match(this.search) == null) : true) &&
          // (isFull ? (isFull.match(this.search) == null) : true) &&
          // (isCamera ? (isCamera.match(this.search) == null) : true) &&) {
          // (isSunroof ? (isSunroof.match(this.search) == null) : true) &&
          // (isLeather ? (isLeather.match(this.search) == null) : true) &&
          (id ? id.match(this.search) == null : true) &&
          (accessToken ? accessToken.match(this.search) == null : true) &&
          (startDate ? startDate.match(this.search) == null : true) &&
          (endDate ? endDate.match(this.search) == null : true) &&
          // (pLocationId ? (pLocationId.match(this.search) == null) : true) &&
          (plocationBrief ? plocationBrief.match(this.search) == null : true) &&
          (dlocationBrief ? dlocationBrief.match(this.search) == null : true) &&
          (orderDescription
            ? orderDescription.match(this.search) == null
            : true) &&
          (days ? days.match(this.search) == null : true) &&
          (total ? total.match(this.search) == null : true) &&
          (outTradeNo ? outTradeNo.match(this.search) == null : true) &&
          // (totalFee ? (totalFee.match(this.search) == null) : true) &&
          (openId ? openId.match(this.search) == null : true) &&
          (name ? name.match(this.search) == null : true)
        ) {
          this.uselessOrders.push(this.orders.splice(i - count, 1));
          count++;
        }
      }
    },

    //没有创建订单的drawer 是因为创建订单需要用到wx.requestPayment这个函数
    //我们在客服的后端是无法调用这个函数的 只能在微信小程序里面调用才可以

    // handleCreateFormClose() {
    //     this.showCreateDrawer = false
    // },

    // cancelCreateForm() {
    //     this.showCreateDrawer = false
    // },

    handleSelectionChange(val) {
      this.multipleSelection = val;
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

    clickEditButton(e) {
      this.currentOrder = e;
      console.log(this.currentOrder);
      this.setInitialEditForm(e);
    },

    handleEditFormClose() {
      this.showEditDrawer = false;
    },

    cancelEditForm() {
      this.showEditDrawer = false;
    },

    confirmEditForm() {
      this.editFormLoading = true;
      var form = this.$qs.stringify(this.editForm);
      // await this.axios.put('http://localhost:8081/driver/update',
      // await this.axios.post('/api/orders/updateOrder',
      //     form).
      this.axios
        .put("/api/orders/update", form)
        .then((res) => {
          console.log(res);
          this.editFormLoading = false;
          if (res.data == 1) {
            // console.log(111)
            for (var i = 0; i < this.orders.length; i++) {
              if (this.orders[i].orderId == this.currentOrder.orderId) {
                // console.log(123);
                console.log(this.currentOrder);
                this.orders[i].orderId = this.currentOrder.orderId;
                this.orders[i].phone = this.editForm.phone;
                this.orders[i].name = this.editForm.name;
                this.orders[i].id = this.editForm.id;
                this.orders[i].vehicleType.vehicleTypeId =
                  this.editForm.vehicleTypeId;
                this.orders[i].vehicle.vehicleId = this.editForm.vehicleId;
                this.orders[i].startDate = this.editForm.startDate;
                this.orders[i].endDate = this.editForm.endDate;
                this.orders[i].pickupLocation.locationId =
                  this.editForm.pickupLocation;
                this.orders[i].dropoffLocation.locationId =
                  this.editForm.dropoffLocation;
                this.orders[i].orderStatus.orderStatusId =
                  this.editForm.orderStatus;
                this.orders[i].days = this.editForm.days;
                this.orders[i].total = this.editForm.total;
              }
            }
            this.clearEditForm();
            this.$message({
              message: "用户修改成功",
              type: "success",
            });
            this.showEditDrawer = false;
          } else {
            this.$message.error("用户修改失败");
            this.clearEditForm();
            this.showEditDrawer = false;
          }
        })
        .catch((err) => {
          console.log(err);
          this.editFormLoading = false;
          this.$message.error("用户修改失败");
          this.clearEditForm();
          this.showEditDrawer = false;
        });
    },

    setInitialEditForm(e) {
      this.editForm.orderId = this.currentOrder.orderId;
      this.editForm.id = e.id;
      this.editForm.phone = e.phone;
      this.editForm.name = e.name;
      this.editForm.vehicleTypeId = e.vehicleType.vehicleTypeId;
      this.editForm.vehicleId = e.vehicle.vehicleId;
      this.editForm.startDate = e.startDate;
      this.editForm.endDate = e.endDate;
      this.editForm.pickupLocation = e.pickupLocation.locationId;
      this.editForm.dropoffLocation = e.dropoffLocation.locationId;
      this.editForm.orderStatus = e.orderStatus.orderStatusId;
      this.editForm.days = e.days;
      this.editForm.total = e.total;
      this.showEditDrawer = true;
    },

    clearEditForm() {
      this.editForm.orderId = "";
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

    //感知汽车类型选择变化的函数
    changeVehicleType(e) {
      //   console.log(e)

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
    changeVehicle(e) {
      //   console.log(this.editForm.vehicleId);
      for (var i = 0; i < this.vehicles.length; i++) {
        // if (
        //   this.editForm.vehicleId == this.vehicles[i].vehicleId &&
        //   this.vehicles[i].vehicleType.vehicleTypeId ==
        //     this.editForm.vehicleTypeId
        // ) {
        //   console.log(this.vehicles[i].vehicleType.vehicleTypeId);
        // }
        this.vehicles[i].disabled = false
      }
    },

    //监听el-select(针对编辑汽车选项)变化的函数
    openVehicleSelection() {
      // console.log(this.vehicles)
      console.log(this.$refs.vehicleOptions)

    },

    //监听el-select(针对编辑汽车类型选项)变化的函数
    openVehicleTypeSelection() {
      // console.log(this.vehicleTypes)

      console.log(this.$refs.vehicleTypeOptions)
    }
  },

  //   computed:{

  //   }
};
</script>
<style>

</style>
