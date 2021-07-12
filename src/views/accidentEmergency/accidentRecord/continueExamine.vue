<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
      >
        <el-form-item label="发生时间" prop="occurTime">
          <div class="block">
            <el-date-picker
              disabled
              v-model="ruleForm.occurTime"
              type="datetime"
              placeholder="选择日期"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="直接经济损失" prop="occurPlace">
          <el-input
            disabled
            v-model="ruleForm.occurPlace"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="间接经济损失" prop="infoSource">
          <el-input
            disabled
            v-model="ruleForm.infoSource"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="参与事故救援单位" prop="cause">
          <el-input disabled v-model="ruleForm.cause" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="信息报告及应急处理情况" prop="nature">
          <el-input
            disabled
            v-model="ruleForm.nature"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理伤亡人员善后情况" prop="process">
          <el-input
            disabled
            v-model="ruleForm.process"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="清除社会及环境影响情况" prop="influence">
          <el-input
            disabled
            v-model="ruleForm.influence"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="对社会和生产秩序影响" prop="measure">
          <el-input
            disabled
            v-model="ruleForm.measure"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="主管部门验收的意见" prop="disposal">
          <el-input
            disabled
            v-model="ruleForm.disposal"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="事故暴露的问题" prop="nextstepPlan">
          <el-input
            disabled
            v-model="ruleForm.nextstepPlan"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="整改措施" prop="rescueSituation">
          <el-input
            disabled
            v-model="ruleForm.rescueSituation"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="fileList">
          <div class="upload">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="getUrl"
              :on-preview="handlePreview"
              multiple
              :limit="1"
              :file-list="fileLists"
              name="file"
            >
              <span slot="tip" class="el-upload__tip">点击文件下载</span>
            </el-upload>
            <div class="shade"></div>
          </div>
        </el-form-item>
        <el-form-item label="报送人" prop="createBy">
          <el-row>
            <el-col :span="12">
              <el-cascader
                disabled
                v-model="ruleForm.createByDeptId"
                ref="myCascader"
                :options="treeselect"
                :props="optionProps"
                @change="handleChange"
                placeholder="请选择部门"
              ></el-cascader>
            </el-col>
            <el-col :span="12">
              <el-select disabled v-model="ruleForm.createBy" value-key="cardId" placeholder="请选择">
                <el-option
                  v-for="item in UserList"
                  :key="item.userId"
                  :label="item.realName"
                  :value="item.realName"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注" prop="supSupport">
          <el-input
            disabled
            v-model="ruleForm.supSupport"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- <div class="dialog-footer">
        <el-button class="cancel-btn" @click="resetForm">取 消</el-button>
      </div>-->
    </div>
  </div>
</template>

<script>
import {
  getBusinessList,
  Classification,
  getContinueAdd,
  getContinueDetails,
  treeselect,
  getUserList
} from "@/api/accidentEmergency/accidentRecord";

export default {
  props: {
    person: String
  },
  data() {
    return {
      has: {
        add: "laws:projectDoc:add"
      },
      optionProps: {
        value: "id",
        label: "label",
        checkStrictly: true
      },
      fileLists: [],
      flag: true,
      loading: false,
      toUserName: "",
      ruleForm: {
        accidentId: "", //事故记录表主键
        occurTime: "", //续报时间
        occurPlace: "", //直接经济损失
        infoSource: "", //间接经济损失
        cause: "", //参与事故救援单位
        nature: "", //信息报告及应急处置情况
        process: "", //处理伤亡人员善后情况
        influence: "", //清除社会及环境影响情况
        measure: "", //对社会和生产秩序影响
        disposal: "", //主管部门验收的意见
        nextstepPlan: "", //事故暴露的问题
        rescueSituation: "", //整改措施
        supSupport: "", //备注
        createByDept: "", //报送部门
        createByDeptId: "", //报送部门编号
        createBy: "", //报送人
        createById: "", //报送人编号
        planFileList: [] //文件
      },
      rules: {},
      dialogVisible: false,
      treeselect: [],
      UserList: [],
      renewalIds: ""
    };
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/fs/upload"
      );
    }
  },
  created() {
    this.loading = true;
    this.renewalIds = this.person;
    this.department();
    this.goCheck();
  },
  methods: {
    //查看
    async goCheck() {
      try {
        let data = this.renewalIds;
        let changeData = await getContinueDetails(data);
        this.ruleForm = changeData;
        let arry = [];
        changeData.accidentrenewalFileList.map(item => {
          arry.push(
            Object.assign({}, { name: item.fileName, url: item.fileUrl })
          );
        });
        this.fileLists = [...arry];
      } catch (e) {
        console.error("接口异常");
      }
    },
    //获取部门
    async department() {
      this.treeselect = await treeselect();
    },
    //部门
    handleChange(value) {
      if (value != undefined) {
        let deptname = this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
        this.ruleForm.createByDept = deptname[deptname.length - 1];
      }
      if (this.ruleForm.createByDeptId != undefined) {
        this.ruleForm.createByDeptId = this.ruleForm.createByDeptId[
          this.ruleForm.createByDeptId.length - 1
        ];
        this.People();
      }
    },
    async People() {
      if (this.ruleForm.createByDeptId != undefined) {
        var end = this.ruleForm.createByDeptId;
        if (end != "") {
          this.UserList = await getUserList(end);
        }
      }
    },
    //获取人员的value和label值
    selectedCag(e) {
      let operUserIds = [];
      for (let i = 0; i <= e.length - 1; i++) {
        this.UserList.map(item => {
          if (item.realName == e[i]) {
            operUserIds.push(item.userId);
          }
        });
      }
      this.ruleForm.createById = operUserIds.toString();
    },

    // 取消
    resetForm() {
      this.$emit("func");
    },
    //下载
    handlePreview(file) {
      let row = file;
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
      location.href = this.fileDowloadName;
    }
  }
};
</script>
<style scoped>
.content_add_box {
  background-color: #fff;
  padding: 15px 0;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.shade {
  position: absolute;
  right: 0;
  height: 100%;
  width: 10%;
  top: 0;
  z-index: 999999;
  background-color: #fff;
}

.content_add_box .el-input__inner {
  border: none !important;
}
.tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
  margin-top: 18px;
  border-bottom: 1px solid #d7d7d7;
  margin-bottom: 25px;
}
.tit::before {
  display: inline-block;
  content: "";
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}
</style>
