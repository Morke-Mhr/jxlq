<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="发生1111时间" prop="occurTime">
          <div class="block">
            <el-date-picker
              disabled
              v-model="ruleForm.occurTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="发生地点" prop="occurPlace">
          <el-input disabled v-model="ruleForm.occurPlace" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="事件区域" prop="area">
          <el-select
            disabled
            v-model="ruleForm.area"
            @change="ChangeStatus"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事故类别" prop="type">
          <el-select
            disabled
            v-model="ruleForm.type"
            @change="ChangeType"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options2"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信息来源" prop="infoSource">
          <el-input disabled v-model="ruleForm.infoSource" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="事件起因" prop="cause">
          <el-input disabled v-model="ruleForm.cause" type="textarea" :rows="3" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="事故性质" prop="nature">
          <el-select
            disabled
            v-model="ruleForm.nature"
            @change="ChangeNature"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options1"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基本过程" prop="process">
          <el-input disabled v-model="ruleForm.process" type="textarea" :rows="3" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="影响与趋势" prop="influence">
          <el-input
            disabled
            v-model="ruleForm.influence"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="已采取措施" prop="measure">
          <el-input disabled v-model="ruleForm.measure" type="textarea" :rows="3" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="应急处置情况" prop="disposal">
          <el-input
            disabled
            v-model="ruleForm.disposal"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="下一步计划" prop="nextstepPlan">
          <el-input
            disabled
            v-model="ruleForm.nextstepPlan"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="现场指挥救援情况" prop="rescueSituation">
          <el-input
            disabled
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="ruleForm.rescueSituation"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否需要上级支持" prop="supSupport">
          <el-input
            disabled
            v-model="ruleForm.supSupport"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
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
              <el-select
                disabled
                v-model="ruleForm.createBy"
                @change="selectedCag($event)"
                value-key="cardId"
                placeholder="请选择人员"
              >
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
        <el-form-item label="联系方式" prop="iphone">
          <el-input v-model="ruleForm.iphone" disabled placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="planFileList">
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
  getAddList,
  getCheck,
  treeselect,
  getUserList
} from "@/api/accidentEmergency/accidentRecord";
import { getTreeSelect } from "@/api/job/safety"; //获取部门

import Sdialog from "@/components/selectDialog"; //通过部门选择人

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
      options: [], //事故区域
      options1: [], //获取事故性质字典
      options2: [], //事故类别
      fileLists: [],
      flag: true,
      loading: false,
      toUserName: "",
      ruleForm: {
        occurTime: "", //时间
        occurTime: "", //发生地点
        infoSource: "", //信息来源
        cause: "", //事件起因
        nature: "", //事故性质
        natureId: "",
        area: "", //事故区域
        areaId: "",
        type: "", //事故类型
        typeId: "",
        process: "", //基本过程
        influence: "", //影响与趋势
        measure: "", //已采取措施
        disposal: "", //应急处置情况
        nextstepPlan: "", //下一步计划
        rescueSituation: "", //现场指挥救援情况
        supSupport: "", //是否需要上级支持
        iphone: "", //联系方式|自动带报送人手机信息
        createByDept: "", //报送部门
        createByDeptId: "",
        createBy: "", //报送人
        createById: "",
        planFileList: []
      },
      rules: {
        // userName: [
        //   { required: true, message: "请选择签订人", trigger: "change" },
        // ],
        // safeDuty: [
        //   { required: true, message: "请选择输入安全责任", trigger: "blur" },
        // ],
      },
      dialogVisible: false,
      accidentId: "",
      treeselect: [],
      UserList: []
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
    this.accidentId = this.person;
    this.Classifications();
    this.department();
    this.goCheck();
  },
  methods: {
    //查看
    async goCheck() {
      try {
        let data = this.accidentId;
        let changeData = await getCheck(data);
        this.ruleForm = changeData;
        let arry = [];
        changeData.accidentFileList.map(item => {
          arry.push(
            Object.assign({}, { name: item.fileName, url: item.fileUrl })
          );
        });
        this.fileLists = [...arry];
      } catch (e) {
        console.error("接口异常");
      }
    },

    //事故区域
    async Classifications() {
      this.options = await Classification("accident_area");
      this.options1 = await Classification("accident_nature");
      this.options2 = await Classification("accident_type");
    },
    //选择事故区域
    ChangeStatus(e) {
      let operUserIds = [];
      this.options.map(item => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.ruleForm.areaId = operUserIds.toString();
    },
    //选择事故类型
    ChangeType(e) {
      let operUserIds = [];
      this.options.map(item => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.ruleForm.typeId = operUserIds.toString();
    },
    //选择事故性质
    ChangeNature(e) {
      let operUserIds = [];
      this.options.map(item => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.ruleForm.natureId = operUserIds.toString();
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
        `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
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
.shade {
  position: absolute;
  right: 0;
  height: 100%;
  width: 15%;
  top: 0;
  z-index: 999999;
  background-color: #fff;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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
