<template>
  <div class="app-container container-table">
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="demo-form-inline"
      >
        <el-form-item prop="title" label="标题">
          <el-input
            v-model="formInline.title"
            maxlength="30"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="chaxun" icon="el-icon-search" @click="getNotice"
            >查询</el-button
          >
          <el-button @click="resetForm('formInline')" class="chongzhi"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table-list">
      <el-button
        class="table-default-btn"
        @click="$router.go(-1)"
        style="float: right;margin-bottom: 20px"
      >
        返回
      </el-button>
      <el-table
        :data="rolesList"
        v-loading="loading"
        style="width: 100%; margin-top: 30px"
        @selection-change="handleSelectionChange"
        class="tableBox"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布人">
          <template slot-scope="scope">
            {{ scope.row.createBy }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == '0'">未发布</span>
            <span v-if="scope.row.status == '1'">已发布</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布时间">
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="公告类型名称">
          <template slot-scope="scope">
            {{ scope.row.noticeType }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="240" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="handleCheck(scope)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="formInline.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>

      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
      >
        <div class="information">
          <p class="title" v-html="caption"></p>
          <div class="time_m">
            <span>{{ releaseTime }}</span>
            <span>{{ publisher }} ({{ dept }})</span>
          </div>
          <div class="Publish_Content" v-html="PublishContent"></div>
          <div>
            附件：<span
              style="color: #5583fe; cursor: pointer"
              @click="handledownload"
              >{{ fileName }}</span
            >
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addNotice } from "@/api/system/notice";
import { getNoticeList, oneNotice } from "@/api/homepage/leader";
import { getTreeSelect } from "@/api/system/dept";
import Editor from "../../../components/quillEditor";
export default {
  components: {
    Editor,
  },

  data() {
    return {
      formInline: {
        pageNum: 1,
        pageSize: 10,
        title: "",
      },
      dialogVisible: false,
      caption: "", //标题
      releaseTime: "", //发布时间
      publisher: "", //发布人
      PublishContent: "", //发布内容
      dept: "", //部门
      fileName: "", //附件
      fileUrl: "", //附件地址
      rolesList:[],
      fileLists: [],
      loading: false,
      total: 100,
      pageSizes: [10, 15, 20, 25, 30],
    };
  },
  computed: {
    depttreeSelectData() {
      return this.depttreeSelect;
    },
    menutreeSelectData() {
      return this.menutreeSelect;
    },
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        "/fs/upload"
      );
    },
  },
  async created() {
    this.getNotice();
    this.deptOptions = await getTreeSelect();
  },
  methods: {
    //查看
    async handleCheck(scope) {
      this.dialogVisible = true;
      let resDete = await oneNotice(scope.row.noticeId);
      this.caption = resDete.title;
      this.releaseTime = resDete.createTime;
      this.publisher = resDete.createBy;
      this.PublishContent = resDete.content;
      this.dept = resDete.dept;
      this.fileName = resDete.fileName;

      if (resDete.fileName != null) {
        this.fileLists.push(
          Object.assign({}, { name: resDete.fileName, url: resDete.fileUrl })
        );
      }
    },
    handledownload() {
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(encodeURI(this.fileName))}&path=${
          this.fileUrl
        }`;
      location.href = this.fileDowloadName;
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getNotice();
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.noticeId);
        }
        this.multipleSelection = [...arr];
      }
    },
    handleSizeChange(val) {
      this.formInline.pageSize = val;
      this.getNotice();
    },
    handleCurrentChange(val) {
      this.formInline.pageNum = val;
      this.getNotice();
    },
    //获取列表数据
    async getNotice() {
      this.loading = true;
      const res = await getNoticeList(this.formInline);
      this.rolesList = res.rows;
      this.total = res.total;
      this.loading = false;
    },
    async confirmRole() {
      //取得选中菜单id集合
      if (this.$refs.menuTree) {
        const menuTreeKeys = this.$refs.menuTree.getCheckedKeys();

        this.role.menuIds = menuTreeKeys;
      }

      this.$refs.noticeFome.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        const isEdit = this.dialogType === "edit";

        let data = null;
        try {
          if (isEdit) {
            delete this.notice.deptLabel;
            data = await updateRole(this.role);
          } else {
            delete this.notice.deptLabel;
            if (this.notice.area == "1") {
              this.notice.area = this.deptLabelId.join();
            }
            data = await addNotice(this.notice);
          }
        } catch (e) {
          console.error("接口异常");
        }
        this.dialogVisible = false;
        this.$notify({
          title: data ? "成功" : "失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "服务器开小差了，请稍后再试",
          type: data ? "success" : "warning",
        });
        this.getNotice();
      });
    },
    //关闭弹框的事件
    closeDialog(formName) {
      this.notice = {};
      this.fileLists = [];
      this.$refs.upload.clearFiles();
    },
    // //返回首页
    // handleGetback(){

    // }
  },
};
</script>

<style lang="scss">
.app-container {
  .announcement {
    width: 100%;
    height: 400px;
    overflow: auto;
    border: 1px solid #606266;
    padding: 10px;
  }
  .roles-table {
    margin-top: 15px;
  }

  .permission-tree {
    margin-bottom: 15px;
  }
  .read-box {
    .el-form-item {
      position: relative;
      .read-num {
        position: absolute;
        left: -80px;
        top: 20px;
        display: inline-block;
        font-size: 12px;
      }
    }
  }
  .aleady-read {
    color: #6bc4bd;
  }
  .un-read {
    color: #d9001b;
  }
}
.information {
  border: 1px solid #000;
  padding: 0 20px 20px 20px;
  .title {
    text-align: center;
    font-size: 28px;
    font-weight: 400;
    line-height: 28px;
    color: #000;
  }
  .time_m {
    text-align: center;
    margin-bottom: 20px;
    span {
      margin: 0 20px;
      color: #000;
      font-size: 18px;
    }
  }
  .Publish_Content {
    border: 1px solid #000;
    width: 100%;
    min-height: 300px;
     max-height: 500px;
    margin-bottom: 20px;
    padding: 20px;
    overflow: auto;
  }
}

// .tableBox{
//   td{
//     div{
//       max-height: 120px;
//     }
//   }
// }
</style>
