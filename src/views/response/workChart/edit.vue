<template>
    <div class="edit-editor">
        <div id="vue-g6-editor">
            <div class="editor">
                <el-row class="editor-tit">
                    <el-col :span="24">
                        <header>流程设计器</header>
                    </el-col>
                </el-row>
                <!-- 工具栏 -->
                <el-row>
                    <el-col :span="24">
                        <div id="toolbar">
                            <i
                                data-command="save"
                                class="command el-icon-document"
                                title="保存"
                            ></i>
                            <!-- <i class="el-icon-notebook-1" title="历史数据" @click="readHistoryData"></i> -->
                            <i
                                class="el-icon-upload2"
                                title="上传数据"
                                @click="readUploadData"
                            ></i>
                            <i
                                class="el-icon-download"
                                title="另存为文件"
                                @click="saveAsFile"
                            ></i>
                            <i
                                class="el-icon-download"
                                title="打开属性栏"
                                @click="openDeatils"
                            ></i>
                            <i
                                class="el-icon-picture-outline"
                                title="另存为图片"
                                @click="openSaveAsImageDialog"
                            ></i>
                            <!--          <i data-command="undo" class="el-icon-back" title="撤销"></i>
                        <i data-command="redo" class="el-icon-refresh-left" title="重做"></i>
                        <i data-command="delete" class="el-icon-delete" title="删除"></i>
                        <i data-command="zoomOut" class="el-icon-zoom-out" title="缩小"></i>
                        <i data-command="zoomIn" class="el-icon-zoom-in" title="放大"></i>
                        <i data-command="clear" class="el-icon-c-scale-to-original" title="清除画布"></i>
                        <i data-command="toFront" class="el-icon-sort-up" title="提升层级"></i>
                        <i data-command="toBack" class="el-icon-sort-down" title="下降层级"></i>
                        <i data-command="selectAll" class="el-icon-finished" title="全选"></i>
                        <i data-command="copy" class="el-icon-reading" title="复制"></i>
                        <i data-command="paste" class="el-icon-scissors" title="粘贴"></i>
                        <i data-command="autoZoom" class="el-icon-top-left" title="实际大小"></i>
                        <i data-command="resetZoom" class="el-icon-data-board" title="适应页面"></i>
                        <i data-command="addGroup" class="el-icon-connection" title="组合"></i>
                        <i data-command="unGroup" class="el-icon-copy-document" title="取消组合"></i>
                        <i data-command="multiSelect" class="el-icon-plus" title="多选"></i> -->
                        </div>
                    </el-col>
                </el-row>
                <!-- 元素面板 + 画布 + 属性栏 -->
                <el-row>
                    <!-- 元素面板 -->
                    <el-col :span="2">
                        <div id="itempannel">
                            <!-- 开始节点 -->
                            <div
                                id="startNode"
                                class="getItem"
                                data-type="node"
                                data-shape="flow-circle"
                                data-size="72*72"
                                data-label="开始节点"
                                data-color="#FA8C16"
                                data-nodeType="startNode"
                            >
                                <img draggable="false" :src="startNodeSVGUrl" alt srcset/>
                            </div>

                            <!-- 常规节点 -->
                            <div
                                id="regularNode"
                                class="getItem"
                                data-type="node"
                                data-size="100*50"
                                data-label="常规节点"
                                data-color="#1890ff"
                            >
                                <img draggable="false" :src="regularNodeSVGUrl" alt srcset/>
                            </div>

                            <!-- 条件节点 -->
                            <div
                                id="judgeNode"
                                class="getItem"
                                data-type="node"
                                data-shape="flow-rhombus"
                                data-size="80*80"
                                data-label="条件节点"
                                data-color="#13C2C2"
                            >
                                <img draggable="false" :src="conditionNodeSVGUrl"/>
                            </div>

                            <!-- 结束节点 -->
                            <div
                                id="endNode"
                                class="getItem"
                                data-type="node"
                                data-shape="flow-circle"
                                data-size="80*80"
                                data-label="结束节点"
                                data-color="#FA8C16"
                                data-nodeType="endNode"
                            >
                                <img draggable="false" :src="endNodeSVGUrl"/>
                            </div>
                        </div>
                    </el-col>
                    <!-- 画布 -->
                    <el-col :span="17">
                        <el-col :span="24">
                            <div id="page"></div>
                        </el-col>
                    </el-col>
                    <!-- 属性栏 -->
                    <el-col :span="5">
                        <section class="right-part">
                            <div id="detailpannel">
                                <!-- 节点属性栏 -->
                                <div id="nodeAttributeBar" class="pannel" data-status="node-selected">
                                    <div class="title">节点属性</div>
                                    <div class="main">
                                        <el-form :model="nodeAttributeForm" label-position="top" label-width="80px">
                                            <el-form-item label="节点文本">
                                                <el-input v-model="nodeAttributeForm.label"
                                                          @change="saveNodeAttribute"></el-input>
                                            </el-form-item>
                                            <el-form-item label="宽度">
                                                <el-input v-model="nodeAttributeForm.width"
                                                          @change="saveNodeAttribute"></el-input>
                                            </el-form-item>
                                            <el-form-item label="高度">
                                                <el-input v-model="nodeAttributeForm.height"
                                                          @change="saveNodeAttribute"></el-input>
                                            </el-form-item>
                                            <el-form-item label="颜色">
                                                <el-color-picker v-model="nodeAttributeForm.color"
                                                                 @change="saveNodeAttribute"></el-color-picker>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                                <!-- 边属性栏 -->
                                <div id="edgeAttributeBar" class="pannel" data-status="edge-selected">
                                    <div class="title">边属性</div>
                                    <div class="main">
                                        <el-form :model="edgeAttributeForm" label-position="top" label-width="80px">
                                            <el-form-item label="边文本">
                                                <el-input v-model="edgeAttributeForm.label"
                                                          @change="saveEdgeAttribute"></el-input>
                                            </el-form-item>
                                            <el-form-item label="边文本">
                                                <el-select v-model="edgeAttributeForm.shape"
                                                           @change="saveEdgeAttribute">
                                                    <el-option label="流程图折线"
                                                               value="flow-polyline"></el-option>
                                                    <el-option label="流程图圆⻆折线"
                                                               value="flow-polyline-round"></el-option>
                                                    <el-option
                                                        label="流程图曲线"
                                                        value="flow-smooth"
                                                    ></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                                <div
                                    id="groupAttributeBar"
                                    class="pannel"
                                    data-status="group-selected"
                                >
                                    <div class="title">群组属性栏</div>
                                </div>
                                <div
                                    id="basicForm"
                                    class="pannel"
                                    data-status="canvas-selected"
                                    v-show="propetyPanel"
                                >
                                    <div
                                        class="title"
                                        style="margin-top: 10px;margin-left: 10px;"
                                    >
                                        属性栏
                                    </div>
                                    <div class="main">
                                        <el-form label-width="100px" label-position="right">
                                            <el-form-item label="网格对齐">
                                                <el-checkbox
                                                    v-model="basicForm.grid"
                                                    @change="toggleGridShowStatus"
                                                ></el-checkbox>
                                            </el-form-item>
                                            <el-form-item label="流程图名称">
                                                <el-input
                                                    v-model="basicForm.name"
                                                    @change="saveNodeAttribute"
                                                    style="width: 80%;"
                                                ></el-input>
                                            </el-form-item>
                                            <el-form-item label="描述">
                                                <el-input
                                                    v-model="basicForm.description"
                                                    @change="saveNodeAttribute"
                                                    style="width: 80%;"
                                                ></el-input>
                                            </el-form-item>
                                        </el-form>
                                    </div>
                                </div>
                                <div
                                    id="multiAttributeBar"
                                    class="pannel"
                                    data-status="multi-selected"
                                >
                                    <div class="title">多选时属性栏</div>
                                </div>
                            </div>
                            <!-- 缩略图 -->
                            <div id="minimap">
                                <div class="title">缩略图</div>
                            </div>
                        </section>
                    </el-col>
                </el-row>

                <!-- 右键菜单 -->
                <section>
                    <div id="contextmenu">
                        <div data-status="node-selected" class="menu">
                            <el-button data-command="copy" class="command">复制</el-button>
                            <el-button data-command="paste" class="command">粘贴</el-button>
                            <el-button data-command="delete" class="command">删除</el-button>
                        </div>
                        <div data-status="edge-selected" class="menu">
                            <el-button data-command="delete" class="command">删除</el-button>
                        </div>
                        <div data-status="group-selected" class="menu">
                            <el-button data-command="copy" class="command">复制</el-button>
                            <el-button data-command="paste" class="command">粘贴</el-button>
                            <el-button data-command="unGroup" class="command"
                            >取消组合
                            </el-button
                            >
                            <el-button data-command="delete" class="command">删除</el-button>
                        </div>
                        <div data-status="canvas-selected" class="menu">
                            <el-button data-command="undo" class="command">撤销</el-button>
                            <el-button data-command="redo" class="command disable"
                            >重做
                            </el-button
                            >
                        </div>
                        <div data-status="multi-selected" class="menu">
                            <el-button data-command="copy" class="command">复制</el-button>
                            <el-button data-command="paste" class="command">粘贴</el-button>
                            <el-button data-command="addGroup" class="command"
                            >组合
                            </el-button
                            >
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <!-- 弹窗 -->
        <article>
            <!-- 下载图片 -->
            <section class="save-as-image-dialog">
                <el-dialog
                    title="下载图片"
                    :visible.sync="saveAsImageDialogVisible"
                    custom-class="small"
                    :close-on-click-modal="false"
                >
                    <el-form label-width="100px" label-position="top">
                        <el-form-item label="选择图片格式">
                            <el-select v-model="saveAsImageFormat">
                                <el-option label="jpg" value="jpg">
                                    <span style="float: left;">jpg</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px;"
                                    >白色背景</span
                                    >
                                </el-option>
                                <el-option label="png" value="png">
                                    <span style="float: left;">png</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px;"
                                    >透明背景</span
                                    >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
            <el-button class="fBtn" @click="saveAsImageDialogVisible = false"
            >取 消</el-button
            >
            <el-button class="tBtn" @click="saveAsImage">确 定</el-button>
          </span>
                </el-dialog>
            </section>
        </article>
    </div>
</template>
<script>
import G6Editor from '@antv/g6-editor'
import mixin from './mixin'
import {
    getAddWorkchart,
    getlookWorkchart,
    getEditWorkchart
} from '@/api/job/workChart'
// import { construct } from "netflix-conductor-json-tree/dist/index";
export default {
    props: {
        edit: String
    },
    name: 'VueG6Editor',
    mixins: [mixin],
    data() {
        return {
            // 节点属性表单
            nodeAttributeForm: {
                label: '',
                width: '',
                height: ''
            },
            formList: {
                name: '',
                description: '',
                // workprocessId:this.$route.query.workprocessId,
                workprocessId: ''
            },
            // 节点属性表单
            edgeAttributeForm: {
                label: ''
            },
            // 画布属性栏表单
            basicForm: {
                grid: true,
                cell: 20,
                name: '',
                dename: ''
            },
            flow: '',
            workprocessId: '',
            propetyPanel: true,
            processMap: '',
            // SVG节点图片URL地址
            startNodeSVGUrl: require('../../../assets/start-node.svg'),
            endNodeSVGUrl: require('../../../assets/end-node.svg'),
            regularNodeSVGUrl: require('../../../assets/regular-node.svg'),
            conditionNodeSVGUrl: require('../../../assets/condition-node.svg'),
            modelNodeSVGUrl:
                'https://gw.alipayobjects.com/zos/rmsportal/rQMUhHHSqwYsPwjXxcfP.svg',
            // 编辑器
            editor: null,
            saveAsImageDialogVisible: false,
            saveAsImageFormat: 'jpg'
        }
    },
    mounted() {
        this.initG6Editor()
    },
    async created() {
        this.getLookChart()
        this.workprocessId = this.edit
        this.basicForm = await getlookWorkchart(this.workprocessId)
    },
    methods: {
        // 初始化
        initG6Editor() {
            const _this = this
            const editor = new G6Editor()
            this.editor = editor
            G6Editor.track(false)
            const Command = G6Editor.Command
            // 注册新命令save
            Command.registerCommand('save', {
                // 禁止保存命令进入队列
                queue: false,
                // 命令是否可用
                enable: (editor) => {
                    return true
                },
                // 正向命令
                execute(editor) {
                    let needSaveData = editor.getCurrentPage().save()
                    localStorage.setItem('flowData', JSON.stringify(needSaveData))
                    _this.save(needSaveData)
                    // _this.$message.success("数据已保存");
                },
                // 反向命令
                back(editor) {
                    console.log('反向命令')
                    console.log(editor)
                },
                // 快捷键：Ctrl + S
                shortcutCodes: [['metaKey', 's'], ['ctrlKey', 's']]
            })
            // 画布
            this.flow = new G6Editor.Flow({
                graph: {
                    container: 'page'
                },
                align: {
                    line: {
                        // 对齐线颜色
                        stroke: '#FA8C16',
                        // 对齐线粗细
                        lineWidth: 1
                    },
                    // 开启全方位对齐
                    item: true,
                    // 网格对齐
                    grid: true
                },
                grid: {
                    // 网孔尺寸
                    cell: 18
                },
                shortcut: {
                    // 开启自定义命令保存的快捷键
                    save: true
                }
            })
            window.flow = this.flow

            // 设置边
            this.flow.getGraph().edge({
                shape: 'flow-polyline'
            })

            // 元素面板栏
            const itempannel = new G6Editor.Itempannel({
                container: 'itempannel'
            })
            // 工具栏
            const toolbar = new G6Editor.Toolbar({
                container: 'toolbar'
            })
            // 属性栏
            const detailpannel = new G6Editor.Detailpannel({
                container: 'detailpannel'
            })
            // 缩略图
            let minimapWidth = getComputedStyle(document.querySelector('.right-part'))
                .width
            minimapWidth = Number(minimapWidth.replace(/px$/, ''))
            const minimap = new G6Editor.Minimap({
                container: 'minimap',
                width: minimapWidth,
                height: 200
            })
            // 右键菜单
            const contextmenu = new G6Editor.Contextmenu({
                container: 'contextmenu'
            })
            // 挂载以上组件到Editor
            editor.add(flow)
            editor.add(itempannel)
            editor.add(toolbar)
            editor.add(detailpannel)
            editor.add(minimap)
            editor.add(contextmenu)
            // 挂载到window，方便调试
            window.editor = editor

            // 获取当前画布
            const currentPage = editor.getCurrentPage()
            currentPage.on('afterchange', (e) => {
                if (e.action === 'add') {
                    if (
                        e.model.nodetype === 'startNode' ||
                        e.model.nodetype === 'endNode'
                    ) {
                        let nodes = this.editor.getCurrentPage().getNodes()
                        for (const item of nodes) {
                            if (
                                item.model.nodetype === e.model.nodetype &&
                                item.model.id !== e.model.id
                            ) {
                                this.editor.getCurrentPage().remove(e.item)
                                this.$message.warning('只能有一个开始节点或结束节点')
                            }
                        }
                    }
                }
            })
            // 监听（选择对象后）事件
            currentPage.on('afteritemselected', (ev) => {
                console.log('打印所选对象属性', ev.item)
                console.log('打印所选对象数据模型', ev.item.model)
                const selectedItemDataModel = ev.item.model
                // 如果选择的对象是节点
                if (ev.item.isNode) {
                    this.nodeAttributeForm.label = selectedItemDataModel.label
                    this.nodeAttributeForm.width = selectedItemDataModel.size.split(
                        '*'
                    )[0]
                    this.nodeAttributeForm.height = selectedItemDataModel.size.split(
                        '*'
                    )[1]
                    this.nodeAttributeForm.color = selectedItemDataModel.color
                }
                // 如果选择的对象是边
                if (ev.item.isEdge) {
                    ev.item.graph.edge({
                        shape: 'flow-polyline-round'
                    })
                    this.edgeAttributeForm.label = selectedItemDataModel.label
                    this.edgeAttributeForm.shape = selectedItemDataModel.shape
                }
            })

            // 监听（取消选择对象后）事件
            currentPage.on('afteritemunselected', (ev) => {
                console.log('取消选择后',ev)
            })


            // 监听（删除后）事件
            currentPage.on('afterdelete', (ev) => {
            })
        },
        // 打开保存为图片弹窗
        openSaveAsImageDialog() {
            this.saveAsImageDialogVisible = true
        },
        // 开启/关闭网格对齐
        toggleGridShowStatus(value) {
            if (value) {
                this.editor.getCurrentPage().showGrid()
            } else {
                this.editor.getCurrentPage().hideGrid()
            }
        },
        // 保存为图片
        saveAsImage() {
            let newCanvas
            if (this.saveAsImageFormat === 'jpg') {
                let canvas = this.editor.getCurrentPage().saveImage()
                newCanvas = document.createElement('canvas')
                newCanvas.width = canvas.width
                newCanvas.height = canvas.height
                let newContext = newCanvas.getContext('2d')
                newContext.fillStyle = '#fff'
                newContext.fillRect(0, 0, newCanvas.width, newCanvas.height)
                newContext.drawImage(canvas, 0, 0)
            }
            if (this.saveAsImageFormat === 'png') {
                newCanvas = this.editor.getCurrentPage().saveImage()
            }
            let imageDataURL = newCanvas.toDataURL()
            let downloadLink = document.createElement('a')
            downloadLink.download = '图片.jpg'
            downloadLink.href = imageDataURL
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
            this.saveAsImageDialogVisible = false
        },
        // 保存为文件
        saveAsFile() {
            let jsonString = JSON.stringify(this.editor.getCurrentPage().save())
            let blob = new Blob([jsonString])
            let blobURL = URL.createObjectURL(blob)
            let downloadLink = document.createElement('a')
            downloadLink.download = '数据.json'
            downloadLink.href = blobURL
            document.body.appendChild(downloadLink)
            downloadLink.click()
            URL.revokeObjectURL(blobURL)
            document.body.removeChild(downloadLink)
        },
        // 读取历史数据
        readHistoryData() {
            let stringData = localStorage.getItem('flowData')
            if (stringData === '' || stringData === '{}' || stringData === null) {
                this.$message.warning('无历史数据')
                return
            }
            let jsonData = JSON.parse(stringData)
            this.editor.getCurrentPage().read(jsonData)
        },
        // 读取上传数据
        readUploadData() {
            let uploadButton = document.createElement('input')
            uploadButton.setAttribute('type', 'file')
            uploadButton.setAttribute('accept', '.json')
            uploadButton.addEventListener('change', (e) => {
                console.dir(uploadButton)
                let file = uploadButton.files[0]
                let fileReader = new FileReader()
                fileReader.onload = (event) => {
                    console.log(event)
                    let text = JSON.parse(event.target.result)
                    console.log(text)
                    this.editor.getCurrentPage().read(text)
                }
                fileReader.readAsText(file)
            })
            uploadButton.click()
        },
        //
        async save(source) {
            this.workprocessId = this.edit
            this.formList.edges = source.edges
            this.formList.nodes = source.nodes
            this.formList.name = this.basicForm.name
            this.formList.description = this.basicForm.description
            this.formList.workprocessId = this.workprocessId
            let res = await getEditWorkchart(this.formList)
            this.$notify({
                title: res ? '修改成功' : '修改失败',
                dangerouslyUseHTMLString: true,
                message: res ? res.message : '系统正在维护中，请与管理员联系',
                type: res ? 'success' : 'warning'
            })
            this.$emit('fatherMethod')
        },
        openDeatils() {
            this.propetyPanel = true
        },
        async getLookChart() {
            // this.workprocessId=this.$route.query.workprocessId;
            this.workprocessId = this.edit
            this.processMap = await getlookWorkchart(this.workprocessId)
            let _data = {
                nodes: [],
                edges: []
            };
            if (this.processMap.nodes) {
                for (let i in this.processMap.nodes) {
                    let _obj = {};
                    _obj.id = this.processMap.nodes[i].id;
                    _obj.color = this.processMap.nodes[i].color;
                    _obj.size = this.processMap.nodes[i].size;
                    _obj.shape = this.processMap.nodes[i].shape;
                    _obj.label = this.processMap.nodes[i].label;
                    _obj.index = this.processMap.nodes[i].index;
                    _obj.x = this.processMap.nodes[i].x;
                    _obj.y = this.processMap.nodes[i].y;
                    _data.nodes.push(_obj);
                }
            }

            if (this.processMap.edges) {
                for (let i in this.processMap.edges) {
                    let _obj = {};
                    _obj.id = this.processMap.edges[i].id;
                    _obj.source = this.processMap.edges[i].source;
                    _obj.target = this.processMap.edges[i].target;
                    _obj.sourceAnchor = this.processMap.edges[i].sourceAnchor;
                    _obj.targetAnchor = this.processMap.edges[i].targetAnchor;
                    _obj.shape = this.processMap.edges[i].shape;
                    _obj.label = this.processMap.edges[i].label;
                    _obj.index = this.processMap.edges[i].index;
                    _obj.x = this.processMap.edges[i].x;
                    _obj.y = this.processMap.edges[i].y;
                    _data.edges.push(_obj);
                }
            }
            this.flow.read(_data);
        }
    }
}
</script>

<style>
body {
    margin: 0;
    overflow: hidden;
}

/* .editor-tit{
  margin-top: 120px;
} */
.edit-editor #vue-g6-editor {
    position: fixed;
    top: 215px;
    left: 8.7%;
    right: 35px;
    bottom: 0px;
    width: 89%;
}

#vue-g6-editor header:nth-of-type(1) {
    background: #fbfbfb;
    line-height: 40px;
    padding-left: 20px;
    border-bottom: 1px solid #dadce0;
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

#vue-g6-editor #itempannel {
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

#vue-g6-editor #page {
    height: calc(100vh - 120px - 37px);
}

#vue-g6-editor #page canvas {
    display: block;
    width: 100%;
}

#vue-g6-editor .right-part {
    height: calc(100vh - 220px - 30px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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

/* .editor{
  margin-top: 90px!important;
} */
</style>
