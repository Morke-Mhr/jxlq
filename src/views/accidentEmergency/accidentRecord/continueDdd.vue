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
            v-model="ruleForm.occurPlace"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="间接经济损失" prop="infoSource">
          <el-input
            v-model="ruleForm.infoSource"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="参与事故救援单位" prop="cause">
          <el-input
            v-model="ruleForm.cause"
            placeholder="请输入"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="信息报告及应急处理情况" prop="nature">
          <el-input
            v-model="ruleForm.nature"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理伤亡人员善后情况" prop="process">
          <el-input
            v-model="ruleForm.process"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="清除社会及环境影响情况" prop="influence">
          <el-input
            v-model="ruleForm.influence"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="对社会和生产秩序影响" prop="measure">
          <el-input
            v-model="ruleForm.measure"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="主管部门验收的意见" prop="disposal">
          <el-input
            v-model="ruleForm.disposal"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="事故暴露的问题" prop="nextstepPlan">
          <el-input
            v-model="ruleForm.nextstepPlan"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="整改措施" prop="rescueSituation">
          <el-input
            v-model="ruleForm.rescueSituation"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="planFileList">
          <div class="upload">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="getUrl"
              :on-remove="handleRemove"
              :on-preview="handlePreview"
              :before-remove="beforeRemove"
              :on-success="uploadSuccess"
              :before-upload="beforeUpload"
              multiple
              :limit="1"
              :file-list="fileLists"
              name="file"
            >
              <el-button size="small" type="primary" v-if="flag == true"
                >选择文件</el-button
              >
              <div slot="tip" class="el-upload__tip" style="line-height: 16px">
                只能上传bmp、jpg，png，gif；AVI、rmvb、FLV、mp4、3GP；Doc、docx、xls、xlsx、txt、PDF；RAR、ZIP；MP3格式文件不能超过（1G），
              </div>
              <span v-if="flag == false">点击文件下载</span>
            </el-upload>
            <div class="shade" v-if="flag == false"></div>
          </div>
        </el-form-item>
        <el-form-item label="报送人" prop="createBy">
          <el-row>
            <el-col :span="12">
              <el-cascader
                v-model="ruleForm.createByDeptId"
                ref="myCascader"
                :options="treeselect"
                :props="optionProps"
                @change="handleChange"
              ></el-cascader>
            </el-col>
            <el-col :span="12">
              <el-select
                v-model="ruleForm.createBy"
                @change="selectedCag($event)"
                value-key="cardId"
                placeholder="请选择"
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
        <el-form-item label="备注" prop="supSupport">
          <el-input
            v-model="ruleForm.supSupport"
            placeholder="请输入"
            autocomplete="off"
            :rows="3"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- <div class="dialog-footer">
        <el-button class="confirm-btn" @click="addOpen()"
          >确 定</el-button
        >
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
  getCheck,
  treeselect,
  getUserList,
} from "@/api/accidentEmergency/accidentRecord";

export default {
  props: {
    person: String,
  },
  data() {
    return {
      has: {
        add: "laws:projectDoc:add",
      },
      optionProps: {
        value: "id",
        label: "label",
        checkStrictly: true,
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
        planFileList: [], //文件
      },
      rules: {
        occurTime: [{ required: true, message: "续报时间", trigger: "change" }],
        // occurPlace: [
        //   { required: true, message: "直接经济损失", trigger: "blur" },
        // ],
        // infoSource: [
        //   { required: true, message: "间接经济损失", trigger: "change" },
        // ],
        // cause: [
        //   { required: true, message: "参与事故救援单位", trigger: "blur" },
        // ],
        // nature: [
        //   {
        //     required: true,
        //     message: "信息报告及应急处置情况",
        //     trigger: "change",
        //   },
        // ],
        // process: [
        //   { required: true, message: "处理伤亡人员善后情况", trigger: "blur" },
        // ],
        // influence: [
        //   {
        //     required: true,
        //     message: "清除社会及环境影响情况",
        //     trigger: "change",
        //   },
        // ],
        // measure: [
        //   { required: true, message: "对社会和生产秩序影响", trigger: "blur" },
        // ],
        // disposal: [
        //   { required: true, message: "主管部门验收的意见", trigger: "change" },
        // ],
        // nextstepPlan: [
        //   { required: true, message: "事故暴露的问题", trigger: "blur" },
        // ],
        // rescueSituation: [
        //   { required: true, message: "整改措施", trigger: "change" },
        // ],
        // supSupport: [{ required: true, message: "备注", trigger: "blur" }],
        createByDeptId: [
          { required: true, message: "报送部门", trigger: "blur" },
        ],
        createBy: [{ required: true, message: "报送人", trigger: "change" }],
        // planFileList: [{ required: true, message: "附件", trigger: "blur" }],
      },
      dialogVisible: false,
      emergencyplanId: "",
      treeselect: [],
      UserList: [],
    };
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/fs/upload"
      );
    },
  },
  created() {
    this.loading = true;
    this.ruleForm.accidentId = this.person;
    this.department();
  },
  methods: {
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
      this.UserList.map((item) => {
        if (item.realName == e) {
          console.log(item.userId);
          this.ruleForm.createById = item.userId;
        }
      });
    },

    // 取消
    resetForm() {
      this.$emit("func");
    },
    //新增表单
    submitForm(formName) {
      this.$refs["ruleForm"].validate((valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        this.$confirm("正在执行新增/编辑操作, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            let data = null;
            try {
              let resdata = this.ruleForm;
              data = await getContinueAdd(resdata);
              this.$refs["ruleForm"].resetFields();
            } catch (e) {
              console.error("接口异常");
            }
            this.$refs.upload.clearFiles();
            this.$emit("func");
            this.$notify({
              title: data ? "成功" : "失败",
              dangerouslyUseHTMLString: true,
              message: data ? data.message : "服务器开小差了，请稍后再试",
              type: data ? "success" : "warning",
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      });
    },

    // 文件列表移除文件时的钩子
    async handleRemove(file, fileList) {
      if (this.flag == false) {
        let row = file;
        await fsDelete(row.fileId);
        this.ruleForm.planFileList = [];
        this.$refs.upload.clearFiles();
      }
    },
    //下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = file;
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`;
        location.href = this.fileDowloadName;
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传成功时的钩子
    uploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        return this.$message({
          type: "warning",
          message: "上传失败!",
        });
      }
      let arr = [];
      arr.push(res);
      let formImgList = [];
      arr.forEach((item) => {
        formImgList.push({
          fileName: item.body.fileName,
          fileUrl: item.body.url,
        });
      });
      let arry = formImgList.pop();
      this.ruleForm.planFileList.push(arry);
    },
    //文件大小
    beforeUpload(file) {
      let FileFormat = file.name.substring(file.name.lastIndexOf(".") + 1);
      let testmsg = FileFormat.toLowerCase();
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const extension3 = testmsg === "doc";
      const extension4 = testmsg === "docx";
      const extension5 = testmsg === "txt";
      const extension6 = testmsg === "pdf";
      const extension7 = testmsg === "bmp";
      const extension8 = testmsg === "jpg";
      const extension9 = testmsg === "png";
      const extension10 = testmsg === "gif";
      const extension11 = testmsg === "avi";
      const extension12 = testmsg === "rmvb";
      const extension13 = testmsg === "flv";
      const extension14 = testmsg === "mp4";
      const extension15 = testmsg === "3gp";
      const extension16 = testmsg === "rar";
      const extension17 = testmsg === "zip";
      const extension18 = testmsg === "mp3";
      const isLt2M = file.size / 1024 / 1024 < 1000;
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6 &&
        !extension7 &&
        !extension8 &&
        !extension9 &&
        !extension10 &&
        !extension11 &&
        !extension12 &&
        !extension13 &&
        !extension14 &&
        !extension15 &&
        !extension16 &&
        !extension17 &&
        !extension18
      ) {
        this.ruleForm.projectDocFile = [];
        this.$message({
          message: "请上传正确的格式!",
          type: "warning",
        });
        return false;
      }
      if (!isLt2M) {
        this.ruleForm.projectDocFile = [];
        this.$message({
          message: "上传文件大小超过限制!",
          type: "warning",
        });
        return false;
      }
    },
  },
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
