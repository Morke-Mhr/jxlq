<template>
  <div class="safe_main">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
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
        <el-form-item prop="projectTypeId" label="项目类型">
          <el-select
            v-model="pageForm.projectTypeId"
            placeholder="请选择项目类型"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in itemRes"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="projectProcessId" label="项目进度">
          <el-select
            v-model="pageForm.projectProcessId"
            placeholder="请选择项目进度"
          >
            <el-option
              :value="item.dictCode"
              v-for="item in itemSche"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="btnCont">
          <el-button class="chaxun" v-has="has.query" @click="getAllList()"
            >查询
          </el-button>
          <el-button @click="resetForm('pageForm')" class="chongzhi"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <!-- <el-button v-has="has.add" @click="handleAdd()">立项</el-button> -->
      <!--      <el-button v-has="has.remove" @click="handleDel(scope)">批量删除</el-button>-->
      <el-button v-has="has.export" class="blue" @click="taskexport"
        >导出</el-button
      >

      <el-table
        :data="tableData"
        v-loading="loading"
        style="width: 100%"
        tooltip-effect="light"
        height="calc(100vh - 380px)"
        @selection-change="handleSelectionChange"
        row-key="safebookId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>

        <el-table-column label="项目名称" show-overflow-tooltip align="center">
          <template slot-scope="scope">{{ scope.row.projectName }}</template>
        </el-table-column>
        <el-table-column
          label="标段"
          show-overflow-tooltip
          align="center"
          width="160"
        >
          <template slot-scope="scope">{{ scope.row.bid }}</template>
        </el-table-column>
        <el-table-column
          label="项目类型"
          show-overflow-tooltip
          align="center"
          width="140"
        >
          <template slot-scope="scope">{{ scope.row.projectType }}</template>
        </el-table-column>
        <el-table-column
          label="项目部"
          show-overflow-tooltip
          align="center"
          width="240"
        >
          <template slot-scope="scope">{{ scope.row.projectDept }}</template>
        </el-table-column>
        <el-table-column
          label="项目进度"
          show-overflow-tooltip
          align="center"
          width="120"
        >
          <template slot-scope="scope">{{ scope.row.projectProcess }}</template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          show-overflow-tooltip
          align="center"
          width="240"
        >
          <template slot-scope="scope">{{ scope.row.startTime }}</template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          show-overflow-tooltip
          align="center"
          width="240"
        >
          <template slot-scope="scope">{{ scope.row.endTime }}</template>
        </el-table-column>

        <el-table-column fixed="right" width="90" align="center" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" v-has="has.edit" @click="handleEdit(scope)"
              >编辑</el-button
            > -->
            <el-button class="red" type="text" v-has="has.remove" @click="handleDel(scope)"
              >删除</el-button
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
        @current-change="handleCurrentChange"
      ></el-pagination>

      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="small"
        :title="dialogType === 'edit' ? '修改立项信息' : '新增立项信息'"
      >
        <el-form
          :model="itemModel"
          :rules="formRules"
          ref="itemForm"
          label-width="120px"
          label-position="right"
        >
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="itemModel.projectName"
              maxlength="30"
              show-word-limit
              placeholder="请输入项目名称"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="标段" prop="bid">
            <el-input
              v-model="itemModel.bid"
              maxlength="20"
              show-word-limit
              placeholder="请输入标段"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item label="项目类型" prop="projectTypeId">
            <el-select
              v-model="itemModel.projectTypeId"
              placeholder="请选择项目类型"
              @change="peojectTypeFunc"
            >
              <el-option
                :value="item.dictCode"
                v-for="item in itemRes"
                :key="item.dictCode"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目进度" prop="projectProcessId">
            <el-select
              v-model="itemModel.projectProcessId"
              placeholder="请选择项目进度"
              @change="peojectFunc"
            >
              <el-option
                :value="item.dictCode"
                v-for="item in itemSche"
                :key="item.dictCode"
                :label="item.dictLabel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="16">
              <el-form-item label="项目地址" prop="position">
                <el-input
                  v-model="itemModel.position"
                  :disabled="true"
                  placeholder="请选择项目地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button
                class="fBtn"
                icon="el-icon-location"
                @click="dialogVisiblemap = true"
                >选择位置
              </el-button>
            </el-col>
          </el-row>
          <el-form-item label="经度" prop="longitude">
            <el-input
              v-model="itemModel.longitude"
              :disabled="true"
              placeholder="请选择项目经度"
            />
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input
              v-model="itemModel.latitude"
              :disabled="true"
              placeholder="请选择项目纬度"
            />
          </el-form-item>
          <el-form-item label="项目概况" prop="survey">
            <el-input
              v-model="itemModel.survey"
              maxlength="300"
              type="textarea"
              :rows="5"
              show-word-limit
              placeholder="请输入项目部"
            />
          </el-form-item>

          <el-form-item label="开始时间" prop="startTime">
            <div class="block">
              <el-date-picker
                v-model="itemModel.startTime"
                type="datetime"
                placeholder="开始时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="startOptions"
              ></el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <div class="block">
              <el-date-picker
                v-model="itemModel.endTime"
                type="datetime"
                placeholder="结束时间"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="endOptions"
              ></el-date-picker>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="confirmItem" class="tBtn">提交</el-button>
          <el-button @click="dialogVisible = false" class="fBtn"
            >取消</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        title="选择项目位置"
        :close-on-click-modal="false"
        append-to-body
        custom-class="small"
        :visible.sync="dialogVisiblemap"
        v-if="dialogVisiblemap"
      >
        <selectMap ref="selectMap" @close="close"></selectMap>
        <span slot="footer" class="dialog-footer">
          <el-button class="tBtn" @click="determine">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import selectMap from './selectMap'
import {
  getTechnologyList,
  getAddTech,
  getItemListDetail,
  getEditItem,
  getDeleteItem
} from '@/api/technology/item/item.js'
import { getSelectTechItem } from '@/api/system/class'
import { getTreeDeptSelect } from '@/api/job/org'
import { getPostsBydeptId } from '@/api/job/org'
// import {
//   getTechnologyList,
//   getSelectTechItem,
//   getAddTech
// } from '@/api/technology/item/itemMock.js'
// import {
//   isBasicDate,
// } from '@/utils/date.js'
import elementIcons from '@/views/system/menu/element-icons.js'
import axios from 'axios'
import { getToken } from '@/utils/auth'
// const defaultDept = {
//   deptId:'',
//   deptName:'',
//   email:'',
//   leader:'',
//   orderNum:'',
//   parentId:'',
//   phone:'',
//   status:'0'
// }
//新增表单字段对象
const defaultItem = {
  //项目名称
  projectName: '',
  //标段
  bid: '',
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
  endTime: '',
  survey: '',
  // 项目地址
  position: '',
  longitude: '',
  latitude: ''
}
export default {
  components: {
    selectMap
  },
  data() {
    return {
      has: {
        remove: 'safemanage:project:remove',
        query: 'safemanage:project:list',
        add: 'safemanage:project:add',
        edit: 'safemanage:project:edit',
        export: 'safemanage:project:export'
      },
      dialogVisiblemap: false,
      addTit: '新增',
      tableData: [],
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,

      //搜索
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        bid: '',
        projectTypeId: '',
        projectProcessId: ''
      },
      //树形
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      multipleSelection: [],
      dialogType: 'new',
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: function(data, node) {
          if (data.flag == '1') {
            return true
          } else {
            return false
          }
        }
      },
      elementIcons,

      loading: false,
      startOptions: {
        disabledDate: (time) => {
          let endDateVal = this.itemModel.endTime
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime()
          }
        }
      },
      endOptions: {
        disabledDate: (time) => {
          let beginDateVal = this.itemModel.startTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime()
          }
        }
      },
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
        position: [
          {
            required: true,
            message: '请选择项目地址',
            trigger: 'change'
          }
        ],
        longitude: [
          {
            required: true,
            message: '请选择项目经度',
            trigger: 'change'
          }
        ],
        latitude: [
          {
            required: true,
            message: '请选择项目纬度',
            trigger: 'change'
          }
        ],
        // projectProcessId: [{
        //   required: true,
        //   message: '请选择项目进度',
        //   trigger: 'blur'
        // }],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'blur'
            // validator:validateStartTime,
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'blur'
            // validator:validateEndTime,
          }
        ]
      },
      //新增表单字段对象
      itemModel: {
        //项目名称
        projectName: '',
        //标段
        bid: '',
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
        endTime: '',
        survey: '',
        // 项目地址
        position: '',
        longitude: '',
        latitude: ''
      },
      //项目类型数组
      itemRes: [],
      //项目进度数组
      itemSche: []
    }
  },
  created: async function() {
    this.getItemSel()
    let type = sessionStorage.getItem('item')
    this.getItemSchdSel().then(() => {
      if (type) {
        for (let v of this.itemSche) {
          if (v.dictLabel == type) {
            this.$set(this.pageForm, 'projectProcessId', v.dictCode)
          }
        }
        this.getAllList()
      }
    })
    this.getAllList()
  },
  beforeDestroy() {
    sessionStorage.removeItem('item')
  },
  destroyed() {
    sessionStorage.removeItem('item')
  },
  mounted() {},
  methods: {
    // 关闭地图选择弹出层，回显选择地址信息
    close(v) {
      console.log(v)
      this.$set(this.itemModel, 'position', v.address)
      this.$set(this.itemModel, 'longitude', v.lng)
      this.$set(this.itemModel, 'latitude', v.lat)
      this.dialogVisiblemap = false
    },
    // 选择位置
    determine() {
      this.$refs.selectMap.deter()
    },
    // 导出
    async taskexport() {
      // 导出接口
      axios({
        method: 'get',
        url:
          this.$store.state.apiConfiguration.url +
          this.$store.state.serviceName.technology +
          '/newProject/pc/exportData',
        responseType: 'blob', // 表明返回服务器返回的数据类型
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken()
        },
        data: {
          //接口参数
        }
      }).then(function(response) {
        //创建一个隐藏的a连接，
        const link = document.createElement('a')
        let blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        })
        link.style.display = 'none'
        //设置连接
        link.href = URL.createObjectURL(blob)
        link.download = '项目立项.xlsx'
        document.body.appendChild(link)
        //模拟点击事件
        link.click()
      })
    },
    async nodeclick(data, node) {
      node.loading = true
      if (node.data.children.length == 1) {
        if (
          node.data.children[0].flag == '2' &&
          JSON.stringify(node.data.children[0].label) == 'null'
        ) {
          node.data.children = []
        }
      }
      let parw = {
        deptId: data.id
      }
      let res = await getPostsBydeptId(parw)
      let treelist
      if (node.data.hasOwnProperty('children')) {
        treelist = [...node.data.children, ...res]
      } else {
        treelist = res
      }
      if (treelist.length == 0) {
        node.loading = false
        return
      }
      // 去重
      let map = new Map()
      for (let item of treelist) {
        if (!map.has(item.id)) {
          map.set(item.id, item)
        }
      }
      treelist = [...map.values()]
      this.$refs['deptTree'].updateKeyChildren(data.id, treelist)
      node.loading = false
    },

    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.projectId)
        }
        this.multipleSelection = [...arr]
      }
    },
    //获取列表数据
    //获取列表
    async getAllList() {
      this.loading = true
      const res = await getTechnologyList(this.pageForm)
      this.tableData = res.rows
      this.total = res.total
      console.log(res)
      console.log(res.rows)
      this.loading = false
    },
    //获取项目类型下拉列表
    async getItemSel() {
      let dictName = 'project_type'
      this.itemRes = await getSelectTechItem(dictName)
    },
    //获取项目进度下拉列表
    async getItemSchdSel() {
      let dictName = 'project_schdule'
      this.itemSche = await getSelectTechItem(dictName)
    },
    //查看
    async handleAdd(scope) {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.defaultMenutree = []
      this.deptOptions = await getTreeDeptSelect()
      if (this.$refs['itemForm']) {
        this.$refs['itemForm'].resetFields()
      }
      this.itemModel = defaultItem
      if (this.$refs.deptTree) {
        this.deptOptions = await getTreeDeptSelect()
        this.$refs.deptTree.setCheckedKeys([], false)
      }
      // if (scope) {
      //   let projectDeptId = scope.row.projectDeptId;
      //   this.defaultMenutree = [projectDeptId];
      //   this.dept.projectDeptId = projectDeptId;
      // }
    },
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      if (this.$refs['itemForm']) {
        this.$refs['itemForm'].resetFields()
      }
      let projectId = scope.row.projectId
      this.itemModel = await getItemListDetail(projectId)
      // if (this.$refs.deptTree) {
      //   this.deptOptions = await getTreeDeptSelect();
      //   this.$refs.deptTree.setCheckedKeys(
      //     [this.itemModel.projectDeptId],
      //     true
      //   );
      // }
    },
    confirmItem() {
      //校验表单
      this.$refs.itemForm.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写完整',
            type: 'warning'
          })
          return
        }
        const isEdit = this.dialogType === 'edit'
        //取得选中菜单id集合
        let data = null
        // const deptTreeKeys = this.$refs.deptTree.getCheckedKeys();
        // this.itemModel.projectDeptId = deptTreeKeys[0];
        try {
          if (isEdit) {
            data = await getEditItem(this.itemModel)
          } else {
            data = await getAddTech(this.itemModel)
          }
        } catch (e) {
          console.error('接口异常')
        }
        console.log(this.itemModel)
        this.dialogVisible = false
        this.$notify({
          title: data ? data : '操作失败',
          dangerouslyUseHTMLString: true,
          // message: data ? data.message : '系统正在维护中，请与管理员联系',
          type: data ? 'success' : 'warning'
        })
        this.getAllList()
      })
    },
    //获取项目进度下拉id
    peojectFunc(val, vIndex) {
      let resultArr = this.itemSche.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.itemModel.projectProcessId = resultArr[0].dictCode
      this.itemModel.projectProcess = resultArr[0].dictLabel //直接写val也可以
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.itemRes.filter((item) => {
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
          message: '请选择要删除的选项！'
        })
        return
      }
      let row = scope ? scope.row : null
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await getDeleteItem(row ? row.projectId : this.multipleSelection)
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.getAllList()
        })
        .catch((err) => {
          console.error(err)
        })
    },
    //查看
    async handleDetail() {
      this.$router.push({
        path: '/people/lookPeople'
      })
    },

    // treeCheck(data, isCheck, isChildrenCheck) {
    //   if (isCheck) {
    //     this.itemModel.projectDeptId = data.id;
    //     this.itemModel.projectDept = data.label;
    //     let keys = this.$refs.deptTree.getCheckedKeys();
    //     // let itme = [keys[keys.length-1]]
    //     if (this.currentChecke && this.currentChecke == "") {
    //       this.currentChecke = keys[0];
    //     } else {
    //       let this_ = this;
    //       keys.some((value) => {
    //         if (value != this_.currentChecke) {
    //           this_.currentChecke = value;
    //           return true;
    //         }
    //       });
    //     }
    //     let itme = [this.currentChecke];
    //     this.$refs.deptTree.setCheckedKeys(itme, true);
    //   }
    // },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAllList()
    },
    ///页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getAllList()
    }
  }
}
</script>
