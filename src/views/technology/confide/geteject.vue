<template>
  <div v-loading="loading" id="printTest">
    <el-form
      :inline="true"
      :model="data"
      class="demo-form-inline"
      label-width="100px"
    >
      <el-form-item label="类别" prop="jdType" style="width: 50%;">
        <el-input type="input" disabled v-model="data.jdType"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input type="input" disabled v-model="data.projectName"></el-input>
      </el-form-item>
      <el-form-item label="标段" prop="bid" style="width: 50%;">
        <el-input type="input" disabled v-model="data.bid"></el-input>
      </el-form-item>
      <el-form-item label="单位工程名称" prop="engineName">
        <el-input type="input" disabled v-model="data.engineName"></el-input>
      </el-form-item>
      <el-form-item label="分项工程名称" prop="worktype" style="width: 50%;">
        <el-input type="input" disabled v-model="data.worktype"></el-input>
      </el-form-item>
      <el-form-item label="技术交底内容">
        <el-input style="width: 300px" type="textarea" disabled v-model="data.jdContent"></el-input>
      </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <div v-for="(item, index) of data.disclosureHeads" :key="index">
      <label>{{ item.jiaodiLevel }}级技术交底</label>
      <table border="1" cellspacing="0" width="100%">
        <tr>
          <th>交底部门</th>
          <th>交底人</th>
          <th>签名</th>
          <th>被交底部门</th>
          <th>被交底人</th>
          <th>签名</th>
        </tr>
        <tr v-for="(v, i) of item.disclosureUsers" :key="i">
          <td :rowspan="item.disclosureUsers.length" v-if="i == 0">
            {{ item.jiaodiDept }}
          </td>
          <td :rowspan="item.disclosureUsers.length" v-if="i == 0">
            {{ item.jiaodiUser }}
          </td>
          <td :rowspan="item.disclosureUsers.length" v-if="i == 0">
            <img
              :src="
                item.jiaodiSignUrl ? url + item.jiaodiSignUrl : defaultimgurl
              "
              alt
            />
          </td>
          <td>{{ v.bottonDept }}</td>
          <td>{{ v.bottonUser }}</td>
          <td>
            <img :src="v.signUrl ? url + v.signUrl : defaultimgurl" alt />
          </td>
        </tr>
        <tr v-if="item.supervisor">
          <td>监督人</td>
          <td colspan="4">{{ item.supervisor }}</td>
          <td>
            <img
              :src="
                item.supervisorSignUrl
                  ? url + item.supervisorSignUrl
                  : defaultimgurl
              "
              alt
            />
          </td>
        </tr>
      </table>

      <el-row style="margin-top: 1rem;">
        <el-col :span="11">交底时间：{{ item.jiaodiSignTime }}</el-col>
        <el-col :span="4" style="text-align:right">技术交底附件：</el-col>
        <el-col :span="9">
        <el-popover trigger="hover"  v-for="(t, l) of item.disclosureFiles"  :key="l" :content="t.jiaodiFileName" width="200"  placement="top-start">
            <el-button
            class="buttondownloads"
            slot="reference"
            plain
            @click="downloads(t)"
            >{{ t.jiaodiFileName }}</el-button>
       </el-popover>
        </el-col>
      </el-row>
      <el-divider v-if="index < data.disclosureHeads - 1"></el-divider>
    </div>
  </div>
</template>
<script>
import { getConfideDetail } from '@/api/technology/confide/confide.js'
// import { Vue } from 'vue';
// import { Popover } from 'element-ui';
// Vue.use(Popover);
export default {
  props: {
    technologyconfessId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      data: {},
      loading: false,
      url: this.$store.state.apiConfiguration.imgFileUrl,
      defaultimgurl: require('../../../assets/dataBoard/jsjd.png')
    }
  },
  async created() {
    this.loading = true
    this.data = await getConfideDetail(this.technologyconfessId)
    this.data.disclosureHeads = this.data.disclosureHeads.reverse()
    console.log(this.data)
    this.loading = false
  },
  mounted() {},
  methods: {
    downloads(v) {
      let fileDowloadName =
        this.$store.state.apiConfiguration.url +
        'jxlq-system-service' +
        '/fs/download?name=' +
         encodeURI(encodeURI(v.jiaodiFileName)) +
        '&path=' +
        v.jiaodiFileUrl
     location.href = fileDowloadName
    }
  }
}
</script>
<style lang="scss" scoped>
 .item {
      margin: 4px;
    }
table {
  border-color: #dedbdf;
}
th {
  padding: 0.7rem;
}
td {
  padding: 0.5rem;
  text-align: center;
}
img {
  width: 50px;
  height: 50px;
}
.buttondownloads {
  max-width: 160px;
  margin-left: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@media print {
  .noprint {
    display: none;
  }
}
</style>
