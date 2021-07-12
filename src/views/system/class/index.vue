<template>
  <div class="app-container container-table">
    <div class="table-list">
      <el-button
        class="table-add-btn"
        v-has="has.add"
        @click="handleAddClass()"
        icon="el-icon-plus"
      >
        新增
      </el-button>

      <el-table
        :data="classList"
        v-loading="loading"
        style="width: 100%; margin-top: 30px"
        @selection-change="handleSelectionChange"
        row-key="classdictId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>

        <el-table-column align="center" label="分类名称">
          <template slot-scope="scope">
            {{ scope.row.dictName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="字典编号">
          <template slot-scope="scope">
            {{ scope.row.dictNumber }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="是否是业务数据">
          <template slot-scope="scope">
            <span v-if="scope.row.business == true">是</span>
            <span v-if="scope.row.business == false">否</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="260" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has="has.add"
              size="medium"
              @click="handleAddClass(scope)"
            >
              添加下级
            </el-button>
            <el-button
              type="text"
              v-has="has.edit"
              size="medium"
              @click="handleEdit(scope)"
              :disabled="scope.row.business"
            >
              编辑
            </el-button>

            <el-button
              type="text"
              v-has="has.remove"
              size="medium"
              @click="handleDelete(scope)"
              :disabled="scope.row.business"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        :title="dialogType === 'edit' ? '修改' : '新增'"
      >
        <el-form
          :model="modelClass"
          :rules="loginRules"
          ref="classForm"
          label-width="120px"
          label-position="right"
        >
          <el-form-item label="父级节点" prop="pclassdictId">
            <div class="block">
              <el-cascader
                v-model="dictName"
                :options="this.classList"
                :props="classProps"
                style="width: 40%"
                clearable
              >
              </el-cascader>
            </div>
          </el-form-item>

          <el-form-item label="分类名称" prop="dictName">
            <el-input
              v-model="modelClass.dictName"
              placeholder="请输入分类名称"
              style="width: 40%"
              maxlength="30"
              show-word-limit
            ></el-input>
          </el-form-item>
          <p class="tite_hint">
            提示：字典编码格式举例:DICT_+字典名称每个字的大写,列如：DICT_TASKTYPE
          </p>
          <el-form-item label="字典编号" prop="dictNumber">
            <el-input
              v-model="modelClass.dictNumber"
              placeholder="请输入字典编号"
              style="width: 40%"
              maxlength="30"
              show-word-limit
              onkeyup="value=value.replace(/[\u4e00-\u9fa5\d]/g,'')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button class="confirm-btn" @click="confirmmenu"> 提交 </el-button>
          <el-button class="cancel-btn" @click="dialogVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getClassList,
  getAddClassList,
  getUpdataClassList,
  getClassSelect,
  getDeleteClass,
} from "@/api/system/class";

import elementIcons from "@/views/system/class/element-icons.js";

export default {
  data() {
    return {
      has: {
        remove: "system:ClassDict:delete",
        query: "system:ClassDict:list",
        add: "system:ClassDict:add",
        edit: "system:ClassDict:edit",
      },
      elementIcons,
      itmeLabel: "",
      modelClass: {
        dictName: "",
        pclassdictId: "",
        dictNumber: "",
      },
      classdictId: "",
      dictName: [],
      classProps: {
        value: "classdictId",
        label: "dictName",
        checkStrictly: true,
      },
      loading: false,
      classtreeSelectData: [],
      classList: [],
      defaultMenutree: [],
      multipleSelection: [],
      dialogVisible: false,
      innerVisible: false,
      innerVisible2: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
      //表单验证方法
      loginRules: {
        dictName: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的分类名称",
          },
        ],
        dictNumber: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确的分类名称",
          },
        ],
        component: [
          {
            required: () => {
              return this.menu.menuType != "M";
            },
            message: "请输入正确的组件路径",
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (this.menu.menuType == "M") {
                callback();
              } else {
                if (value == null || value == undefined || value == "") {
                  callback(new Error("请输入正确的组件路径"));
                } else {
                  callback();
                }
              }
            },
          },
        ],
      },
    };
  },
  computed: {
    getClassId(classdictId) {
      return classdictId.toString();
    },
  },
  created() {
    this.getClass();
  },
  methods: {
    checkChange(itmeForData, itmeForNode, itme) {
      this.menu.parentId = itmeForData.id;
      this.itmeLabel = itmeForData.label;
      this.innerVisible = false;
    },
    choiceIcon(itme) {
      this.menu.icon = itme;
      this.innerVisible2 = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getClass();
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.menuId);
        }
        this.multipleSelection = [...arr];
      }
    },
    async getClass() {
      this.loading = true;
      this.classList = await getClassList();

      // this.total = res.total
      this.loading = false;
    },
    //新增
    handleAddClass(scope) {
      this.itmeLabel = "";
      this.dialogType = "new";
      this.dialogVisible = true;
      if (this.$refs["classForm"]) {
        this.$refs["classForm"].resetFields();
      }
      if (scope) {
        let pclassdictId = scope.row.pclassdictId;
        this.modelClass.pclassdictId = pclassdictId;
        this.dictName = [];
        this.dictName.push(this.modelClass.pclassdictId);
      }
    },
    //编辑
    async handleEdit(scope) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      if (this.$refs["classForm"]) {
        this.$refs["classForm"].resetFields();
      }
      let pclassdictId = scope.row.pclassdictId;
      let classdictId = scope.row.classdictId;
      this.modelClass = await getClassSelect(classdictId);
      this.dictName = [];
      this.dictName.push(this.modelClass.pclassdictId);
    },
    //删除
    handleDelete(scope) {
      let row = scope ? scope.row : null;
      this.$confirm("确定删除菜单吗?", "删除菜单", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDeleteClass(row.classdictId);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getClass();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    confirmmenu() {
      //校验表单
      this.$refs.classForm.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        //判断状态
        const isEdit = this.dialogType === "edit";
        //取得选中菜单id集合
        let data = null;
        this.modelClass.pclassdictId = this.dictName[this.dictName.length - 1];
        try {
          if (isEdit) {
            data = await getUpdataClassList(this.modelClass);
          } else {
            delete this.modelClass.updateBy;
            data = await getAddClassList(this.modelClass);
          }
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogVisible = false;
        if (data != null) {
          this.$notify({
            title:  "成功" ,
            dangerouslyUseHTMLString: true,
            message: data.message ,
            type: "success",
          });
        }
        this.getClass();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  .menus-table {
    margin-top: 15px;
  }
  .tite_hint {
    margin-left: 90px;
    color: coral;
    font-size: 12px;
  }
  .permission-tree {
    margin-bottom: 15px;
  }
  .upload-demo {
    display: inline-block;
  }
}

.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 10px;
    height: 65px;
    text-align: center;
    width: 80px;
    float: left;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
