<template>
  <!-- 培训需求 -->
  <div class="app-container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="岗位培训管理" name="first">
        <div class="left">
          <div class="left_title">机构</div>
          <el-tree
            :highlight-current="true"
            node-key="id"
            class="permission-tree"
            ref="deptTree"
            :check-strictly="checkStrictly"
            :default-expanded-keys="defaultMenutree"
            :default-checked-keys="defaultMenutree"
            :data="deptOptions"
            :props="defaultProps"
            @check="selLookBasicInfo"
            @check-change="treeCheck"
            @node-click="handleNodeClick"
            v-loading="treeloading"
            @node-expand="nodeclick"
          />
        </div>
        <div class="left_gw">
          <div class="left_title">岗位</div>
          <p v-if="choosingPost.length == 0">暂无数据</p>
          <p
            v-else
            v-for="(v, index) of choosingPost"
            :key="index"
            :class="{ active: activeNames == v.name }"
            @click="selected(v.name, v.deptName, v.deptId, v.postId)"
          >
            {{ v.name }}
          </p>
        </div>
        <div class="right safe_main">
          <!-- <div class="sxForm">
                  <el-form
                    :inline="true"
                    :model="pageForm"
                    ref="pageForm"
                    class="demo-form-inline"
                  >
                    <el-form-item label="培训类别" prop="pxClassId">
                      <el-select
                        v-model="pageForm.pxClassId"
                        placeholder="请选择培训类别"
                        @change="peojectTypeFunc"
                      >
                        label="区域一"
                        <el-option
                          :value="item.dictCode"
                          v-for="item in classRes"
                          :key="item.dictCode"
                          :label="item.dictLabel"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="培训主题" prop="pxTitleId">
                      <el-select
                        v-model="pageForm.pxTitleId"
                        placeholder="请选择培训主题"
                        @change="peojectFunc"
                      >
                        label="区域一"
                        <el-option
                          :value="item.dictCode"
                          v-for="item in themeRes"
                          :key="item.dictCode"
                          :label="item.dictLabel"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button
                        class="chaxun"
                        icon="el-icon-search"
                        v-has="has.query"
                        @click="getNeed('cx')"
                        >查询</el-button
                      >
                      <el-button @click="resetForm('pageForm')" class="chongzhi"
                        >重置</el-button
                      >
                    </el-form-item>
                  </el-form>
                    </div>-->
          <div class="sxTable">
            <!-- <el-button v-has="has.add" @click="handleAddNeed()">
                      新增
                    </el-button>
                    <el-button v-has="has.remove" @click="handleDelete(scope)">
                      批量删除
                        </el-button>-->
            <h3>{{ activeNames }}培训需求</h3>
            <el-table
              :data="needList"
              v-loading="loading"
              style="width: 100%"
              row-key="id"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              @selection-change="handleSelectionChange"
              height="calc(100vh - 380px)"
              stripe
            >
              <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
              <el-table-column align="center" label="序号">
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column align="center" label="类别">
                <template slot-scope="scope">
                  <div v-if="scope.row.type">
                    <el-select
                      v-model="scope.row.pxClassId"
                      placeholder="请选择培训类别"
                      @change="addseletpxClass($event, scope.$index)"
                    >
                      <el-option
                        :value="item.dictCode"
                        v-for="item in classRes"
                        :key="item.dictCode"
                        :label="item.dictLabel"
                      ></el-option>
                    </el-select>
                  </div>
                  <div v-else>{{ scope.row.pxClass }}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="培训主题">
                <template slot-scope="scope">
                  <div v-if="scope.row.type">
                    <el-select
                      v-model="scope.row.pxTitleId"
                      placeholder="请选择培训主题"
                      @change="addseletpxTitle($event, scope.$index)"
                    >
                      <el-option
                        :value="item.dictCode"
                        v-for="item in themeRes"
                        :key="item.dictCode"
                        :label="item.dictLabel"
                      ></el-option>
                    </el-select>
                  </div>
                  <div v-else>{{ scope.row.pxTitle }}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="周期">
                <template slot-scope="scope">
                  <div v-if="scope.row.type">
                    <el-select v-model="scope.row.pxCycle" placeholder="周期">
                      <el-option label="无" value="0"></el-option>
                      <el-option label="年度" value="1"></el-option>
                    </el-select>
                  </div>
                  <div v-else>{{ scope.row.pxCycle == 0 ? '无' : '年度' }}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="课时">
                <template slot-scope="scope">
                  <div v-if="scope.row.type">
                    <el-input
                      v-model.trim="scope.row.classHour"
                      oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                      maxlength="3"
                      @blur="salaryChange($event, scope.$index)"
                      show-word-limit
                      placeholder="请输入课时"
                    ></el-input>
                  </div>
                  <div v-else>{{ scope.row.classHour }}</div>
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                width="110"
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <div v-if="scope.row.type">
                    <el-button
                      type="text"
                      v-has="has.add"
                      size="medium"
                      @click="handleAddNeed(scope)"
                      >保存
                    </el-button>
                    <el-button
                      type="text"
                      size="medium"
                      @click="cancel(scope, scope.$index)"
                      >取消
                    </el-button>
                  </div>
                  <div v-else>
                    <el-button
                      type="text"
                      v-has="has.edit"
                      size="medium"
                      @click="handleEdit(scope.$index)"
                      >编辑
                    </el-button>

                    <el-button
                      type="text"
                      v-has="has.remove"
                      size="medium"
                      class="red"
                      @click="handleDelete(scope)"
                      >删除
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align:right">
              <el-button
                type="primary"
                v-has="has.add"
                @click="addTabledata"
                icon="el-icon-plus"
                circle
              ></el-button>
            </div>
            <!-- <el-pagination
                          background
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="total"
                          :current-page.sync="currentPage"
                          :page-sizes="pageSizes"
                          :page-size="pageForm.pageSize"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                        ></el-pagination>-->
          </div>
        </div>

        <!-- <el-dialog
                  :visible.sync="dialogVisible"
                  custom-class="small"
                  :title="dialogType === 'edit' ? '修改' : '新增'"
                  :close-on-click-modal="false"
                ></el-dialog>-->
        <!--选择部门及岗位盒子-->
        <sdialog
          ref="sdialog"
          chooseType="dept"
          @choiceUser="choiceUser"
          :isDx="false"
          :sNeed="true"
          :isCheckbox="true"
          dxId="user"
          :transferProps="{
            key: 'name',
            label: 'name'
          }"
          :treeResChild="Array.isArray(need.pxPostId) ? need.pxPostId : []"
          :transTitles="['可选岗位', '已选岗位']"
          :treedata="treeResDept"
        ></sdialog>
      </el-tab-pane>
      <el-tab-pane label="批量添加需求" name="second">
        <div class="second autoWidth">
          <el-form
            :model="need"
            :rules="loginRules"
            ref="needForm"
            label-width="120px"
            label-position="right"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="培训类别" prop="pxClass">
                  <el-select
                    v-model="need.pxClass"
                    placeholder="请选择培训类别"
                    @change="peojectTypeFunc"
                  >
                    <el-option
                      :value="item.dictCode"
                      v-for="item in classRes"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="培训主题" prop="pxTitle">
                  <el-select
                    v-model="need.pxTitle"
                    placeholder="请选择培训主题"
                    @change="peojectFunc"
                  >
                    <el-option
                      :value="item.dictCode"
                      v-for="item in themeRes"
                      :key="item.dictCode"
                      :label="item.dictLabel"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="选择部门" prop="pxDeptId">
                  <el-select
                    class="hide"
                    popper-class="hide"
                    v-if="dialogType !== 'edit'"
                    v-model="need.pxDeptId"
                    placeholder="请选择部门"
                    :multiple="dialogType === 'edit' ? false : true"
                    @focus="alertChoose"
                  >
                    <el-option
                      v-for="item in treeResDept2"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-cascader
                    v-else
                    ref="gwCascader"
                    v-model="need.pxDeptId"
                    :options="treeResDept"
                    :props="jobProps"
                    @change="change"
                    clearable
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="选择岗位" prop="pxPostId">
                  <el-select
                    v-if="dialogType === 'edit'"
                    v-model="need.pxPostId"
                    placeholder="请选择岗位"
                    @change="(val) => selectFun(val, 'pxPost')"
                  >
                    <el-option
                      v-for="item in treeResChild"
                      :key="item.id"
                      :label="item.label"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-else
                    class="hide"
                    popper-class="hide"
                    v-model="need.pxPostId"
                    placeholder="请选择岗位"
                    :multiple="true"
                    @focus="alertChoose"
                  >
                    <el-option
                      v-for="item in treeResChild"
                      :key="item.name"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="周期" prop="pxCycle">
                  <el-select v-model="need.pxCycle" placeholder="培训主题">
                    <el-option label="请选择" value></el-option>
                    <el-option label="无" value="0"></el-option>
                    <el-option label="年度" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="课时(单位:时)" prop="classHour">
                  <el-input
                    v-model="need.classHour"
                    maxlength="3"
                    show-word-limit
                    placeholder="请输入课时"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="内容" prop="pxContent">
              <el-input
                type="textarea"
                v-model="need.pxContent"
                maxlength="300"
                :autosize="{ minRows: 5 }"
                show-word-limit
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="要求" prop="pxRequire">
              <el-input
                type="textarea"
                maxlength="300"
                show-word-limit
                :autosize="{ minRows: 5 }"
                v-model="need.pxRequire"
                placeholder="请输入要求"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="tijiao">
            <el-button class="tBtn" v-has="has.add" @click="confirmmenu"
              >提交</el-button
            >
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="培训需求清单" name="third">
        <batchadd
          :classRes="classRes"
          :deptOptions="deptOptions"
          :themeRes="themeRes"
        ></batchadd>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getNeedList,
  getNeedList2,
  getAddNeed,
  getAddNeed2,
  getEditNeed,
  getNeedDetail,
  getDeleteNeed
} from '@/api/safety/need'
import { getSelectTheme } from '@/api/system/class'
// import { getTreeDeptSelect as getTreeDeptSelect2 } from '@/api/job/org'
import { getTreeDeptSelect, getTreeDeptSelect2 } from '@/api/job/workChart'
import { getPostsBydeptId, getPostsBydeptId2 } from '@/api/job/org'
import { getBranch } from '@/api/job/salary'
import { isNumber } from '@/utils/validate.js'
import Sdialog from '@/components/selectDialog'
import batchadd from './batchadd'

export default {
  components: {
    Sdialog: Sdialog,
    batchadd: batchadd
  },
  data() {
    return {
      isCheckId: '',
      currentPage: 1,
      activeName: 'first',
      choosingPost: [],
      has: {
        remove: 'train:trainDemand:remove',
        query: 'train:trainDemand:list',
        add: 'train:trainDemand:add',
        edit: 'train:trainDemand:edit'
      },
      total: 100,
      treeloading: false,
      pageSizes: [10, 15, 20, 25, 30],
      fileList: [
        {
          name: 'food.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          name: 'food2.jpeg',
          url:
            'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ],
      // has: {
      //   remove: 'system:menu:remove',
      //   query: 'system:menu:query',
      //   add: 'system:menu:add',
      //   edit: 'system:menu:edit'
      // },
      //搜索
      pageForm: {
        // pxTitleId: "",
        // pxClassId: "",
        pxDeptId: '',
        pxPostId: '',
        pageNum: 1,
        pageSize: 10
      },
      label: [],
      form: {
        region: '张三'
      },
      classRes: [],
      themeRes: [],
      //选择岗位
      treeResDept: [],
      treeResDept2: [],
      jobProps: {
        value: 'id',
        label: 'label',
        checkStrictly: true
        // lazy: true,
        // async lazyLoad(node, resolve) {
        //   let res = await getPostsBydeptId({ deptId: node.value })
        //   delete res[0].children
        //   console.log(res)
        //   node.children = [...node.children, ...res]
        //   setTimeout(() => {
        //     resolve(node.children)
        //   }, 1)
        // }
      },
      need: {
        pxTitleId: '',
        pxTitle: '',
        pxClassId: '',
        pxClass: '',
        pxContent: '',
        pxRequire: '',
        pxDept: '',
        pxDeptId: '',
        pxPostId: '',
        pxPost: '',
        pxCycle: '',
        classHour: ''
      },
      needList: [],
      activeNames: '',
      deptName: '',
      pxClass: '',
      pxTitle: '',
      dictClassRes: [],
      dictThemeRes: [],
      treeResChild: [],
      itmeLabel: '',
      dialogType: 'new',
      dialogVisible: false,
      loading: false,
      //树形结构
      checkStrictly: true,
      defaultMenutree: ['400'],
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      //表单验证方法
      loginRules: {
        pxClass: [
          {
            required: true,
            message: '请选择培训类别',
            trigger: 'change'
          }
        ],
        pxTitle: [
          {
            required: true,
            message: '请选择培训主题',
            trigger: 'change'
          }
        ],
        pxContent: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          },
          {
            max: 300,
            message: '长度需为300字符内',
            trigger: 'blur'
          }
        ],
        pxRequire: [
          {
            required: true,
            message: '请输入要求',
            trigger: 'blur'
          },
          {
            max: 300,
            message: '长度需为300字符内',
            trigger: 'blur'
          }
        ],
        pxDeptId: [
          {
            required: true,
            message: '请选择培训部门',
            trigger: 'change'
          }
        ],
        pxPostId: [
          {
            required: true,
            message: '请选择培训岗位',
            trigger: 'change'
          }
        ],
        pxCycle: [
          {
            required: true,
            message: '请选择周期',
            trigger: 'change'
          }
        ],
        classHour: [
          {
            required: true,
            message: '请输入0-9数字格式',
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == null || value == undefined || value == '') {
                callback(new Error('请输入0-9数字格式'))
              } else {
                if (!isNumber(value)) {
                  callback(new Error('只能输入0-9数字格式'))
                } else {
                  callback()
                }
              }
            }
          },
          {
            max: 3,
            message: '长度需为3字符内',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {},
  computed: {},
  created: async function() {
    //获取下拉树形部门
    this.treeloading = true
    this.treeRes = await getTreeDeptSelect2()
    this.deptOptions = this.treeRes
    this.treeloading = false
    this.default()
    // 初始化选中
    // this.$refs.deptTree.setCheckedKeys([this.treeRes[0].id], true)
    // this.currentChecke = this.treeRes[0].id
    // this.pageForm.pxDeptId = this.treeRes[0].id
    // this.getNeed();
    this.getClassSel()
    this.getThemeSel()
    this.treeResDept = await getBranch()
  },
  methods: {
    salaryChange(e, index) {
      this.needList[index].classHour = e.target.value
    },
    // 取消
    cancel(scope, index) {
      if (scope.row.type == 'post') {
        this.needList.splice(index, 1)
      } else if (scope.row.type == 'put') {
        this.needList[index].type = ''
      }
      console.log(this.needList)
    },
    // 选择部门岗位查询
    selected(gameName, deptName, deptId, postId) {
      this.activeNames = gameName
      this.deptName = deptName
      this.pageForm.pxDeptId = deptId
      this.pageForm.pxPostId = postId
      this.getNeed()
    },
    // 默认第一个部门和岗位
    async default() {
      //  默认部门
      let deptId = this.deptOptions[0].id
      this.deptName = this.deptOptions[0].label
      this.$refs.deptTree.setCheckedKeys([deptId], true)
      //  查询岗位
      let res = await getPostsBydeptId2(deptId)
      this.choosingPost = res
      this.activeNames = res[0].name
      let postId = res[0].postId
      this.pageForm.pxDeptId = deptId
      this.pageForm.pxPostId = postId
      this.getNeed()
    },
    // 标签页切换
    handleClick(tab, event) {
      if (tab.name == 'second') {
        this.$refs['needForm'].resetFields()
      }
      console.log(tab.name)
    },
    addseletpxTitle(val, index) {
      // val 当前选中的值 ， index 选择的数组对象
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.needList[index].pxTitleId = resultArr[0].dictCode
      this.needList[index].pxTitle = resultArr[0].dictLabel //直接写val也可以
    },
    addseletpxClass(val, index) {
      // val 当前选中的值 ， index 选择的数组对象
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.needList[index].pxClassId = resultArr[0].dictCode
      this.needList[index].pxClass = resultArr[0].dictLabel //直接写val也可以
    },
    // 新增单个需求
    addTabledata() {
      let data = {
        type: 'post', //类型 新增
        pxTitleId: '',
        pxTitle: '',
        pxClassId: '',
        pxClass: '',
        // pxDeptId: "",
        // pxDept: "",
        // pxPostId: "",
        // pxPost: "",
        pxCycle: '',
        classHour: ''
      }
      this.needList.push(data)
    },
    // 新增审批人 完成后的事件
    choiceUser(deptArr, UserObject, needData) {
      if (deptArr.length == 0) {
        this.$message({
          message: '请选择岗位',
          type: 'warning'
        })
        return
      }
      console.log(deptArr, UserObject, needData, 6666666666)
      this.treeResDept2 = needData.selNode.checkedNodes
      this.need.pxDeptId = needData.selNode.checkedKeys
      this.treeResChild = needData.transferData
      this.need.pxPostId = deptArr
      this.$refs.sdialog.isShow = false
    },
    alertChoose() {
      this.$refs.sdialog.isShow = true
    },

    async nodeclick(data, node) {
      // node.loading = true;
      // if (node.data.children.length == 1) {
      //   if (
      //     node.data.children[0].flag == "2" &&
      //     JSON.stringify(node.data.children[0].label) == "null"
      //   ) {
      //     node.data.children = [];
      //   }
      // }
      // let parw = {
      //   deptId: data.id
      // };
      // let res = await getPostsBydeptId2(data.id);
      // this.choosingPost=res
      // let treelist;
      // if (node.data.hasOwnProperty("children")) {
      //   treelist = [...node.data.children, ...res];
      // } else {
      //   treelist = res;
      // }
      // if (treelist.length == 0) {
      //   node.loading = false;
      //   return;
      // }
      // 去重
      // let map = new Map();
      // for (let item of treelist) {
      //   if (!map.has(item.id)) {
      //     map.set(item.id, item);
      //   }
      // }
      // treelist = [...map.values()];
      // this.$refs["deptTree"].updateKeyChildren(data.id, treelist);
      // node.loading = false;
    },

    async expandChange(arr) {
      let res = await getPostsBydeptId({
        deptId: arr[arr.length - 1]
      })
      console.log(this.treeRes, res)
    },
    //tree 选中 实践
    async handleNodeClick(data, node) {
      let res = await getPostsBydeptId2(data.id)
      this.choosingPost = res
    },
    // handleSizeChange(val) {
    //   this.pageForm.pageSize = val;
    //   this.getNeed();
    // },
    // handleCurrentChange(val) {
    //   this.pageForm.pageNum = val;
    //   this.getNeed();
    // },
    halfCheckedKeys() {
      console.log('getHalfCheckedKeys:')
      console.log(
        this.$refs.deptTree
          .getHalfCheckedKeys()
          .concat(this.$refs.deptTree.getCheckedKeys())
      )
    },
    //获取列表
    async getNeed(cx) {
      if (cx == 'cx') {
        this.pageForm.pageNum = 1
        this.currentPage = 1
      }
      this.loading = true
      const res = await getNeedList2(this.pageForm)
      this.needList = res
      // this.total = res.total;
      this.loading = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.pageForm.pageNum = this.currentPage = 1
      this.getNeed()
    },
    //获取分类下拉列表
    async getClassSel() {
      let dictName = 'train_type'
      this.classRes = await getSelectTheme(dictName)
    },
    //获取项目类型下拉id
    peojectTypeFunc(val) {
      let resultArr = this.classRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.need.pxClassId = resultArr[0].dictCode
      this.need.pxClass = resultArr[0].dictLabel //直接写val也可以
    },
    //获取主题下拉列表
    async getThemeSel() {
      let dictType = 'training_topics'
      this.themeRes = await getSelectTheme(dictType)
    },
    //获取项目进度下拉id
    peojectFunc(val) {
      let resultArr = this.themeRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.need.pxTitleId = resultArr[0].dictCode
      this.need.pxTitle = resultArr[0].dictLabel //直接写val也可以
    },
    //单选操作 treeCheck(data, isCheck, isChildrenCheck)
    async treeCheck(data, isCheck) {
      console.log(data, isCheck, 555)

      if (isCheck) {
        // let keys = this.$refs.deptTree.getCheckedKeys();
        this.$refs.deptTree.setCheckedKeys([], true) //取消所有险种
        this.$refs.deptTree.setCheckedKeys([data.id], true) // 选中当前
        this.isCheckId = ''
      } else {
        this.isCheckId = data.id
      }
    },
    //单击的时候查询信息
    async selLookBasicInfo(data) {
      this.flag = data.flag
      if (this.flag == 1 && this.isCheckId != data.id) {
        //为1进入岗位
        // var node = this.$refs.deptTree.getCheckedKeys()
        this.pageForm.pxDeptId = this.getParentDeptId(
          this.$refs.deptTree.getCheckedKeys(),
          this.deptOptions
        )
        console.log('或者当前id的父级id:' + this.pageForm.pxDeptId)
        this.pageForm.pxPostId = data.id
        this.need.pxPostId = data.id
        this.getNeed()
      } else if (this.isCheckId != data.id) {
        //为0进入部门
        this.pageForm.pxPostId = ''
        this.pageForm.pxDeptId = data.id
        this.getNeed()
      } else {
        this.pageForm = {
          pxTitleId: '',
          pxClassId: '',
          pxDeptId: '',
          pxPostId: '',
          pageNum: 1,
          pageSize: 10
        }
        this.getNeed()
      }
    },
    selectFun(val, txt) {
      // console.log(this.need,txt)
      if (txt) {
        this.need[txt] = event.target.innerText
      }
    },
    async change(arr) {
      if (this.$refs.gwCascader.getCheckedNodes()[0]) {
        var needArr = this.$refs.gwCascader.getCheckedNodes()[0].pathLabels
        this.need.pxDept = needArr[needArr.length - 1]
      }
      if (arr.length > 0) {
        this.need.pxPostId = ''
        this.need.pxDeptId = arr[arr.length - 1]
        this.treeResChild = await getPostsBydeptId({
          deptId: arr[arr.length - 1]
        })
      } else {
        this.treeResChild = []
        this.need.pxDeptId = this.need.pxPostId = ''
      }
      console.log(this.treeRes, this.treeResChild)
      // let nodesObj = this.$refs['cascader'].getCheckedNodes()
      // if (nodesObj[0].data.flag == 0) {
      //   //如果最后一个是部门的话 不让它选择
      //   // delete this.need.pxPostId
      //   //   this.need.pxDeptId = nodesObj[0].data.id
      //   //   this.need.pxPost = this.$refs['cascader' ].getCheckedNodes()[0].pathLabels[this.$refs['cascader'].getCheckedNodes()[0].pathLabels.length - 1
      //   //   ]
      //   this.$set(this.need, 'pxPostId', [])
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择岗位!'
      //   })
      //   return
      // } else if (nodesObj[0].data.flag == 1) {
      //   //如果是岗位的话
      //   this.treeArr = nodesObj[0].path
      //   this.need.pxPostId = this.treeArr[this.treeArr.length - 1]
      //   this.need.pxDeptId = this.treeArr[this.treeArr.length - 2]
      //   this.need.pxDept = this.$refs[
      //     'cascader'
      //   ].getCheckedNodes()[0].pathLabels[
      //     this.$refs['cascader'].getCheckedNodes()[0].pathLabels.length - 2
      //   ]
      //   this.need.pxPost = this.$refs[
      //     'cascader'
      //   ].getCheckedNodes()[0].pathLabels[
      //     this.$refs['cascader'].getCheckedNodes()[0].pathLabels.length - 1
      //   ]
      // }
    },
    //新增
    async handleAddNeed(v) {
      console.log(v)
      if (
        !v.row.classHour ||
        !v.row.pxClass ||
        !v.row.pxCycle ||
        !v.row.pxTitle
      ) {
        this.$message({
          message: '请填写完整再保存！',
          type: 'warning'
        })
        return
      }
      let data = JSON.parse(JSON.stringify(v.row))
      let res
      // 如果是新增
      if (data.type == 'post') {
        data.pxDeptId = this.pageForm.pxDeptId
        data.pxDept = this.deptName
        data.pxPostId = this.pageForm.pxPostId
        data.pxPost = this.activeNames
        delete data.type
        res = await getAddNeed2(data)
      } else if (data.type == 'put') {
        delete data.type
        res = await getEditNeed(data)
      }
      this.$notify({
        title: data ? '成功' : '失败',
        dangerouslyUseHTMLString: true,
        message: data ? data.message : '服务器开小差了，请稍后再试',
        type: data ? 'success' : 'warning'
      })
      this.getNeed()
      // this.itmeLabel = "";
      // this.dialogType = "new";
      // this.dialogVisible = true;
      // if (this.$refs["needForm"]) {
      //   this.$refs["needForm"].resetFields();
      // }
      // this.getClassSel();
      // this.getThemeSel();
    },
    //编辑
    async handleEdit(index) {
      this.needList[index].type = 'put'
      console.log(this.needList[index])
      this.needList = JSON.parse(JSON.stringify(this.needList))
      // this.dialogType = "edit";
      // this.dialogVisible = true;
      // if (this.$refs["needForm"]) {
      //   this.$refs["needForm"].resetFields();
      // }
      // let traindemandId = scope.row.traindemandId;
      // this.need = await getNeedDetail(traindemandId);
      // // 根据返回的部门id 获取岗位列表重显
      // this.treeResChild = await getPostsBydeptId({
      //   deptId: this.need.pxDeptId
      // });
      // this.need.classHour = this.need.classHour + "";
      // console.log("打印培训岗位id:" + this.need.pxPostId);
    },
    //删除
    handleDelete(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的选项!'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除吗?', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDeleteNeed(row ? row.traindemandId : this.multipleSelection)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getNeed()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.traindemandId)
        }
        this.multipleSelection = [...arr]
      }
    },
    confirmmenu() {
      //校验表单
      this.$refs.needForm.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写完整',
            type: 'warning'
          })
          return
        }
        //取得选中菜单id集合
        let data = null
        this.$confirm('是否确定提交?', '提交', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            try {
              let sysDeptList = this.treeResDept2.map((item) => {
                return {
                  deptId: item.id,
                  deptName: item.label
                }
              })

              let getData = {
                classHour: this.need.classHour,
                pxClass: this.need.pxClass,
                pxClassId: this.need.pxClassId,
                pxContent: this.need.pxContent,
                pxCycle: this.need.pxCycle,
                pxRequire: this.need.pxRequire,
                pxTitle: this.need.pxTitle,
                pxTitleId: this.need.pxTitleId,
                sysDeptList: sysDeptList,
                businessPostNameList: this.need.pxPostId
              }
              data = await getAddNeed(getData)
            } catch (e) {
              console.error('接口异常')
            }
            // this.dialogVisible = false;
            this.$notify({
              title: data ? '成功' : '失败',
              dangerouslyUseHTMLString: true,
              message: data ? data.message : '服务器开小差了，请稍后再试',
              type: data ? 'success' : 'warning'
            })
            ;(this.need = {
              pxTitleId: '',
              pxTitle: '',
              pxClassId: '',
              pxClass: '',
              pxContent: '',
              pxRequire: '',
              pxDept: '',
              pxDeptId: '',
              pxPostId: '',
              pxPost: '',
              pxCycle: '',
              classHour: ''
            }),
              (this.activeName = 'first')
            this.getNeed()
            return
          })
          .catch((err) => {})
      })
    },
    //传入参数，选中id，部门id数组
    //返回["父级id", "选中id"]
    getParentDeptId(chridenDeptId, deptArr, parentDeptId) {
      let returnArr = []
      for (let temDept in deptArr) {
        parentDeptId = parentDeptId || deptArr[temDept].id
        if (deptArr[temDept].id == chridenDeptId) {
          // returnArr = [parentDeptId, chridenDeptId]
          returnArr = parentDeptId
          return returnArr
        }
        if (deptArr[temDept].children) {
          returnArr = this.getParentDeptId(
            chridenDeptId,
            deptArr[temDept].children,
            deptArr[temDept].id
          )
          if (returnArr.length > 0) {
            return returnArr
          }
        }
      }
      return returnArr
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item{
  margin-bottom: 22px !important;
}
.app-container .right,
.safe_main .right {
  width: 64%;
}

.app-container .left {
  padding-top: 0;
  border-radius: 5px;
  height: calc(100vh - 255px);
}

.left_gw {
  float: left;
  width: 12%;
  border: 1px solid #eee;
  border-radius: 5px;
  margin-left: 5px;
}

.left_gw > p {
  margin: 5px 0 5px 0 !important;
  padding: 3px 8px !important;
  cursor: pointer;
  font-size: 15px;
}

.left_gw > p:hover {
  color: #2c6cbd;
  background-color: #f0f7ff;
}

.active {
  color: #2c6cbd;
  background-color: #f0f7ff;
}

.left_title {
  height: 40px;
  background: #0d74d7;
  border-radius: 5px;
  text-align: center;
  color: #ffffff;
  line-height: 40px;
  user-select: none;
}

h3 {
  text-align: center;
}

.second /deep/ {
  .el-form-item__content {
    line-height: 0;
  }

  .el-row {
    margin-bottom: 20px;
  }
}

.tijiao {
  text-align: right;
}

</style>
