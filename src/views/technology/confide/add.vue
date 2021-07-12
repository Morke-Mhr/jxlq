<template>
  <div class="container-table">
    <div class="page-tit">
      {{ state == 'post' ? '新增' : state == 'put' ? '修改' : '查看' }}
    </div>
    <!-- <div v-if="state=='get'" class="zzc" :style="heights"></div> -->
    <div class="table-list confide-content" ref="getheight">
      <el-form
        :model="addConfide"
        :rules="formRules"
        class="clearfix"
        ref="operationFome"
        label-width="150px"
        label-position="right"
        v-loading="addConfideloading"
      >
        <el-form-item
          label="类别"
          prop="jdTypeId"
          style="width: 50%;float: left;margin-bottom: 0px;z-index: 9;position: relative;"
        >
          <el-select
            v-model="addConfide.jdTypeId"
            placeholder="请选择类别"
            @change="peojectTypeFunc"
          >
            <el-option
              v-for="item in confideRes"
              :value="item.dictCode"
              :key="item.dictCode"
              :label="item.dictLabel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="项目名称"
          prop="projectName"
          style="width: 50%; float: left; margin-bottom: 0px"
        >
          <el-input
            v-model="addConfide.projectName"
            maxlength="30"
            show-word-limit
            placeholder="请输入项目名称"
          />
          <span
            @click="chooseList"
            style="position: relative; z-index: 1"
            class="choose-list"
            >选择列表</span
          >
        </el-form-item>
        <el-form-item label="标段" prop="bid" style="width: 50%; float: left">
          <el-input
            v-model="addConfide.bid"
            maxlength="30"
            show-word-limit
            placeholder="标段"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="单位工程名称"
          style="width: 50%; float: left"
        >
          <el-input
            v-model="addConfide.engineName"
            maxlength="30"
            show-word-limit
            placeholder="请输入单位工程名称"
          />
        </el-form-item>
        <el-form-item
          label="分项工程名称"
          style="width: 50%; float: left"
        >
          <el-input
            v-model="addConfide.worktype"
            maxlength="30"
            show-word-limit
            placeholder="请输入分项工程名称"
          />
        </el-form-item>
        <el-form-item
          label="技术交底内容"
          prop="jdContent"
          style="width: 100%; float: left"
        >
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入内容"
            v-model="addConfide.jdContent"
          ></el-input>
        </el-form-item>

        <div v-for="(itme, index) in confideItem" :key="index" class="clearfix">
          <div class="area-confide">
            <div
              class="clearfix confide"
              style="clear: both; display: flex; flex-wrap: wrap;margin-top: 14rem;"
            >
              <el-collapse v-model="activeNames" style="width:100%">
                <el-collapse-item
                  title="1级技术交底"
                  name="1"
                  style="width:100%"
                >
                  <label
                    style="text-align: right;float:left; inline-block;width: 145px;padding: 20px 12px 0 0;color: #606266;"
                    >1级技术交底</label
                  >

                  <table
                    style="flex: 1; float: left;border: 1px solid #dcdfe6;margin-top:20px;"
                    border="1"
                    cellspacing="0"
                  >
                    <tr>
                      <td width="25%" class="boldfont">
                        交底部门
                        <span
                          style="font-size: 14px;cursor: pointer;"
                          @click="alertChoose2(1)"
                          class="choose-color"
                          >选择</span
                        >
                      </td>
                      <td width="10%" class="boldfont">交底人</td>
                      <td class="boldfont">
                        被交底部门
                        <span
                          style="font-size: 14px;cursor: pointer;"
                          @click="alertChoose(1, 1, 'firstLevel')"
                          class="choose-color"
                          >选择</span
                        >
                      </td>
                      <td class="boldfont">被交底人</td>
                      <td class="boldfont">是否为下一级技术交底责任人</td>
                      <td class="boldfont">操作</td>
                    </tr>
                    <template>
                      <tr v-if="firstLevel.topUserList != null">
                        <td>{{ firstLevel.topUserList.bottonDept }}</td>
                        <td>{{ firstLevel.topUserList.bottonUser }}</td>
                        <td colspan="4">
                          <table
                            style="width: 100%;height: 100%;border: 0;"
                            v-if="firstLevel.userList.length > 0"
                          >
                            <tr
                              v-for="(item, index) in firstLevel.userList"
                              :key="index"
                            >
                              <td width="26%" style="border: 0;">
                                {{ item.bottonDept }}
                              </td>
                              <td width="16%" style="border: 0;">
                                {{ item.bottonUser }}
                              </td>
                              <td width="50%" style="border: 0;">
                                <el-radio-group
                                  :disabled="disabledChooseNextOne"
                                  v-model="item.isNextCharger"
                                  @change="
                                    (label) => {
                                      radioGroupNextChargerChange(
                                        label,
                                        0,
                                        index,
                                        item.bottonUserId
                                      )
                                    }
                                  "
                                >
                                  <el-radio :label="'0'">否</el-radio>
                                  <el-radio :label="'1'">是</el-radio>
                                </el-radio-group>
                              </td>
                              <td style="border: 0;">
                                <el-button
                                  style="color:#f96964"
                                  type="text"
                                  @click="open(index, 'fir', 'firstLevel')"
                                  >删除</el-button
                                >
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </template>
                  </table>

                  <div class="jiaodi-other" id="first-miscellaneous">
                    <el-form-item
                      label="交底附件"
                      :required="true"
                      style="display: inline-block;flex: 1"
                    >
                      <el-upload
                        ref=" upload"
                        class="upload-demo"
                        :action="getUrl"
                        :headers="geHeaders"
                        :on-success="
                          (response, file, fileList) =>
                            sucUpload(response, file, fileList, 'secondArr')
                        "
                        :on-remove="
                          (file, fileList) =>
                            remUpload(file, fileList, 'secondArr')
                        "
                        :on-preview="handlePreview"
                        :before-upload="
                          (file) => beforeAvatarUpload(file, 'secondArr')
                        "
                        multiple
                        :file-list="secondArr.fileList"
                        name="file"
                      >
                        <el-button
                          icon="el-icon-paperclip"
                          class="xzwj"
                          v-if="flag == true"
                          >选择文件</el-button
                        >
                        <span v-if="flag == false">点击文件下载</span>
                      </el-upload>
                      <div class="shade" v-if="flag == false"></div>
                    </el-form-item>
                    <div class="search-supervise">
                      <div class="supervise-tit">监督人&nbsp;</div>
                      <div class="supervise-content">
                        <el-input
                          v-model="secondArr.userName"
                          readonly
                          class="xzwj"
                          @focus="seleSupervisor('secondArr')"
                        ></el-input>
                      </div>
                    </div>
                    <div class="time-supervise">
                      <el-form-item
                        label="交底时间"
                        :required="true"
                        style="width: 35%; float: left"
                      >
                        <el-date-picker
                          v-model="secondArr.jdTime"
                          type="datetimerange"
                          range-separator="至"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                        ></el-date-picker>
                      </el-form-item>
                    </div>
                  </div>
                </el-collapse-item>
                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="2级技术交底"
                    name="2"
                    style="width:100%"
                    v-show="
                      secondArr.filter(
                        (item) => item.topUserList.isShow == true
                      ).length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(secondItem, secondIdx) in secondArr"
                      :key="secondIdx"
                      v-show="secondItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ secondItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  secondItem.level,
                                  secondItem.topUserList.bottonUserId,
                                  'secondArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ secondItem.topUserList.bottonDept }}</td>
                          <td>{{ secondItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="secondItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in secondItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          1,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    type="text"
                                    style="color:#f96964"
                                    @click="
                                      open(menIdx, secondIdx, 'secondArr')
                                    "
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        secondArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'thirdArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'thirdArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'thirdArr')
                          "
                          multiple
                          :file-list="thirdArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            class="xzwj"
                            v-model="thirdArr.userName"
                            readonly
                            @focus="seleSupervisor('thirdArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="thirdArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="3级技术交底"
                    name="3"
                    style="width:100%"
                    v-show="
                      thirdArr.filter((item) => item.topUserList.isShow == true)
                        .length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(thirdItem, thirdIdx) in thirdArr"
                      :key="thirdIdx"
                      v-show="thirdItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ thirdItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  thirdItem.level,
                                  thirdItem.topUserList.bottonUserId,
                                  'thirdArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ thirdItem.topUserList.bottonDept }}</td>
                          <td>{{ thirdItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="thirdItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in thirdItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          2,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    style="color:#f96964"
                                    type="text"
                                    @click="open(menIdx, thirdIdx, 'thirdArr')"
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        thirdArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'fourthArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'fourthArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'fourthArr')
                          "
                          multiple
                          :file-list="fourthArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            class="xzwj"
                            v-model="fourthArr.userName"
                            readonly
                            @focus="seleSupervisor('fourthArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="fourthArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="4级技术交底"
                    name="4"
                    style="width:100%"
                    v-show="
                      fourthArr.filter(
                        (item) => item.topUserList.isShow == true
                      ).length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(fourthItem, fourthIdx) in fourthArr"
                      :key="fourthIdx"
                      v-show="fourthItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ fourthItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  fourthItem.level,
                                  fourthItem.topUserList.bottonUserId,
                                  'fourthArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ fourthItem.topUserList.bottonDept }}</td>
                          <td>{{ fourthItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="fourthItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in fourthItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          3,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    type="text"
                                    style="color:#f96964"
                                    @click="
                                      open(menIdx, fourthIdx, 'fourthArr')
                                    "
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        fourthArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'fifthArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'fifthArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'fifthArr')
                          "
                          multiple
                          :file-list="fifthArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            class="xzwj"
                            v-model="fifthArr.userName"
                            readonly
                            @focus="seleSupervisor('fifthArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="fifthArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="5级技术交底"
                    style="width:100%"
                    name="5"
                    v-show="
                      fifthArr.filter((item) => item.topUserList.isShow == true)
                        .length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(fourthItem, fourthIdx) in fifthArr"
                      :key="fourthIdx"
                      v-show="fourthItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ fourthItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  fourthItem.level,
                                  fourthItem.topUserList.bottonUserId,
                                  'fifthArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ fourthItem.topUserList.bottonDept }}</td>
                          <td>{{ fourthItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="fourthItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in fourthItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          4,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    type="text"
                                    style="color:#f96964"
                                    @click="open(menIdx, fourthIdx, 'fifthArr')"
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        fifthArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'sixthArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'sixthArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'sixthArr')
                          "
                          multiple
                          :file-list="sixthArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            class="xzwj"
                            v-model="sixthArr.userName"
                            readonly
                            @focus="seleSupervisor('sixthArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="sixthArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="6级技术交底"
                    style="width:100%"
                    name="6"
                    v-show="
                      sixthArr.filter((item) => item.topUserList.isShow == true)
                        .length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(fourthItem, fourthIdx) in sixthArr"
                      :key="fourthIdx"
                      v-show="fourthItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ fourthItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  fourthItem.level,
                                  fourthItem.topUserList.bottonUserId,
                                  'sixthArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ fourthItem.topUserList.bottonDept }}</td>
                          <td>{{ fourthItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="fourthItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in fourthItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          5,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    type="text"
                                    style="color:#f96964"
                                    @click="open(menIdx, fourthIdx, 'sixthArr')"
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        sixthArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'seventhArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'seventhArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'seventhArr')
                          "
                          multiple
                          :file-list="seventhArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            class="xzwj"
                            v-model="seventhArr.userName"
                            readonly
                            @focus="seleSupervisor('seventhArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="seventhArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="7级技术交底"
                    name="7"
                    style="width:100%"
                    v-show="
                      seventhArr.filter(
                        (item) => item.topUserList.isShow == true
                      ).length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(fourthItem, fourthIdx) in seventhArr"
                      :key="fourthIdx"
                      v-show="fourthItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ fourthItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  fourthItem.level,
                                  fourthItem.topUserList.bottonUserId,
                                  'seventhArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ fourthItem.topUserList.bottonDept }}</td>
                          <td>{{ fourthItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="fourthItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in fourthItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          6,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    type="text"
                                    style="color:#f96964"
                                    @click="
                                      open(menIdx, fourthIdx, 'seventhArr')
                                    "
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        seventhArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'eighthArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'eighthArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'eighthArr')
                          "
                          multiple
                          :file-list="eighthArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            class="xzwj"
                            v-model="eighthArr.userName"
                            readonly
                            @focus="seleSupervisor('eighthArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="eighthArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="8级技术交底"
                    name="8"
                    style="width:100%"
                    v-show="
                      eighthArr.filter(
                        (item) => item.topUserList.isShow == true
                      ).length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(fourthItem, fourthIdx) in eighthArr"
                      :key="fourthIdx"
                      v-show="fourthItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ fourthItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  fourthItem.level,
                                  fourthItem.topUserList.bottonUserId,
                                  'eighthArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ fourthItem.topUserList.bottonDept }}</td>
                          <td>{{ fourthItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="fourthItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in fourthItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          7,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    type="text"
                                    style="color:#f96964"
                                    @click="
                                      open(menIdx, fourthIdx, 'eighthArr')
                                    "
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        eighthArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'ninthArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'ninthArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'ninthArr')
                          "
                          multiple
                          :file-list="ninthArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            v-model="ninthArr.userName"
                            readonly
                            class="xzwj"
                            @focus="seleSupervisor('ninthArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="ninthArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <el-collapse-item
                    title="9级技术交底"
                    name="9"
                    style="width:100%"
                    v-show="
                      ninthArr.filter((item) => item.topUserList.isShow == true)
                        .length > 0
                    "
                  >
                    <div
                      style="width: 100%; display: flex;margin-top:20px;"
                      v-for="(fourthItem, fourthIdx) in ninthArr"
                      :key="fourthIdx"
                      v-show="fourthItem.topUserList.isShow"
                    >
                      <label
                        style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                        >{{ fourthItem.level }}级技术交底</label
                      >
                      <table
                        style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                        border="1"
                        cellspacing="0"
                      >
                        <tr>
                          <td width="25%" class="boldfont">交底部门</td>
                          <td width="10%" class="boldfont">交底人</td>
                          <td class="boldfont">
                            被交底部门
                            <span
                              style="font-size: 14px;cursor: pointer;color:#175eb6;"
                              @click="
                                alertChoose(
                                  fourthItem.level,
                                  fourthItem.topUserList.bottonUserId,
                                  'ninthArr'
                                )
                              "
                              class="choose-color"
                              >选择</span
                            >
                          </td>
                          <td class="boldfont">被交底人</td>
                          <td class="boldfont">是否为下一级技术交底责任人</td>
                          <td class="boldfont">操作</td>
                        </tr>
                        <tr>
                          <td>{{ fourthItem.topUserList.bottonDept }}</td>
                          <td>{{ fourthItem.topUserList.bottonUser }}</td>
                          <td colspan="4">
                            <table
                              style="width: 100%;height: 100%;border: 0;"
                              v-if="fourthItem.userList != null"
                            >
                              <tr
                                v-for="(menItem, menIdx) in fourthItem.userList"
                                :key="menIdx"
                              >
                                <td width="26%" style="border: 0;">
                                  {{ menItem.bottonDept }}
                                </td>
                                <td width="16%" style="border: 0;">
                                  {{ menItem.bottonUser }}
                                </td>
                                <td width="50%" style="border: 0;">
                                  <el-radio-group
                                    :disabled="disabledChooseNextOne"
                                    v-model="menItem.isNextCharger"
                                    @change="
                                      (label) => {
                                        radioGroupNextChargerChange(
                                          label,
                                          8,
                                          menIdx,
                                          menItem.bottonUserId
                                        )
                                      }
                                    "
                                  >
                                    <el-radio :label="'0'">否</el-radio>
                                    <el-radio :label="'1'">是</el-radio>
                                  </el-radio-group>
                                </td>
                                <td style="border: 0;">
                                  <el-button
                                    type="text"
                                    style="color:#f96964"
                                    @click="open(menIdx, fourthIdx, 'ninthArr')"
                                    >删除</el-button
                                  >
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div
                      class="jiaodi-other"
                      id="first-miscellaneous"
                      v-show="
                        ninthArr.filter(
                          (item) => item.topUserList.isShow == true
                        ).length > 0
                      "
                    >
                      <el-form-item
                        label="交底附件"
                        :required="true"
                        style="display: inline-block;flex: 1"
                      >
                        <el-upload
                          ref=" upload"
                          class="upload-demo"
                          :action="getUrl"
                          :headers="geHeaders"
                          :on-success="
                            (response, file, fileList) =>
                              sucUpload(response, file, fileList, 'tenthArr')
                          "
                          :on-remove="
                            (file, fileList) =>
                              remUpload(file, fileList, 'tenthArr')
                          "
                          :on-preview="handlePreview"
                          :before-upload="
                            (file) => beforeAvatarUpload(file, 'tenthArr')
                          "
                          multiple
                          :file-list="tenthArr.fileList"
                          name="file"
                        >
                          <el-button
                            icon="el-icon-paperclip"
                            class="xzwj"
                            v-if="flag == true"
                            >选择文件</el-button
                          >
                          <span v-if="flag == false">点击文件下载</span>
                        </el-upload>
                        <div class="shade" v-if="flag == false"></div>
                      </el-form-item>
                      <div class="search-supervise">
                        <div class="supervise-tit">监督人&nbsp;</div>
                        <div class="supervise-content">
                          <el-input
                            class="xzwj"
                            v-model="tenthArr.userName"
                            readonly
                            @focus="seleSupervisor('tenthArr')"
                          ></el-input>
                        </div>
                      </div>
                      <div class="time-supervise">
                        <el-form-item
                          label="交底时间"
                          :required="true"
                          style="width: 35%; float: left"
                        >
                          <el-date-picker
                            v-model="tenthArr.jdTime"
                            type="datetimerange"
                            range-separator="至"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                          ></el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </el-collapse-item>
                </div>

                <div class="first-div" v-if="itemIsShow">
                  <div
                    style="width: 100%; display: flex;margin-top:20px;"
                    v-for="(fourthItem, fourthIdx) in tenthArr"
                    :key="fourthIdx"
                    v-show="fourthItem.topUserList.isShow"
                  >
                    <label
                      style="text-align: right; inline-block;width: 145px;padding: 0 12px 0 0;color: #606266;"
                      >{{ fourthItem.level }}级技术交底</label
                    >
                    <table
                      style="flex: 1;border: 1px solid #dcdfe6;text-align: center;"
                      border="1"
                      cellspacing="0"
                    >
                      <tr>
                        <td width="25%" class="boldfont">交底部门</td>
                        <td width="10%" class="boldfont">交底人</td>
                        <td class="boldfont">
                          被交底部门
                          <span
                            style="font-size: 14px;cursor: pointer;color:#175eb6;"
                            @click="
                              alertChoose(
                                fourthItem.level,
                                fourthItem.topUserList.bottonUserId,
                                'tenthArr'
                              )
                            "
                            class="choose-color"
                            >选择</span
                          >
                        </td>
                        <td class="boldfont">被交底人</td>
                        <td class="boldfont">是否为下一级技术交底责任人</td>
                        <td class="boldfont">操作</td>
                      </tr>
                      <tr>
                        <td>{{ fourthItem.topUserList.bottonDept }}</td>
                        <td>{{ fourthItem.topUserList.bottonUser }}</td>
                        <td colspan="4">
                          <table
                            style="width: 100%;height: 100%;border: 0;"
                            v-if="fourthItem.userList != null"
                          >
                            <tr
                              v-for="(menItem, menIdx) in fourthItem.userList"
                              :key="menIdx"
                            >
                              <td width="26%" style="border: 0;">
                                {{ menItem.bottonDept }}
                              </td>
                              <td width="16%" style="border: 0;">
                                {{ menItem.bottonUser }}
                              </td>
                              <td width="50%" style="border: 0;">
                                <el-radio-group
                                  :disabled="disabledChooseNextOne"
                                  v-model="menItem.isNextCharger"
                                  @change="
                                    (label) => {
                                      radioGroupNextChargerChange(
                                        label,
                                        9,
                                        menIdx,
                                        menItem.bottonUserId
                                      )
                                    }
                                  "
                                >
                                  <el-radio :label="'0'">否</el-radio>
                                  <el-radio :label="'1'">是</el-radio>
                                </el-radio-group>
                              </td>
                              <td style="border: 0;">
                                <el-button
                                  type="text"
                                  style="color:#f96964"
                                  @click="open(menIdx, fourthIdx, 'tenthArr')"
                                  >删除</el-button
                                >
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </el-collapse>
            </div>
          </div>

          <div class="confide-item" v-if="confideItemList">
            <div class="area-confide">
              <el-form-item
                label="二级技术交底附件"
                prop="fileList2"
                style="display: inline-block"
              >
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="getUrl"
                  :headers="geHeaders"
                  :on-success="
                    (response, file, fileList) =>
                      sucUpload(response, file, fileList, 'fileList2')
                  "
                  :on-remove="
                    (file, fileList) => remUpload(file, fileList, 'fileList2')
                  "
                  :on-preview="handlePreview"
                  :before-upload="beforeAvatarUpload"
                  multiple
                  :file-list="addConfide.fileList"
                  name="file"
                >
                  <el-button icon="el-icon-paperclip" v-if="flag == true"
                    >选择文件</el-button
                  >
                  <span v-if="flag == false">点击文件下载</span>
                  <!-- <img v-if="addData.userCertificate[index].categoryFile" :src="getLceImg(index)" class="avatar"> -->
                </el-upload>
                <div class="shade" v-if="flag == false"></div>
              </el-form-item>
              <div class="clearfix confide">
                <label
                  style="text-align: right;float:left; inline-block;width: 120px;padding: 0 12px 0 0;color: #606266;"
                  >被交底人</label
                >
                <table style="float: left">
                  <tr>
                    <td>部门</td>
                    <td style="border-left: 1px solid #dcdfe6">人员</td>
                    <td style="border-left: 1px solid #dcdfe6">是否为监督人</td>
                    <td style="border-left: 1px solid #dcdfe6">
                      是否为下一级技术交底责任人
                    </td>
                    <td style="border-left: 1px solid #dcdfe6">操作</td>
                  </tr>
                  <template v-if="showTr2">
                    <tr
                      v-for="(item, index) in secondLevel.userList"
                      :key="index"
                    >
                      <td>&nbsp;{{ item.bottonDept }}</td>
                      <td style="border-left: 1px solid #dcdfe6">
                        &nbsp;{{ item.bottonUser }}
                      </td>
                      <td style="border-left: 1px solid #dcdfe6">
                        <el-radio-group
                          :disabled="disabledChooseTwo"
                          v-model="item.isChecker"
                          @change="
                            (label) => {
                              radioGroupMonitor(label, 2, index, 'jd')
                            }
                          "
                        >
                          <el-radio :label="'0'">否</el-radio>
                          <el-radio :label="'1'">是</el-radio>
                        </el-radio-group>
                      </td>
                      <td style="border-left: 1px solid #dcdfe6">
                        <el-radio-group
                          :disabled="disabledChooseNextTwo"
                          v-model="item.isNextCharger"
                          @change="
                            (label) => {
                              radioGroupNextChargerChange(
                                label,
                                2,
                                index,
                                'next'
                              )
                            }
                          "
                        >
                          <el-radio :label="'0'">否</el-radio>
                          <el-radio :label="'1'">是</el-radio>
                        </el-radio-group>
                      </td>
                      <td style="border-left: 1px solid #dcdfe6">
                        <el-button
                          type="text"
                          style="color:#f96964"
                          @click="open(index, secondLevel.userList, 'showTr2')"
                          >删除</el-button
                        >
                      </td>
                    </tr>
                  </template>
                </table>

                <span
                  style="
                    font-size: 14px;
                    padding-right: 15px;
                    cursor: pointer;
                    float: right;
                  "
                  @click="alertChoose(2)"
                  class="choose-color"
                  >选择</span
                >
              </div>
            </div>

            <div class="area-confide">
              <el-form-item
                label="三级技术交底附件"
                prop="fileList3"
                style="display: inline-block"
              >
                <div class="upload">
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    :action="getUrl"
                    :headers="geHeaders"
                    :on-success="
                      (response, file, fileList) =>
                        sucUpload(response, file, fileList, 'fileList3')
                    "
                    :on-remove="
                      (file, fileList) => remUpload(file, fileList, 'fileList3')
                    "
                    :on-preview="handlePreview"
                    :before-upload="beforeAvatarUpload"
                    multiple
                    :file-list="addConfide.fileList3"
                    name="file"
                  >
                    <el-button icon="el-icon-paperclip" v-if="flag == true"
                      >选择文件</el-button
                    >
                    <span v-if="flag == false">点击文件下载</span>
                    <!-- <img v-if="addData.userCertificate[index].categoryFile" :src="getLceImg(index)" class="avatar"> -->
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
              <div class="clearfix confide">
                <label
                  style="text-align: right;float:left; inline-block;width: 120px;padding: 0 12px 0 0;color: #606266;"
                  >被交底人</label
                >
                <table style="float: left">
                  <tr>
                    <td>部门</td>
                    <td style="border-left: 1px solid #dcdfe6">人员</td>
                    <td style="border-left: 1px solid #dcdfe6">是否为监督人</td>
                    <td style="border-left: 1px solid #dcdfe6">
                      是否为下一级技术交底责任人
                    </td>
                    <td style="border-left: 1px solid #dcdfe6">操作</td>
                  </tr>
                  <template v-if="showTr3">
                    <tr
                      v-for="(item, index) in thirdLevel.userList"
                      :key="index"
                    >
                      <td>&nbsp;{{ item.bottonDept }}</td>
                      <td style="border-left: 1px solid #dcdfe6">
                        &nbsp;{{ item.bottonUser }}
                      </td>
                      <td style="border-left: 1px solid #dcdfe6">
                        <el-radio-group
                          :disabled="disabledChoose"
                          v-model="item.isChecker"
                          @change="
                            (label) => {
                              radioGroupMonitor(label, 3, index, 'jd')
                            }
                          "
                        >
                          <el-radio :label="'0'">否</el-radio>
                          <el-radio :label="'1'">是</el-radio>
                        </el-radio-group>
                      </td>
                      <td style="border-left: 1px solid #dcdfe6">
                        <el-radio-group
                          :disabled="disabledChooseNext"
                          v-model="item.isNextCharger"
                          @change="
                            (label) => {
                              radioGroupNextChargerChange(
                                label,
                                3,
                                index,
                                'next'
                              )
                            }
                          "
                        >
                          <el-radio :label="'0'" :disabled="true">否</el-radio>
                          <el-radio :label="'1'" :disabled="true">是</el-radio>
                        </el-radio-group>
                      </td>
                      <td style="border-left: 1px solid #dcdfe6">
                        <el-button
                          type="text"
                          style="color:#f96964"
                          @click="open(index, thirdLevel.userList, 'showTr3')"
                          >删除</el-button
                        >
                      </td>
                    </tr>
                  </template>
                </table>

                <span
                  style="
                    font-size: 14px;
                    padding-right: 15px;
                    cursor: pointer;
                    float: right;
                  "
                  @click="alertChoose(3)"
                  class="choose-color"
                  >选择</span
                >
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <div style="text-align: right; padding-top:20px" ref="bottonheight">
        <el-button class="tBtn" v-if="state != 'get'" @click="confirm(1)"
          >提交</el-button
        >
        <el-button class="tBtn" v-if="state != 'get'" @click="confirm(0)"
          >临时保存</el-button
        >
      </div>

      <!--新增盒子-->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="large"
        title="新增列表"
        :append-to-body="true"
      >
        <el-form
          :inline="true"
          :model="addPageForm"
          ref="pageForm"
        >
          <el-form-item prop="projectName" label="项目名称">
            <el-input
              v-model="addPageForm.projectName"
              maxlength="30"
              placeholder="请输入项目名称"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="chaxun"
              icon="el-icon-search"
              @click="getTech('cx')"
              >查询</el-button
            >
            <el-button @click="resetForm('pageForm')" class="chongzhi"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          :data="addTableData"
          v-loading="loading"
          style="width: 100%;"
          row-key="menuId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          stripe
        >
          <el-table-column align="left" label="项目名称">
            <template slot-scope="scope">
              <el-radio
                @change="selectData"
                v-model="radio"
                :label="scope.row"
                >{{ scope.row.projectName }}</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column align="left" label="标段">
            <template slot-scope="scope">{{ scope.row.bid }}</template
            >>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="addTotal"
          :current-page.sync="currentPage"
          :page-sizes="addPageSizes"
          :page-size="addPageForm.pageSize"
          @size-change="addHandleSizeChange"
          @current-change="addHandleCurrentChange"
        ></el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button class="tBtn" @click="selectItem">提 交</el-button>
          <el-button class="fBtn" @click="fBtn">取 消</el-button>
        </span>
      </el-dialog>

      <!--穿梭框盒子-->
      <div class="sdialog">
        <el-dialog
          :visible.sync="dialogVisibleDept"
          :close-on-click-modal="false"
          :title="'选择部门'"
          custom-class="s_dialog large"
          append-to-body
        >
          <el-card class="left">
            <el-tree
              class="tree"
              node-key="id"
              ref="deptTree"
              :check-strictly="checkStrictly"
              :default-expanded-keys="defaultMenutree"
              :default-checked-keys="defaultMenutree"
              :data="deptOptions"
              :props="defaultProps"
              @check-change="setCheckedNodes"
              @check="checkNodes"
              show-checkbox
            />
          </el-card>
          <el-card class="right">
            <el-transfer
              :button-texts="['选出', '选入']"
              :props="{ key: 'bottonUserId', label: 'bottonUser' }"
              v-model="value"
              :data="data"
            ></el-transfer>
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button class="tBtn" @click="selectDept">提交</el-button>
            <el-button class="fBtn" @click="dialogVisibleDept = false"
              >取消</el-button
            >
          </span>
        </el-dialog>
      </div>
      <!-- 选择监督人 -->
      <Sdialog
        ref="sdialog"
        @choiceUser="choiceUser"
        :showclose="true"
        :isDx="true"
        :isCheckbox="false"
        :sNeed="true"
        needData="zrUser"
        dxId="zrUserId"
        :transferProps="{
          key: 'userId',
          label: 'realName'
        }"
        :treedata="deptOptions"
      ></Sdialog>
      <!--穿梭框盒子2-->
      <div class="sdialog">
        <el-dialog
          :visible.sync="dialogVisibleDept2"
          :close-on-click-modal="false"
          :title="'选择部门'"
          custom-class="s_dialog large"
          append-to-body
        >
          <el-card class="left">
            <el-tree
              class="tree"
              node-key="id"
              ref="deptTree2"
              :check-strictly="checkStrictly"
              :default-expanded-keys="defaultMenutree"
              :default-checked-keys="defaultMenutree"
              :data="deptOptions"
              :props="defaultProps"
              @check-change="setCheckedNodes2"
              @check="checkNodes2"
              show-checkbox
            />
          </el-card>
          <el-card class="right">
            <el-transfer
              :button-texts="['选出', '选入']"
              :props="{ key: 'bottonUserId', label: 'bottonUser' }"
              @left-check-change="checkTeacher($event)"
              @change="teaChange($event)"
              v-model="value2"
              :data="data2"
            ></el-transfer>
          </el-card>
          <span slot="footer" class="dialog-footer">
            <el-button class="tBtn" @click="selectDept2">提交</el-button>
            <el-button class="fBtn" @click="dialogVisibleDept2 = false"
              >取消</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getLoginDept,
  getLoginDeptPerson,
  getTreeSelect
} from '@/api/system/dept'
import {
  getConfidePut,
  getConfideEdit
} from '@/api/technology/confide/confide.js'
import { getToken } from '@/utils/auth'
import { getSelectTechItem } from '@/api/system/class'
import { getTechnologyList } from '@/api/technology/item/item.js'
import Sdialog from '@/components/selectDialog' //通过部门选择人

export default {
  name: 'index',
  components: {
    Sdialog: Sdialog
  },
  props: {
    datas: {
      type: Object,
      default: {}
    },
    state: {
      type: String,
      default: 'post'
    }
  },
  data() {
    return {
      activeNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      topUserId: '',
      firstLevels: [],
      firstHtml: '',
      isCheckId: '',
      showTr1: true,
      showTr2: true,
      showTr3: true,
      radio: 1,
      selData: '',
      // 当前页数
      currentPage: 1,
      thirdLevelCheckboxModel: [],
      checkedDeptIndex: 0,
      leftId: '',
      jdUserOption: [],
      firstLevelRadio: {
        checkerUserId: '',
        nextChargerUserId: ''
      },
      secondLevelRadio: {
        checkerUserId: '',
        nextChargerUserId: ''
      },
      thirdLevelRadio: {
        checkerUserId: '',
        nextChargerUserId: ''
      },

      firstLevel: {
        userList: []
      },
      secondLevel: {
        userList: []
      },
      thirdLevel: {
        userList: []
      },
      secondArr: [],
      thirdArr: [],
      fourthArr: [],
      fifthArr: [],
      sixthArr: [],
      seventhArr: [],
      eighthArr: [],
      ninthArr: [],
      tenthArr: [],
      menList: [],
      itemIsShow: false,
      htmlArr: [],
      disabledChoose: false,
      disabledChooseNext: false,
      disabledChooseTwo: false,
      disabledChooseNextTwo: false,
      disabledChooseOne: false,
      disabledChooseNextOne: false,
      oneJd: '',
      oneNext: '',
      twoJd: '',
      twoNext: '',
      threeJd: '',
      threeNext: '',
      deptPersonProps: {
        key: 'userId',
        label: 'realName',
        disabled: false
      },
      selectDeptIndex: 1,
      data: [],
      data2: [],
      value: [],
      value2: [],
      myFlag: false,
      myFlag2: false,
      // has: {
      //   remove: 'system:dept:remove',
      //   query: 'system:dept:query',
      //   add: 'system:dept:add',
      //   edit: 'system:dept:edit'
      // },
      dialogVisibleDept: false,
      dialogVisibleDept2: false,
      //搜索  项目清单
      confideItem: ['1'],
      //选择列表 项目清单
      addTotal: 0,
      addPageSizes: [5],
      addPageForm: {
        pageNum: 1,
        pageSize: 5,
        jdTypeId: '',
        projectName: '',
        bid: '',
        engineName: '',
        jdUser: '',
        projectTypeId: '',
        projectProcessId: ''
      },
      jobProps: {
        value: 'id',
        checkStrictly: true
      },
      addConfide: {
        jdTypeId: '',
        jdType: '',
        projectName: '',
        projectId: '',
        bid: '',
        engineName: '',
        worktype: '',
        jdContent: ''
      },
      confideItemList: false,
      flag: true,
      defaultMenutree: [],
      multipleSelection: [],
      //穿梭框列表
      transferList: [],
      //穿梭框文件id数组
      transferListId: [],

      //选择列表
      addTableData: [],
      loading: false,
      tableKey: 0,
      dialogVisible: false,
      dialogType: 'new',
      deptOptions: [],
      checkStrictly: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      addConfideloading: false,
      //部门名称
      deptLabel: [],
      currentChecke: '',
      //性质
      natureRes: [],
      //类别
      confideRes: [],
      //选择的部门id
      chooseDeptId: '',
      deptPerson: null,
      // 新增 还是 修改 true新增 false修改
      sta: true,
      //表单验证方法
      formRules: {
        jdTypeId: [
          {
            required: true,
            message: '请选择部技术交底类型',
            trigger: 'change'
          }
        ],
        projectName: [
          {
            required: true,
            message: '请输入项目名称',
            trigger: 'change'
          }
        ],
        bid: [
          {
            required: true,
            message: '请输入标段',
            trigger: 'change'
          }
        ],
        jdContent: [
          {
            required: true,
            message: '请选择交底内容',
            trigger: 'blur'
          }
        ]
      },
      jdrcj: ''
    }
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url + 'jxlq-system-service/fs/upload'
      )
    },
    geHeaders() {
      return {
        Authorization: getToken()
      }
    }
  },
  created: async function(scope) {
    this.getConfideType()
    this.deptOptions = await getTreeSelect()
    if (this.$refs['operationFome']) {
      this.$refs['operationFome'].resetFields()
    }
    if (this.$refs.deptTree) {
      this.deptOptions = await getTreeSelect()
      this.$refs.deptTree.setCheckedKeys([], false)
    }
    if (scope) {
      let projectDeptId = scope.row.projectDeptId
      this.defaultMenutree = [projectDeptId]
    }
  },
  mounted() {
    this.addConfideloading = true
    if (Object.getOwnPropertyNames(this.datas).length <= 1) {
      // 新增
      this.sta = true
    } else {
      // 修改
      this.sta = false
      let sequence = [
        'firstLevel',
        'secondArr',
        'thirdArr',
        'fourthArr',
        'fifthArr',
        'sixthArr',
        'seventhArr',
        'eighthArr',
        'ninthArr',
        'tenthArr'
      ]

      for (let t in sequence) {
        t = parseInt(t)
        let topUserId = 0
        for (let item of this.datas.disclosureHeads) {
          topUserId++
          if (item.jiaodiLevel == t + 1) {
            console.log(item)
            let obj = {}
            // 交底人
            obj.level = item.jiaodiLevel
            obj.topUserList = {}
            obj.userList = []
            obj.topUserList.bottonDept = item.jiaodiDept
            obj.topUserList.bottonDeptId = item.jiaodiDeptId
            obj.topUserList.bottonUser = item.jiaodiUser
            obj.topUserList.bottonUserId = item.jiaodiUserId
            if (item.jiaodiLevel != 1) {
              // console.log(this[sequence[t - 1]])
              if (Array.isArray(this[sequence[t - 1]])) {
                for (let c of this[sequence[t - 1]]) {
                  if (typeof c != 'object' || Array.isArray(c) || c === null) {
                    continue
                  }
                  for (let d of c.userList) {
                    if (d.bottonUserId == item.jiaodiUserId) {
                      obj.topUserList.topUserId = d.topUserId
                    }
                  }
                }
              } else {
                for (let d of this[sequence[t - 1]].userList) {
                  if (d.bottonUserId == item.jiaodiUserId) {
                    obj.topUserList.topUserId = d.topUserId
                  }
                }
              }
            }
            if (item.jiaodiLevel == 1) {
              obj.topUserList.disabled = false
              obj.topUserList.isChecker = '0'
              obj.topUserList.isNextCharger = '0'
            } else {
              let people = []
              if (Array.isArray(this[sequence[t - 1]])) {
                console.log(
                  this[sequence[t - 1]],
                  item.jiaodiUserId,
                  998898998988
                )
                for (let jun of this[sequence[t - 1]]) {
                  let ttrs = []
                  ttrs = jun.userList.filter(
                    (l) => l.bottonUserId == item.jiaodiUserId
                  )
                  if (ttrs.length > 0) {
                    people = [...people, ...ttrs]
                  }
                }
              } else {
                people = this[sequence[t - 1]].userList.filter(
                  (l) => l.bottonUserId == item.jiaodiUserId
                )
              }
              console.log(people, 'people')
              if (people.length > 0) {
                obj.topUserList.isChecker = '0'
                obj.topUserList.isNextCharger = people[0].isNextCharger
                obj.topUserList.isShow =
                  people[0].isNextCharger == 0 ? false : true
              }
            }
            // 设置下一级技术交底 topUserList
            // for (let y of obj.userList) {
            //   let att = {};
            //   att.topUserList = y;
            //   att.level =parseInt( item.jiaodiLevel )+ 1 ;
            //   console.log(att.topUserList.level,999888888)
            //  this[sequence[t + 1]].push(att)
            // }

            // 被交底人
            for (let v of item.disclosureUsers) {
              let arr = {}
              console.log(item, 9999996666666666666)
              arr.bottonDept = v.bottonDept
              arr.bottonDeptId = v.bottonDeptId
              arr.bottonUser = v.bottonUser
              arr.bottonUserId = v.bottonUserId
              arr.level = item.jiaodiLevel
              arr.isNextCharger = v.nextJiaodiUser
              arr.isShow = v.nextJiaodiUser == 0 ? false : true
              arr.isChecker = '0'
              arr.topUserId = item.jiaodiUserId
              obj.userList.push(arr)
              console.log(arr, 22222222222222)
            }

            this.itemIsShow = true
            // 附件
            let files = []
            for (let fj of item.disclosureFiles) {
              fj.name = fj.jiaodiFileName ? fj.jiaodiFileName : ''
              files.push(fj)
            }
            this.$set(this[sequence[t + 1]], 'fileList', files)
            // 交底时间
            this.$set(this[sequence[t + 1]], 'jdTime', [
              item.jiaodiStartTime,
              item.jiaodiEndTime
            ])
            // 监督人
            this.$set(
              this[sequence[t + 1]],
              'userName',
              item.supervisor ? item.supervisor : ''
            )
            this.$set(
              this[sequence[t + 1]],
              'UserID',
              item.supervisorId ? item.supervisorId : ''
            )
            if (t == 0) {
              this[sequence[t]] = obj
            } else {
              this[sequence[t]].push(obj)
            }
          }
        }

        if (t != 0) {
          let asd = []
          for (let h of this[sequence[t]]) {
            asd.push(h.topUserList.bottonUserId)
          }
          if (t - 1 == 0) {
            for (let h of this[sequence[t - 1]].userList) {
              asd.push(h.bottonUserId)
            }
          } else {
            for (let h of this[sequence[t - 1]]) {
              for (let hh of h.userList) {
                asd.push(hh.bottonUserId)
              }
            }
          }

          let tt = asd.filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v)
          })
          let att = {}
          for (let vg of tt) {
            if (t - 1 == 0) {
              for (let omg of this[sequence[t - 1]].userList) {
                if (omg.bottonUserId == vg) {
                  let arr = {}
                  delete omg.level
                  arr.topUserList = omg
                  arr.userList = []
                  arr.level = t + 1
                  this[sequence[t]].push(arr)
                }
              }
            } else {
              for (let omg of this[sequence[t - 1]]) {
                if (
                  typeof omg != 'object' ||
                  Array.isArray(omg) ||
                  omg === null
                ) {
                  continue
                }
                for (let rng of omg.userList) {
                  if (rng.bottonUserId == vg) {
                    let arr = {}
                    delete rng.level
                    arr.topUserList = rng
                    arr.userList = []
                    arr.level = t + 1
                    this[sequence[t]].push(arr)
                  }
                }
              }
            }
          }
        }
      }
      delete this.datas.disclosureHeads
      delete this.datas.jiaodiDept
      delete this.datas.jiaodiUser
      delete this.datas.createTime
      delete this.datas.createBy
      delete this.datas.createById
      delete this.datas.createById
      delete this.datas.dept
      delete this.datas.deptId
      // this.$set(this,"addConfide",this.datas)
      setTimeout(() => {
        this.addConfide = this.datas
      }, 350)
    }
    this.addConfideloading = false
    console.log(
      this.firstLevel,
      this.secondArr,
      this.thirdArr,
      this.fourthArr,
      's2sas2s2s2s'
    )
  },
  methods: {
    // 选择监督人
    seleSupervisor(cj) {
      this.$refs.sdialog.isShow = true
      this.jdrcj = cj
    },
    //选择完监督人 组件回调
    choiceUser(UserID, UserList) {
      if (UserID.length == 0) {
        this.$message({
          message: '请选择监督人',
          type: 'warning'
        })
        return
      }
      // console.log(UserID, UserList);
      let name = UserList[0].userName
        ? UserList[0].userName
        : UserList[0].realName
      this.$set(this[this.jdrcj], 'userName', name)
      this.$set(this[this.jdrcj], 'UserID', UserID[0])
      this.$refs.sdialog.isShow = false
    },
    open(index, jdiex, List) {
      // this[isshow] = false;
      // userList.splice(index, 1);
      // this[isshow] = true;
      if (jdiex == 'fir') {
        this[List].userList.splice(index, 1)
      } else {
        this[List][jdiex].userList.splice(index, 1)
      }
      let sequence = [
        'firstLevel',
        'secondArr',
        'thirdArr',
        'fourthArr',
        'fifthArr',
        'sixthArr',
        'seventhArr',
        'eighthArr',
        'ninthArr',
        'tenthArr'
      ]
      for (let v in sequence) {
        if (sequence[v] == List) {
          v = parseInt(v) + 1
          this[sequence[v]].splice(index, 1)
        }
      }
    },
    //选择项目清单分页列表触发事件
    selectData(val) {
      // console.log(val, this.radio);
      this.selData = val
    },
    // 文件上传成功后
    sucUpload(response, file, fileList, fileListName) {
      console.log(fileList, '文件上传')
      if (response.body != null) {
        this[fileListName].fileList = fileList.map((item) => {
          return {
            jiaodiFileName: item.response
              ? item.response.body.fileName
              : item.jiaodiFileName,
            jiaodiFileUrl: item.response
              ? item.response.body.url
              : item.jiaodiFileUrl,
            name: item.response
              ? item.response.body.fileName
              : item.jiaodiFileName
          }
        })
      }
      console.log(this[fileListName].fileList, '文件上传2')
    },
    // 移除文件
    remUpload(file, fileList, fileListName) {
      this[fileListName].fileList = fileList
      // console.log(this[fileListName].fileList);
    },
    // 大小限制
    beforeAvatarUpload(file, jiaodi) {
      let FileFormat = file.name.substring(file.name.lastIndexOf('.') + 1)
      let testmsg = FileFormat.toLowerCase()
      const extension =
        testmsg === 'xls' ||
        testmsg === 'xlsx' ||
        testmsg === 'doc' ||
        testmsg === 'docx' ||
        testmsg === 'txt' ||
        testmsg === 'pdf'
      if (!extension) {
        this.$message({
          message: 'doc,docx,xls,xlsx,txt,pdf格式文件!',
          type: 'warning'
        })
        return false
      }
      const isLt100M = file.size / 1024 / 1024 < 100
      const isLt0M = file.size / 1024 / 1024 == 0
      if (!isLt100M) {
        this.$message.error('文件大小不能超过 100MB!')
        setTimeout(() => {
          this[jiaodi].fileList = []
        }, 100)
      }
    },
    // 提交触发
    selectItem() {
      if (this.selData && this.selData != '') {
        this.addConfide.projectName = this.selData.projectName
        this.addConfide.projectId = this.selData.projectId
        this.addConfide.bid = this.selData.bid
      } else {
        this.addConfide.projectName = ''
        this.addConfide.projectId = ''
        this.addConfide.bid = ''
        this.radio = 1
      }
      this.selData = ''
      this.radio = ''
      this.dialogVisible = false
    },
    // 是否选择了至少一个监督人和被交底人
    hasSelect(arr) {
      let obj = {}
      obj.isChecker = arr.some((item) => {
        return item.isChecker == 1
      })
      obj.isNextCharger = arr.some((item) => {
        return item.isNextCharger == 1
      })
      return obj
    },
    fBtn() {
      this.selData = ''
      this.radio = ''
      this.dialogVisible = false
    },
    //取消操作
    cancelBtn() {
      this.$store.state.tabActive = 'confide'
      // console.log(this.$store.state.tabActive);
      this.$emit('fatherMethod')
    },
    //对否为下级交底人 change 事件
    radioGroupNextChargerChange: function(label, index, userIndex, name) {
      let _index = index
      let _userIndex = userIndex
      let _userId = name
      let that = this
      switch (index) {
        case 0:
          if (label == 1) {
            for (let i in that.secondArr) {
              if (
                typeof that.secondArr[i] != 'object' ||
                Array.isArray(that.secondArr[i]) ||
                that.secondArr[i] === null
              ) {
                continue
              }
              if (that.secondArr[i].topUserList.bottonUserId == _userId) {
                that.secondArr[i].topUserList.isShow = true
              }
              // console.log(that.secondArr);
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          } else {
            for (let i in that.secondArr) {
              if (
                typeof that.secondArr[i] != 'object' ||
                Array.isArray(that.secondArr[i]) ||
                that.secondArr[i] === null
              ) {
                continue
              }
              if (that.secondArr[i].topUserList.bottonUserId == _userId) {
                if (that.secondArr[i].userList.length > 0) {
                  that.secondArr[i].userList = []
                }
                that.secondArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 1:
          if (label == 1) {
            for (let i in that.thirdArr) {
              if (
                typeof that.thirdArr[i] != 'object' ||
                Array.isArray(that.thirdArr[i]) ||
                that.thirdArr[i] === null
              ) {
                continue
              }
              if (that.thirdArr[i].topUserList.bottonUserId == _userId) {
                that.thirdArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.thirdArr) {
              if (
                typeof that.thirdArr[i] != 'object' ||
                Array.isArray(that.thirdArr[i]) ||
                that.thirdArr[i] === null
              ) {
                continue
              }
              if (that.thirdArr[i].topUserList.bottonUserId == _userId) {
                if (that.thirdArr[i].userList.length > 0) {
                  that.thirdArr[i].userList = []
                }
                that.thirdArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 2:
          if (label == 1) {
            for (let i in that.fourthArr) {
              if (
                typeof that.fourthArr[i] != 'object' ||
                Array.isArray(that.fourthArr[i]) ||
                that.fourthArr[i] === null
              ) {
                continue
              }
              if (that.fourthArr[i].topUserList.bottonUserId == _userId) {
                that.fourthArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.fourthArr) {
              if (
                typeof that.fourthArr[i] != 'object' ||
                Array.isArray(that.fourthArr[i]) ||
                that.fourthArr[i] === null
              ) {
                continue
              }
              if (that.fourthArr[i].topUserList.bottonUserId == _userId) {
                if (that.fourthArr[i].userList.length > 0) {
                  that.fourthArr[i].userList = []
                }
                that.fourthArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 3:
          if (label == 1) {
            for (let i in that.fifthArr) {
              if (
                typeof that.fifthArr[i] != 'object' ||
                Array.isArray(that.fifthArr[i]) ||
                that.fifthArr[i] === null
              ) {
                continue
              }
              if (that.fifthArr[i].topUserList.bottonUserId == _userId) {
                that.fifthArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.fifthArr) {
              if (
                typeof that.fifthArr[i] != 'object' ||
                Array.isArray(that.fifthArr[i]) ||
                that.fifthArr[i] === null
              ) {
                continue
              }
              if (that.fifthArr[i].topUserList.bottonUserId == _userId) {
                if (that.fifthArr[i].userList.length > 0) {
                  that.fifthArr[i].userList = []
                }
                that.fifthArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 4:
          if (label == 1) {
            for (let i in that.sixthArr) {
              if (
                typeof that.sixthArr[i] != 'object' ||
                Array.isArray(that.sixthArr[i]) ||
                that.sixthArr[i] === null
              ) {
                continue
              }
              if (that.sixthArr[i].topUserList.bottonUserId == _userId) {
                that.sixthArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.sixthArr) {
              if (
                typeof that.sixthArr[i] != 'object' ||
                Array.isArray(that.sixthArr[i]) ||
                that.sixthArr[i] === null
              ) {
                continue
              }
              if (that.sixthArr[i].topUserList.bottonUserId == _userId) {
                if (that.sixthArr[i].userList.length > 0) {
                  that.sixthArr[i].userList = []
                }
                that.sixthArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 5:
          if (label == 1) {
            for (let i in that.seventhArr) {
              if (
                typeof that.seventhArr[i] != 'object' ||
                Array.isArray(that.seventhArr[i]) ||
                that.seventhArr[i] === null
              ) {
                continue
              }
              if (that.seventhArr[i].topUserList.bottonUserId == _userId) {
                that.seventhArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.seventhArr) {
              if (
                typeof that.seventhArr[i] != 'object' ||
                Array.isArray(that.seventhArr[i]) ||
                that.seventhArr[i] === null
              ) {
                continue
              }
              if (that.seventhArr[i].topUserList.bottonUserId == _userId) {
                if (that.seventhArr[i].userList.length > 0) {
                  that.seventhArr[i].userList = []
                }
                that.seventhArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 6:
          if (label == 1) {
            for (let i in that.eighthArr) {
              if (
                typeof that.eighthArr[i] != 'object' ||
                Array.isArray(that.eighthArr[i]) ||
                that.eighthArr[i] === null
              ) {
                continue
              }
              if (that.eighthArr[i].topUserList.bottonUserId == _userId) {
                that.eighthArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.eighthArr) {
              if (
                typeof that.eighthArr[i] != 'object' ||
                Array.isArray(that.eighthArr[i]) ||
                that.eighthArr[i] === null
              ) {
                continue
              }
              if (that.eighthArr[i].topUserList.bottonUserId == _userId) {
                if (that.eighthArr[i].userList.length > 0) {
                  that.eighthArr[i].userList = []
                }
                that.eighthArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 7:
          if (label == 1) {
            for (let i in that.ninthArr) {
              if (
                typeof that.ninthArr[i] != 'object' ||
                Array.isArray(that.ninthArr[i]) ||
                that.ninthArr[i] === null
              ) {
                continue
              }
              if (that.ninthArr[i].topUserList.bottonUserId == _userId) {
                that.ninthArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.ninthArr) {
              if (
                typeof that.ninthArr[i] != 'object' ||
                Array.isArray(that.ninthArr[i]) ||
                that.ninthArr[i] === null
              ) {
                continue
              }
              if (that.ninthArr[i].topUserList.bottonUserId == _userId) {
                if (that.ninthArr[i].userList.length > 0) {
                  that.ninthArr[i].userList = []
                }
                that.ninthArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
        case 8:
          if (label == 1) {
            for (let i in that.tenthArr) {
              if (
                typeof that.tenthArr[i] != 'object' ||
                Array.isArray(that.tenthArr[i]) ||
                that.tenthArr[i] === null
              ) {
                continue
              }
              if (that.tenthArr[i].topUserList.bottonUserId == _userId) {
                that.tenthArr[i].topUserList.isShow = true
              }
            }
            // that.menList.userList[_userIndex].isShow = true;
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
            // this.firstHtml += (this.htmlArr[index])[userIndex];
          } else {
            // this.firstHtml = this.firstHtml.replace((this.htmlArr[index])[userIndex], '');
            // that.menList.userList[_userIndex].isShow = false;
            for (let i in that.tenthArr) {
              if (
                typeof that.tenthArr[i] != 'object' ||
                Array.isArray(that.tenthArr[i]) ||
                that.tenthArr[i] === null
              ) {
                continue
              }
              if (that.tenthArr[i].topUserList.bottonUserId == _userId) {
                if (that.tenthArr[i].userList.length > 0) {
                  that.tenthArr[i].userList = []
                }
                that.tenthArr[i].topUserList.isShow = false
              }
            }
            that.itemIsShow = false
            setTimeout(function() {
              that.itemIsShow = true
            }, 10)
          }
          break
      }
    },
    //是否为监督人
    radioGroupMonitor: function(label, index, userIndex, name) {
      // console.log("radioGroupMonitor:", label, index, userIndex, name);
      let checkedIndexFlag
      let checkedCheckUserId = ''
      let indexFlag
      if (label === '1') {
        switch (index) {
          case 1:
            for (let temUserIndex in this.firstLevel.userList) {
              this.firstLevel.userList[temUserIndex].isChecker = '0'
              //记录选中监督人的index
              if (
                this.firstLevel.userList[temUserIndex].bottonUserId ==
                this.firstLevelRadio.checkerUserId
              ) {
                checkedIndexFlag = temUserIndex
              }
              //获取当前选中监督人的id,和index
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex
                checkedCheckUserId = this.firstLevel.userList[temUserIndex]
                  .bottonUserId
              }
            }
            if (checkedCheckUserId === this.firstLevelRadio.nextChargerUserId) {
              if (checkedCheckUserId && checkedIndexFlag) {
                this.firstLevel.userList[checkedIndexFlag].isChecker = '1'
              }
              this.firstLevel.userList[indexFlag].isChecker = '0'
              //不能同一人
              this.$message({
                message: '监督人和技术交底人不能为同一人',
                type: 'warning'
              })
              return false
            }
            this.firstLevelRadio.checkerUserId = checkedCheckUserId
            this.firstLevel.userList[indexFlag].isChecker = '1'
            break
          case 2:
            for (let temUserIndex in this.secondLevel.userList) {
              this.secondLevel.userList[temUserIndex].isChecker = '0'
              //记录选中监督人的index
              if (
                this.secondLevel.userList[temUserIndex].bottonUserId ==
                this.secondLevelRadio.checkerUserId
              ) {
                checkedIndexFlag = temUserIndex
              }
              //获取当前选中监督人的id,和index
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex
                checkedCheckUserId = this.secondLevel.userList[temUserIndex]
                  .bottonUserId
              }
            }

            if (
              checkedCheckUserId === this.secondLevelRadio.nextChargerUserId
            ) {
              if (checkedCheckUserId && checkedIndexFlag) {
                this.secondLevel.userList[checkedIndexFlag].isChecker = '1'
              }
              this.secondLevel.userList[indexFlag].isChecker = '0'
              //不能同一人
              this.$message({
                message: '监督人和技术交底人不能为同一人',
                type: 'warning'
              })
              return false
            }
            this.secondLevelRadio.checkerUserId = checkedCheckUserId
            this.secondLevel.userList[indexFlag].isChecker = '1'
            break
          case 3:
            for (let temUserIndex in this.thirdLevel.userList) {
              this.thirdLevel.userList[temUserIndex].isChecker = '0'
              //记录选中监督人的index
              if (
                this.thirdLevel.userList[temUserIndex].bottonUserId ==
                this.thirdLevelRadio.checkerUserId
              ) {
                checkedIndexFlag = temUserIndex
              }
              //获取当前选中监督人的id,和index
              if (temUserIndex == userIndex) {
                indexFlag = temUserIndex
                checkedCheckUserId = this.thirdLevel.userList[temUserIndex]
                  .bottonUserId
              }
            }
            if (checkedCheckUserId === this.thirdLevelRadio.nextChargerUserId) {
              if (checkedCheckUserId && checkedIndexFlag) {
                this.thirdLevel.userList[checkedIndexFlag].isChecker = '1'
              }
              this.thirdLevel.userList[indexFlag].isChecker = '0'
              //不能同一人
              this.$message({
                message: '监督人和技术交底人不能为同一人',
                type: 'warning'
              })
              return false
            }
            this.thirdLevelRadio.checkerUserId = checkedCheckUserId
            this.thirdLevel.userList[indexFlag].isChecker = '1'
            break
        }
      } else {
        switch (index) {
          case 1:
            for (let temUserIndex in this.firstLevel.userList) {
              if (temUserIndex == userIndex) {
                this.firstLevel.userList[temUserIndex].isChecker = '0'
                this.firstLevelRadio.checkerUserId = ''
              }
            }
            break
          case 2:
            for (let temUserIndex in this.secondLevel.userList) {
              if (temUserIndex == userIndex) {
                this.secondLevel.userList[temUserIndex].isChecker = '0'
                this.secondLevelRadio.checkerUserId = ''
              }
            }
            break
          case 3:
            for (let temUserIndex in this.thirdLevel.userList) {
              if (temUserIndex == userIndex) {
                this.thirdLevel.userList[temUserIndex].isChecker = '0'
                this.thirdLevelRadio.checkerUserId = ''
              }
            }
            break
        }
      }
    },

    selectChangeJdPerson(value) {
      for (let i in this.jdUserOption) {
        if (this.jdUserOption[i].userId == value) {
          this.addConfide.jdUser = this.jdUserOption[i].realName
          this.addConfide.jdUserId = this.jdUserOption[i].userId
        }
      }
    },

    levelRadioLabel(level, label, index) {
      // console.log("reruenLabel-------:", level, label, index);
      let reruenLabel = ''
      switch (level) {
        case 1:
          reruenLabel = 'level1'
          break
        default:
          break
      }
      reruenLabel += label + index
      // console.log("reruenLabel:", reruenLabel);
      return reruenLabel
    },

    //添加技术交底项
    addConfideItem() {
      this.confideItemList = !this.confideItemList
    },
    //获取部门id
    async deptChange(val) {
      this.addConfide.jdDeptId = val[val.length - 1]
      this.jdUserOption = await getLoginDeptPerson(this.addConfide.jdDeptId)
      this.addConfide.jdDept = this.$refs.cascader.getCheckedNodes()[0].pathLabels
    },

    //穿梭框获取人员
    async setCheckedNodes(nodes, checked, indeterminate) {
      // console.log("setCheckedNodes", nodes, checked, indeterminate);
      this.chooseDeptId = nodes.id
      this.deptLabel = nodes.label
      //查询指定部门id的下的人员
      this.myFlag = checked
    },
    checkNodes: async function(data) {
      let temDeptPerson = await getLoginDeptPerson(this.chooseDeptId)
      this.deptPerson = temDeptPerson
      if (this.myFlag) {
        //选中节点
        if (temDeptPerson.length > 0) {
          //将人员列表格式改为穿梭框可以支持的格式
          for (let i = 0; i < temDeptPerson.length; i++) {
            let temPerson = {}
            temPerson.bottonUserId = temDeptPerson[i].userId
            temPerson.bottonUser = temDeptPerson[i].realName
            temPerson.bottonDeptId = this.chooseDeptId
            temPerson.bottonDept = this.deptLabel
            temPerson.isNextCharger = '0'
            temPerson.isChecker = '0'
            this.data.push(temPerson)
          }
        }
        // console.log("data长度", this.data.length);
      } else {
        //取消选中节点
        if (temDeptPerson.length > 0) {
          let temData = this.data

          for (let i = 0; i < temData.length; i++) {
            for (let j = 0; j < temDeptPerson.length; j++) {
              if (temData[i].bottonUserId == temDeptPerson[j].userId) {
                temData.splice(i, 1)
              }
            }
          }
          this.data = temData
          // console.log("选择部门:", this.data);
        }
      }
    },
    //穿梭框获取人员2
    async setCheckedNodes2(nodes, checked, indeterminate) {
      // console.log("setCheckedNodes", nodes, checked, indeterminate);
      this.myFlag2 = nodes.id
      if (checked) {
        this.$refs.deptTree2.setCheckedKeys([], true) //取消所有选中
        this.$refs.deptTree2.setCheckedKeys([nodes.id], true) // 选中当前
      } else {
        //取消选中节点
        this.data2 = []
      }
    },
    checkNodes2: async function(data) {
      // console.log("checkNodes1", data);
      // console.log("getCheckedKeys", this.$refs.deptTree2.getCheckedKeys());
      if (this.$refs.deptTree2.getCheckedKeys() != '') {
        this.chooseDeptId = data.id
        // console.log("checkNodes2", this.chooseDeptId);
        //查询指定部门id的下的人员
        let temDeptPerson = await getLoginDeptPerson(this.chooseDeptId)
        this.deptPerson = temDeptPerson
        this.data2 = []
        //选中节点
        if (temDeptPerson.length > 0) {
          //将人员列表格式改为穿梭框可以支持的格式
          for (let i = 0; i < temDeptPerson.length; i++) {
            let temPerson = {}
            temPerson.bottonUserId = temDeptPerson[i].userId
            temPerson.bottonUser = temDeptPerson[i].realName
            temPerson.bottonDeptId = data.id
            temPerson.bottonDept = data.label
            temPerson.isNextCharger = '0'
            temPerson.isChecker = '0'
            temPerson.disabled = false
            this.data2.push(temPerson)
          }
        }
      } else {
        this.data2 = []
      }
    },
    //下拉根据部门id获取部门下的人
    async getPerson() {
      let deptId = this.addConfide.jdDeptId
      let personRes = await getLoginDeptPerson(deptId)
      console.log('部门：' + personRes)
    },
    //选择部门弹窗
    alertChoose: function(level, index, arr) {
      if (this.firstLevel.topUserList == undefined) {
        this.$message({
          message: '请先选择交底部门',
          type: 'warning'
        })
        return
      }
      console.log(index, 366666636363636)
      let sequence = [
        'firstLevel',
        'secondArr',
        'thirdArr',
        'fourthArr',
        'fifthArr',
        'sixthArr',
        'seventhArr',
        'eighthArr',
        'ninthArr',
        'tenthArr'
      ]

      //清空 树 选中
      //清空 穿梭框 内容和选中的值
      this.$nextTick(() => {
        this.data = []
        this.value = []
        this.$refs.deptTree.setCheckedKeys([])
      })
      this.checkedDeptIndex = index
      this.topUserId = index
      this.checkedDeptLevel = level
      this.dialogVisibleDept = true
    },
    //选择部门弹窗
    alertChoose2: function(index) {
      this.checkedDeptIndex = index
      this.dialogVisibleDept2 = true
      let len = this.data2.length
      if (this.leftId != '') {
        for (let i = 0; i < len; i++) {
          if (this.data2[i].bottonUserId == this.leftId) {
            this.data2[i].disabled = false
          } else {
            this.data2[i].disabled = true
          }
        }
      } else {
        for (let i = 0; i < len; i++) {
          this.data2[i].disabled = false
        }
      }
    },

    async chooseList() {
      this.dialogVisible = true
      let res = await getTechnologyList(this.addPageForm)
      this.addTableData = res.rows
      this.addTotal = res.total
    },
    async getTech(cx) {
      if (cx == 'cx') {
        this.addPageForm.pageNum = 1
        this.currentPage = 1
      }
      let res = await getTechnologyList(this.addPageForm)
      this.addTableData = res.rows
      this.addTotal = res.total
    },

    //新增页脚
    addHandleSizeChange(val) {
      this.addPageForm.pageSize = val
      this.getTech()
    },
    addHandleCurrentChange(val) {
      this.addPageForm.pageNum = val
      this.getTech()
    },
    //获取方案性质下拉
    async getConfideType() {
      let dictName = 'confide_type'
      this.confideRes = await getSelectTechItem(dictName)
    },
    //获取项目类型下拉id
    peojectTypeFunc(val) {
      let resultArr = this.confideRes.filter((item) => {
        return item.dictCode === val
      })
      //把值赋给要传给后台的表单对象中
      this.addConfide.jdTypeId = resultArr[0].dictCode
      this.addConfide.jdType = resultArr[0].dictLabel //直接写val也可以
    },

    // 下载
    handlePreview(file) {
      if (this.flag == false) {
        let row = JSON.parse(JSON.stringify(file))
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          'jxlq-system-service' +
          `/fs/download?name=${encodeURI(encodeURI(row.name))}&path=${row.url}`
        location.href = this.fileDowloadName
      }
    },
    async handleAdd() {
      this.dialogType = 'new'
      this.dialogVisible = true
      if (this.$refs['operationFome']) {
        this.$refs['operationFome'].resetFields()
      }
      if (this.$refs.deptTree) {
        this.deptOptions = await getLoginDept()
        this.$refs.deptTree.setCheckedKeys([], false)
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.addPageForm.pageNum = this.currentPage = 1
      this.getTech()
    },
    async confirm(status) {
      this.$refs.operationFome.validate(async (valid) => {
        if (!valid) {
          this.$notify({
            title: '操作失败',
            dangerouslyUseHTMLString: true,
            message: '请填写完整',
            type: 'warning'
          })
          return
        } else {
          let that = this
          console.log(
            // this.addConfide,
            this.secondArr,
            this.firstLevel,
            this.thirdArr,
            this.fourthArr
          )
          // firstLevel 第一级交底部门
          let sequence = [
            'firstLevels',
            'secondArr',
            'thirdArr',
            'fourthArr',
            'fifthArr',
            'sixthArr',
            'seventhArr',
            'eighthArr',
            'ninthArr',
            'tenthArr'
          ]
          // 必填验证
          if (
            this.firstLevel.userList.length == 0 ||
            this.firstLevel.topUserList.length == 0
          ) {
            this.$notify({
              title: '操作失败',
              dangerouslyUseHTMLString: true,
              message: '请选择1级交底部门人员和被交底部门人员',
              type: 'warning'
            })
            return
          }
          let disclosureHeadParams = []
          let arrty = []
          arrty.push(this.firstLevel)
          arrty[0].topUserList.isShow = true
          this.firstLevels = arrty
          for (let i = 1; i < 10; i++) {
            for (let item of this[sequence[i - 1]]) {
              if (!item.topUserList.isShow) {
                continue
              }
              let arr = {
                disclosureUserParams: [] //被交底人数据参数
              }
              //验证 交底时间 附件
              if (
                !that[sequence[i]]['jdTime'] ||
                !that[sequence[i]]['fileList']
              ) {
                this.$notify({
                  title: '操作失败',
                  dangerouslyUseHTMLString: true,
                  message: '请选择' + i + '级交底时间和交底附件',
                  type: 'warning'
                })
                return
              }

              if (that[sequence[i]].length == 0) {
                this.$notify({
                  title: '操作失败',
                  dangerouslyUseHTMLString: true,
                  message: '请选择' + i + '级被交底部门和被交底人',
                  type: 'warning'
                })
                return
              }
              for (let v of that[sequence[i]]) {
                if (typeof v != 'object' || Array.isArray(v) || v === null) {
                  continue
                }
                console.log(item.topUserList, v.topUserList)
                if (item.topUserList.bottonUserId == v.topUserList.topUserId) {
                  let bjd = {}
                  bjd.bottonDept = v.topUserList.bottonDept //被交底部门
                  bjd.bottonDeptId = v.topUserList.bottonDeptId //被交底部门ID
                  bjd.bottonUser = v.topUserList.bottonUser //被交底人
                  bjd.bottonUserId = v.topUserList.bottonUserId //被交底人ID
                  bjd.nextJiaodiUser = v.topUserList.isShow ? 1 : 0 //是否为下一级技术交底人|0不是,1是
                  arr.disclosureUserParams.push(bjd)
                }
              }
              if (
                !item.topUserList.bottonDept ||
                !item.topUserList.bottonUser
              ) {
                this.$notify({
                  title: '操作失败',
                  dangerouslyUseHTMLString: true,
                  message: '请选择' + i + '级交底部门和交底人员',
                  type: 'warning'
                })
                return
              }
              arr.jiaodiLevel = item.level //交底级别
              arr.jiaodiDept = item.topUserList.bottonDept //交底部门
              arr.jiaodiDeptId = item.topUserList.bottonDeptId //交底部门ID
              arr.jiaodiUser = item.topUserList.bottonUser //交底人
              arr.jiaodiUserId = item.topUserList.bottonUserId //交底人ID
              arr.supervisor = this[sequence[i]].userName
                ? this[sequence[i]].userName
                : '' //监督人
              arr.supervisorId = this[sequence[i]].UserID
                ? this[sequence[i]].UserID
                : '' //监督人ID
              arr.jiaodiStartTime = this[sequence[i]].jdTime[0] //交底开始时间
              arr.jiaodiEndTime = this[sequence[i]].jdTime[1] //交底结束时间
              arr.disclosureFileParams = [] //附件列表
              for (let fj of this[sequence[i]].fileList) {
                let fle = {}
                fle.jiaodiFileName = fj.jiaodiFileName
                fle.jiaodiFileUrl = fj.jiaodiFileUrl
                arr.disclosureFileParams.push(fle)
              }
              disclosureHeadParams.push(arr)
            }
          }
          this.$set(
            this.addConfide,
            'disclosureHeadParams',
            disclosureHeadParams
          )
          this.$set(this.addConfide, 'status', status)
          delete this.addConfide.fileList1
          let data

          if (this.sta) {
            // 新增
            data = await getConfidePut(this.addConfide)
          } else {
            // 修改
            data = await getConfideEdit(this.addConfide)
          }
          this.dialogVisible = false
          this.$notify({
            title: data ? (this.sta ? '添加成功' : '修改成功') : '添加失败',
            dangerouslyUseHTMLString: true,
            message: data ? data : '系统正在维护中，请与管理员联系',
            type: data ? 'success' : 'warning'
          })
          this.$emit('fatherMethod')
        }
      })

      return
      // this.$refs.operationFome.validate(async (valid) => {
      //   // if (!valid) {
      //   //   this.$notify({
      //   //     title: "操作失败",
      //   //     dangerouslyUseHTMLString: true,
      //   //     message: "请填写完整",
      //   //     type: "warning"
      //   //   });
      //   //   return;
      //   // } else {
      //   //   // 只有一级时的判断
      //   //   let firstObj = this.hasSelect(
      //   //     this.firstLevel.userList ? this.firstLevel.userList : []
      //   //   );

      //   // if (!this.confideItemList) {
      //   // 判断是否选择两人以上
      //   // if (
      //   //   this.firstLevel.userList &&
      //   //   this.firstLevel.userList.length < 2
      //   // ) {
      //   //   this.$notify({
      //   //     title: "操作失败",
      //   //     dangerouslyUseHTMLString: true,
      //   //     message: "被交底人需要选择两人以上",
      //   //     type: "warning",
      //   //   });
      //   //   return;
      //   // } else if (!firstObj.isChecker || !firstObj.isNextCharger) {
      //   //   this.$notify({
      //   //     title: "操作失败",
      //   //     dangerouslyUseHTMLString: true,
      //   //     message: "被交底人员至少有一名监督人和技术交底人",
      //   //     type: "warning",
      //   //   });
      //   //   return;
      //   // }
      //   //     if (!firstObj.isNextCharger) {
      //   //       console.log(this.firstLevel.userList, firstObj.isNextCharger);
      //   //       this.$notify({
      //   //         title: "操作失败",
      //   //         dangerouslyUseHTMLString: true,
      //   //         message: "被交底人员至少有一名技术交底人",
      //   //         type: "warning"
      //   //       });
      //   //       return;
      //   //     }
      //   //   } else {
      //   //     if (
      //   //       this.firstLevel.userList && this.secondLevel.userList
      //   //         ? this.firstLevel.userList.length < 1 ||
      //   //           this.secondLevel.userList.length < 1 ||
      //   //           // this.thirdLevel.userList.length < 1 ||
      //   //           !firstObj.isNextCharger ||
      //   //           !this.hasSelect(this.secondLevel.userList).isNextCharger
      //   //         : true
      //   //     ) {
      //   //       this.$notify({
      //   //         title: "操作失败",
      //   //         dangerouslyUseHTMLString: true,
      //   //         message: "一二级技术交底至少有一名技术交底人",
      //   //         type: "warning"
      //   //       });
      //   //       return;
      //   //     }
      //   //   }
      //   // }
      //   // let data = null;
      //   //提交
      //   // this.firstLevel.fileList = this.addConfide.fileList1;
      //   // this.secondLevel.fileList = this.addConfide.fileList2;
      //   // this.thirdLevel.fileList = this.addConfide.fileList3;
      //   // if (!this.confideItemList) {
      //   //   this.addConfide.levelList = [this.firstLevel];
      //   // } else {
      //   //   this.addConfide.levelList = [
      //   //     this.firstLevel,
      //   //     this.secondLevel,
      //   //     this.thirdLevel
      //   //   ];
      //   // }
      //   // debugger;
      //   // this.addConfide.levelList = this.addConfide.levelList.filter(item =>
      //   //   item.userList ? item.userList : []
      //   // );
      //   // delete this.addConfide.jdUserOptionModel;
      //   // this.addConfide.taskId = "1301097346164154369";
      //   // this.addConfide.fileList1 = this.addConfide.fileList2 = this.addConfide.fileList3 = undefined;
      //   // this.addConfide.jdDept = this.addConfide.jdDept.pop();
      //   // this.addConfide.jdDept.toString();

      //   data = await getConfidePut(this.addConfide)
      //   this.dialogVisible = false
      //   this.$notify({
      //     title: data ? '添加成功' : '添加失败',
      //     dangerouslyUseHTMLString: true,
      //     message: data ? data.message : '系统正在维护中，请与管理员联系',
      //     type: data ? 'success' : 'warning'
      //   })
      //   this.$emit('fatherMethod')
      // })
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.deptId)
        }
        this.multipleSelection = [...arr]
      }
    },

    selectDept: function() {
      // this.dialogVisibleDept2 = false;
      // checkedDeptIndex
      // this.checkedDeptLevel
      let temCheckedDeptIndex = this.checkedDeptIndex
      let temSelectUser = []
      let temValue = this.value
      let temData = this.data

      for (let val in temValue) {
        for (let data in temData) {
          // console.log(temValue, temData, 1111111111111);
          if (temValue[val] == temData[data].bottonUserId) {
            //获取数据
            temData[data].isShow = false
            temData[data].level = this.checkedDeptLevel
            if (this.topUserId == 1) {
              this.topUserId = this.firstLevel.topUserList.bottonUserId
            }
            temData[data].topUserId = this.topUserId
            temSelectUser.push(temData[data])
          }
        }
        // console.log(temSelectUser, 22222222222222);
      }
      this.checkedDeptLevel = parseInt(this.checkedDeptLevel)
      let that = this
      switch (this.checkedDeptLevel) {
        case 1:
          let tq = JSON.parse(JSON.stringify(this.firstLevel.userList))
          for (let wa of tq) {
            for (let na in this.secondArr) {
              if (
                typeof this.secondArr[na] != 'object' ||
                Array.isArray(this.secondArr[na]) ||
                this.secondArr[na] === null
              ) {
                continue
              }
              if (
                this.secondArr[na].topUserList.bottonUserId == wa.bottonUserId
              ) {
                this.secondArr.splice(na, 1)
                console.log(this.secondArr, 'aaaaaaaaaaaaaaaaaa')
                if (this.secondArr.length == 0) {
                  this.thirdArr = []
                  this.fourthArr = []
                  this.fifthArr = []
                  this.sixthArr = []
                  this.seventhArr = []
                }
              }
            }
          }
          this.firstLevel.userList = temSelectUser
          this.firstLevel.level = this.checkedDeptLevel
          // this.menList.push(this.firstLevel);
          for (let i in this.firstLevel.userList) {
            let _obj = {}
            _obj.level = 2
            _obj.topUserList = this.firstLevel.userList[i]
            _obj.userList = []
            this.secondArr.push(_obj)
          }
          this.dialogVisibleDept = false
          break
        case 2:
          for (let i in this.secondArr) {
            if (
              typeof that.secondArr[i] != 'object' ||
              Array.isArray(that.secondArr[i]) ||
              that.secondArr[i] === null
            ) {
              continue
            }
            if (
              this.secondArr[i].topUserList.bottonUserId ==
              this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.secondArr[i].userList))
              for (let wa of tq) {
                for (let na in this.thirdArr) {
                  if (
                    typeof this.thirdArr[na] != 'object' ||
                    Array.isArray(this.thirdArr[na]) ||
                    this.thirdArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.thirdArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.thirdArr.splice(na, 1)
                    if (this.thirdArr.length == 0) {
                      this.fourthArr = []
                      this.fifthArr = []
                      this.sixthArr = []
                      this.seventhArr = []
                    }
                  }
                }
              }
              this.secondArr[i].userList = temSelectUser
              for (let j in this.secondArr[i].userList) {
                let _obj = {}
                _obj.level = 3
                _obj.topUserList = this.secondArr[i].userList[j]
                _obj.userList = []
                this.thirdArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
        case 3:
          for (let i in this.thirdArr) {
            if (
              typeof that.thirdArr[i] != 'object' ||
              Array.isArray(that.thirdArr[i]) ||
              that.thirdArr[i] === null
            ) {
              continue
            }
            if (
              this.thirdArr[i].topUserList.bottonUserId == this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.thirdArr[i].userList))
              for (let wa of tq) {
                for (let na in this.fourthArr) {
                  if (
                    typeof this.fourthArr[na] != 'object' ||
                    Array.isArray(this.fourthArr[na]) ||
                    this.fourthArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.fourthArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.fourthArr.splice(na, 1)
                    if (this.fourthArr.length == 0) {
                      this.fifthArr = []
                      this.sixthArr = []
                      this.seventhArr = []
                    }
                  }
                }
              }
              this.thirdArr[i].userList = temSelectUser
              for (let j in this.thirdArr[i].userList) {
                let _obj = {}
                _obj.level = 4
                _obj.topUserList = this.thirdArr[i].userList[j]
                _obj.userList = []
                this.fourthArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
        case 4:
          for (let i in this.fourthArr) {
            if (
              typeof that.fourthArr[i] != 'object' ||
              Array.isArray(that.fourthArr[i]) ||
              that.fourthArr[i] === null
            ) {
              continue
            }
            if (
              this.fourthArr[i].topUserList.bottonUserId ==
              this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.fourthArr[i].userList))
              for (let wa of tq) {
                for (let na in this.fifthArr) {
                  if (
                    typeof this.fifthArr[na] != 'object' ||
                    Array.isArray(this.fifthArr[na]) ||
                    this.fifthArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.fifthArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.fifthArr.splice(na, 1)
                    if (this.fifthArr.length == 0) {
                      this.sixthArr = []
                      this.seventhArr = []
                    }
                  }
                }
              }
              this.fourthArr[i].userList = temSelectUser
              for (let j in this.fourthArr[i].userList) {
                let _obj = {}
                _obj.level = 5
                _obj.topUserList = this.fourthArr[i].userList[j]
                _obj.userList = []
                this.fifthArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
        case 5:
          for (let i in this.fifthArr) {
            if (
              typeof that.fifthArr[i] != 'object' ||
              Array.isArray(that.fifthArr[i]) ||
              that.fifthArr[i] === null
            ) {
              continue
            }
            if (
              this.fifthArr[i].topUserList.bottonUserId == this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.fifthArr[i].userList))
              for (let wa of tq) {
                for (let na in this.sixthArr) {
                  if (
                    typeof this.sixthArr[na] != 'object' ||
                    Array.isArray(this.sixthArr[na]) ||
                    this.sixthArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.sixthArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.sixthArr.splice(na, 1)
                  }
                }
              }
              this.fifthArr[i].userList = temSelectUser
              for (let j in this.fifthArr[i].userList) {
                let _obj = {}
                _obj.level = 6
                _obj.topUserList = this.fifthArr[i].userList[j]
                _obj.userList = []
                this.sixthArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
        case 6:
          for (let i in this.sixthArr) {
            if (
              typeof that.sixthArr[i] != 'object' ||
              Array.isArray(that.sixthArr[i]) ||
              that.sixthArr[i] === null
            ) {
              continue
            }
            if (
              this.sixthArr[i].topUserList.bottonUserId == this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.sixthArr[i].userList))
              for (let wa of tq) {
                for (let na in this.seventhArr) {
                  if (
                    typeof this.seventhArr[na] != 'object' ||
                    Array.isArray(this.seventhArr[na]) ||
                    this.seventhArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.seventhArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.seventhArr.splice(na, 1)
                  }
                }
              }
              this.sixthArr[i].userList = temSelectUser
              for (let j in this.sixthArr[i].userList) {
                let _obj = {}
                _obj.level = 7
                _obj.topUserList = this.sixthArr[i].userList[j]
                _obj.userList = []
                this.seventhArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
        case 7:
          for (let i in this.seventhArr) {
            if (
              typeof that.seventhArr[i] != 'object' ||
              Array.isArray(that.seventhArr[i]) ||
              that.seventhArr[i] === null
            ) {
              continue
            }
            if (
              this.seventhArr[i].topUserList.bottonUserId ==
              this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.seventhArr[i].userList))
              for (let wa of tq) {
                for (let na in this.eighthArr) {
                  if (
                    typeof this.eighthArr[na] != 'object' ||
                    Array.isArray(this.eighthArr[na]) ||
                    this.eighthArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.eighthArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.eighthArr.splice(na, 1)
                  }
                }
              }
              this.seventhArr[i].userList = temSelectUser
              for (let j in this.seventhArr[i].userList) {
                let _obj = {}
                _obj.level = 8
                _obj.topUserList = this.seventhArr[i].userList[j]
                _obj.userList = []
                this.eighthArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
        case 8:
          for (let i in this.eighthArr) {
            if (
              typeof that.eighthArr[i] != 'object' ||
              Array.isArray(that.eighthArr[i]) ||
              that.eighthArr[i] === null
            ) {
              continue
            }
            if (
              this.eighthArr[i].topUserList.bottonUserId ==
              this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.eighthArr[i].userList))
              for (let wa of tq) {
                for (let na in this.ninthArr) {
                  if (
                    typeof this.ninthArr[na] != 'object' ||
                    Array.isArray(this.ninthArr[na]) ||
                    this.ninthArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.ninthArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.ninthArr.splice(na, 1)
                  }
                }
              }
              this.eighthArr[i].userList = temSelectUser
              for (let j in this.eighthArr[i].userList) {
                let _obj = {}
                _obj.level = 9
                _obj.topUserList = this.eighthArr[i].userList[j]
                _obj.userList = []
                this.ninthArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
        case 9:
          for (let i in this.ninthArr) {
            if (
              typeof that.ninthArr[i] != 'object' ||
              Array.isArray(that.ninthArr[i]) ||
              that.ninthArr[i] === null
            ) {
              continue
            }
            if (
              this.ninthArr[i].topUserList.bottonUserId == this.checkedDeptIndex
            ) {
              let tq = JSON.parse(JSON.stringify(this.ninthArr[i].userList))
              for (let wa of tq) {
                for (let na in this.tenthArr) {
                  if (
                    typeof this.tenthArr[na] != 'object' ||
                    Array.isArray(this.tenthArr[na]) ||
                    this.tenthArr[na] === null
                  ) {
                    continue
                  }
                  if (
                    this.tenthArr[na].topUserList.bottonUserId ==
                    wa.bottonUserId
                  ) {
                    this.tenthArr.splice(na, 1)
                  }
                }
              }
              this.ninthArr[i].userList = temSelectUser
              for (let j in this.ninthArr[i].userList) {
                let _obj = {}
                _obj.level = 10
                _obj.topUserList = this.ninthArr[i].userList[j]
                _obj.userList = []
                this.tenthArr.push(_obj)
              }
            }
          }
          this.dialogVisibleDept = false
          break
      }
    },
    checkTeacher: function(e) {
      if (e.length > 1) {
        e.shift()
      }
      this.leftId = e[0]
    },
    teaChange: function(e) {
      let len = this.data2.length
      if (e.length > 0) {
        for (let i = 0; i < len; i++) {
          if (this.data2[i].bottonUserId == this.leftId) {
            this.data2[i].disabled = false
          } else {
            this.data2[i].disabled = true
          }
        }
      } else {
        for (let i = 0; i < len; i++) {
          this.data2[i].disabled = false
        }
      }
    },
    selectDept2: function() {
      // 如果 更改第一级交底人 下面所有的数据清空
      this.dialogVisibleDept2 = false
      let temCheckedDeptIndex = this.checkedDeptIndex
      let temSelectUser = []
      let temValue = this.value2
      let temData = this.data2
      for (let val in temValue) {
        for (let data in temData) {
          if (temValue[val] == temData[data].bottonUserId) {
            //获取数据
            temSelectUser = temData[data]
          }
        }
      }
      if (temCheckedDeptIndex == 1) {
        this.firstLevel.topUserList = temSelectUser
      } else {
        this.secondLevel.topUserList = temSelectUser
      }
    },

    //map 去重
    deWeightThree(deWeightKey, arrayObj) {
      let name = deWeightKey
      let map = new Map()
      for (let item of arrayObj) {
        if (!map.has(item[name])) {
          map.set(item[name], item)
        }
      }
      return [...map.values()]
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

.page-tit {
  font-size: 18px;
  background: #ffffff;
  height: 45px;
  line-height: 45px;
  margin-bottom: 10px;
  padding-left: 15px;
  border-radius: 5px;
}

.choose-list {
  color: #175eb6;
  cursor: pointer;
  font-weight: 600;
  margin-left: 10px;
  display: inline-block;
}

.choose-color {
  color: #175eb6;
  cursor: pointer;
  font-weight: 600;
}

.confide tr td {
  // width: 25%;
  border-bottom: 1px solid #dcdfe6;
}

.confide table {
  width: 100%;
  float: right;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  text-align: center;
  border-bottom: none;
}

.confide tr {
  height: 32px;
  line-height: 32px;
}

.confide-content .upload-demo,
.confide-content .upload {
  width: 70%;
}

.confide-content .upload-demo,
el-upload-list {
  width: 15rem;
}

.confede-content .el-transfer {
  text-align: center;
}

.area-confide {
  margin-top: 20px;
}

.upload {
  display: inline-block;
}

.confide-content .el-tree {
  width: 30%;
  height: 40vh;
  float: left;
  overflow-y: scroll;
}

.confide-content .el-transfer {
  width: 70%;
  float: left;
}

.first-other {
  width: 100%;
  float: left;
}

.first-div {
  width: 100%;
  float: left;
  display: flex;
  flex-wrap: wrap;
}

.first-div table {
  text-align: center;
}

.first-div table span {
  color: #5583fe;
}

.jiaodi-other {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding-top: 1rem;
}

.search-supervise {
  flex: 1;
  height: 40px;
  display: flex;
  align-items: center;
}

.time-supervise {
  width: 100%;
}

.boldfont {
  font-weight: bold;
  background: #d2e5fa;
}
label {
  font-weight: 500;
}
.xzwj {
  min-width: 300px;
}
/deep/ .el-collapse-item__header {
  border-bottom: 2px solid #ebeef5;
  font-weight: bold;
}
/deep/ .el-collapse-item__wrap {
  border-bottom: 2px solid #ebeef5;
}
/deep/ .el-collapse-item__header {
  font-weight: bold;
}
/deep/ .el-form-item__label {
  font-weight: bold;
}
/deep/ .el-upload-list {
  width: 445px !important;
}
.safe_main .sxTable .el-button{
  margin: 0;
}
.supervise-tit{
  margin-right: 12px;
}
</style>
