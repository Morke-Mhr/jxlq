<template>
    <!-- 隐患分配 -->
    <div class="safe_main">
        <div class="sxForm">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="问题描述">
                    <el-input v-model="formInline.problemDesc"></el-input>
                </el-form-item>
                <el-form-item label="检查类别">
                    <el-select
                        v-model="formInline.checkCategoryId"
                        placeholder="请选择"
                        @visible-change="$forceUpdate()"
                    >
                        <el-option
                            v-for="item in jcList"
                            :key="item.dictCode"
                            :label="item.dictLabel"
                            :value="item.dictCode"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="隐患级别">
                    <el-select
                        v-model="formInline.hdLevel"
                        clearable
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in yhjbList"
                            :key="item.dictCode"
                            :label="item.dictLabel"
                            :value="item.dictCode"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登记部门">
                    <el-input v-model="formInline.createDept"></el-input>
                </el-form-item>
                <el-form-item label="登记人">
                    <el-input v-model="formInline.createBy"></el-input>
                </el-form-item>
                <!--        <el-form-item label="责任人">-->
                <!--          <el-input v-model="formInline.dutyUser"></el-input>-->
                <!--        </el-form-item>-->
                <div class="btnCont">
                    <el-button @click="onSubmit" v-has="has.allocationList" class="chaxun"
                    >查询
                    </el-button>
                    <el-button
                        class="chongzhi"
                        @click="resetBtn"
                        v-has="has.allocationList"
                    >重置
                    </el-button>
                </div>
            </el-form>
        </div>
        <div class="sxTable">
            <el-button @click="open(true)" class="blue" v-has="has.deletes"
            >批量删除
            </el-button
            >
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="light"
                style="width: 100%"
                height="calc(100vh - 370px)"
                stripe
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center">
                </el-table-column>
                <el-table-column
                    prop="checkCategory"
                    label="检查类别"
                    align="center"
                    show-overflow-tooltip
                    width="160"
                >
                </el-table-column>
                <el-table-column
                    prop="yhName"
                    label="隐患级别"
                    align="center"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="createDept"
                    label="登记部门"
                    align="center"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    prop="createBy"
                    label="登记人"
                    align="center"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="dutyUser"
                    label="责任人"
                    align="center"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="planFinishTime"
                    label="计划完成日期"
                    align="center"
                    show-overflow-tooltip
                    width="200px"
                >
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    align="center"
                    width="110px"
                >
                </el-table-column>
                <el-table-column
                    prop="problemDesc"
                    label="问题描述"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            @click="fpFun(scope.row)"
                            v-has="has.allocationView"
                        >分配
                        </el-button>
                        <el-button
                            type="text"
                            @click="open(false, scope.row.hyId)"
                            v-has="has.deletes"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[1, 10, 20, 30]"
                :page-size="formInline.pageSize"
                background
                layout=" total, prev, pager, next, sizes, jumper"
                :total="total"
            ></el-pagination>
        </div>
        <el-dialog
            title="分配"
            :close-on-click-modal="false"
            :visible.sync="dialogVisible"
            custom-class="small"
        >
            <el-form
                v-if="dialogVisible"
                ref="form"
                :model="formDia"
                label-width="auto"
                :rules="rules"
            >
                <el-form-item label="详情" class="formTitle"></el-form-item>
                <el-form-item label="检查类别">
                    {{ formDia.checkCategory }}
                </el-form-item>
                <el-form-item label="隐患级别">
                    <el-radio-group v-model="formDia.hdLevel" prop="hdLevel">
                        <el-radio label="1">一般</el-radio>
                        <el-radio label="2">重大</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="问题描述">
                    {{ formDia.problemDesc }}
                </el-form-item>
                <el-form-item label="违反法规">
                    {{ formDia.violationLaw }}
                </el-form-item>
                <el-form-item label="三违行为">
                    {{ formDia.threeBehavior }}
                </el-form-item>
                <el-form-item label="隐患图片">
                    <div class="yhImg">
                        <img
                            v-for="item in formDia.hiddendangerFiles"
                            :key="item.pictureId"
                            :src="item.pictureUrl"
                        />
                    </div>
                </el-form-item>
                <el-form-item label="分配" class="formTitle"></el-form-item>
                <el-form-item label="是否为隐患" prop="isHiddendanger">
                    <el-radio-group v-model="formDia.isHiddendanger">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="formDia.isHiddendanger == '0'">
                    <!-- <el-form-item label="关联作业指导书">
                                <el-button type="text">请选择</el-button>
                              </el-form-item> -->
                    <el-form-item label="治理要求" prop="formDia2.controlClaim">
                        <el-input
                            type="textarea"
                            placeholder="请填写"
                            :autosize="{ minRows: 3 }"
                            v-model="formDia.formDia2.controlClaim"
                            maxlength="300"
                            show-word-limit
                        ></el-input>
                    </el-form-item>

                    <el-form-item label="计划完成日期" prop="formDia2.planFinishTime">
                        <el-date-picker
                            v-model="formDia.formDia2.planFinishTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                        >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="责任人" prop="formDia2.dutyUserId">
                        <el-row>
                            <el-col span="12">
                                <el-cascader
                                    :show-all-levels="false"
                                    :options="cascaderList"
                                    :props="{ checkStrictly: true, value: 'id' }"
                                    @change="getDutyUser"
                                    clearable
                                ></el-cascader>
                            </el-col>
                            <el-col span="12">
                                <el-select
                                    v-model="formDia.formDia2.dutyUserId"
                                    placeholder="请选择责任人"
                                    @change="(val) => selectFun(val, 'dutyUserTxt')"
                                    @visible-change="$forceUpdate()"
                                >
                                    <el-option
                                        v-for="item in dutyUserList"
                                        :key="item.userId"
                                        :label="item.realName"
                                        :value="item.userId"
                                    >
                                    </el-option>
                                </el-select
                                >
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="审批" prop="isApprove">
                        <el-radio-group v-model="formDia.isApprove" @change="isSpchange">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 是否需要审批 -->
                    <template v-if="formDia.isApprove == '1'">
                        <el-form-item label="流程设置" class="formTitle"></el-form-item>
                        <el-form-item label="选择审批流" prop="nextData.seleSpl">
                            <el-select
                                v-model="formDia.nextData.seleSpl"
                                placeholder="请选择"
                                @change="(val) => selectFun(val, 'seleSpl')"
                                @visible-change="$forceUpdate()"
                            >
                                <el-option
                                    v-for="item in splList"
                                    :key="item.id"
                                    :label="item.businessName"
                                    :value="item.processDefinitionKey"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批岗位">
                            <el-input v-model="nodeName" :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="审批人" prop="nextData.realName">
                            <el-input
                                v-model="formDia.nextData.realName"
                                maxlength="30"
                                placeholder="点击选择审批人"
                                readonly
                                @focus="showSdialog"
                            ></el-input>
                        </el-form-item>
                    </template>
                </template>
                <!--选择审批人盒子-->
                <sdialog
                    ref="sdialog"
                    @choiceUser="choiceUser"
                    :sNeed="true"
                    dxId="user"
                    :transferProps="{
            key: 'userId',
            label: 'realName'
          }"
                    :treedata="treedata"
                ></sdialog>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">取 消</el-button>
        <el-button class="tBtn" @click="distOpen()" v-has="has.allocationSubmit"
        >确 定</el-button
        >
      </span>
        </el-dialog>
    </div>
</template>

<script>
import {getBusinesspost} from '@/api/job/safety'
import {
    allocationList,
    hDeletes,
    allocationView,
    dictType,
    getBusinessList,
    allocationSubmit
} from '@/api/hiddenDanger/security'
import Sdialog from '@/components/selectDialog'
import {getBranchS, getPeople} from '@/api/job/salary'
import {getTreeSelect} from '@/api/system/process' // 部门列表

const defaultPageSize = 10
export default {
    components: {
        Sdialog: Sdialog
    },
    data() {
        return {
            nodeName: '',
            yhjbList: [
                {dictCode: '0', dictLabel: '微小'},
                {dictCode: '1', dictLabel: '一般'},
                {dictCode: '2', dictLabel: '重大'}
            ],
            has: {
                // 隐患分配全部查询
                allocationList: 'hiddendanger:post:allocationList',
                // 隐患上报记录删除
                deletes: 'hiddendanger:post:deletes',
                // 隐患分配编辑
                allocationView: 'hiddendanger:post:allocationView',
                // 隐患分配提交
                allocationSubmit: 'hiddendanger:post:allocationSubmit'
            },
            rules: {
                hdLevel: [{required: true, message: '请选择', trigger: 'change'}],
                isHiddendanger: [
                    {required: true, message: '请选择', trigger: 'change'}
                ],
                controlClaim: [{required: true, message: '请输入', trigger: 'blur'}],
                'formDia2.controlClaim': [
                    {required: true, message: '请输入', trigger: 'blur'}
                ],
                'formDia2.planFinishTime': [
                    {required: true, message: '请选择日期', trigger: 'change'}
                ],
                'formDia2.dutyUserId': [
                    {required: true, message: '请选择责任人', trigger: 'change'}
                ],
                isApprove: [{required: true, message: '请选择', trigger: 'change'}],
                'nextData.seleSpl': [
                    {required: true, message: '请选择', trigger: 'change'}
                ],
                'nextData.realName': [
                    {required: true, message: '请选择', trigger: 'change'}
                ]
            },
            // 级联选择绑定数据
            cascaderList: [],
            // 责任人列表
            dutyUserList: [],
            treedata: [],
            dutyUserTxt: '',
            formInline: {
                problemDesc: '',
                checkCategoryId: '',
                hdLevel: '',
                createBy: '',
                dutyUser: '',
                pageSize: defaultPageSize,
                pageNum: '1',
                createDept: ''
            },
            yhList: {
                0: '微小',
                1: '一般',
                2: '重大'
            },
            // dialog表单
            formDia: {
                // 隐患描述
                problemDesc: '',
                // 检查类别
                checkCategory: '',
                // 隐患级别
                hdLevel: '',
                // 三违行为字典id
                threeBehaviorId: '',
                // 违反法规
                violationLaw: '',
                hiddendangerFiles: [],
                // 是否为隐患
                isHiddendanger: 0,
                // 是否审批
                isApprove: 0,
                formDia2: {
                    // 责任人
                    dutyUserId: '',
                    // 治理要求
                    controlClaim: '',
                    // 计划完成日期
                    planFinishTime: ''
                },
                nextData: {
                    seleSpl: '',
                    realName: ''
                }
            },
            dutyDeptId: '',
            tableData: [],
            //总条目
            total: 0,
            // 当前页数
            currentPage: 1,
            //默认当前页
            pageNum: 1,
            // 所选中项的id
            delArr: [],
            dialogVisible: false,
            jcList: [],
            swList: [],
            // 选择审批流
            seleSpl: '',
            splList: [],
            sprData: {},
            rowYhid: '',
            isSelectDel: false
        }
    },
    methods: {
        // 分配前确认
        distOpen() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    this.$confirm('正在执行隐患分配操作, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.distSubmit('form')
                        })
                        .catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            })
                        })
                }
            })
        },
        onSubmit() {
            this.getData('cx')
        },
        handleSizeChange(val) {
            this.formInline.pageSize = val
            this.getData()
        },
        handleCurrentChange(val) {
            this.formInline.pageNum = val
            this.getData()
        },
        async getData(cx) {
            console.log(this.formInline)
            if (cx == 'cx') {
                this.formInline.pageNum = 1
                this.currentPage = 1
            }
            let res = await allocationList(this.formInline)
            this.total = res.total
            this.tableData = res.rows.map((item) => {
                item.yhName = this.yhList[item.hdLevel]
                return item
            })
            console.log(res)
        },
        async selDelect() {
            let newArr = this.delArr.map((item) => {
                return item.hyId
            })
            if (newArr.length > 0) {
                var res = await hDeletes(newArr)
                this.$message.success(res)

                const totalPage = Math.ceil(
                    (this.total - newArr.length) / this.formInline.pageSize
                )
                //记录当前页码
                console.log(totalPage)
                const pagenum =
                    this.formInline.pageNum > totalPage
                        ? totalPage
                        : this.formInline.pageNum
                //实现跳转
                this.formInline.pageNum = pagenum < 1 ? 1 : pagenum

                this.getData()
            } else {
                this.$message.warning('请确认是否勾选')
            }
        },
        handleSelectionChange(val) {
            this.delArr = val
        },
        async delBtn() {
            var res = await hDeletes([this.rowYhid])
            this.$message.success(res)

            const totalPage = Math.ceil((this.total - 1) / this.formInline.pageSize)
            //记录当前页码
            //记住删除最后一条数据时当前码是最后一页
            const pagenum =
                this.formInline.pageNum > totalPage
                    ? totalPage
                    : this.formInline.pageNum
            //实现跳转
            this.formInline.pageNum = pagenum < 1 ? 1 : pagenum
            this.getData()
        },
        // 分配
        async fpFun(val) {
            var res = await allocationView({hyId: val.hyId})
            res.hiddendangerFiles.forEach((item) => {
                if (
                    item.pictureUrl.indexOf(
                        this.$store.state.apiConfiguration.url +
                        this.$store.state.serviceName.jurisdiction
                    ) == '-1'
                ) {
                    item.pictureUrl =
                        this.$store.state.apiConfiguration.url +
                        this.$store.state.serviceName.jurisdiction +
                        item.pictureUrl
                }
            })
            this.formDia = {
                ...{
                    // 隐患描述
                    problemDesc: '',
                    // 检查类别
                    checkCategory: '',
                    // 隐患级别
                    hdLevel: '',
                    // 三违行为字典id
                    threeBehaviorId: '',
                    // 违反法规
                    violationLaw: '',
                    hiddendangerFiles: [],
                    // 是否为隐患
                    isHiddendanger: 0,
                    // 是否审批
                    isApprove: 0,
                    formDia2: {
                        // 责任人
                        dutyUserId: '',
                        // 治理要求
                        controlClaim: '',
                        // 计划完成日期
                        planFinishTime: ''
                    },
                    nextData: {
                        seleSpl: '',
                        realName: ''
                    }
                },
                ...res
            }
            console.log(this.formDia, 456)
            this.dialogVisible = true
        },
        async selectFun(val, txt) {
            // val为当前选中的值  txt为传过来的字符串
            if (txt) {
                this[txt] = event.target.innerText
            }
            if (txt == 'seleSpl') {
                let data = {
                    processDefinitionKey: val
                }
                let nodeName = await getBusinesspost(data)
                this.nodeName = nodeName.nodeName
            }
            // console.log(val,txt,this[txt])
        },
        // 获取级联选择数据
        async getCascader() {
            this.cascaderList = await getTreeSelect()
        },
        // 获取责任人列表
        async getDutyUser(arr) {
            this.dutyDeptId = arr[arr.length - 1]
            console.log(arr, this.dutyDeptId)
            // this.formDia.dutyUserId = ''
            if (arr.length > 0) {
                this.formDia.formDia2.dutyUserId = ''
                this.dutyUserList = await getPeople(arr[arr.length - 1])
            } else {
                this.formDia.formDia2.dutyUserId = ''
                this.dutyUserList = []
            }
        },
        // 提交
        distSubmit(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    let reqData = {
                        hyId: this.formDia.hyId,
                        controlClaim: this.formDia.formDia2.controlClaim,
                        planFinishTime: this.formDia.formDia2.planFinishTime,
                        dutyUser: this.dutyUserTxt,
                        dutyUserId: this.formDia.formDia2.dutyUserId,
                        isApprove: this.formDia.isApprove,
                        isHiddendanger: this.formDia.isHiddendanger,
                        // 暂不添加
                        workDocIds: [],
                        dutyDeptId: this.dutyDeptId,
                        hdLevel: this.formDia.hdLevel
                    }
                    if (this.formDia.isApprove === 1) {
                        reqData.processDefinitionKey = this.formDia.nextData.seleSpl
                        reqData.toUser = this.sprData.userId
                    }
                    var res = await allocationSubmit(reqData)
                    console.log(reqData, this.formDia, res, 999)
                    this.$message.success(res)
                    this.getData('cx')
                    this.dialogVisible = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        async isSpchange(val) {
            if (val === 1) {
                this.splList = await getBusinessList({
                    businessCode: this.$store.state.approvalProcess.hiddendangerdown
                })
            } else {
                this.splList = []
                this.formDia.nextData.seleSpl = ''
                this.formDia.nextData.realName = ''
            }
        },
        async showSdialog() {
            // 树形结构
            this.treedata = await getTreeSelect()
            this.$refs.sdialog.isShow = true
        },
        choiceUser(UserID, UserObject) {
            //子组件 选择参与人 完成后调用的事件
            this.sprData = UserObject[0]
            console.log(this.sprData, 999, UserID)
            if (this.sprData && this.sprData.realName) {
                this.formDia.nextData.realName = this.sprData.realName
            } else {
                this.formDia.nextData.realName = ''
            }
            this.$refs.sdialog.isShow = false
        },
        open(isbool, hyId) {
            this.$confirm('正在执行删除操作, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    if (!isbool) {
                        this.rowYhid = hyId
                        this.delBtn()
                    } else if (isbool) {
                        this.selDelect()
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
        },
        // 重置
        resetBtn() {
            this.formInline = {
                ...this.formInline,
                ...{
                    problemDesc: '',
                    checkCategoryId: '',
                    hdLevel: '',
                    createBy: '',
                    dutyUser: '',
                    createDept: ''
                }
            }
            this.getData('cx')
        }
    },
    async created() {
        this.jcList = await dictType('safecheck_category')
        this.getCascader()
        this.getData()
    }
}
</script>
<style lang="scss" scoped>
.yhImg img {
    width: 230px;
    height: 260px;
}
</style>
