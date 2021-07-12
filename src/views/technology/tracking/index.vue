<template>
  <div class="safe_main">
    <div class="sxForm">
      <el-form
        :inline="true"
        :model="pageForm"
        ref="pageForm"
        class="demo-form-inline"
      >
        <el-form-item prop="projectName" label="项目名称">
          <el-input
            v-model="pageForm.projectName"
            maxlength="30"
            placeholder="请输入项目名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="packageName" label="方案名称">
          <el-input
            v-model="pageForm.packageName"
            maxlength="30"
            placeholder="请输入方案名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="disclosureOf" label="交底人">
          <el-input
            v-model="pageForm.disclosureOf"
            maxlength="30"
            placeholder="请输入交底人姓名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="nature" label="方案性质">
          <el-select v-model="pageForm.nature" placeholder="全部">
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="方案类别">
          <el-select v-model="pageForm.type" placeholder="全部">
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="time" label="交底时间">
          <el-date-picker
            v-model="dateList"
            type="datetime"
            placeholder="选择交底时间"
          ></el-date-picker>
        </el-form-item>
        <div class="btnCont">
          <el-button
            class="chaxun"
            icon="el-icon-search"
            v-has="has.query"
            @click="getList()"
            >查询</el-button
          >
          <el-button @click="resetForm('pageForm')" class="chongzhi"
            >重置</el-button
          >
        </div>
      </el-form>
    </div>
    <div class="sxTable">
      <el-button class="blue" v-has="">导出</el-button>
      <el-button class="blue" v-has="">批量删除</el-button>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" label="项目名称" width="400">
          <template slot-scope="scope">{{ scope.row.projectName }}</template>
        </el-table-column>
        <el-table-column align="center" label="方案名称">
          <template slot-scope="scope">{{ scope.row.packageName }}</template>
        </el-table-column>
        <el-table-column align="center" label="编写人">
          <template slot-scope="scope">{{ scope.row.writeName }}</template>
        </el-table-column>
        <el-table-column align="header-center" label="方案类别">
          <template slot-scope="scope">{{ scope.row.type }}</template>
        </el-table-column>
        <el-table-column align="header-center" label="方案性质">
          <template slot-scope="scope">{{ scope.row.nature }}</template>
        </el-table-column>
        <el-table-column align="header-center" label="交底人">
          <template slot-scope="scope">{{ scope.row.disclosureOf }}</template>
        </el-table-column>
        <el-table-column align="header-center" label="交底时间">
          <template slot-scope="scope">{{ scope.row.time }}</template>
        </el-table-column>
        <el-table-column fixed="right" width="200" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              v-has=""
              size="medium"
              @click="trackingsEdit(scope)"
              >交底跟踪</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageForm.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>

      <!-- 详情 -->
      <el-dialog
        :visible.sync="dialogVisible"
        custom-class="small"
        title="交底跟踪详情"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="方案信息" name="first">
            <el-form
              :model="tracking"
              ref="trackingFome"
              label-width="auto"
              label-position="left"
              class="trackingForm"
            >
              <el-form-item label="项目名称：" prop="projectName">
                <span> {{ tracking.projectName }} </span>
              </el-form-item>
              <el-form-item label="方案名称：" prop="packageName">
                <span> {{ tracking.packageName }} </span>
              </el-form-item>
              <el-form-item label="方案性质：" prop="nature">
                <span> {{ tracking.nature }} </span>
              </el-form-item>
              <el-form-item label="方案类别：" prop="type">
                <span> {{ tracking.type }} </span>
              </el-form-item>
              <el-form-item label="专项施工时间：" prop="specialTime">
                <span> {{ tracking.specialTime }} </span>
              </el-form-item>
              <el-form-item label="方案概况：" prop="general" class="formItemW">
                <el-input
                  v-model="tracking.general"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  type="textarea"
                  placeholder="方案概况"
                />
              </el-form-item>
              <el-form-item
                label="方案文件："
                prop="planFileList"
                class="formItemW"
              >
                <div class="upload">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="getUrl"
                    :on-preview="handlePreview"
                    multiple
                    :limit="1"
                    :file-list="fileLists"
                    name="file"
                  >
                    <span v-if="flag == false">点击文件下载</span>
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="交底信息" name="second">
            <el-form
              :model="trackings"
              ref="trackingsFome"
              label-width="auto"
              label-position="left"
              class="trackingForm"
            >
              <el-form-item label="被交底人：" prop="userName">
                <span> {{ trackings.userName }} </span>
              </el-form-item>
              <el-form-item label="交底监督人：" prop="jdName">
                <span> {{ trackings.jdName }} </span>
              </el-form-item>
              <el-form-item label="交底开始时间：" prop="timeSta">
                <span> {{ trackings.timeSta }} </span>
              </el-form-item>
              <el-form-item label="交底结束时间：" prop="timeEnd">
                <span> {{ trackings.timeEnd }} </span>
              </el-form-item>
              <el-form-item
                label="交底内容："
                prop="contents"
                class="formItemW"
              >
                <el-input
                  v-model="trackings.contents"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="交底内容"
                />
              </el-form-item>
              <el-form-item label="技术要求：" prop="yaoq" class="formItemW">
                <el-input
                  v-model="trackings.yaoq"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="技术要求"
                />
              </el-form-item>
              <el-form-item
                label="注意事项/风险："
                prop="fenx"
                class="formItemW"
              >
                <el-input
                  v-model="trackings.fenx"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="注意事项/风险"
                />
              </el-form-item>
              <el-form-item
                label="交底附件："
                prop="planFileList"
                class="formItemW"
              >
                <div class="upload">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="getUrl"
                    :on-preview="handlePreview"
                    multiple
                    :limit="1"
                    :file-list="fileListss"
                    name="file"
                  >
                    <span v-if="flag == true">点击文件下载</span>
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="交底状态" name="third" class="timeList">
            <p class="statistical">
              <span>待签收：1人</span> <span>待交底：1人</span>
              <span>已转发：1人</span> <span>已会签：1人</span>
            </p>
            <el-timeline>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div>
                    <p>被交底人：蒋睿 <i class="stay">待签收</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div>
                    <p>被交底人：蒋睿 <i class="stay">待签收</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div @click="signs()">
                    <p>被交底人：蒋睿 <i class="stays">已转发</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div @click="sign()">
                    <p>被交底人：蒋睿 <i class="stays">已会签</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                    <p>会签人数：15人</p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button class="fBtn" @click="dialogVisible = false"
            >取消</el-button
          >
        </span>
      </el-dialog>
      <!-- 详情结束 -->

      <!-- 已转发详情 -->
      <el-dialog
        :visible.sync="dialogVisibleszf"
        custom-class="small"
        title="交底跟踪详情"
      >
        <el-tabs v-model="activeNamess" @tab-click="handleClicks">
          <el-tab-pane label="方案信息" name="firsts">
            <el-form
              :model="tracking"
              ref="trackingFome"
              label-width="auto"
              label-position="left"
              class="trackingForm"
            >
              <el-form-item label="项目名称：" prop="projectName">
                <span> {{ tracking.projectName }} </span>
              </el-form-item>
              <el-form-item label="方案名称：" prop="packageName">
                <span> {{ tracking.packageName }} </span>
              </el-form-item>
              <el-form-item label="方案性质：" prop="nature">
                <span> {{ tracking.nature }} </span>
              </el-form-item>
              <el-form-item label="方案类别：" prop="type">
                <span> {{ tracking.type }} </span>
              </el-form-item>
              <el-form-item label="专项施工时间：" prop="specialTime">
                <span> {{ tracking.specialTime }} </span>
              </el-form-item>
              <el-form-item label="方案概况：" prop="general" class="formItemW">
                <el-input
                  v-model="tracking.general"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  type="textarea"
                  placeholder="方案概况"
                />
              </el-form-item>
              <el-form-item
                label="方案文件："
                prop="planFileList"
                class="formItemW"
              >
                <div class="upload">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="getUrl"
                    :on-preview="handlePreview"
                    multiple
                    :limit="1"
                    :file-list="fileLists"
                    name="file"
                  >
                    <span v-if="flag == false">点击文件下载</span>
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="交底信息" name="seconds">
            <el-form
              :model="trackings"
              ref="trackingsFome"
              label-width="auto"
              label-position="left"
              class="trackingForm"
            >
              <el-form-item label="被交底人：" prop="userName">
                <span> {{ trackings.userName }} </span>
              </el-form-item>
              <el-form-item label="交底监督人：" prop="jdName">
                <span> {{ trackings.jdName }} </span>
              </el-form-item>
              <el-form-item label="交底开始时间：" prop="timeSta">
                <span> {{ trackings.timeSta }} </span>
              </el-form-item>
              <el-form-item label="交底结束时间：" prop="timeEnd">
                <span> {{ trackings.timeEnd }} </span>
              </el-form-item>
              <el-form-item
                label="交底内容："
                prop="contents"
                class="formItemW"
              >
                <el-input
                  v-model="trackings.contents"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="交底内容"
                />
              </el-form-item>
              <el-form-item label="技术要求：" prop="yaoq" class="formItemW">
                <el-input
                  v-model="trackings.yaoq"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="技术要求"
                />
              </el-form-item>
              <el-form-item
                label="注意事项/风险："
                prop="fenx"
                class="formItemW"
              >
                <el-input
                  v-model="trackings.fenx"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="注意事项/风险"
                />
              </el-form-item>
              <el-form-item
                label="交底附件："
                prop="planFileList"
                class="formItemW"
              >
                <div class="upload">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="getUrl"
                    :on-preview="handlePreview"
                    multiple
                    :limit="1"
                    :file-list="fileListss"
                    name="file"
                  >
                    <span v-if="flag == true">点击文件下载</span>
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="交底状态" name="thirds">
            <p class="statistical">
              <span>待签收：1人</span> <span>待交底：1人</span>
              <span>已转发：1人</span>
            </p>
            <el-timeline>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div>
                    <p>被交底人：蒋睿 <i class="stay">待签收</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div>
                    <p>被交底人：蒋睿 <i class="stay">待签收</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div @click="signs()">
                    <p>被交底人：蒋睿 <i class="stays">已转发</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item color="#366DBB">
                <el-card>
                  <div @click="sign()">
                    <p>被交底人：蒋睿 <i class="stays">已会签</i></p>
                    <p>交底时间：2021-07-07 10:00:00</p>
                    <p>方案名称：广大高速吉安至南康段路基方案</p>
                    <p>会签人数：15人</p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button class="fBtn" @click="dialogVisibleszf = false
              dialogVisible = true"
            >返回</el-button
          >
        </span>
      </el-dialog>
      <!-- 已转发详情结束 -->

      <!-- 会签详情 -->
      <el-dialog
        :visible.sync="dialogVisibles"
        custom-class="small"
        title="会签详情"
      >
        <el-tabs v-model="activeNames" @tab-click="handleClickss">
          <el-tab-pane label="交底详情" name="first">
            <el-form
              :model="trackingSign"
              ref="trackingSignFome"
              label-width="auto"
              label-position="left"
              class="trackingForm"
            >
              <el-form-item label="项目名称：" prop="projectName">
                <span> {{ trackingSign.projectName }} </span>
              </el-form-item>
              <el-form-item label="工序名称：" prop="processName">
                <span> {{ trackingSign.processName }} </span>
              </el-form-item>
              <el-form-item label="交底部位：" prop="departmentName">
                <span> {{ trackingSign.departmentName }} </span>
              </el-form-item>
              <el-form-item label="施工单位：" prop="unitName">
                <span> {{ trackingSign.unitName }} </span>
              </el-form-item>
              <el-form-item
                label="交底内容："
                prop="disclosureContent"
                class="formItemW"
              >
                <el-input
                  v-model="trackingSign.disclosureContent"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="方案概况"
                />
              </el-form-item>
              <el-form-item
                label="技术要求："
                prop="technicalRequirements"
                class="formItemW"
              >
                <el-input
                  v-model="trackingSign.technicalRequirements"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="方案概况"
                />
              </el-form-item>
              <el-form-item
                label="注意事项/风险："
                prop="attention"
                class="formItemW"
              >
                <el-input
                  v-model="trackingSign.attention"
                  :autosize="{ minRows: 6, maxRows: 10 }"
                  type="textarea"
                  placeholder="方案概况"
                />
              </el-form-item>

              <el-form-item label="现场照片：" prop="avatar" class="formItemW">
                <!-- <el-upload
                  class="avatar-uploader"
                  ref="upload"
                  :action="getUrl"
                  :headers="geHeaders"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                > -->
                  <img src="../../../../public/img/sgt.jpg" width="184px" />
                  <img src="../../../../public/img/sgts.jpg" width="184px" />
                  <img src="../../../../public/img/sgtss.jpg" width="184px"/>
                  <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <!-- </el-upload> -->
              </el-form-item>
              <el-form-item
                label="方案文件："
                prop="planFileList"
                class="formItemW"
              >
                <div class="upload">
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="getUrl"
                    :on-preview="handlePreview"
                    multiple
                    :limit="1"
                    :file-list="fileListsss"
                    name="file"
                  >
                    <span v-if="flag == true">点击文件下载</span>
                  </el-upload>
                  <div class="shade" v-if="flag == false"></div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="会签人员" name="second">
            <p class="statistical">
              <span>已有5人完成签名</span>
            </p>
            <el-table
              :data="tableDatas"
              v-loading="listLoadings"
              style="width: 100%; margin-top: 30px"
              @selection-change="handleSelectionChanges"
              stripe
            >
              <el-table-column align="center" label="姓名">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column align="center" label="签字时间">
                <template slot-scope="scope">{{ scope.row.time }}</template>
              </el-table-column>
              <el-table-column fixed="right" align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-has=""
                    size="medium"
                    @click="signature(scope)"
                    >查看</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :total="totals"
              :page-sizes="[10, 15, 20, 25, 30]"
              :page-size="pageForms.pageSize"
              @size-change="handleSizeChanges"
              @current-change="handleCurrentChanges"
            ></el-pagination>
          </el-tab-pane>
        </el-tabs>

        <span slot="footer" class="dialog-footer">
          <el-button
            class="fBtn"
            @click="
              dialogVisibles = false
              dialogVisible = true
            "
            >返回</el-button
          >
        </span>
      </el-dialog>
      <!-- 会签详情结束 -->

      <!-- 会签详情 - 人员查看 -->
      <el-dialog
        :visible.sync="dialogVisiblesig"
        custom-class="small"
        title="会签详情"
        class="popHight"
      >
        <div class="editImgBox">
          <img src="../../../../public/img/qm.png" />
        </div>
      </el-dialog>
      <!-- 会签详情 - 人员查看 结束 -->
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      has: {},
      pageForm: {
        pageNum: 1,
        pageSize: 10,
        projectName: '',
        packageName: '',
        disclosureOf: '',
        nature: '',
        beginTime: '',
        endTime: '',
        type: ''
      },
      pageForms: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        time: ''
      },
      listLoading: false,
      tableData: [
        {
          projectName: 'S303浙临线浙源段公路升级改造建工程项',
          packageName: '防沙工程',
          writeName: '洪乐',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '洪乐',
          time: '2021-07-07'
        },
        {
          projectName: '大广高速吉安至南康段改扩建工程',
          packageName: '防沙工程',
          writeName: '侍玲晶',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '侍玲晶',
          time: '2021-07-07'
        },
        {
          projectName: '东昌C1标',
          packageName: '防沙工程',
          writeName: '小力东',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '小力东',
          time: '2021-07-07'
        },
        {
          projectName: '大广高速南龙扩容工程',
          packageName: '防沙工程',
          writeName: '矫朋',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '矫朋',
          time: '2021-07-07'
        },
        {
          projectName: 'S303浙临线浙源段公路升级改造建工程项目',
          packageName: '防沙工程',
          writeName: '蓝振',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '蓝振',
          time: '2021-07-07'
        },
        {
          projectName: '大广高速吉安至南康段改扩建工程',
          packageName: '防沙工程',
          writeName: '臧苑青',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '臧苑青',
          time: '2021-07-07'
        },
        {
          projectName: '东昌C1标',
          packageName: '防沙工程',
          writeName: '矫芳奇',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '矫芳奇',
          time: '2021-07-07'
        },
        {
          projectName: '大广高速南龙扩容工程',
          packageName: '防沙工程',
          writeName: '旷娥',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '旷娥',
          time: '2021-07-07'
        },
        {
          projectName: 'S303浙临线浙源段公路升级改造建工程项目',
          packageName: '防沙工程',
          writeName: '蔡义',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '蔡义',
          time: '2021-07-07'
        },
        {
          projectName: '大广高速吉安至南康段改扩建工程',
          packageName: '防沙工程',
          writeName: '赫云',
          type: 'B1类',
          nature: 'B  ( 施工方案 )',
          disclosureOf: '赫云',
          time: '2021-07-07'
        }
      ],
      multipleSelection: [],
      listLoadings: false,
      tableDatas: [
        {
          name: '权青凡',
          time: '2020-07-07  19:20:20'
        },
        {
          name: '司思',
          time: '2020-07-07  19:20:20'
        },
        {
          name: '虞世政',
          time: '2020-07-07  19:20:20'
        },
        {
          name: '应奇',
          time: '2020-07-07  19:20:20'
        },
        {
          name: '隆梦岚',
          time: '2020-07-07  19:20:20'
        }
      ],
      multipleSelections: [],
      total: 10,
      totals: 1,
      pageSizes: [10, 15, 20, 25, 30],
      dialogVisible: false,
      dialogVisibles: false,
      dialogVisiblesig: false,
      dialogVisibleszf: false,
      dateList: '',
      activeName: 'first',
      activeNames: 'first',
      activeNamess: 'firsts',
      tracking: {
        userName: '蒋睿',
        disclosureTime: '2021-07-07 10:0',
        projectName: '广大高速吉安至南康段',
        packageName: '防沙工程',
        nature: 'C施工方案',
        type: 'C类',
        specialTime: '2021-07-17',
        general:
          '1、编制依据现场踏勘；有关国家现行技术规范、规程;我公司同类工程施工经验；专项资金防沙治沙建设项目工程的设计图。2编制原则1依据设计图、有关施工技术规范和验收规范的原则:2在仔细踏勘工地现场，认真研究设计文件和有关规定的基础上充分考虑标段的特点、场地、交通、水位、料源、民情、水电供应、气候等实际情况，我公司将科学合理地组织施工。3.建设内容专项资金防沙治沙建设项目位与吉安市，本项目建设内容为:封护围栏工程10000米:布设草沙障工程1000亩:草沙障中灌木造林工程1000亩:防风林带营造工程90亩:防风林带灌水渠道衬砌工程6200米。本项目招标设一个标段，招标内容包括以上建设内容范围内的材料采购，施工及后续两年内的维护、养护等全部内容。实施地点位于白银市景泰县;工程所在地乡村道路畅通，交通便利，各供货厂家均可直达工地。',
        planFileList: []
      },
      trackings: {
        userName: '蒋睿',
        jdName: '王为安',
        timeSta: '2021-07-07 10:00:00',
        timeEnd: '2021-07-07 10:00:00',
        contents:
          '     路基换填变更要以驻地办的变更通知单为准。承包人的变更报告单应附有:(挖土前的)原地面照片、原地面水准测量表、平面示意图、有关原状地试验检测报告单估计变量工程数量与金额:(回填前的)照片、原地面照片水准测量表、平面示意图、纵断面图、有关新地基试验检测报告单、实际变更工程数量与金额。照片内应有桩号和名称并对照片及底片进行有序归档',
        yaoq:
          '     路基填筑定人指挥，每层定点定量卸车，接线施工。2 每层路基填筑顶面做成2%~4%的路拱，路基平整度 良好;3排水边沟排水畅通，线条顺直美观 路基施工 路段外两侧设置施工期间统一的整公桩、百米桩等边桩，小型结构物边设置标牌:5各种施工安全告示牌设置规X、齐全。',
        fenx:
          '     换填要彻底，并进行标高等测量。软基路段应进行触探，摸清下卧层地质情况，再确定处量方案(不允许采用抛石挤淤的施工工艺)。',
        planFileList: []
      },
      trackingSign: {
        projectName: '广大高速吉安至南康段',
        processName: '路基工程',
        departmentName: '路基填筑',
        unitName: '吉康B1',
        disclosureContent:
          '     保证路基顶标高符合设计要求，其压实度、横坡度、平整度、弯沉等检测指标符合设计要求。其中压实度、弯沉除施工、监理单位自检外，质监部门还将进行交工质量检测，检测数据将作为交工验收和竣工质量鉴定的依据',
        technicalRequirements:
          '     1、集料粒径规格以方孔筛为准。基层混合料最大粒径37.5mm，底基层混合 料最大粒径53mm2、集料颗粒组成应满足规范要求，细粒土的液限≤40%， 塑性指数≤17%， 实际工作中，宜选用塑性指数<12%的土3、 水泥稳定半刚集料必须分档(至少5档)准确计量拌和。 4、 级配碎石底基层粒径不得超标，要求组配良好，摊铺时避免骨料集中 5、 水泥稳定混合料摊铺前需对下承层进行洒水湿润 6、 水泥稳定混合料碾压含水量应大于设计理论配合含水量1-2%，但不宜过 大否则将产生弹簧与挤压裂缝。',
        attention:
          '     路面工程交工检测时，除施工自检、监理抽检外，质量监督单位还将对平整度厚度、宽度、横破度、抗滑性能、沥青砼路面的压实度、弯沉、车辙、水泥松散的强度、相邻板高差等项目进行重点检测。在竣工质量鉴定时将对路面平度、抗滑性能、沥青砼路面的弯沉、车辙、水泥砼的相邻板高差等项目进行重点检验',
        avatar: '',
        planFileList: []
      },
      fileLists: [
        {
          name: '方案文件1'
        },
        {
          name: '方案文件2'
        },
        {
          name: '方案文件3'
        },
        {
          name: '方案文件4'
        }
      ],
      fileListss: [],
      fileListsss: [],
      flag: false
    }
  },
  created: async function() {
    this.getList()
  },
  computed: {
    getUrl() {
      return (
        this.$store.state.apiConfiguration.url +
        this.$store.state.serviceName.jurisdiction +
        '/fs/upload'
      )
    },
    geHeaders() {
      return { Authorization: getToken() }
    },
    getUserImg() {
      return this.$store.state.apiConfiguration.url + this.trackingSign.avatar
    }
  },
  mounted() {},
  methods: {
    //日期时间置空
    dateChange(value) {
      if (value == null) {
        this.dateList = []
        this.pageForm.beginTime = ''
        this.pageForm.endTime = ''
      } else {
        this.pageForm.beginTime = this.$dateFormat(
          'yyyy-MM-dd',
          this.dateList[0]
        )
        this.pageForm.endTime = this.$dateFormat('yyyy-MM-dd', this.dateList[1])
      }
    },
    async getList() {
      this.listLoading = true
      // const res = await getUserList(this.pageForm);
      // this.tableData = res.rows;
      // this.total = res.total;
      this.listLoading = false
    },
    async getLists() {
      this.listLoadings = true
      this.listLoadings = false
    },
    //重置
    resetForm(formName) {
      this.dateList = []
      this.pageForm.beginTime = ''
      this.pageForm.endTime = ''
      this.$refs[formName].resetFields()
      this.getList()
    },
    handleSizeChange(val) {
      this.pageForm.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageForm.pageNum = val
      this.getList()
    },
    handleSizeChanges(val) {
      this.pageForms.pageSize = val
      this.getLists()
    },
    handleCurrentChanges(val) {
      this.pageForms.pageNum = val
      this.getLists()
    },
    handleSelectionChange(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.userId)
        }
        this.multipleSelections = [...arr]
      }
    },
    handleSelectionChanges(val) {
      if (val) {
        let arr = []
        for (let i = 0; i < val.length; i++) {
          let itme = val[i]
          arr.push(itme.userId)
        }
        this.multipleSelections = [...arr]
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleClicks(tab, event) {
      console.log(tab, event)
    },
    handleClickss(tab, event) {
      console.log(tab, event)
    },
    // 详情
    trackingsEdit(scope) {
      this.dialogVisible = true
    },
    // 已转发
    signs(scope) {
      this.dialogVisibleszf = true
    },
    // 会签
    sign(scope) {
      this.dialogVisibles = true
    },
    // 查看签名
    signature() {
      this.dialogVisiblesig = true
    },
    // 图片
    handleAvatarSuccess(res, file) {
      this.user.avatar = res.body
    },
    //下载
    handlePreview(file) {
      if (this.flag == false) {
        this.fileDowloadName =
          this.$store.state.apiConfiguration.url +
          `/fs/download?name=${encodeURI(encodeURI(file.name))}&path=${
            file.url
          }`
        location.href = this.fileDowloadName
      }
    }
  }
}
</script>

<style lang="scss">
$input_wide: 100%;
.trackingForm .el-form-item {
  width: 50%;
  float: left;
}
.trackingForm .el-form-item__content {
  margin-left: 100px;
}
.trackingForm .el-form-item__label-wrap {
  margin-left: 0 !important;
}
.statistical {
  margin-bottom: 20px;
}
.statistical span {
  margin-right: 60px;
}
.trackingForm .el-form-item.formItemW {
  width: 100%;
}
.formItemW .el-form-item__label-wrap {
  float: none !important;
}
.formItemW .el-form-item__content {
  margin-left: 0 !important;
}
.formItemW img {
  width: 184px;
  height: 104px;
  margin-right: 20px;
}
.stay {
  font-style: normal;
  font-size: 16px;
  font-weight: 400;
  color: #999999;
  line-height: 22px;
  float: right;
}
.stays {
  font-style: normal;
  font-size: 16px;
  font-weight: 400;
  color: #0091ff;
  line-height: 22px;
  float: right;
}
.popHight .el-dialog {
  margin-top: 15% !important;
}
.popHight .el-dialog .el-dialog__body {
  height: auto;
}
.editImgBox {
  width: 100%;
  height: auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.timeList .el-timeline-item__tail{
  top: 50%;
  border-left: 2px solid rgba($color: #366DBB, $alpha: 0.49);
}
.timeList .el-timeline-item__node--normal {
  top: 43%;
}
</style>
