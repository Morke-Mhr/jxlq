<template>
    <div class="safe_main">
        <div class="sxForm">
            <el-form
                    :inline="true"
                    :model="pageForm"
                    ref="pageForm"
                    class="demo-form-inline"
            >
                <el-form-item prop="jdTypeId" label="技术交底类别">
                    <el-select
                            v-model="pageForm.jdTypeId"
                            placeholder="请选择技术交底类别"
                    >
                        <el-option
                                :value="item.dictCode"
                                v-for="item in typeRes"
                                :key="item.dictCode"
                                :label="item.dictLabel"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="projectName" label="项目名称">
                    <el-input
                            v-model="pageForm.projectName"
                            maxlength="30"
                            placeholder="请输入项目名称"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="bid" label="标段">
                    <el-input
                            v-model="pageForm.bid"
                            maxlength="30"
                            placeholder="请输入标段"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="engineName" label="单位工程名称">
                    <el-input
                            v-model="pageForm.engineName"
                            maxlength="30"
                            placeholder="请输入单位工程名称"
                    ></el-input>
                </el-form-item>
                <el-form-item prop="jiaodiUser" label="交底人">
                    <el-input
                            v-model="pageForm.jiaodiUser"
                            maxlength="30"
                            placeholder="请输入交底人"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                            class="chaxun"
                            icon="el-icon-search"
                            v-has="has.query"
                            @click="onSubmit()"
                    >查询
                    </el-button
                    >
                    <el-button @click="resetForm('pageForm')" class="chongzhi"
                    >重置
                    </el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="sxTable">
            <el-button v-has="has.add" @click="handleAdd()">新增</el-button>
            <el-button v-has="has.remove" @click="handleDel(scope)"
            >批量删除
            </el-button
            >

            <el-table
                    :data="tableData"
                    v-loading="loading"
                    style="width: 100%;"
                    tooltip-effect="light"
                    @selection-change="handleSelectionChange"
                    row-key="workprogramId"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                    stripe
            >
                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column label="类别" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.jdType }}</template>
                </el-table-column>
                <el-table-column label="项目名称" show-overflow-tooltip width="110">
                    <template slot-scope="scope">{{ scope.row.projectName }}</template>
                </el-table-column>
                <el-table-column label="标段" show-overflow-tooltip width="110">
                    <template slot-scope="scope">{{ scope.row.bid }}</template>
                </el-table-column>
                <el-table-column label="单位工程名称" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.engineName }}</template>
                </el-table-column>
                <el-table-column label="交底部门" show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.jiaodiDept }}</template>
                </el-table-column>
                <el-table-column label="交底人" show-overflow-tooltip width="110">
                    <template slot-scope="scope">{{ scope.row.jiaodiUser }}</template>
                </el-table-column>
                <el-table-column label="状态" show-overflow-tooltip width="110">
                    <template slot-scope="scope">{{
                            scope.row.status == 0 ? '未提交' : '已提交'
                        }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="145" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="see(scope.row.technologyconfessId)"
                        >查看
                        </el-button
                        >
                        <el-button
                                type="text"
                                v-has="has.edit"
                                v-show="scope.row.status == 0"
                                @click="modify(scope.row.technologyconfessId)"
                        >修改
                        </el-button
                        >
                        <el-button type="text" v-has="has.remove" @click="handleDel(scope)"
                        >删除
                        </el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    :page-sizes="pageSizes"
                    :page-size="pageForm.pageSize"
                    @size-change="handleSizeChange"
                    :current-page.sync="currentPage"
                    @current-change="handleCurrentChange"
            ></el-pagination>
            <el-dialog
                    class="pub_dialog"
                    :visible.sync="seedialogVisible"
                    title="技术交底详情"
                    custom-class="large"
                    v-if="seedialogVisible"
            >
                <add
                        v-if="flag === 'Add'"
                        @fatherMethod="fatherMethod"
                        :state="state"
                        :datas="datas"
                ></add>
                <geteject v-else :technologyconfessId="technologyconfessId"></geteject>
                <span slot="footer" class="dialog-footer">
          <el-button v-if="flag !== 'Add'" class="tBtn" v-print="'#printTest'"
          >打印</el-button
          >
                    <!-- <el-button v-else-if="flag === 'Add'" class="tBtn" @click=""
                      >确 定</el-button
                    > -->
          <el-button class="fBtn" @click="seedialogVisible = false"
          >取 消</el-button
          >
        </span>
            </el-dialog>

            <el-dialog
                    :visible.sync="dialogVisible"
                    custom-class="large"
                    :title="this.lookTit"
            >
                <div class="safety-table">
                    <div id="printForm">
                        <el-form
                                :model="detailDate"
                                ref="itemSelInfo"
                                label-width="120px"
                                class="form-table clearfix"
                        >
                            <el-form-item
                                    label="类别"
                                    prop="jdType"
                                    style="width: 50%;float: left;"
                            >
                                <el-input type="input" v-model="detailDate.jdType"></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="项目名称"
                                    prop="projectName"
                                    style="width: 50%;float: left;"
                            >
                                <el-input
                                        type="input"
                                        v-model="detailDate.projectName"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="标段"
                                    prop="bid"
                                    style="width: 50%;float: left;"
                            >
                                <el-input type="input" v-model="detailDate.bid"></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="单位工程名称"
                                    prop="engineName"
                                    style="width: 50%;float: left;"
                            >
                                <el-input
                                        type="input"
                                        v-model="detailDate.engineName"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="分项工程名称"
                                    prop="worktype"
                                    style="width: 50%;float: left;"
                            >
                                <el-input type="input" v-model="detailDate.worktype"></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="交底时间"
                                    prop="jdTime"
                                    style="width: 50%;float: left;"
                            >
                                <el-input type="input" v-model="detailDate.jdTime"></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="交底人"
                                    prop="jiaodiUser"
                                    style="width: 50%;float: left;"
                            >
                                <el-input
                                        type="input"
                                        v-model="detailDate.jiaodiUser"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                    label="交底部门"
                                    prop="jdDept"
                                    style="width: 50%;float: left;"
                            >
                                <el-input type="input" v-model="detailDate.jdDept"></el-input>
                            </el-form-item>

                            <el-form-item label="技术交底内容">
                                <el-input
                                        type="textarea"
                                        v-model="detailDate.jdContent"
                                ></el-input>
                            </el-form-item>
                            <el-form-item label prop="createByDept"></el-form-item>
                            <el-form-item
                                    label="技术交底附件"
                                    prop="createByDept"
                                    style="width: 100%;"
                            >
                                <el-button icon="el-icon-paperclip" @click="downLoadFile">
                                    {{
                                        Array.isArray(detailDate.technologyConfessFileList)
                                                ? '下载附件:' +
                                                detailDate.technologyConfessFileList[0].fileName
                                                : '下载附件'
                                    }}
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <div class="clearfix">
                            <label
                                    style="text-align: right;display: inline-block;width: 120px;padding: 0 12px 0 0;color: #606266;"
                            >被交底人</label
                            >
                            <table
                                    style="width: 83%;float: right;border-radius: 4px;border: 1px solid #DCDFE6;text-align: center;border-bottom:none"
                            >
                                <tr style="height: 32px;line-height: 32px;">
                                    <td style="border-bottom:1px solid #DCDFE6;">部门</td>
                                    <td
                                            style="border-bottom:1px solid #DCDFE6;border-left:1px solid #DCDFE6;"
                                    >
                                        人员
                                    </td>
                                    <td
                                            style="border-bottom:1px solid #DCDFE6;border-left:1px solid #DCDFE6;"
                                    >
                                        电子签名
                                    </td>
                                </tr>
                                <tr
                                        v-for="(item, index) in this.detailDate.technologyBottomList"
                                        :key="index"
                                        style="height: 32px;line-height: 32px;"
                                >
                                    <td style="border-bottom:1px solid #DCDFE6;">
                                        &nbsp;{{ item.bottonDept }}
                                    </td>
                                    <td
                                            style="border-bottom:1px solid #DCDFE6;border-left:1px solid #DCDFE6;"
                                    >
                                        &nbsp;{{ item.bottonUser }}
                                    </td>
                                    <td
                                            style="border-bottom:1px solid #DCDFE6;border-left:1px solid #DCDFE6;"
                                    >
                                        <img
                                                :src="getImage(item.signUrl)"
                                                style="width: 32px;height: 32px;"
                                        />
                                    </td>
                                </tr>
                                <!--  <tr v-for="(item,index) in this.detailDate.technologyBottomList" style="height: 32px;line-height: 32px;border-bottom: 1px solid #DCDFE6;">
                                   <td></td>
                                   <td style="border-left:1px solid #DCDFE6;"></td>
                                  </tr>-->
                            </table>
                        </div>
                    </div>
                    <div style="text-align:right;margin-top: 20px;">
                        <!-- <el-button class="confirm-btn" v-print="'#printForm'"> -->
                        <el-button @click="printFun">打印</el-button>
                        <el-button class="cancel-btn" @click="dialogVisible = false"
                        >取消
                        </el-button
                        >
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    getConfideList,
    getDeleteConfide,
    getConfideDetail
} from '@/api/technology/confide/confide.js'
import {getSelectTechItem, exportWord} from '@/api/system/class'
import Add from './add'
import geteject from './geteject'

// import {
//   getTechnologyList,
//   getSelectTechItem,
//   getAddTech
// } from '@/api/technology/item/itemMock.js'
// import {
//   isBasicDate,
// } from '@/utils/date.js'
import elementIcons from '@/views/system/menu/element-icons.js'

export default {
    components: {Add, geteject},
    data() {
        return {
            state: '',
            needTechnologyconfessId: '',
            has: {
                edit: 'safemanage:technologyConfess:update',
                add: 'safemanage:technologyConfess:add',
                remove: 'safemanage:technologyConfess:remove',
                query: 'safemanage:technologyConfess:query'
            },
            addTit: '新增',
            tableData: [],
            total: 100,
            pageSizes: [10, 15, 20, 25, 30],
            dialogVisible: false,
            flag: '',
            seedialogVisible: false,
            technologyconfessId: '',
            //搜索
            pageNum: 1, //默认当前页
            pageSize: 10,
            pageForm: {
                pageNum: 1,
                pageSize: 10,
                jdTypeId: '',
                projectName: '',
                bid: '',
                engineName: '',
                jiaodiUser: ''
            },
            // 当前页数
            currentPage: 1,
            //树形
            checkStrictly: true,
            defaultMenutree: [],
            deptOptions: [],
            multipleSelection: [],
            dialogType: 'new',
            defaultProps: {
                children: 'children',
                label: 'label',
                disabled: function (data, node) {
                    if (data.flag == '1') {
                        return true
                    } else {
                        return false
                    }
                }
            },
            elementIcons,

            loading: false,
            //表单验证方法
            formRules: {
                projectName: [
                    {
                        required: true,
                        message: '请输入项目名称',
                        trigger: 'blur'
                    }
                ],
                projectDept: [
                    {
                        required: true,
                        message: '请选择项目部',
                        trigger: 'blur'
                    }
                ],
                bid: [
                    {
                        required: true,
                        message: '请输入标段',
                        trigger: 'blur'
                    }
                ],
                projectTypeId: [
                    {
                        required: true,
                        message: '请选择项目类型',
                        trigger: 'blur'
                    }
                ],
                projectProcessId: [
                    {
                        required: true,
                        message: '请选择项目进度',
                        trigger: 'blur'
                    }
                ],
                startTime: [
                    {
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'blur'
                    }
                ],
                endTime: [
                    {
                        required: true,
                        message: '请选择结束时间',
                        trigger: 'blur'
                    }
                ]
            },
            //新增表单字段对象
            itemModel: {
                //项目名称
                projectName: '',
                //标段
                bid: '',
                //项目部编号
                projectDeptId: '',
                //项目部
                projectDept: '',
                //项目类型编号
                projectTypeId: '',
                //项目类型
                projectType: '',
                //项目进度编号
                projectProcessId: '',
                //项目进度
                projectProcess: '',
                //开始时间
                startTime: '',
                //结束时间
                endTime: ''
            },
            //方案性质数组
            natureRes: [],
            //方案类别数组
            typeRes: [],
            itemSelInfo: {},
            lookTit: '查看',
            datas: {},
            detailDate: {}
        }
    },
    created: async function () {
        this.getAllList()
        this.getTypeSel()
    },
    computed: {
        getImage() {
            return function (aa) {
                return this.$store.state.apiConfiguration.imgFileUrl + aa
            }
        }
    },
    methods: {
        async onSubmit() {
            let {jdTypeId, projectName, bid, engineName, jiaodiUser} = this.pageForm
            let params = {
                pageNum: 1,
                pageSize: this.pageSize,
                jdTypeId: this.pageForm.jdTypeId,
                projectName: this.pageForm.projectName,
                engineName: this.pageForm.engineName,
                jiaodiUser: this.pageForm.jiaodiUser,
                bid: this.pageForm.bid
            }
            let data = await getConfideList(params)
            this.tableData = data.rows
            this.loading = false
            this.total = data.total
            this.currentPage = 1
        },
        //新增
        async handleAdd() {
            this.datas = {}
            this.state = 'post'
            this.flag = 'Add'
            this.seedialogVisible = true
        },
        // 修改
        async modify(Id) {
            this.datas = await getConfideDetail(Id)
            this.state = 'put'
            this.flag = 'Add'
            this.seedialogVisible = true
        },
        // 查看
        async see(Id) {
            this.flag = ''
            this.seedialogVisible = true
            this.technologyconfessId = Id
        },
        //返回列表
        fatherMethod() {
            this.flag = ''
            this.seedialogVisible = false;
            this.getAllList()
        },
        printFun() {
            exportWord({technologyconfessId: this.needTechnologyconfessId})
        },
        handleSelectionChange(val) {
            if (val) {
                let arr = []
                for (let i = 0; i < val.length; i++) {
                    let itme = val[i]
                    arr.push(itme.technologyconfessId)
                }
                this.multipleSelection = [...arr]
            }
        },
        //获取列表数据
        //获取列表
        async getAllList() {
            this.loading = true
            const res = await getConfideList(this.pageForm)
            this.tableData = res.rows
            this.total = res.total
            console.log(res)
            console.log(res.rows)
            this.loading = false
        },
        //获取方案性质下拉
        //获取技术交底下拉
        async getTypeSel() {
            let dictName = 'confide_type'
            this.typeRes = await getSelectTechItem(dictName)
        },
        //获取技术交底下拉id
        peojectTypeFunc(val) {
            let resultArr = this.typeRes.filter((item) => {
                return item.dictCode === val
            })
            //把值赋给要传给后台的表单对象中
            this.itemModel.projectTypeId = resultArr[0].dictCode
            this.itemModel.projectType = resultArr[0].dictLabel //直接写val也可以
        },
        //删除
        async handleDel(scope) {
            if (!scope && this.multipleSelection.length <= 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择要删除的技术交底!'
                })
                return
            }
            let row = scope ? scope.row : null
            this.$confirm('确定删除该技术交底吗?', '删除技术交底', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            })
                    .then(async () => {
                        await getDeleteConfide(
                                row ? row.technologyconfessId : this.multipleSelection
                        )
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.getAllList()
                    })
                    .catch((err) => {
                        console.error(err)
                    })
        },
        //查看
        async handleDetail(scope) {
            let technologyconfessId = scope.row.technologyconfessId
            this.needTechnologyconfessId = scope.row.technologyconfessId
            this.dialogType = 'edit'
            this.dialogVisible = true
            this.detailDate = await getConfideDetail(technologyconfessId)
            console.log(this.detailDate)
        },
        //下载附件
        async downLoadFile() {
            let data = this.detailDate
            let fileForm = {
                name: data.technologyConfessFileList[0].fileName,
                path: data.technologyConfessFileList[0].fileUrl
            }
            this.fileDowloadName =
                    this.$store.state.apiConfiguration.url +
                    'jxlq-system-service' +
                    '/fs/download?name=' +
                    fileForm.name +
                    '&path=' +
                    fileForm.path
            location.href = this.fileDowloadName
        },
        treeCheck(data, isCheck) {
            if (isCheck) {
                this.itemModel.projectDeptId = data.id
                this.itemModel.projectDept = data.label
                let keys = this.$refs.deptTree.getCheckedKeys()
                // let itme = [keys[keys.length-1]]
                if (this.currentChecke && this.currentChecke == '') {
                    this.currentChecke = keys[0]
                } else {
                    let this_ = this
                    keys.some((value) => {
                        if (value != this_.currentChecke) {
                            this_.currentChecke = value
                            return true
                        }
                    })
                }
                let itme = [this.currentChecke]
                this.$refs.deptTree.setCheckedKeys(itme, true)
            }
        },
        //重置
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.getAllList()
        },

        ///页脚
        handleSizeChange(val) {
            this.pageForm.pageSize = val
            this.onSubmit()
        },
        handleCurrentChange(val) {
            this.pageForm.pageNum = val
            this.getAllList()
        }
    }
}
</script>

<style lang="scss" scoped>
.safety-table .el-form-item {
    width: 50%;
    float: left;
}
</style>
