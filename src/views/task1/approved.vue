<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="待审批" name="first">
        <index ref="indexs" :state="true"></index>
      </el-tab-pane>
      <el-tab-pane label="已审批" name="second">
        <index ref="index" :state="false"></index>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import index from "./index";
export default {
  components: {
    index
  },
  data() {
    return {
        activeName:"first",
    };
  },
  created() {},
  methods: {
    // 选项卡切换
    handleClick(tab, event) {
     if(tab.name=="first"){
        this.$refs.indexs.getAllList();

     }else if(tab.name=="second"){
        this.$refs.index.getAllList();
     }
      },
  }
};
</script>
<style lang="scss" scoped>
</style>