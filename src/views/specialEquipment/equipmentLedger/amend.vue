<template>
  <div class="content_add_box">
    <div class="content_add">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="设备编号" prop="devNumber">
          <el-input
            v-model="ruleForm.devNumber"
            placeholder="请输入"
            type="number"
            autocomplete="off"
            maxlength="15"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="devName">
          <el-input
            v-model="ruleForm.devName"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格型号" prop="devModel">
          <el-input
            v-model="ruleForm.devModel"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="出厂编号" prop="serialNumber">
          <el-input
            v-model="ruleForm.serialNumber"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="投用日期" prop="useTime">
          <div class="block">
            <el-date-picker
              v-model="ruleForm.useTime"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="设备注册代码" prop="registCode">
          <el-input
            v-model="ruleForm.registCode"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用证编号" prop="useCardNumber">
          <el-input
            v-model="ruleForm.useCardNumber"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用状态" prop="statusName">
          <el-select
            v-model="ruleForm.statusName"
            @change="ChangeStatus"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in quipment"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用部门" prop="dept">
          <el-cascader
            v-model="ruleForm.deptId"
            ref="myCascader"
            :options="treeselect"
            :props="optionProps"
            @change="handleChange"
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="操作人员" prop="operUserIds">
          <el-select
            v-model="ruleForm.operUserNames"
            @change="selectedCag($event)"
            value-key="cardId"
            multiple
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in UserList"
              :key="item.userId"
              :props="Props"
              :label="item.realName"
              :value="item.realName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装地址" prop="installPlace">
          <el-input
            v-model="ruleForm.installPlace"
            placeholder="请输入"
            autocomplete="off"
            type="textarea"
            :rows="3"
            maxlength="300"
          ></el-input>
        </el-form-item>
        <el-form-item label="生产厂家" prop="factory">
          <el-input
            v-model="ruleForm.factory"
            placeholder="请输入"
            autocomplete="off"
            type="textarea"
            :rows="3"
            maxlength="300"
          ></el-input>
        </el-form-item>
        <el-form-item label="功率" prop="power">
          <el-input
            v-model="ruleForm.power"
            placeholder="请输入"
            autocomplete="off"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="安装调试单位" prop="installUnit">
          <el-input
            v-model="ruleForm.installUnit"
            placeholder="请输入"
            autocomplete="off"
            type="textarea"
            :rows="3"
            maxlength="300"
          ></el-input>
        </el-form-item>
        <el-form-item label="检测周期" prop="docVersion">
          <el-select
            v-model="ruleForm.testCycle"
            placeholder="请选择"
            style="width: 30%"
          >
            <el-option
              v-for="item in period"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model="ruleForm.cycleTimes"
            placeholder="请输入次数(0-100)"
            @mousewheel.native.prevent
            oninput="value=value.replace(/[^\d]/g,'')"
            type="number"
            @change="cycleTimeslimit"
            style="width: 20%"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="5"
            v-model="ruleForm.remark"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- <div class="dialog-footer" v-show="flag">
        <el-button
          class="confirm-btn"
          v-has="has.add"
          @click="submitForm('ruleForm')"
          >修改</el-button
        >
        <el-button class="cancel-btn" @click="resetForm('ruleForm')"
          >取 消</el-button
        >
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  getPutList,
  specialequipment,
  treeselect,
  getUserList,
  getIdList,
} from "@/api/specialEquipment/equipmentLedger";

export default {
  props: {
    person: String,
  },
  data() {
    return {
      has: {
        add: "laws:projectDoc:add",
      },
      addTableData: [],
      fileList: [],
      flag: true,
      loading: true,
      project: [],
      arr: [],
      dialogVisible: false,
      total: 0,
      pageNum: 1,
      pageSize: 5,
      optionProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
      },
      Props: {
        value: "id",
        label: "label",
      },
      period: [
        {
          value: "年",
          label: "年",
        },
      ],
      ruleForm: {
        //新增表单数据
        devNumber: "",
        devName: "",
        devModel: "",
        serialNumber: "",
        useTime: "",
        installPlace: "",
        registCode: "",
        useCardNumber: "",
        statusId: "",
        statusName: "",
        dept: "",
        deptId: "",
        factory: "",
        power: "",
        installUnit: "",
        testCycle: "", //检测周期
        cycleTimes: "", //检测次数
        operUserNames: [],
        operUserIds: [],
        remark: "",
      },
      rules: {
        devNumber: [{ required: true, message: "设备编号", trigger: "blur" }],
        devName: [{ required: true, message: "设备名称", trigger: "blur" }],
        devModel: [{ required: true, message: "规格型号", trigger: "blur" }],
        serialNumber: [
          { required: true, message: "出厂编号", trigger: "blur" },
        ],
        useTime: [{ required: true, message: "投用日期", trigger: "blur" }],
        installPlace: [
          { required: true, message: "安装地址", trigger: "blur" },
        ],
        registCode: [
          { required: true, message: "设备注册代码", trigger: "blur" },
        ],
        useCardNumber: [
          { required: true, message: "使用证编号", trigger: "blur" },
        ],
        statusName: [{ required: true, message: "使用状态", trigger: "blur" }],
        dept: [{ required: true, message: "使用部门", trigger: "blur" }],
        factory: [{ required: true, message: "生产厂家", trigger: "blur" }],
        power: [{ required: true, message: "功率", trigger: "blur" }],
        installUnit: [
          { required: true, message: "安装调试单位", trigger: "blur" },
        ],
        testCycle: [{ required: true, message: "检测周期", trigger: "blur" }],
        operUserNames: [
          { required: true, message: "操作人员", trigger: "blur" },
        ],
      },
      quipment: [],
      treeselect: [],
      UserList: [],
      id: "",
    };
  },
  created() {
    this.id = this.person;
    this.SQstatus();
    this.department();
    this.getEqList();
  },
  methods: {
    async SQstatus() {
      this.quipment = await specialequipment("specialequipment_status");
    },
    //部门
    handleChange(value) {
      if (value != undefined) {
        let deptname = this.$refs.myCascader.getCheckedNodes()[0].pathLabels;
        this.ruleForm.dept = deptname;
      }
      this.People();
    },
    async People() {
      var end = this.ruleForm.deptId;
      if (end.length >= 1) {
        this.UserList = await getUserList(end);
      } else {
        var id = end[end.length - 1];
        this.UserList = await getUserList(id);
      }
    },
    //获取人员的value和label值
    selectedCag(e) {
      let operUserIds = [];
      for (let i = 0; i <= e.length - 1; i++) {
        this.UserList.map((item) => {
          if (item.realName == e[i]) {
            operUserIds.push(item.userId);
          }
        });
      }
      this.ruleForm.operUserIds = operUserIds.toString();
    },

    //状态
    ChangeStatus(e) {
      let operUserIds = [];
      this.quipment.map((item) => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.ruleForm.statusId = operUserIds;
    },
    //获取部门
    async department() {
      this.treeselect = await treeselect();
    },
    //获取修改数据
    async getEqList() {
      let data = this.id;
      let formData = await getIdList(data);
      this.ruleForm = formData;
      this.ruleForm.deptId = formData.deptId + ""; //id转字符串
      this.ruleForm.operUserNames = formData.operUserNames.split(",");
      this.loading = false;
      this.People();
    },
    //取消
    resetForm() {
      this.$emit("func");
    },
    cycleTimeslimit(value) {
      if (value > 100) {
        this.$message({
          message: "次数不能大于100",
          type: "warning",
        });
        this.ruleForm.cycleTimes = "";
        return;
      }
    },
    //新增表单
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        if (!this.ruleForm.cycleTimes) {
          return;
        }
        this.ruleForm.cycleTimes = parseInt(this.ruleForm.cycleTimes);
        let data = null;
        let operUserNames = this.ruleForm.operUserNames;
        this.ruleForm.operUserNames = operUserNames.toString();
        try {
          let resdata = this.ruleForm;
          data = await getPutList(resdata);
          this.$refs[formName].resetFields();
          this.$emit("func");
        } catch (e) {
          console.error("接口异常");
        }
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
      });
    },
  },
};
</script>
<style lang='scss' scoped>
// .demo-ruleForm /deep/ {
//    .el-textarea{
//     width: 700px;
//   }
// }
// .text_area /deep/ {
//    .el-textarea{
//     width: 100%;
//   }
// }

.content_add_box {
  background-color: #fff;
  padding: 15px 0;
  .content_add {
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
