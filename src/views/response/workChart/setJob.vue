<template>
  <div class="set-job">
    <div id="vue-g6-editor">
      <div class="editor">
        <el-row class="editor-tit">
          <el-col :span="24">
            <header>{{ this.basicForm.name }}</header>
          </el-col>
        </el-row>
        <!-- 工具栏 -->
        <el-row>
          <el-col :span="24">
            <div id="toolbar" style="display: none">
              <i
                data-command="save"
                class="command el-icon-document"
                title="保存"
              ></i>
              <i
                class="el-icon-notebook-1"
                title="历史数据"
                @click="readHistoryData"
              ></i>
              <i
                class="el-icon-upload2"
                title="上传数据"
                @click="readUploadData"
              ></i>
              <i
                class="el-icon-download"
                title="另存为文件"
                @click="saveAsFile"
              ></i>
              <i
                class="el-icon-download"
                title="打开属性栏"
                @click="openDeatils"
              ></i>
              <i
                class="el-icon-picture-outline"
                title="另存为图片"
                @click="openSaveAsImageDialog"
              ></i>
            </div>
          </el-col>
        </el-row>
        <!-- 元素面板 + 画布 + 属性栏 -->
        <el-row>
          <!-- 元素面板 -->
          <el-col :span="2">
            <div id="itempannel">
              <!-- 开始节点 -->
              <div
                id="startNode"
                class="getItem"
                data-type="node"
                data-shape="flow-circle"
                data-size="72*72"
                data-label="开始节点"
                data-color="#FA8C16"
                data-nodeType="startNode"
              >
                <img draggable="false" :src="startNodeSVGUrl" alt srcset />
              </div>

              <!-- 常规节点 -->
              <div
                id="regularNode"
                class="getItem"
                data-type="node"
                data-size="100*50"
                data-label="常规节点"
                data-color="#1890ff"
              >
                <img draggable="false" :src="regularNodeSVGUrl" alt srcset />
              </div>

              <!-- 条件节点 -->
              <div
                id="judgeNode"
                class="getItem"
                data-type="node"
                data-shape="flow-rhombus"
                data-size="80*80"
                data-label="条件节点"
                data-color="#13C2C2"
              >
                <img draggable="false" :src="conditionNodeSVGUrl" />
              </div>

              <!-- 结束节点 -->
              <div
                id="endNode"
                class="getItem"
                data-type="node"
                data-shape="flow-circle"
                data-size="80*80"
                data-label="结束节点"
                data-color="#FA8C16"
                data-nodeType="endNode"
              >
                <img draggable="false" :src="endNodeSVGUrl" />
              </div>
            </div>
          </el-col>
          <!-- 画布 -->
          <el-col :span="24">
            <el-col :span="24">
              <div id="page" style="height: calc(100vh - 4vh)"></div>
            </el-col>
          </el-col>
          <!-- 属性栏 -->
        </el-row>

        <!-- 右键菜单 -->
        <section>
          <div id="contextmenu">
            <div data-status="node-selected" class="menu">
              <el-button data-command="copy" class="command">复制</el-button>
              <el-button data-command="paste" class="command">粘贴</el-button>
              <el-button data-command="delete" class="command">删除</el-button>
            </div>
            <div data-status="edge-selected" class="menu">
              <el-button data-command="delete" class="command">删除</el-button>
            </div>
            <div data-status="group-selected" class="menu">
              <el-button data-command="copy" class="command">复制</el-button>
              <el-button data-command="paste" class="command">粘贴</el-button>
              <el-button data-command="unGroup" class="command"
                >取消组合</el-button
              >
              <el-button data-command="delete" class="command">删除</el-button>
            </div>
            <div data-status="canvas-selected" class="menu">
              <el-button data-command="undo" class="command">撤销</el-button>
              <el-button data-command="redo" class="command disable"
                >重做</el-button
              >
            </div>
            <div data-status="multi-selected" class="menu">
              <el-button data-command="copy" class="command">复制</el-button>
              <el-button data-command="paste" class="command">粘贴</el-button>
              <el-button data-command="addGroup" class="command"
                >组合</el-button
              >
            </div>
          </div>
        </section>
      </div>
      <!--右边盒子-->
      <div class="fr-form">
        <div
          style="
            overflow-y: scroll;
            height: 50vh;
            border-bottom: 1px solid #eee;
          "
        >
          <div class="fr-tit">关联岗位</div>
          <div class="fr-top">
            <el-form
              ref="jobForm"
              :model="jobForm"
              label-width="80px"
              class="org-form"
            >
              <el-form-item label="选择岗位" class="setJobCont">
                <el-tree
                  ref="deptTree"
                  :check-strictly="checkStrictly"
                  :default-expanded-keys="defaultMenutree"
                  :default-checked-keys="defaultMenutree"
                  :data="deptOptions"
                  :props="defaultProps"
                  @check-change="treeCheck"
                  show-checkbox
                  node-key="id"
                  class="permission-tree"
                  @check="setCheckedNodes"
                  v-loading="treeloading"
                  @node-expand="nodeclick"
                />
              </el-form-item>
              <el-form-item
                label="确认岗位"
                prop="postName"
                style="margin-bottom: 8px !important"
              >
                <el-input
                  v-model="jobForm.postName"
                  style="width: 97%"
                  class="inputAuto"
                  disabled
                ></el-input>
              </el-form-item>
            </el-form>
            <div
              style="text-align: right; margin-right: 3%; padding-bottom: 8px"
            >
              <el-button class="cancel-btn" @click="cancelBtn">
                返回
              </el-button>
              <el-button @click="confirmJob" class="confirm-btn">
                保存
              </el-button>
              <!--       <el-button class="cancel" @click="resetForm('jobForm')">
              关闭
            </el-button> -->
            </div>
          </div>
        </div>
        <div class="fr-bottom">
          <div class="fr-tit">关联作业指导书</div>
          <el-button
            class="table-add-btn"
            style="margin-left: 15px"
            @click="handleAdd"
            v-has="has.add"
            v-show="addBtn"
          >
            新增
          </el-button>
          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%; margin-top: 30px"
            @selection-change="handleSelectionChange"
            row-key="wprocessGuideId"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            stripe
          >
            <!--  <el-table-column type="selection" width="55">
          </el-table-column> -->

            <el-table-column align="center" label="作业类别">
              <template slot-scope="scope">
                {{ scope.row.workType }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="作业名称">
              <template slot-scope="scope">
                {{ scope.row.workName }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="附件">
              <template slot-scope="scope">
                <span
                  style="color: #096dd9; cursor: pointer"
                  @click="fileDownload"
                  >{{ scope.row.fileName }}</span
                >
              </template>
            </el-table-column>

            <el-table-column
              fixed="right"
              width="80"
              align="center"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="medium"
                  v-has="has.remove"
                  @click="handleDel(scope)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 接口暂无分页 -->
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-sizes="pageSizes"
            :page-size="pageForm.pageSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!--新增盒子-->
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="large"
      :title="'新增列表'"
      :close-on-click-modal="false"
    >
      <div>
        <el-form
          :inline="true"
          :model="zdPageForm"
          ref="zdPageForm"
          class="demo-form-inline"
        >
          <!-- <el-form-item prop="workType" label="作业类别">
        <el-input v-model="zdPageForm.workType" maxlength="30" placeholder="请输入作业类别"></el-input>
      </el-form-item> -->
          <el-form-item prop="workType" label="作业类别">
            <el-select
              v-model="zdPageForm.workType"
              placeholder="请选择作业类别"
              style="width: 100%"
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
          <el-form-item prop="workName" label="作业名称">
            <el-input
              v-model="zdPageForm.workName"
              maxlength="30"
              placeholder="请输入作业名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="chaxun"
              icon="el-icon-search"
              style="margin-bottom: 0px"
              @click="getWorkBookListInner()"
              >查询</el-button
            >
            <el-button
              @click="resetForm('zdPageForm')"
              style="margin-bottom: 0px"
              class="chongzhi"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="addTableData"
        v-loading="loading"
        style="width: 100%; margin-top: 30px"
        @selection-change="handleSelectionChange"
        row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        stripe
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="作业类别">
          <template slot-scope="scope">
            {{ scope.row.workType }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="作业名称">
          <template slot-scope="scope"> {{ scope.row.workName }} </template>>
        </el-table-column>
        <el-table-column align="center" label="附件名">
          <template slot-scope="scope"> {{ scope.row.fileName }} </template>>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="addTotal"
        :page-sizes="[5]"
        :page-size="addPageForm.pageSize"
        @size-change="addHandleSizeChange"
        @current-change="addHandleCurrentChange"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button class="tBtn" @click="addSubmit(scope)"> 提交 </el-button>
      </span>
    </el-dialog>
    <!-- 弹窗 -->
    <article>
      <!-- 下载图片 -->
      <section class="save-as-image-dialog">
        <el-dialog
          title="下载图片"
          :visible.sync="saveAsImageDialogVisible"
          custom-class="small"
          :close-on-click-modal="false"
        >
          <el-form label-width="100px" label-position="top">
            <el-form-item label="选择图片格式">
              <el-select v-model="saveAsImageFormat">
                <el-option label="jpg" value="jpg">
                  <span style="float: left">jpg</span>
                  <span style="float: right; color: #8492a6; font-size: 13px"
                    >白色背景</span
                  >
                </el-option>
                <el-option label="png" value="png">
                  <span style="float: left">png</span>
                  <span style="float: right; color: #8492a6; font-size: 13px"
                    >透明背景</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button class="fBtn" @click="saveAsImageDialogVisible = false"
              >取 消</el-button
            >
            <el-button class="tBtn" @click="saveAsImage">确 定</el-button>
          </span>
        </el-dialog>
      </section>
    </article>
  </div>
</template>
<script>
import G6Editor from "@antv/g6-editor";
import mixin from "./mixin";
import {
  getlookWorkchart,
  getEditWorkchart,
  getSetJob,
  getNodeIdJob,
  getNodeIdBook,
  getAddWorkBookList,
  getDeleteWorkBook,
  getSaveAddWork,
} from "@/api/job/workChart";
import { getSelectTechItem } from "@/api/system/class";
import { getTreeDeptSelect } from "@/api/job/org";
import { getPostsBydeptId } from "@/api/job/org";
// import store from '@/store'

// const serviceName = store.state.serviceName.mock
// const serviceName = store.state.serviceName.org
// import { construct } from "netflix-conductor-json-tree/dist/index";
export default {
  props: {
    edit: String,
  },
  name: "VueG6Editor",
  mixins: [mixin],
  data() {
    return {
      treeloading: false,
      // 节点属性表单
      nodeAttributeForm: {
        label: "",
        width: "",
        height: "",
      },
      workForm: {},
      //作业类别数组
      itemRes: [],
      //上传
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      has: {
        //删除作业指导书按钮权限
        remove: "system:wprocessGuide:delete",
        query: "",
        //新增作业指导书列表
        add: "laws:workstandarddoc:findWrapper",
        edit: "",
        put: "",
        set: "",
      },
      formList: {
        name: "",
        description: "",
        workprocessId: this.$route.query.workprocessId,
      },
      jobForm: {
        postName: "",
        postId: "",
        nodeId: "",
        wprocessId: this.edit,
      },
      // 节点属性表单
      edgeAttributeForm: {
        label: "",
      },
      // 画布属性栏表单
      basicForm: {
        grid: true,
        cell: 20,
        name: "",
        dename: "",
        id: "",
      },
      //新增作业指导书
      addWork: {
        workType: "",
        workName: "",
        workContent: "",
        workRequire: "",
      },
      flow: "",
      graph: "",
      workprocessId: "",
      propetyPanel: true,
      processMap: "",
      title: "",
      addBtn: false,
      // SVG节点图片URL地址
      startNodeSVGUrl: require("../../../assets/start-node.svg"),
      endNodeSVGUrl: require("../../../assets/end-node.svg"),
      regularNodeSVGUrl: require("../../../assets/regular-node.svg"),
      conditionNodeSVGUrl: require("../../../assets/condition-node.svg"),
      modelNodeSVGUrl:
        "https://gw.alipayobjects.com/zos/rmsportal/rQMUhHHSqwYsPwjXxcfP.svg",
      // 编辑器
      editor: null,
      saveAsImageDialogVisible: false,
      saveAsImageFormat: "jpg",
      checkStrictly: true,
      defaultMenutree: [],
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
        disabled: function (data, node) {
          if (data.flag == "0") {
            return true;
          } else {
            return false;
          }
        },
      },
      treeRes: "",
      tableData: [],
      total: 0,
      pageSizes: [5],
      zdPageForm: {
        pageNum: 1,
        pageSize: 5,
        workType: "",
        workName: "",
      },
      pageForm: {
        pageNum: 1,
        pageSize: 5,
      },
      addTotal: "",
      addPageForm: {
        pageNum: 1,
        pageSize: 5,
        workType: "",
        workName: "",
      },
      dialogVisible: false,
      addTableData: [],
      multipleSelection: [],
      fileDowloadName: "",
      loading: false,
      saveForm: {
        wprocessId: "",
        nodeId: "",
        guideId: [],
      },
    };
  },
  mounted() {
    this.initG6Editor();
  },
  async created() {
    this.workprocessId = this.edit;
    this.getLookChart();
    this.getItemSel();
    this.treeloading = true;
    this.deptOptions = await getTreeDeptSelect();
    this.treeloading = false;

    // this.jobForm=await getNodeIdJob(this.jobForm.nodeId);
    // this.title=this.jobForm.name;
  },
  methods: {
    async nodeclick(data, node) {
      node.loading = true;
      if (node.data.children.length == 1) {
        if (
          node.data.children[0].flag == "2" &&
          JSON.stringify(node.data.children[0].label) == "null"
        ) {
          node.data.children = [];
        }
      }
      let parw = {
        deptId: data.id,
      };
      let res = await getPostsBydeptId(parw);
      let treelist;
      if (node.data.hasOwnProperty("children")) {
        treelist = [...node.data.children, ...res];
      } else {
        treelist = res;
      }
      if (treelist.length == 0) {
        node.loading = false;
        return;
      }
      // 去重
      let map = new Map();
      for (let item of treelist) {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      }
      treelist = [...map.values()];
      this.$refs["deptTree"].updateKeyChildren(data.id, treelist);
      node.loading = false;
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.zdPageForm = {
        pageNum: 1,
        pageSize: 5,
        workType: "",
        workName: "",
      };
      this.getWorkBookListInner();
    },
    //获取作业类别下拉列表
    async getItemSel() {
      let dictName = "Job_category";
      this.itemRes = await getSelectTechItem(dictName);
      console.log(this.itemRes, "itemRes");
    },
    //获取项目类型下拉id
    peojectTypeFunc(val, vIndex) {
      let resultArr = this.itemRes.filter((item) => {
        return item.dictCode === val;
      });
      //把值赋给要传给后台的表单对象中
      // this.itemModel.projectTypeId = resultArr[0].dictCode;
      this.zdPageForm.workType = resultArr[0].dictLabel; //直接写val也可以
    },
    cancelBtn() {
      this.$emit("fatherMethod");
    },
    // 初始化
    initG6Editor() {
      const _this = this;
      const editor = new G6Editor();
      this.editor = editor;
      G6Editor.track(false);
      const Command = G6Editor.Command;
      // 注册新命令save
      Command.registerCommand("save", {
        // 禁止保存命令进入队列
        queue: false,
        // 命令是否可用
        enable: (editor) => {
          return true;
        },
        // 正向命令
        execute(editor) {
          let needSaveData = editor.getCurrentPage().save();
          console.log(needSaveData);
          localStorage.setItem("flowData", JSON.stringify(needSaveData));
          _this.save(needSaveData);
          // _this.$message.success("数据已保存");
        },
        // 反向命令
        back(editor) {
          console.log("反向命令");
          console.log(editor);
        },
        // 快捷键：Ctrl + S
        shortcutCodes: [
          ["metaKey", "s"],
          ["ctrlKey", "s"],
        ],
      });
      // 画布
      this.flow = new G6Editor.Flow({
        graph: {
          container: "page",
        },
        align: {
          line: {
            // 对齐线颜色
            stroke: "#FA8C16",
            // 对齐线粗细
            lineWidth: 1,
          },
          // 开启全方位对齐
          item: true,
          // 网格对齐
          grid: true,
        },
        grid: {
          // 网孔尺寸
          cell: 18,
        },
        shortcut: {
          // 开启自定义命令保存的快捷键
          save: true,
        },
      });
      window.flow = this.flow;

      // 设置边
      this.flow.getGraph().edge({
        shape: "flow-polyline",
      });

      // 元素面板栏
      const itempannel = new G6Editor.Itempannel({
        container: "itempannel",
      });
      // 工具栏
      const toolbar = new G6Editor.Toolbar({
        container: "toolbar",
      });
      // // 属性栏
      // const detailpannel = new G6Editor.Detailpannel({
      //   container: "detailpannel"
      // });
      // // 缩略图
      // let minimapWidth = getComputedStyle(document.querySelector(".right-part")).width;
      // minimapWidth = Number(minimapWidth.replace(/px$/, ""));
      // const minimap = new G6Editor.Minimap({
      //   container: "minimap",
      //   width: minimapWidth,
      //   height: 200
      // });
      // 右键菜单
      const contextmenu = new G6Editor.Contextmenu({
        container: "contextmenu",
      });
      // 挂载以上组件到Editor
      editor.add(flow);
      editor.add(itempannel);
      editor.add(toolbar);
      // editor.add(detailpannel);
      // editor.add(minimap);
      editor.add(contextmenu);
      // 挂载到window，方便调试
      window.editor = editor;

      // 获取当前画布
      var currentPage = editor.getCurrentPage();
      console.log("currentPage:" + currentPage);
      currentPage.on("afterchange", (e) => {
        if (e.action === "add") {
          if (
            e.model.nodetype === "startNode" ||
            e.model.nodetype === "endNode"
          ) {
            let nodes = this.editor.getCurrentPage().getNodes();
            for (const item of nodes) {
              if (
                item.model.nodetype === e.model.nodetype &&
                item.model.id !== e.model.id
              ) {
                this.editor.getCurrentPage().remove(e.item);
                this.$message.warning("只能有一个开始节点或结束节点");
              }
            }
          }
        }
      });
      // 监听（选择对象后）事件
      // 获取流图的graph示例
      // this.graph = this.flow.getGraph();
      // console.log(this.graph);
      // // 居中画布中的内容
      //   this.graph.setFitView('cc');
      currentPage.on("node:click", (ev) => {
        console.log("打印所选对象属性", ev.item);
        console.log("打印所选对象数据模型", ev.item.model);
        var selectedItemDataModel = ev.item.model;
        // 如果选择的对象是节点
        if (ev.item.isNode) {
          this.nodeAttributeForm.label = selectedItemDataModel.label;
          this.nodeAttributeForm.width =
            selectedItemDataModel.size.split("*")[0];
          this.nodeAttributeForm.height =
            selectedItemDataModel.size.split("*")[1];
          this.nodeAttributeForm.color = selectedItemDataModel.color;
          this.jobForm.nodeId = selectedItemDataModel.id;
          this.getTree();
          this.defaultMenutree = [];
          //根据节点显示工作岗位
          let jobPostName = [];
          let jobPostId = [];
          getNodeIdJob(this.jobForm.nodeId).then(function (response) {
            for (var i = 0; i < response.length; i++) {
              jobPostName.push(response[i].postName);
              jobPostId.push(response[i].postId);
              // this.$refs.deptTree.setCheckedKeys(self.jobForm.postId, true)
            }
          });
          this.jobForm.postId = jobPostId;
          this.jobForm.postName = jobPostName;
          // this.jobForm.nodeId = response.nodeId
          console.log(this.jobForm, "response");
          if (jobPostName.length > 0 && jobPostId.length > 0) {
            this.jobForm.postName.splice(0, jobPostName.length);
            this.jobForm.postId.splice(0, jobPostId.length);
          }
          console.log(this.jobForm.postName, "岗位的信息");

          //根据节点显示作业指导书
          this.workBookList();
          this.addBtn = true;
        }

        // 如果选择的对象是边
        if (ev.item.isEdge) {
          ev.item.graph.edge({
            shape: "flow-polyline-round",
          });
          this.edgeAttributeForm.label = selectedItemDataModel.label;
          this.edgeAttributeForm.shape = selectedItemDataModel.shape;
        }
      });
      // 监听（删除后）事件
      currentPage.on("afterdelete", (ev) => {});
    },
    // 打开保存为图片弹窗
    openSaveAsImageDialog() {
      this.saveAsImageDialogVisible = true;
    },
    // 开启/关闭网格对齐
    toggleGridShowStatus(value) {
      if (value) {
        this.editor.getCurrentPage().showGrid();
      } else {
        this.editor.getCurrentPage().hideGrid();
      }
    },
    // 保存为图片
    saveAsImage() {
      let newCanvas;
      if (this.saveAsImageFormat === "jpg") {
        let canvas = this.editor.getCurrentPage().saveImage();
        newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        let newContext = newCanvas.getContext("2d");
        newContext.fillStyle = "#fff";
        newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
        newContext.drawImage(canvas, 0, 0);
      }
      if (this.saveAsImageFormat === "png") {
        newCanvas = this.editor.getCurrentPage().saveImage();
      }
      let imageDataURL = newCanvas.toDataURL();
      let downloadLink = document.createElement("a");
      downloadLink.download = "图片.jpg";
      downloadLink.href = imageDataURL;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      this.saveAsImageDialogVisible = false;
    },
    // 保存为文件
    saveAsFile() {
      let jsonString = JSON.stringify(this.editor.getCurrentPage().save());
      let blob = new Blob([jsonString]);
      let blobURL = URL.createObjectURL(blob);
      let downloadLink = document.createElement("a");
      downloadLink.download = "数据.json";
      downloadLink.href = blobURL;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(blobURL);
      document.body.removeChild(downloadLink);
    },
    // 读取历史数据
    readHistoryData() {
      let stringData = localStorage.getItem("flowData");
      if (stringData === "" || stringData === "{}" || stringData === null) {
        this.$message.warning("无历史数据");
        return;
      }
      let jsonData = JSON.parse(stringData);
      this.editor.getCurrentPage().read(jsonData);
    },
    // 读取上传数据
    readUploadData() {
      let uploadButton = document.createElement("input");
      uploadButton.setAttribute("type", "file");
      uploadButton.setAttribute("accept", ".json");
      uploadButton.addEventListener("change", (e) => {
        console.dir(uploadButton);
        let file = uploadButton.files[0];
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
          console.log(event);
          let text = JSON.parse(event.target.result);
          console.log(text);
          this.editor.getCurrentPage().read(text);
        };
        fileReader.readAsText(file);
      });
      uploadButton.click();
    },
    //
    async save(source) {
      this.workprocessId = this.edit;
      this.formList.edges = source.edges;
      this.formList.nodes = source.nodes;
      this.formList.name = this.basicForm.name;
      this.formList.description = this.basicForm.description;
      this.formList.workprocessId = this.workprocessId;
      let res = await getEditWorkchart(this.formList);
      this.$notify({
        title: res ? "修改成功" : "修改失败",
        dangerouslyUseHTMLString: true,
        message: res ? res.message : "系统正在维护中，请与管理员联系",
        type: res ? "success" : "warning",
      });
    },
    openDeatils() {
      this.propetyPanel = true;
    },
    async getLookChart() {
      this.workprocessId = this.edit;
      // this.workprocessId = this.$route.query.workprocessId;
      this.processMap = await getlookWorkchart(this.workprocessId);
      this.flow.read(this.processMap);
      this.basicForm = await getlookWorkchart(this.workprocessId);
    },
    treeCheck(data, isCheck, isChildrenCheck) {
      if (isCheck) {
        let keys = this.$refs.deptTree.getCheckedKeys();
        // let itme = [keys[keys.length-1]]
        if (this.currentChecke && this.currentChecke == "") {
          this.currentChecke = keys[0];
        } else {
          let this_ = this;
          keys.some((value) => {
            if (value != this_.currentChecke) {
              this_.currentChecke = value;
              return true;
            }
          });
        }
        // let itme = [this.currentChecke]
        this.$refs.deptTree.setCheckedKeys(keys, true);
      }
    },
    //获取岗位选择的当前节点
    setCheckedNodes(data, nodes) {
      let arr = [];
      let arrId = [];
      let temp = [];
      let tempId = [];
      for (let i = 0; i < nodes.checkedNodes.length; i++) {
        arr.push(nodes.checkedNodes[i].label);
        arrId.push(nodes.checkedNodes[i].id);
      }

      console.log(this.basicForm.id);
      this.jobForm.postName = arr;

      this.jobForm.postId = arrId;
      for (var i = 0; i < this.jobForm.postName.length; i++) {
        if (temp.indexOf(this.jobForm.postName[i]) == -1) {
          temp.push(this.jobForm.postName[i]);
        }
      }
      for (var j = 0; j < this.jobForm.postId.length; j++) {
        if (tempId.indexOf(this.jobForm.postId[j]) == -1) {
          tempId.push(this.jobForm.postId[j]);
        }
      }
      this.jobForm.postName = temp;

      this.jobForm.postId = tempId;
      // debugger;
      // delete this.jobForm.postName[length-1];
    },
    async getTree() {
      this.deptOptions = await getTreeDeptSelect();
    },
    //取消选中
    // getCurrentKey(key) {
    // },
    async getTree() {
      this.deptOptions = await getTreeDeptSelect();
    },
    //设置岗位保存
    confirmJob() {
      //校验表单
      this.$refs.jobForm.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: "操作失败",
            dangerouslyUseHTMLString: true,
            message: "请填写完整",
            type: "warning",
          });
          return;
        }
        let data = null;
        this.workprocessId = this.edit;
        this.jobForm.wprocessId = this.workprocessId;
        if (this.jobForm.postId == "") {
          this.$notify({
            title:"操作失败",
            dangerouslyUseHTMLString: true,
            message:"请选择要设置的岗位",
            type: "warning",
          });
          return
        }
        data = await getSetJob(this.jobForm);
        this.jobForm.postId = "";
        this.jobForm.postName = "";
        this.dialogVisible = false;
        this.$notify({
          title: data ? "操作成功" : "操作失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "系统正在维护中，请与管理员联系",
          type: data ? "success" : "warning",
        });
        this.getTree();
      });
    },
    //新增
    async handleAdd() {
      this.dialogVisible = true;
      let res = await getAddWorkBookList(this.zdPageForm);
      this.addTableData = res.rows;
      this.addTotal = res.total;
    },
    async getWorkBookListInner() {
      let res = await getAddWorkBookList(this.zdPageForm);
      this.addTableData = res.rows;
      this.addTotal = res.total;
    },
    //作业指导书列表
    async workBookList() {
      let res = await getNodeIdBook(this.jobForm.nodeId, this.pageForm);
      this.tableData = res.rows;
      this.total = res.total;
    },
    //删除作业指导书
    async handleDel(scope) {
      let row = scope ? scope.row : null;
      this.$confirm("确定删除吗?", "删除", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getDeleteWorkBook(row.wprocessGuideId);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.workBookList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    //可以多选选择  新增里面的
    handleSelectionChange(val) {
      if (val) {
        let arr = [];
        for (let i = 0; i < val.length; i++) {
          let itme = val[i];
          arr.push(itme.workstandardId);
        }
        this.multipleSelection = [...arr];
      }
    },
    //附件下载
    async fileDownload(scope) {
      let row = this.tableData;
      let fileForm = {
        name: row[0].fileName,
        path: row[0].fileUrl,
      };
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        "jxlq-system-service" +
        "/fs/download?" +
        "name=" +
        fileForm.name +
        "&path=" +
        fileForm.path;
      location.href = this.fileDowloadName;
    },
    ///作业指导书页脚
    handleSizeChange(val) {
      this.pageForm.pageSize = val;
      this.workBookList();
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val;
      this.workBookList();
    },
    //新增页脚
    addHandleSizeChange(val) {
      this.zdPageForm.pageSize = val;
      this.getWorkBookListInner();
    },
    addHandleCurrentChange(val) {
      this.zdPageForm.pageNum = val;
      this.getWorkBookListInner();
    },
    //提交新增
    async addSubmit(scope) {
      if (!scope && this.multipleSelection.length <= 0) {
        this.$message({
          type: "warning",
          message: "请选择要增加的列表项!",
        });
        return;
      }

      let row = scope ? scope.row : null;
      this.saveForm = {};
      this.workprocessId = this.edit;
      this.saveForm.wprocessId = this.workprocessId;
      this.saveForm.nodeId = this.jobForm.nodeId;
      this.saveForm.guideId = this.multipleSelection;
      this.$confirm("确定添加列表项吗?", "新增列表", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await getSaveAddWork(this.saveForm);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.workBookList();
          this.dialogVisible = false;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  overflow: hidden;
}

.set-job {
  margin-top: 10px;
}
.set-job .editor {
  float: left;
  width: 68%;
  border: 1px solid #eee;
}

.set-job #vue-g6-editor .fr-form {
  float: left;
  width: 30%;
  margin-left: 2%;
  border: 1px solid #eee;
}

.set-job {
  .fr-form .fr-top {
    border-bottom: none;
    padding-bottom: 0;
  }
  .fr-tit {
    margin-top: 0;
  }
  .setJobCont {
    overflow: auto;
    height: 34vh;
    margin-bottom: 1vh !important;
  }
}
.set-job #vue-g6-editor .fr-tit {
  font-size: 18px;
  height: 50px;
  line-height: 50px;
  color: #333;
  padding-left: 15px;
}

.set-job .fr-tit::before {
  display: inline-block;
  content: "";
  width: 4px;
  height: 20px;
  background: rgba(13, 116, 215, 1);
  vertical-align: -4px;
  margin-right: 9px;
}
.set-job #vue-g6-editor .fr-bottom {
  overflow: auto;
  margin-top: 2vh;
  background: #ffffff;
  height: calc(100vh - 51vh);
}
.set-job #vue-g6-editor {
  /* position: absolute; */
  top: 180px;
  /* left: 7%; */
  right: 0;
  bottom: 0px;
  width: 100%;
  overflow-y: scroll;
  /* padding: 30px; */
  /* width: 94%; */
}

.set-job #vue-g6-editor header:nth-of-type(1) {
  background: #fbfbfb;
  line-height: 40px;
  padding-left: 20px;
  border-bottom: 1px solid #dadce0;
  box-sizing: border-box;
}

.set-job #vue-g6-editor #toolbar {
  background: #fbfbfb;
  border-bottom: 1px solid #dadce0;
  padding: 4px 14px;
}

.set-job #vue-g6-editor #toolbar i {
  font-size: 18px;
  padding: 4px;
  margin-right: 8px;
  color: #999999;
}

.set-job #vue-g6-editor #toolbar i:hover {
  cursor: pointer;
  background-color: #eeeeee;
  color: #5cb6ff;
}

.set-job #vue-g6-editor #itempannel {
  box-sizing: border-box;
  background-color: #fbfbfb;
  border-right: 1px solid #dadce0;
  height: calc(100vh - 41px - 37px);
  padding-top: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: flex-start;
  display: none;
}

#vue-g6-editor #itempannel .getItem {
  cursor: move;
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#vue-g6-editor #itempannel .getItem img {
  width: 100%;
}

#vue-g6-editor #page {
  height: calc(100vh - 185px);
  background: #ffffff;
}

#vue-g6-editor #page canvas {
  display: block;
  width: 100%;
}

.set-job #vue-g6-editor .right-part {
  height: calc(100vh - 220px - 30px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  display: none;
}

#vue-g6-editor #detailpannel {
  flex-grow: 1;
  background-color: #fbfbfb;
  border-left: 1px solid #dadce0;
  overflow-y: scroll;
}

#vue-g6-editor #detailpannel #nodeAttributeBar .title,
#vue-g6-editor #detailpannel #edgeAttributeBar .title,
#vue-g6-editor #detailpannel #groupAttributeBar .title,
#vue-g6-editor #detailpannel #canvasAttributeBar .title,
#vue-g6-editor #detailpannel #multiAttributeBar .title {
  height: 34px;
  line-height: 34px;
  text-align: center;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 13px;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #dadce0;
}

#vue-g6-editor #detailpannel #nodeAttributeBar .main,
#vue-g6-editor #detailpannel #edgeAttributeBar .main,
#vue-g6-editor #detailpannel #groupAttributeBar .main,
#vue-g6-editor #detailpannel #canvasAttributeBar .main,
#vue-g6-editor #detailpannel #multiAttributeBar .main {
  padding: 10px;
}

#vue-g6-editor #minimap {
  background-color: #fbfbfb;
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

#vue-g6-editor #minimap .title {
  height: 34px;
  line-height: 34px;
  text-align: center;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 13px;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #dadce0;
}

#vue-g6-editor #contextmenu {
  display: none;
}

#vue-g6-editor #contextmenu .menu /deep/ .el-button {
  width: 100%;
  display: block;
  margin-left: 0;
  border-radius: 0 !important;
  border-bottom: none;
}

#vue-g6-editor #contextmenu .menu /deep/ .el-button:nth-last-of-type(1) {
  border-bottom: 1px solid #dcdfe6;
}

#vue-g6-editor .save-as-image-dialog /deep/ .el-select {
  display: block;
}

#vue-g6-editor #page canvas {
  height: auto !important;
}

.el-dialog {
  position: relative;
  z-index: 9999999;
}
.set-job .el-tree {
  background: #ffffff;
}
/* .editor{
  margin-top: 90px!important;
} */
</style>
