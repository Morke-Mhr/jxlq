<template>
  <div class="content">
    <template>
      <div class="inquire">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="姓名">
            <el-input v-model="formInline.workName" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="发放日期">
            <el-input v-model="formInline.workType" placeholder="发放日期"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="formInline.createBy" placeholder="身份证号"></el-input>
          </el-form-item>
          <el-form-item label="部门名称">
            <el-input v-model="formInline.createBy" placeholder="部门名称"></el-input>
          </el-form-item>
          <el-form-item label="岗位名称">
            <el-input v-model="formInline.createBy" placeholder="岗位名称"></el-input>
          </el-form-item>
          <el-form-item label="薪酬月份">
            <el-input v-model="formInline.createBy" placeholder="薪酬月份"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </div>
</template>
