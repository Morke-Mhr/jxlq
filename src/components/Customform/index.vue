<template>
  <f-render
    @save="handleSave"
    :loading="loading"
    height="calc(100vh - 60px)"
    :config="formConfig"
    :comps="comps"
  />
</template>

<script>
// 默认配置
import comps from "f-render/src/fixtures/comps.js";
// 富文本配置
import quillEditor from "f-render/src/fixtures/extends/quill-editor.js";
// 可以更改显示组件位置，默认为 10
// 这里更改为 2，显示更靠前
quillEditor.sort = 2
  export default {
    data() {
      return {
        loading: false,
        formConfig: {},
        // 拼接上即可
        comps: comps.concat(quillEditor),
      };
    },
    methods: {
      handleSave(res) {
        // 这里是保存到 localStorage，你可以保存到服务器
        console.info(res);
        localStorage.setItem("form-config", res);
        this.$message.success("保存成功啦~");
      }
    },
    mounted() {
      // 模拟异步加载
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.formConfig = localStorage.getItem("form-config") || "";
      }, 1000);
    }
  };
</script>