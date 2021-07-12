<template>
  <div class="sdialog">
    <el-dialog
      title="选择人员"
      :show-close="showclose"
      :close-on-click-modal="false"
      :visible.sync="isShow"
      custom-class="s_dialog large"
      append-to-body
    >
      <el-card class="left">
        <el-tree
          :data="treedata"
          :props="treeProps"
          @node-click="handleNodeClick"
          @check="setCheckedNodes"
          :check-strictly="checkStrictly"
          class="tree"
          :show-checkbox="isCheckbox"
          node-key="id"
          :default-expanded-keys="defaultKeys"
        ></el-tree>
      </el-card>
      <el-card class="right">
        <el-transfer
          v-model="value"
          :props="transferProps"
          :data="transferData"
          :button-texts="['选出', '选入']"
          :titles="transTitles"
          @left-check-change="leftFun($event, isDx)"
          @change="rightFun($event)"
        ></el-transfer>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button class="fBtn" @click="fBtnFun">取 消</el-button>
        <el-button class="tBtn" @click="tBtnFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  getUsersByLoginuser,
  getUsersByDeptId,
  getBusinessPostAllByDeptIds
} from '@/api/system/process'
export default {
  name: 'Sdialog',
  props: {
    transTitles: {
      type: Array,
      default: () => {
        return ['可选项', '已选']
      }
    },
    // 树形结构 根据children对应的值分级 默认'children' label为需要显示的字段 默认为'label'
    treeProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    // 穿梭栏 key为需要绑定的索引 默认为'key' label为需要显示的字段 默认为'label'
    transferProps: {
      type: Object,
      default: () => {
        return {
          key: 'key',
          label: 'label'
        }
      }
    },
    // 树形结构的数据
    treedata: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 单选多选 true :单选
    isDx: {
      type: Boolean,
      default: true
    },
    // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法
    checkStrictly: {
      type: Boolean,
      default: true
    },
    // 树状是否可以多选
    isCheckbox: {
      type: Boolean,
      default: false
    },
    // 是否需要将选中的id,和文本传回父组件
    sNeed: {
      type: Boolean,
      default: false
    },
    // sNeed为true时 父组件用于接收数据的字段名
    needData: {
      type: String
    },
    dxId: {
      type: String
    },
    // 是否显示弹出层关闭按钮
    showclose: {
      type: Boolean,
      default: true
    },
    chooseType: {
      type: String,
      default: 'people'
    },
    // 回显已选的数据
    treeResChild: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      isShow: false,
      // treedata: [],
      // 选中的
      value: [],
      // 穿梭栏绑定数据
      transferData: [],
      defaultKeys: [],
      selNode: {}
    }
  },
  methods: {
    async handleNodeClick(data) {
      if (!this.isCheckbox) {
        this.transferData = await getUserList(data.id)
        console.log(this.transferData, 'handleNodeClick')
      }
    },
    async setCheckedNodes(treeNode, selNode) {
      this.selNode = selNode
      if (this.chooseType == 'dept') {
        if (selNode.checkedKeys.length > 0) {
          this.transferData = await getBusinessPostAllByDeptIds(
            selNode.checkedKeys
          )
        } else {
          this.transferData = []
        }
      } else {
        this.transferData = await getUsersByDeptId(selNode.checkedKeys)
      }
      // console.log(this.transferData, treeNode, selNode, 'setCheckedNodes')
    },
    fBtnFun() {
      this.isShow = false
    },
    tBtnFun() {
      // 如果需要传回
      if (this.sNeed) {
        let v = []
        this.value.forEach((vitem) => {
          this.transferData.forEach((tItem) => {
            if (tItem[this.transferProps.key] == vitem) {
              v.push(tItem)
            }
          })
        })
        // v:选中人的ID和名称对象    this.value:选中人的ID数组
        if (this.chooseType == 'dept') {
          this.$emit('choiceUser', this.value, v, {
            selNode: this.selNode,
            transferData: this.transferData
          })
        } else {
          this.$emit('choiceUser', this.value, v)
        }
        // this.$parent[this.needData] = []
        // this.value.forEach((vitem) => {
        //   this.transferData.forEach((tItem) => {
        //     if (tItem[this.transferProps.key] == vitem) {
        //       this.$parent[this.needData].push(tItem)
        //     }
        //   })
        // })
        // console.log(this.$parent[this.needData],555)
      }
      // 是否需要显示选中文本
      if (this.dxId) {
        this.$parent[this.dxId] = this.value[0]
      }
      this.value = []
      this.transferData.forEach((dItem) => {
        dItem.disabled = false
      })
      //  this.isShow = false
    },
    // 左侧选中事件
    leftFun(isCheck, val) {
      if (isCheck.length > 0 && val) {
        this.value = []
        this.transferData.forEach((dItem) => {
          if (dItem[this.transferProps.key] != isCheck[0]) {
            dItem.disabled = true
          }
        })
      } else if (isCheck.length <= 0 && val) {
        this.transferData.forEach((dItem) => {
          dItem.disabled = false
        })
      }
    },
    // 右侧选出事件【用于接触左侧禁用】
    rightFun(e) {
      console.log(111, e)
      if (e.length <= 0) {
        this.transferData.forEach((dItem) => {
          dItem.disabled = false
        })
      }
    }
  },
  computed: {},
  async created() {
    if (!this.isCheckbox) {
      this.transferData = await getUsersByLoginuser()
    }
    console.log(this.transferData, 'this.transferData')
  },
  beforeUpdate() {
    // console.log(this.treedata, 'treedata')
    if (this.isShow) {
      this.defaultKeys = [this.treedata[0].id]
      // 回显
      if (
        this.treeResChild.length > 0 &&
        this.value.length <= this.treeResChild.length
      ) {
        this.value = this.treeResChild
        this.treeResChild = []
        console.log(this.value, 'treeResChild')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.right {
  float: right;
  width: 65%;
}
.sdialog {
  .el-card {
    min-height: 60vh;
    height: 100%;
  }
}
.left {
  float: left;
  width: 30%;
}
.el-transfer-panel__body,
.el-transfer-panel__list {
  height: 280px;
}
.v-modal {
  z-index: 9999999 !important;
}
.el-dialog__wrapper {
  z-index: 9999999 !important;
}
</style>
