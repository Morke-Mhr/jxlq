<template>
  <div class="newWindows">
    <!--<iframe  src="http://192.168.16.62:8001/modeler/createPage?name=activiti16&amp;key=20200616" width="100%" height="100%"></iframe>-->
    <iframe :src="url" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
import { getProcessMap } from "@/api/system/process";
import axios from "axios";
import { getToken, setToken } from "@/utils/auth";
//
export default {
  data() {
    return {
      htmlTemplate: "",
    };
  },
  computed: {
    url: function () {
      // return (
      //   'http://192.168.16.175:8001/editor?modelId=' +
      //   this.$route.query.modelId +
      //   '?Authorization=Bearer eyJhbGciOiJIUzI1NiJ9.eyJsb2dpbl91c2VyX2tleSI6IjJmN2MwYWVmLTZkMWQtNDkzMi1hNDgwLTM2YzgwMjZmMWU1NyIsInN1YiI6InpkdHgiLCJleHAiOjE1OTk1NTU3NzF9.yqG29jaZ_SuFvZcrTv2wiZYUM-vWXfu4ot847B3VWr8'
      // )
      const serviceName = this.$store.state.serviceName.process;
      console.log(serviceName+"服务名")
      return (
        this.$store.state.apiConfiguration.url +
        serviceName +
        "/editor?modelId=" +
        this.$route.query.modelId +
        "?Authorization=" +
        getToken()
      );
    },
  },
  geHeaders() {
    return {
      Authorization: getToken(),
    };
  },
  created() {},
  mounted() {},
};
</script>

<style>
.newWindows {
  width: 100%;
  height: 100%;
}
</style>
