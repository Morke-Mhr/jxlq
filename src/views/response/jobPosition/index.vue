<template>
  <div class="app-container job-position org">
    <div class="left left_jgs">
      <div class="org-tit">机构列表</div>
      <el-tree
        class="el_tree"
        ref="deptTree"
        :check-strictly="checkStrictly"
        :data="deptOptions"
        :props="defaultProps"
        node-key="id"
        @node-expand="nodeclick"
        @node-click="setCheckedNodes"
        :default-expanded-keys="defaultKeys"
      />
    </div>
    <div class="right">
      <div class="right-content" v-loading="rigthLoading">
        <div class="right-form">
          <div class="right-job">
            <div class="org-tit" style="padding-left: 0">
              岗位职责
              <el-button
                v-has="has.edit"
                class="el-icon-edit chaxun"
                @click="editAlert"
                style="float: right; margin-top: 9px"
                >编辑
              </el-button>
            </div>
          </div>
          <div>
            <el-tabs v-model="activeName">
              <el-tab-pane label="岗位职责" name="first">
                <div
                  class="panel-text"
                  v-html="jobContent.responsibility"
                ></div>
              </el-tab-pane>
              <el-tab-pane label="安全责任" name="second">
                <div class="panel-text">
                  {{ jobContent.safeDuty }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="工作标准" name="third">
                <div class="panel-text">
                  {{ jobContent.standard }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="法规依据" name="fourth">
                <div class="panel-text">
                  {{ jobContent.rule }}
                </div>
              </el-tab-pane>
              <el-tab-pane label="追责方向" name="five">
                <div class="panel-text">
                  {{ jobContent.accountable }}
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="right-bottom" v-loading="loading">
          <el-row>
            <el-col :span="11">
              <div class="org-tit">流程</div>
              <div
                v-for="(item, index) in jobContent.workProcessList"
                :key="index"
              >
                <p class="text-Content" @click="getProcess(index)">
                  {{ item.workprocessName }}
                </p>
              </div>
              <el-dialog
                title="流程图"
                :visible.sync="dialogVisibleT"
                custom-class="large"
                append-to-body
              >
                <div id="vue-g6-editor">
                  <div class="editor" style="width: 100%">
                    <!-- 元素面板 + 画布 + 属性栏 -->
                    <el-row :span="17">
                      <!-- 画布 -->
                      <el-col :span="24">
                        <div
                          id="page"
                          style="width: 100%; display: flex; height: 92vh"
                        ></div>
                      </el-col>
                      <!-- 属性栏 -->
                    </el-row>
                  </div>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button class="fBtn" @click="dialogVisibleT = false"
                    >关 闭</el-button
                  >
                </span>
              </el-dialog>
            </el-col>
            <el-col :span="12" :offset="1">
              <div class="org-tit">作业规范</div>
              <div
                v-for="(item, index) in this.jobContent.workstandardFiles"
                :key="index"
              >
                <p class="text-Content" @click="lookDetail(index)">
                  {{ item.fileName }}
                </p>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="workTit"
      custom-class="large"
      :close-on-click-modal="false"
    >
      <el-form
        :model="lookForm"
        ref="operationFome"
        label-width="80px"
        label-position="left"
      >
        <!-- <el-form-item label="类别" prop="workType">
                  <el-input v-model="lookForm.workType" maxlength="30" show-word-limit placeholder="类别" />
                </el-form-item> -->
        <el-form-item label="类别">
          <el-select v-model="lookForm.workType" placeholder="请选择类别">
            <el-option
              v-for="item in workRes"
              :key="item.dictCode"
              :label="item.dictLabel"
              :value="item.dictLabel"
              :disabled="true"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="workName">
          <el-input
            v-model="lookForm.workName"
            maxlength="30"
            show-word-limit
            placeholder="名称"
            :disabled="true"
          />
        </el-form-item>

        <!--     <el-form-item label="附件" prop="fileName">
                  <el-input v-model="lookForm.fileName" maxlength="11" show-word-limit :disabled="true"  />
                </el-form-item> -->

        <el-form-item label="附件" prop="fileName">
          <template>
            <span
              style="color: #096dd9; cursor: pointer"
              @click="fileDownload"
              >{{ lookForm.fileName }}</span
            >
          </template>
        </el-form-item>

        <el-form-item label="要求" prop="workRequire">
          <el-input
            v-model="lookForm.workRequire"
            maxlength="30"
            show-word-limit
            placeholder="要求"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item label="内容" prop="workContent">
          <el-input
            v-model="lookForm.workContent"
            placeholder="内容"
            :disabled="true"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--编辑弹窗-->
    <el-dialog
      :visible.sync="dialogVisibleEdit"
      :title="editTit"
      custom-class="large"
      :close-on-click-modal="false"
    >
      <el-form
        :model="jobContent"
        ref="jobContent"
        :rules="formRules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="部门" prop="deptName">
          <el-input
            v-model="jobContent.deptName"
            maxlength="30"
            show-word-limit
            placeholder="部门名称"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item label="岗位" prop="postName">
          <el-input
            v-model="jobContent.postName"
            maxlength="30"
            show-word-limit
            placeholder="岗位"
            :disabled="true"
          />
        </el-form-item>

        <el-form-item label="岗位职责" prop="responsibility">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入岗位职责"
            v-model="jobContent.responsibility"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="安全责任" prop="safeDuty">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入安全责任"
            v-model="jobContent.safeDuty"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="工作标准" prop="standard">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入工作标准"
            v-model="jobContent.standard"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="法规依据" prop="rule">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入法规依据"
            v-model="jobContent.rule"
          >
          </el-input>
        </el-form-item>

        <el-form-item label="追责方向" prop="accountable">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入追责方向"
            v-model="jobContent.accountable"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="tBtn" @click="confirm"> 提交 </el-button>
        <el-button class="fBtn" @click="dialogVisibleEdit = false">
          取消
        </el-button>
      </span>
    </el-dialog>
  </div>
  <!--弹窗-->
</template>

<script>
import {
  getJobPosition,
  getEditJob,
  getLookWorkAlert,
} from "@/api/job/jobPosition";
import { getPostsBydeptId } from "@/api/job/org";
import G6Editor from "@antv/g6-editor";
import {
  getlookWorkchart,
  getEditWorkchart,
  getNodeIdJob,
  getNodeIdBook,
  getTreeDeptSelect,
} from "@/api/job/workChart";
import { getSelectWorkType } from "@/api/system/class";

export default {
  data() {
    return {
      has: {
        remove: "",
        query: "",
        add: "",
        edit: "business:post:edit",
      },
      dialogFull: false,
      workTit: "查看",
      editTit: "编辑",
      btnShowJob: false,
      btnShowDept: false,
      addDeptShow: false,
      addJobShow: false,
      lookShow: true,
      updataBtn: true,
      dialogVisibleT: false,
      workRes: [],
      flow: "",
      // 节点属性表单
      nodeAttributeForm: {
        label: "",
        width: "",
        height: "",
      },
      formList: {
        name: "",
        description: "",
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
      },
      // SVG节点图片URL地址
      startNodeSVGUrl: require("../../../assets/start-node.svg"),
      endNodeSVGUrl: require("../../../assets/end-node.svg"),
      regularNodeSVGUrl: require("../../../assets/regular-node.svg"),
      conditionNodeSVGUrl: require("../../../assets/condition-node.svg"),
      modelNodeSVGUrl:
        "https://gw.alipayobjects.com/zos/rmsportal/rQMUhHHSqwYsPwjXxcfP.svg",
      // 编辑器
      editor: null,
      saveAsImageFormat: "jpg",
      //表单验证方法
      //树形
      checkStrictly: true,
      deptOptions: [],
      dialogVisible: false,
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
      id: "202",
      treeRes: "",
      postId: "",
      activeName: "first",
      jobContent: {
        //工作标准
        standard: "暂无数据",
        //安全责任
        safeDuty: "暂无数据",
        //岗位职责
        responsibility: "暂无数据",
        //法规依据
        rule: "暂无数据",
        //追责方向
        accountable: "暂无数据",
        //流程名
        workprocessName: "暂无数据",
        workprocessId: "",
        fileName: "",
        //岗位名称
        postName: "暂无数据",
        //部门
        deptName: "",
        deptId: "",
        postId: "",
        workProcessList: [
          {
            workprocessName: "暂无数据",
          },
        ],
        workstandardFiles: [
          {
            fileName: "暂无数据",
          },
        ],
      },
      lookForm: {
        workType: "",
        workName: "",
        workContent: "",
        workRequire: "",
        fileName: "",
        fileUrl: "",
      },

      //表单验证方法
      formRules: {
        standard: [
          {
            required: true,
            message: "请输入工作标准",
            trigger: "blur",
          },
        ],
        safeDuty: [
          {
            required: true,
            message: "请输入安全责任",
            trigger: "blur",
          },
        ],
        responsibility: [
          {
            required: true,
            message: "请输入岗位职责",
            trigger: "blur",
          },
        ],
        rule: [
          {
            required: true,
            message: "请输入法规依据",
            trigger: "blur",
          },
        ],
        accountable: [
          {
            required: true,
            message: "请输入追责方向",
            trigger: "blur",
          },
        ],
      },
      // 画布属性栏表单
      showProcess: true,
      processMap: "",
      dialogVisibleEdit: false,
      index: "",
      curID: "",
      curBookId: "",
      lookParams: {
        workstandardId: "",
        fileId: "",
      },
      dictLabel: [],
      loading: false,
      rigthLoading: false,
      // tree默认展开节点
      defaultKeys: [],
    };
  },
  created: async function () {
    //获取部门树形
    this.fullscreenLoading = true;
    this.deptOptions = await getTreeDeptSelect();
    this.fullscreenLoading = false;
    this.defaultKeys = [this.deptOptions[0].id];
    //查看基本信息
  },
  methods: {
    // :render-content="renderContent"  图标添加在el-tree组件上
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <i class="el-icon-share"></i>
          <span style="margin-left:5px;">{node.label}</span>
        </span>
      );
    },
    //树状结构
    async nodeclick(data, node) {
      node.loading = true;
      console.log(node);
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
    //获取树形结构
    async getTree() {
      this.deptOptions = await getTreeDeptSelect();
    },

    // 初始化
    initG6Editor() {
      const _this = this;
      if (_this.editor) {
        return;
      }
      console.log(222);
      const editor = new G6Editor();
      this.editor = editor;
      G6Editor.track(false);
      const Command = G6Editor.Command;
      // 注册新命令save
      // Command.registerCommand('save', {
      //     // 禁止保存命令进入队列
      //     queue: false,
      //     // 命令是否可用
      //     enable: (editor) => {
      //         return true
      //     },
      //     // 正向命令
      //     execute(editor) {
      //         let needSaveData = editor.getCurrentPage().save()
      //         localStorage.setItem('flowData', JSON.stringify(needSaveData))
      //         _this.save(needSaveData)
      //         // _this.$message.success("数据已保存");
      //     },
      //     // 反向命令
      //     back(editor) {
      //         console.log('反向命令')
      //         console.log(editor)
      //     },
      //     // 快捷键：Ctrl + S
      //     shortcutCodes: [['metaKey', 's'], ['ctrlKey', 's']]
      // })
      // 画布
      this.flow = new G6Editor.Flow({
        graph: {
          container: "page",
          fitView: "autoZoom",
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

      editor.add(this.flow);
      editor.add(itempannel);
      window.editor = editor;

      // 获取当前画布
      var currentPage = editor.getCurrentPage();
      // currentPage.on('afterchange', (e) => {
      //     if (e.action === 'add') {
      //         if (
      //                 e.model.nodetype === 'startNode' ||
      //                 e.model.nodetype === 'endNode'
      //         ) {
      //             let nodes = this.editor.getCurrentPage().getNodes()
      //             for (const item of nodes) {
      //                 if (
      //                         item.model.nodetype === e.model.nodetype &&
      //                         item.model.id !== e.model.id
      //                 ) {
      //                     this.editor.getCurrentPage().remove(e.item)
      //                     this.$message.warning('只能有一个开始节点或结束节点')
      //                 }
      //             }
      //         }
      //     }
      // })
      // 监听（选择对象后）事件
      currentPage.on("afteritemselected", (ev) => {
        console.log("打印所选对象属性", ev.item);
        console.log("打印所选对象数据模型", ev.item.model);
        const selectedItemDataModel = ev.item.model;
        // 如果选择的对象是节点
        if (ev.item.isNode) {
          this.nodeAttributeForm.label = selectedItemDataModel.label;
          this.nodeAttributeForm.width = selectedItemDataModel.size.split(
            "*"
          )[0];
          this.nodeAttributeForm.height = selectedItemDataModel.size.split(
            "*"
          )[1];
          this.nodeAttributeForm.color = selectedItemDataModel.color;
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
      // currentPage.on('node:click', (ev) => {
      //     var selectedItemDataModel = ev.item.model
      //     let self = this
      //     // 如果选择的对象是节点
      //     if (ev.item.isNode) {
      //         this.nodeAttributeForm.label = selectedItemDataModel.label
      //         this.nodeAttributeForm.width = selectedItemDataModel.size.split(
      //                 '*'
      //         )[0]
      //         this.nodeAttributeForm.height = selectedItemDataModel.size.split(
      //                 '*'
      //         )[1]
      //         this.nodeAttributeForm.color = selectedItemDataModel.color
      //         // this.jobForm.nodeId = selectedItemDataModel.id
      //         this.getTree()
      //         //根据节点显示工作岗位
      //         // getNodeIdJob(this.jobForm.nodeId).then(function (response) {
      //         //     for (var i = 0; i < response.length; i++) {
      //         //         self.jobForm.postName.push(response[i].postName)
      //         //         self.jobForm.postId.push(response[i].postId)
      //         //         self.$refs.deptTree.setCheckedKeys(self.jobForm.postId, true)
      //         //     }
      //         // })
      //         // this.jobForm.postName.splice(0, this.jobForm.postName.length)
      //         // this.jobForm.postId.splice(0, this.jobForm.postName.length)
      //         //根据节点显示作业指导书
      //         // getNodeIdBook(this.jobForm.nodeId).then(function (response) {
      //         //     self.tableData = response.rows
      //         //     self.total = response.total
      //         // })
      //         // this.addBtn = true
      //     }
      //     // 如果选择的对象是边
      //     if (ev.item.isEdge) {
      //         ev.item.graph.edge({
      //             shape: 'flow-polyline-round'
      //         })
      //         this.edgeAttributeForm.label = selectedItemDataModel.label
      //         this.edgeAttributeForm.shape = selectedItemDataModel.shape
      //     }
      // })
      // 监听（删除后）事件
      currentPage.on("afterdelete", (ev) => {});
    },
    //
    async save(source) {
      // this.formList.edges = source.edges
      // this.formList.nodes = source.nodes
      // this.formList.name = this.basicForm.name
      // this.formList.description = this.basicForm.description
      // let res = await getEditWorkchart(this.formList)
      // this.$notify({
      //     title: res ? '修改成功' : '修改失败',
      //     dangerouslyUseHTMLString: true,
      //     message: res ? data.message : '系统正在维护中，请与管理员联系',
      //     type: res ? 'success' : 'warning'
      // })
      // this.$emit('fatherMethod')
    },
    //获取岗位选择的当前节点
    setCheckedNodes(data) {
      if (!data.children) {
        this.postId = data.id;
        this.rigthLoading = true;
        this.getJobData();
        this.rigthLoading = false;
      }
    },
    //获取岗位职责数据
    async getJobData() {
      let _content = await getJobPosition(this.postId);
      // this.jobContent = await getJobPosition(this.postId)
      // debugger
      if (_content == undefined) {
        this.jobContent.standard = "暂无数据";
        this.jobContent.safeDuty = "暂无数据";
        this.jobContent.responsibility = "暂无数据";
        this.jobContent.rule = "暂无数据";
        this.jobContent.accountable = "暂无数据";
        this.jobContent.workProcessList = [{ workprocessName: "暂无数据" }];
        this.jobContent.workstandardFiles = [{ fileName: "暂无数据" }];
      } else {
        this.jobContent = _content;
      }
    },
    //请求单个流程图
    async getLookChart() {
      console.log(111, this.jobContent);
      this.loading = true;
      this.processMap = await getlookWorkchart(
        this.jobContent.workProcessList[this.curID].workprocessId,
        {
          selectNodeIds: this.jobContent.workProcessList[this.curID]
            .selectNodeIds,
        }
      );
      console.log(222, this.processMap);

      this.flow.read(this.processMap);
      this.loading = false;
    },

    //流程图
    getProcess(index) {
      if (this.postId != "") {
        this.dialogVisibleT = true;
        setTimeout(() => {
          this.curID = index;
          this.initG6Editor();
          this.getLookChart();
        }, 100);
      }
    },
    //附件下载
    async fileDownload(scope) {
      let fileForm = {
        name: this.lookForm.fileName,
        path: this.lookForm.fileUrl,
      };
      this.fileDowloadName =
        this.$store.state.apiConfiguration.url +
        "jxlq-system-service" +
        `/fs/download?name=${encodeURI(encodeURI(fileForm.name))}
        ` +
        "&path=" +
        fileForm.path;
      location.href = this.fileDowloadName;
    },
    //获取分类下拉列表
    async getWorkSel() {
      let dictName = "Job_category";
      this.workRes = await getSelectWorkType(dictName);
      console.log(this.workRes);
    },
    //查看
    async lookDetail(index) {
      if (this.postId != "") {
        this.curBookId = index;
        this.getWorkSel();
        this.dialogVisible = true;
        this.lookParams.workstandardId = this.jobContent.workstandardFiles[
          this.curBookId
        ].workstandardId;
        this.lookParams.fileId = this.jobContent.workstandardFiles[
          this.curBookId
        ].fileId;
        try {
          let checkData = await getLookWorkAlert(this.lookParams);
          this.lookForm = checkData;

          this.lookForm.workType = checkData.dictDataWorkType.dictLabel;
          this.lookForm.fileName = checkData.fileList[0].fileName;
          this.lookForm.fileUrl = checkData.fileList[0].fileUrl;
        } catch (e) {
          console.error("接口异常");
        }
      }
    },
    async editAlert(scope) {
      if (this.postId != "") {
        this.dialogVisibleEdit = true;
      }
    },
    //提交编辑岗位职责
    async confirm(scope) {
      this.$refs.jobContent.validate(async (valid) => {
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
        delete this.jobContent.fileName;
        delete this.jobContent.workprocessId;
        delete this.jobContent.fileId;
        delete this.jobContent.workprocessName;
        delete this.jobContent.workProcessList;
        delete this.jobContent.workstandardFiles;
        delete this.jobContent.workProcessListVos;
        data = await getEditJob(this.jobContent);
        this.dialogVisibleEdit = false;
        this.$notify({
          title: data ? "修改成功" : "修改失败",
          dangerouslyUseHTMLString: true,
          message: data ? data.message : "系统正在维护中，请与管理员联系",
          type: data ? "success" : "warning",
        });

        this.getJobData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/*  .main-container {
    background: #F4F1F2;
  } */
.job-position {
  //   .left_jgs {
  //     position: relative;
  //     overflow: hidden;
  //   }
  .org-tit {
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    color: #333;
    padding-left: 15px;
    // position: absolute;
    // width: 100%;
    // z-index: 2;
    // background: #fff;
  }
  //   .el_tree {
  //     overflow: auto;
  //     height: 100%;
  //     margin-top: 50px;
  //   }
  .org-tit .chaxun {
    background-color: #0d74d7;
    border-color: #0d74d7;
    color: #ffffff;
    text-align: center;
    height: 32px;
  }
  .org-tit::before {
    display: inline-block;
    content: "";
    width: 4px;
    height: 20px;
    background: rgba(13, 116, 215, 1);
    vertical-align: -4px;
    margin-right: 9px;
  }

  .right-form {
    padding: 0px 15px;
    position: relative;
  }

  .org-tit em {
    border: 1px solid #d7d7d7;
    cursor: pointer;
    padding: 7px;
    border-radius: 3px;
  }

  .oprate-btn {
    /* position: absolute; */
    right: 35px;
    top: 25px;
  }

  .submit {
    width: 68px;
    height: 32px;
    line-height: 32px;
    background: rgba(13, 116, 215, 1);
    border-radius: 3px;
    color: #ffffff;
    border: 0;
  }

  .cancel {
    width: 68px;
    height: 32px;
    line-height: 32px;
    color: #d7d7d7;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid rgba(215, 215, 215, 1);
  }

  .edit-btn {
    float: right;
  }

  .el-tabs__item.is-active {
    height: 22px;
    background: #5583fe;
    border-radius: 4px;
    color: #ffffff;
    line-height: 22px;
    padding: 1px 5px;
    text-align: center;
  }

  .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
  .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
  .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 3px;
  }

  .el-tabs__nav {
    text-align: center;
    float: none;
  }

  .el-tabs__active-bar {
    background-color: #ffffff;
  }

  .el-tabs__nav-wrap::after {
    background-color: #ffffff;
  }

  .right-form {
    /* height: 33vh; */
    background: #fff;
    margin-bottom: 2vh;
  }

  .right-bottom {
    height: 45vh;
    overflow-y: scroll;
  }

  .right-bottom .el-col {
    background: #fff;
  }

  .text-Content {
    color: #5583fe;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }

  .text-Content::before {
    width: 6px;
    height: 6px;
    background: #d8d8d8;
    border-radius: 50%;
    margin: 0px 5px;
    display: inline-block;
    content: "";
    vertical-align: middle;
    cursor: pointer;
    margin-left: 15px;
  }

  .right-bottom .el-row {
    background: #fff;
    height: 100%;
  }

  .fr-form {
    float: left;
    width: 45%;
    margin-left: 2%;
  }

  /* .fr-tit {
       height: 40px;
       line-height: 40px;
       font-size: 16px;
     } */
  .fr-tit {
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    color: #333;
    padding-left: 15px;
    margin-top: 18px;
  }

  .fr-tit::before {
    display: inline-block;
    content: "";
    width: 4px;
    height: 20px;
    background: rgba(13, 116, 215, 1);
    vertical-align: -4px;
    margin-right: 9px;
  }

  .fr-form .fr-top {
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }

  .fr-bottom {
    margin-top: 25px;
  }

  .job-position #vue-g6-editor {
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  #vue-g6-editor header:nth-of-type(1) {
    background: #fbfbfb;
    line-height: 40px;
    padding-left: 20px;
    border-bottom: 1px solid #ffffff;
    box-sizing: border-box;
  }

  #vue-g6-editor #toolbar {
    background: #fbfbfb;
    border-bottom: 1px solid #dadce0;
    padding: 4px 14px;
  }

  #vue-g6-editor #toolbar i {
    font-size: 18px;
    padding: 4px;
    margin-right: 8px;
    color: #999999;
  }

  #vue-g6-editor #toolbar i:hover {
    cursor: pointer;
    background-color: #eeeeee;
    color: #5cb6ff;
  }

  .job-position #vue-g6-editor #itempannel {
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

  .right-content #vue-g6-editor #page {
    height: calc(24vh);
    width: 100%;
    display: none;
  }

  #vue-g6-editor #page canvas {
    display: block;
    width: 100%;
    margin-left: 0px;
  }

  .job-position #vue-g6-editor .right-part {
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

  .right-bottom canvas {
    height: 80% !important;
    position: relative;
    top: 0;
    right: 0;
  }

  .panel-text {
    color: #333333;
    font-size: 14px;
    line-height: 30px;
    /* overflow: overlay; */
    overflow-y: auto;
    height: 25vh;
  }
}
</style>
