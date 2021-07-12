<template>
  <el-row>
    <div class="lce">
      <div class="area-tit">证书信息<span style="font-size: 14px;text-align: right;float: right;padding-right: 15px;cursor: pointer;">添加证书</span></div>
      <el-col :span="3">
        放图片的位置
      </el-col>
      <el-col :span="21">
        <el-form :model="addData" label-width="80px" class="form-table">
          <el-form-item label="证书类别">
            <el-select v-model="addData.userCertificate.category" placeholder="业务模块" style="width:80%">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证书名称">
            <el-input type="input" v-model="addData.userCertificate.name" placeholder="请输入证书名称"></el-input>
          </el-form-item>
          <el-form-item label="发证日期">
            <div class="block">
              <el-date-picker v-model="addData.userCertificate.useTime" type="date" placeholder="选择日期" style="width: 80%;"
                format="yyyy-MM-dd" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="发证单位">
            <el-input type="input" v-model="addData.userCertificate.unit" placeholder="请输入发证单位"></el-input>
          </el-form-item>
          <el-form-item label="有效期">
            <div class="block">
              <el-date-picker v-model="addData.userCertificate.effectiveTime" type="date" placeholder="选择日期" style="width: 80%;"
                format="yyyy-MM-dd" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
  </el-row>
</template>

<script>
</script>

<style>
  .lce {
    background: #FFFFFF;
    height: 260px;
    border-radius: 5px;
  }
  
  .people-tree {
    height: 130px;
    overflow-y: scroll;
    z-index: 99;
  }
</style>
