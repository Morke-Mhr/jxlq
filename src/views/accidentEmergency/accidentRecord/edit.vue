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
        <el-form-item label="发生时间" prop="occurTime">
          <div class="block">
            <el-date-picker
              v-model="ruleForm.occurTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="发生地点" prop="occurPlace">
          <el-input
            v-model="ruleForm.occurPlace"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件区域" prop="area">
          <el-select
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
          <el-input
            v-model="ruleForm.infoSource"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="事件起因" prop="cause">
          <el-input
            v-model="ruleForm.cause"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="事故性质" prop="nature">
          <el-select
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
          <el-input
            v-model="ruleForm.process"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="影响与趋势" prop="influence">
          <el-input
            v-model="ruleForm.influence"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="已采取措施" prop="measure">
          <el-input
            v-model="ruleForm.measure"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="应急处置情况" prop="disposal">
          <el-input
            v-model="ruleForm.disposal"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="下一步计划" prop="nextstepPlan">
          <el-input
            v-model="ruleForm.nextstepPlan"
            type="textarea"
            :rows="3"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="现场指挥救援情况" prop="rescueSituation">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="ruleForm.rescueSituation"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否需要上级支持" prop="supSupport">
          <el-input
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
          <el-input
            v-model="ruleForm.iphone"
            disabled
            placeholder="请输入"
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
  getAddList,
  getCheck,
  treeselect,
  getUserList,
  getChangeList,
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
        planFileList: [],
      },
      rules: {
        occurTime: [{ required: true, message: "时间", trigger: "change" }],
        occurPlace: [{ required: true, message: "发生地点", trigger: "blur" }],
        infoSource: [
          { required: true, message: "信息来源", trigger: "change" },
        ],
        cause: [{ required: true, message: "事件起因", trigger: "blur" }],
        nature: [{ required: true, message: "事故性质", trigger: "change" }],
        area: [{ required: true, message: "事故区域", trigger: "blur" }],
        type: [{ required: true, message: "事故类型", trigger: "change" }],
        process: [{ required: true, message: "基本过程", trigger: "blur" }],
        // influence: [
        //   { required: true, message: "影响与趋势", trigger: "change" },
        // ],
        // measure: [{ required: true, message: "已采取措施", trigger: "blur" }],
        // disposal: [
        //   { required: true, message: "应急处置情况", trigger: "blur" },
        // ],
        // nextstepPlan: [
        //   { required: true, message: "下一步计划", trigger: "change" },
        // ],
        // rescueSituation: [
        //   { required: true, message: "现场指挥救援情况", trigger: "blur" },
        // ],
        // supSupport: [
        //   { required: true, message: "是否需要上级支持", trigger: "change" },
        // ],
        iphone: [{ required: true, message: "联系方式", trigger: "blur" }],
        createByDeptId: [
          { required: true, message: "报送部门", trigger: "blur" },
        ],
        createBy: [{ required: true, message: "报送人", trigger: "blur" }],
        // planFileList: [{ required: true, message: "附件", trigger: "change" }],
      },
      dialogVisible: false,
      emergencyplanId: "",
      treeselect: [],
      UserList: [],
      accidentId: "",
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
    this.accidentId = this.person;
    this.Classifications();
    this.department();
    this.goCheck();
  },
  methods: {
    //获取数据
    async goCheck() {
      try {
        let data = this.accidentId;
        let changeData = await getCheck(data);
        this.ruleForm = changeData;
        let arry = [];
        changeData.accidentFileList.map((item) => {
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
      this.options.map((item) => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.ruleForm.areaId = operUserIds.toString();
    },
    //选择事故类型
    ChangeType(e) {
      let operUserIds = [];
      this.options.map((item) => {
        if (item.dictLabel == e) {
          operUserIds.push(item.dictCode);
        }
      });
      this.ruleForm.typeId = operUserIds.toString();
    },
    //选择事故性质
    ChangeNature(e) {
      let operUserIds = [];
      this.options.map((item) => {
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
        this.UserList.map((item) => {
          if (item.realName == e[i]) {
            operUserIds.push(item.userId);
            this.ruleForm.iphone = item.phonenumber;
          }
        });
      }
      this.ruleForm.createById = operUserIds.toString();
    },

    // 取消
    resetForm() {
      this.$emit("func");
    },
    //修改表单
    submitForm() {
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
              data = await getChangeList(resdata);
            } catch (e) {
              console.error("接口异常");
            }
            this.$refs.upload.clearFiles();
            this.$refs["ruleForm"].resetFields();
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
        this.ruleForm.fileList = [];
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
      if (!this.ruleForm.planFileList) {
        this.ruleForm.planFileList = [];
      }
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
