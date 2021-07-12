<template>
  <div class="manageClass">
    <div class="people-content">
      <el-row class="row-height manage-basic">
        <el-col :span="12">
          <div class="area-tit" s>培训信息</div>
          <div class="manage-sign">
            <p>
              培训实际时间：{{ manageData.planStartTime }} ~
              {{ manageData.planEndTime }}
            </p>
            <p>培训课时：{{ manageData.pxClassHour }}</p>
            <p v-if="show">培训地点：{{ manageData.pxPlace }}</p>
            <p>
              培训方式：{{ manageData.pxWay == true ? "线下培训" : "线上培训" }}
            </p>
            <p>培训主题：{{ manageData.pxTitle }}</p>
            <p>培训类别：{{ manageData.pxClass }}</p>
            <p v-if="show">培训机构：{{ manageData.pxAgency }}</p>
            <p v-if="show">授课老师：{{ manageData.pxTeacher }}</p>
          </div>
          <div class="area-tit">培训现场</div>
          <div class="dataList">
            <ul>
              <li v-for="(item, i) in manageData.trainplanFileList" :key="i">
                <img
                  v-if="item.pictureType == '0'"
                  :src="URL + item.pictureUrl"
                  @click="openImgViewer(item.pictureUrl)"
                  alt=""
                />
                <source
                  v-if="item.pictureType == '2'"
                  :src="URL + item.pictureUrl"
                />
                <video
                  class="video-js"
                  :id="'video' + item.id"
                  controls="controls"
                  poster="webImg"
                  preload="metadata"
                  v-if="item.pictureType == '1'"
                >
                  <source :src="URL + item.pictureUrl" type="video/mp4" />
                </video>
              </li>
            </ul>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="area-tit">
            培训记录
            <div class="area-sum">
              <p class="list">
                总人数：<span class="list1">{{ sun.totalNumber }} 人</span>
              </p>
              <p class="list">
                已参会：<span class="list1">{{ sun.meetingNumber }} 人</span>
              </p>
              <p class="list">
                未参会：<span class="list1"
                  >{{ sun.notMeetingNumber }} 人</span
                >
              </p>
            </div>
          </div>
          <div>
            <div class="sxTable">
              <!-- 新增及删除 -->
              <!-- 表格 -->
              <el-table
                ref="multipleTable"
                :data="trainPersonList"
                tooltip-effect="light"
                height="calc(100vh - 370px)"
                style="width: 100%"
              >
                <!-- 表格部分 -->
                <template>
                  <el-table-column type="index" label="序号" width="100">
                  </el-table-column>
                  <el-table-column align="center" property="user" label="姓名">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    property="dept"
                    label="部门"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    property="postName"
                    label="岗位"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    align="center"
                    property="date"
                    label="培训情况"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope"
                      >{{ scope.row.isAttend == false ? "未签到" : "已签到" }}
                    </template>
                  </el-table-column>
                  <!-- 根据权限列表显示当前列的内容 -->
                  <el-table-column
                    align="center"
                    fixed="right"
                    prop="cz"
                    label="记录"
                  >
                    <template slot-scope="scope">
                      <!-- 这里可以拿到当前行的内容 row -->
                      <el-button type="text" @click="goRedact(scope)"
                        >查看
                      </el-button>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
              <!-- 分页器 -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[5, 10, 20, 30]"
                :page-size="pageSize"
                background
                layout="total, prev, pager, next, sizes, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="个人培训记录"
      :visible.sync="dialogVisible"
      append-to-body
      custom-class="small"
    >
      <children v-if="dialogVisible == true" :person="personData"></children>
    </el-dialog>
    <!-- 图片查看器 -->
    <el-image-viewer
      v-if="showImgViewer"
      :on-close="closeImgViewer"
      :url-list="imgPreviewList"
    />
    <!-- <div class="demo-image__preview" v-if="showImgViewer">
      <el-image
        style="width: 100px; height: 100px"
        :preview-src-list="srcList"
      >
      </el-image>
    </div> -->
  </div>
</template>

<script>
import { getPlanDetail, getPersonList, getSum } from "@/api/safety/plan.js";
import { getToken } from "@/utils/auth";
import children from "../dialog/index.vue";
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
export default {
  components: { children: children, ElImageViewer },
  props: {
    manage: String,
  },
  data() {
    return {
      // 显示图片查看器
      showImgViewer: false,
      // 查看大图列表
      imgPreviewList: [],

      dialogVisible: false,
      tableList: [],
      total: 0,
      pageNum: 1, //默认当前页
      pageSize: 10,
      manageData: [],
      trainPersonList: [],
      show: false,
      sun: {},
      URL: "",
      personData: "",
    };
  },
  created() {
    this.getDetails();
    this.getPlist();
    this.URL = this.$store.state.apiConfiguration.fileUrl;
  },
  computed: {
    getUrl() {
      return this.$store.state.apiConfiguration.url + "/fs/upload";
    },
    geHeaders() {
      return { Authorization: getToken() };
    },
  },

  methods: {
    // 打开图片查看器
    openImgViewer(file) {
      // 获取要查看的图片临时地址
      this.showImgViewer = true;
    },
    // 关闭图片查看器
    closeImgViewer() {
      this.showImgViewer = false;
    },

    //下载附件
    async downLoadFileS(item) {
      let nameS = item.pictureName.substring(
        item.pictureName.lastIndexOf(".") + 1
      );
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        `fs/download?name=${encodeURI(
          encodeURI(item.pictureName + "." + nameS)
        )}&path=${item.pictureUrl}`;
      location.href = this.fileDowloadName;
    },

    //获取查看信息
    async getDetails() {
      let trainplanId = this.manage;
      let resData = await getPlanDetail(trainplanId);
      if (resData.pxPlace != "") {
        this.show = true;
      }
      this.manageData = resData;
      this.manageData.trainplanFileList.map((item) => {
        if (item.pictureType == "0") {
          let url = this.URL + item.pictureUrl;
          this.imgPreviewList.push(url);
        }
      });
    },
    //获取培训人员
    async getPlist() {
      let trainplanId = this.manage;
      this.sun = await getSum(trainplanId);
      let resData = await getPersonList(
        this.pageNum,
        this.pageSize,
        trainplanId
      );
      this.trainPersonList = resData.rows;

      this.total = resData.total;
    },

    //查看
    goRedact(e) {
      this.personData = e.row.userId;
      this.dialogVisible = true;
    },
    /**
     * 分页器
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getPlist();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getPlist();
    },
  },
};
</script>
<style lang="scss" scoped>
.area-tit {
  padding-left: 0;
  .area-sum {
    float: right;
    font-size: 16px;
    .list {
      margin-right: 10px;
      display: inline-block;
      margin-top: 0;
      .list1 {
        color: #409eff;
      }
    }
  }
}
.dataList {
  ul {
    padding: 0;
    margin: 0;
    height: 310px;
    overflow: auto;
    li {
      list-style: none;
      display: inline-block;
      width: 250px;
      margin-right: 12px;
      img {
        width: 250px;
        height: 150px;
      }
      video {
        width: 250px;
      }
    }
  }
}
.manage-sign {
  padding-left: 30px;
  height: 230px;
  p {
    font-weight: 600;
  }
}
</style>
