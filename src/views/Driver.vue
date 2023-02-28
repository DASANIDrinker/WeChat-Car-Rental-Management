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
                <el-table-column type="selection" width="55" fixed="left" prop="id">
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

                <el-table-column label="上传身份证正面图片" width="150">
                    <template slot-scope="scope">

                        <!-- <el-upload action="http://192.168.64.130:8081/image/uploadIds/" :on-preview="handlePreview" -->
                        <el-upload action="http://localhost:8081/image/uploadIds/" :on-preview="handlePreview"
                        :on-remove="handleRemove" list-type="picture" :limit="1" :data="currentDriver"
                            :on-success="getDrivers">
                            <el-image style="width: 100px; height: 100px" :src="scope.row.fullIdFrontUrl"
                                lazy></el-image>
                            <el-button size="small" type="primary"
                                @click="clickUploadIdFrontButton(scope.row)">点击上传</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>

                    </template>
                </el-table-column>

                <el-table-column label="下载/删除身份证正面图片" width="150">
                    <template slot-scope="scope">
                        <!-- <el-image style="width: 100px; height: 100px" :src="scope.row.imageUrl" lazy></el-image> -->
                        <el-button size="small" type="primary" class="downloadButton"
                            @click="clickDownloadIdFrontButton(scope.row)">点击下载</el-button>
                        <el-button size="small" type="danger" class="deleteButton"
                            @click="clickDeleteIdFrontButton(scope.row)">点击删除</el-button>
                    </template>
                </el-table-column>

                <el-table-column label="上传身份证反面图片" width="150">
                    <template slot-scope="scope">


                        <!-- <el-upload action="http://192.168.64.130:8081/image/uploadIds/" :on-preview="handlePreview"     -->
                                                <el-upload action="http://localhost:8081/image/uploadIds/" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :limit="1" :data="currentDriver"
                            :on-success="getDrivers">
                            <el-image style="width: 100px; height: 100px" :src="scope.row.fullIdBackUrl"
                                lazy></el-image>
                            <el-button size="small" type="primary"
                                @click="clickUploadIdBackButton(scope.row)">点击上传</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>

                    </template>
                </el-table-column>

                <el-table-column label="下载/删除身份证反面图片" width="150">
                    <template slot-scope="scope">
                        <!-- <el-image style="width: 100px; height: 100px" :src="scope.row.imageUrl" lazy></el-image> -->
                        <el-button size="small" type="primary" class="downloadButton"
                            @click="clickDownloadIdBackButton(scope.row)">点击下载</el-button>
                        <el-button size="small" type="danger" class="deleteButton"
                            @click="clickDeleteIdBackButton(scope.row)">点击删除</el-button>
                    </template>
                </el-table-column>


                <el-table-column label="上传驾驶证图片" width="150">
                    <template slot-scope="scope">


                        <!-- <el-upload action="http://192.168.64.130:8081/image/uploadIds/" :on-preview="handlePreview"     -->
                            <el-upload action="http://localhost:8081/image/uploadIds/" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :limit="1" :data="currentDriver"
                            :on-success="getDrivers">
                            <el-image style="width: 100px; height: 100px" :src="scope.row.fullLicenseUrl"
                                lazy></el-image>
                            <el-button size="small" type="primary"
                                @click="clickUploadLicenseButton(scope.row)">点击上传</el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>

                    </template>
                </el-table-column>

                <el-table-column label="下载/删除驾驶证图片" width="150">
                    <template slot-scope="scope">
                        <!-- <el-image style="width: 100px; height: 100px" :src="scope.row.imageUrl" lazy></el-image> -->
                        <el-button size="small" type="primary" class="downloadButton"
                            @click="clickDownloadLicenseButton(scope.row)">点击下载</el-button>
                        <el-button size="small" type="danger" class="deleteButton"
                            @click="clickDeleteLicenseutton(scope.row)">点击删除</el-button>
                    </template>
                </el-table-column>



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
                // await this.axios.get('http://localhost:8081/driver/getAll')
                await this.axios.get('/api/driver/getAll')
                    .then(res => {
                        console.log(res);
                        this.drivers = res.data;
                        for (var i = 0; i < this.drivers.length; i++) {
                            this.drivers[i].fullIdFrontUrl = "http://localhost:8081/img/ID/" + this.drivers[i].idFrontUrl + "/"
                            this.drivers[i].fullIdBackUrl = "http://localhost:8081/img/ID/" + this.drivers[i].idBackUrl + "/"
                            this.drivers[i].fullLicenseUrl = "http://localhost:8081/img/ID/" + this.drivers[i].licenseUrl + "/"

                            // this.drivers[i].fullIdFrontUrl = "http://192.168.64.130:8081/img/ID/" + this.drivers[i].idFrontUrl + "/"
                            // this.drivers[i].fullIdBackUrl = "http://192.168.64.130:8081/img/ID/" + this.drivers[i].idBackUrl + "/"
                            // this.drivers[i].fullLicenseUrl = "http://192.168.64.130:8081/img/ID/" + this.drivers[i].licenseUrl + "/"
                        }
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
            // await this.axios.post('http://localhost:8081/driver/uploadDriver',
            await this.axios.post('/api/driver/uploadDriver',
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
            // await this.axios.put('http://localhost:8081/driver/update',
            await this.axios.put('/api/driver/update',
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
                            // this.axios.delete('http://localhost:8081/driver/delete',
                            this.axios.delete('/api/driver/delete',
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
                            // this.axios.delete('http://localhost:8081/driver/delete',
                            this.axios.delete('/api/driver/delete',
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
                    if (action === 'cancel') {
                        done()
                    }
                }
            })
        },
        //上传按钮 函数
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },

        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },

        //点击上传身份证正面按钮
        clickUploadIdFrontButton(e) {
            this.currentDriver = e
            this.currentDriver.label = 1
            console.log(this.currentDriver)
        },

        //点击下载身份证正面照片按钮
        clickDownloadIdFrontButton(e) {
            this.currentDriver = e
            var url = e.fullIdFrontUrl
            var id = this.currentDriver.id + " " + this.currentDriver.name + " 正面"
            console.log(url)
            console.log(id)
            this.downloadByBlob(url, id)
        },

        //下载图片的函数 name为图片下载后的名字 url为请求的路径
        downloadByBlob(url, name) {
            let image = new Image()
            image.setAttribute('crossOrigin', '*')
            // image.crossOrigin = "*";
            image.src = url
            image.onload = () => {
                let canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height
                let ctx = canvas.getContext('2d')
                ctx.drawImage(image, 0, 0, image.width, image.height)
                canvas.toBlob((blob) => {
                    let url = URL.createObjectURL(blob)
                    this.download(url, name)
                    // 用完释放URL对象
                    URL.revokeObjectURL(url)
                })

            }

        },

        download(href, name) {
            let eleLink = document.createElement('a')
            eleLink.download = name
            eleLink.href = href
            eleLink.click()
            eleLink.remove()

        },

        //点击删除身份证正面图片的按钮函数
        clickDeleteIdFrontButton(e) {
            this.currentDriver = e
            this.deleteIdFrontImage(this.currentDriver.id, this.currentDriver.idFrontUrl)
        },

        //删除身份证正面照片函数 id为身份证号 idFrontUrl为身份证的图片名字 eg:xxx.jpg
        async deleteIdFrontImage(id, idFrontUrl) {
            await this.$confirm('是否要删除该图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.get('/api/image/deleteIdFrontImage',
                    { params: { id: id, idFrontUrl: idFrontUrl } })
                    .then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                            // this.getProductImage()
                        }
                    }).catch(res => {

                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })

        },

        //点击上传身份证反面按钮函数
        clickUploadIdBackButton(e) {
            this.currentDriver = e
            this.currentDriver.label = 2
            console.log(this.currentDriver)
        },

        //点击下载身份证背面按钮
        clickDownloadIdBackButton(e) {
            this.currentDriver = e
            var url = e.fullIdBackUrl
            var id = this.currentDriver.id + " " + this.currentDriver.name + " 背面"
            console.log(url)
            console.log(id)
            this.downloadByBlob(url, id)
        },

        //点击删除身份证背面按钮函数
        clickDeleteIdBackButton(e) {
            this.currentDriver = e
            this.deleteIdBackImage(this.currentDriver.id, this.currentDriver.idBackUrl)
        },

        //删除身份证反面照片函数 id为身份证号 idBackUrl为身份证的图片名字 eg:xxx.jpg
        async deleteIdBackImage(id, idBackUrl) {
            var updateFlag = false
            await this.$confirm('是否要删除该图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.get('/api/image/deleteIdBackImage',
                    { params: { id: id, idBackUrl: idBackUrl } })
                    .then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                            updateFlag = true
                        }
                    }).catch(res => {

                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
            
            this.updateDrivers(updateFlag)
        },

        //点击上传驾驶证图片按钮函数
        clickUploadLicenseButton(e) {
            this.currentDriver = e
            this.currentDriver.label = 3
            console.log(this.currentDriver)
        },

        //点击下载驾驶证图片按钮
        clickDownloadLicenseButton(e) {
            this.currentDriver = e
            var url = e.fullLicenseUrl
            var id = this.currentDriver.id + " " + this.currentDriver.name + " 驾驶证"
            console.log(url)
            console.log(id)
            this.downloadByBlob(url, id)
        },

        //点击删除驾驶证图片按钮函数
        clickDeleteLicenseutton(e) {
            this.currentDriver = e
            this.deleteLicenseImage(this.currentDriver.id, this.currentDriver.licenseUrl)
        },

        //删除驾驶证照片函数 id为身份证号 licenseUrl为驾驶证的图片名字 eg:xxx.jpg
        async deleteLicenseImage(id, licenseUrl) {
            await this.$confirm('是否要删除该图片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.axios.get('/api/image/deleteLicenseImage',
                    { params: { id: id, licenseUrl: licenseUrl } })
                    .then(res => {
                        if (res.status == 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            })
                        }
                    }).catch(res => {

                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },

        //备用参数 用来在上传或删除图片之后更新数据 不知道为什么没用
        getDriverbyId(e) {
            var id = e.id
            console.log(111)
            this.axios.get('/api/driver/getDriverById',
                { params: { id: id } }).then(res => {
                    if (res.status == 200) {
                        var updatedDriver = res.data
                        updatedDriver.fullIdFrontUrl = "http://localhost:8081/img/ID/" + updatedDriver.idFrontUrl + "/"
                        updatedDriver.fullIdBackUrl = "http://localhost:8081/img/ID/" + updatedDriver.idBackUrl + "/"
                        updatedDriver.fullLicenseUrl = "http://localhost:8081/img/ID/" + updatedDriver.licenseUrl + "/"
                        console.log(updatedDriver)
                        for (var i = 0; i < this.drivers.length; i++) {
                            if (this.drivers[i].id == updatedDriver.id) {
                                this.drivers[i] = updatedDriver
                            }
                        }
                    }
                }).catch(err => {

                })
        },

        updateDrivers(updateFlag){
            if(updateFlag){
                this.getDrivers()
            }
        }
    }
}
</script>
<style>
.downloadButton {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 75;
    margin: auto;

}

.deleteButton {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 75;
    right: 0;
    margin: auto;
}
</style>
