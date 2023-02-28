<template>
    <div>
        <el-row>
            <el-col :span="12" :offset="4">
                <el-input v-model="search" size="large" placeholder="输入关键字搜索" clearable autosize @input="inputChange">
                    <el-button icon="el-icon-search" size="small" slot="append" @click="searchFor"></el-button>
                </el-input>
            </el-col>
            <!-- <el-col :span="2" :offset="1">
                <el-button type="success" icon="el-icon-circle-plus" circle size="medium">
                </el-button>
            </el-col> -->
        </el-row>

        <el-row>
            <el-table :data="paymentOrders" ref="multipleTable" style="width: 100%" height="1000" max-height="1200"
                :default-sort="{ prop: 'orderId', order: 'descending' }">
                <el-table-column type="expand"> </el-table-column>
                <el-table-column prop="sign" type="selection" width="150">
                </el-table-column>
                <el-table-column prop="sign" label="支付签名" width="400" sortable>
                </el-table-column>
                <el-table-column prop="outTradeNo" label="商户订单号" width="400">
                </el-table-column>
                <!-- <el-table-column prop="totalFee" label="总金额" width="150" fixed="left">
        </el-table-column>
        <el-table-column prop="openId" label="用户登录凭证" width="150"></el-table-column> -->
                <el-table-column width="150" fixed="right" label="操作">
                    <!-- <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle style="margin-left: 20px"
                            @click="clickEditButton(scope.row)"></el-button>
                    </template> -->
                </el-table-column>
            </el-table>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'PaymentOrder',
    beforeRouteEnter: (to, from, next) => {
        console.log("支付订单类");
        next((vm) => {
            vm.getPaymentOrders();
        });
    },
    data() {
        return {
            paymentOrders: [],
            search: "",
            uselessPaymentOrders: [],
            showEditDrawer: false,
            editFormLoading: false,
            editForm: {
                sign: "",
                outTradeNo: ""
            },
            currentPaymentOrder: Object
        };

    },
    methods: {
        async getPaymentOrders() {
            try {
                await this.axios.get("/api/paymentorders/findAll")
                    .then((res => {
                        this.paymentOrders = res.data
                        console.log(this.paymentOrders)
                    }))
            } catch (err) {
                console.log(err);
            }
        },

        inputChange(e) {
            var uselessPaymentOrders = [];
            for (var i = 0; i < this.uselessPaymentOrders.length; i++) {
                uselessPaymentOrders.push(this.uselessPaymentOrders[i][0]);
            }
            this.paymentOrders = this.paymentOrders.concat(uselessPaymentOrders);
            this.uselessPaymentOrders = [];
        },

        searchFor() {
            var paymentOrders = JSON.parse(JSON.stringify(this.paymentOrders));
            var count = 0;
            for (var i = 0; i < paymentOrders.length; i++) {
                var sign = paymentOrders[i].sign
                var outTradeNo = paymentOrders[i].outTradeNo
                // var totalFee = paymentOrders[i].totalFee.toString()
                // var openId = paymentOrders[i].openId

                if ((sign ? sign.match(this.search) == null : true) &&
                    (outTradeNo ? outTradeNo.match(this.search) == null : true) 
                    // (totalFee ? totalFee.match(this.search) == null : true) &&
                    // (openId ? openId.match(this.search) == null : true)
                    ) {

                    this.uselessPaymentOrders.push(this.paymentOrders.splice(i - count, 1));
                    count++;
                }
            }
        },

        clickEditButton(e) {
            this.currentPaymentOrder = e;
            console.log(this.currentPaymentOrder);
            this.setInitialEditForm(e);
        },

        handleEditFormClose() {
            this.showEditDrawer = false;
        },

        cancelEditForm() {
            this.showEditDrawer = false;
        },

        setInitialEditForm(e) {
            this.editForm.sign = this.currentPaymentOrder.sign;
            this.editForm.outTradeNo = e.outTradeNo;
            this.showEditDrawer = true;
        },

        clearEditForm() {
            this.editForm.sign = ""
            this.editForm.outTradeNo = ""
        },
    }
}
</script>
<style>

</style>