<template>
    <div>
        <div class="title">业务逻辑说明</div>
        <div class="title1">核心业务逻辑案例:</div>
        <el-tree :data="data" :props="defaultProps" :default-expanded-keys="[1, 2, 3]" node-key="id"
            class="content"></el-tree>
        <!-- <div class="content1">每层都有下拉按钮 来查询下一层的信息
            例如:用户页面有查看司机信息的下拉按钮
        </div> -->
    </div>
</template>
<script>
export default {
    name: 'Logic',
    data() {
        return {
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            data: [{
                id: 1,
                label: '微信用户:13901054449   (独特标识:用户登录凭证) -- 每个微信用户最多有三个认证司机!',
                children: [{
                    // id: 2,
                    // label: '认证司机: 刘伟  (独特标识:身份证号)',
                    // children: [
                        // {
                    id: 3,
                    label: '订单: 01    (独特标识:订单号/订单ID)',
                    children: [
                        {
                            id: 4,
                            label: '车辆:  京A00001   (独特标识:车辆ID)'
                        },
                        {
                            id: 5,
                            label: '车辆类型： 斯柯达昊锐 (独特标识:车辆类型ID)',
                        },
                        {
                            id: 6,
                            label: '取车地点:   北京东方时尚驾校北门 (独特标识:地点ID)'
                        },
                        {
                            id: 7,
                            label: '还车地点:    北京东方时尚南门    (独特标识:地点ID)'
                        },
                        {
                            id: 8,
                            label: '订单状态:    租用中  (独特标识:订单状态ID)'
                        },
                        {
                            id: 9,
                            label: '支付订单:    67C235B0F3A0C47E045DF200D6C26769  (独特标识:支付签名)'
                        },
                        {
                            id: 10,
                            label: '姓名:    尚斌 '
                        },
                        {
                            id: 11,
                            label: '手机号:    13641154228 '
                        },
                        {
                            id: 12,
                            label: '身份证号:    110106199603081432'
                        },
                        {
                            id: 13,
                            label: '取车地点:    东方时尚驾校  (独特标识:地点ID)'
                        },
                        {
                            id: 14,
                            label: '还车地点:    东方时尚驾校  (独特标识:地点ID)'
                        },
                        {
                            id: 15,
                            label: '天数:    15天 '
                        },
                        {
                            id: 16,
                            label: '总金额:    3000 '
                        },

                    ]



                },
                {
                    label: '订单: 02    ',
                    children: [{
                        label: '车辆:  京A00002   ',
                        children: [{
                            label: '车辆类型： 北汽EU300'
                        }]
                    }]
                },
                {
                    label: '订单: 03    ',
                    children: [{
                        label: '车辆:  京A00003 ',
                        children: [{
                            label: '车辆类型： 大众宝莱'
                        }]
                    }]
                }],
            }],
        }
            // {
            //     label: '认证司机:二环十三郎   (独特标识:用户登录凭证) ',
            //     children: [
            //         {
            //             label: '订单: 04    (独特标识:订单号)',
            //             children: [{
            //                 label: '车辆:  京A00004   (独特标识:车辆ID)',
            //                 children: [{
            //                     label: '车辆类型： 斯柯达明锐'
            //                 }]
            //             }]
            //         },
            //         {
            //             label: '订单: 05    ',
            //             children: [{
            //                 label: '车辆: 京A00005   ',
            //                 children: [{
            //                     label: '车辆类型： 斯柯达速派'
            //                 }]
            //             }]
            //         },
            //         {
            //             label: '订单: 06    ',
            //             children: [{
            //                 label: '车辆: 京A00006  ',
            //                 children: [{
            //                     label: '车辆类型： 大众速腾'
            //                 }]
            //             }]
            //         },
            //         {
            //             label: '订单: 07    ',
            //             children: [{
            //                 label: '车辆: 京A00007     ',
            //                 children: [{
            //                     label: '车辆类型： 北汽绅宝'
            //                 }]
            //             }]
            //         },
            //         {
            //             label: '订单: 08    ',
            //             children: [{
            //                 label: '车辆: 京A00008  ',
            //                 children: [{
            //                     label: '车辆类型： 北京现代索纳塔第八代'
            //                 }]
            //             }]
            //         }
            //     ]
            // },
            // {
            //     label: '认证司机:速度与激情 光头侠  (独特标识:用户登录凭证)',
            //     children: [
            //         {
            //             label: '订单: 09    (独特标识:订单号)',
            //             children: [{
            //                 label: '车辆: 京A00009    (独特标识:车辆ID)',
            //                 children: [{
            //                     label: '车辆类型： 北京现代伊兰特'
            //                 }]
            //             }]
            //         },
            //         {
            //             label: '订单: 10    ',
            //             children: [{
            //                 label: '车辆: 京A00010    ',
            //                 children: [{
            //                     label: '车辆类型： 斯柯达昊锐'
            //                 }]
            //             }]
            //         }
            //     ]
            // }
        //     ]
        // }],


    }
}

</script>
<style>
.title {
    text-align: center;
    font-size: x-large;
    font-weight: 600;
    color: #012ea5;
}

.title1 {
    font-size: large;
    font-weight: 600;
    color: #012ea5;
}

.content {
    /* text-align: center; */
    font-size: medium;
    color: black;
    font-weight: 550;

}

.el-tree {
    word-wrap: break-word;
    word-break: break-all;
}

.content1 {
    text-align: center;
    margin-top: 50px;
    font-size: medium;
    color: #012ea5;
    font-weight: 550;
    word-wrap: break-word;
    word-break: break-all;
    white-space: pre-line;
}
</style>
