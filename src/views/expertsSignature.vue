<template>
  <div class="expertsOne">
    <el-form ref="form">
      <el-form-item label="姓名">
        <el-select v-model="info.bottonUser" placeholder="请选择">
          <el-option
            v-for="item in userList"
            :key="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 手写签名组件 -->
      <p class="qianzi">签字</p>
      <div class="page sign-page">
        <div class="content">
          <div class="sign-wrap" id="signWrap">
            <canvas id="myCanvas" width="100%" height="100%"></canvas>
          </div>
        </div>
        <div class="con-btn">
          <span class="staging-btn size14" @click="clearArea()">清除签名</span>
          <span class="submit-btn size14" @click="saveSign()">确认签名</span>
        </div>
      </div>
      <el-button
        class="submitBtn"
        type="primary"
        @click="submitForm"
		:disabled="hideBtn"
        >提交
      </el-button>
    </el-form>
  </div>
</template>
<script>
import {postWorkerSign,fsUpload} from '@/api/system/class'
import axios from 'axios'
function base64ToFile(data) { 
　　　　　　// 将base64 的图片转换成file对象上传 atob将ascii码解析成binary数据
          let binary = atob(data.split(',')[1]);
          let mime = data.split(',')[0].match(/:(.*?);/)[1];
          let array = [];
          for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }
          let fileData = new Blob([new Uint8Array(array)], {
                type: mime,
              });
 
          let file = new File([fileData], `${new Date().getTime()}.png`, { type: mime });
 
　　　　　　return file;
 
}
export default {
  name: 'expertsSignature',
  data() {
    return {
      form: {},
      nameOptions: {},
      image: '',
      mousePressed: false,
      c: '',
      ctx: '',
      lastX: 0,
      lastY: 0,
	  userList:[],
	  info:{
		  bottonUser:'',
		  jiaodiId:'',
		  signUrl:''
	  },
	  isShowSign:true,
	  hideBtn:false
    }
  },
  mounted() {
	let newUserList = this.$route.query.userList.split(',')
	let obj = {}
	newUserList = newUserList.reduce((cur,next) => {
		obj[next] ? "" : obj[next] = true && cur.push(next);
		return cur;
	},[]) //去重 
	this.userList = newUserList
	this.info.jiaodiId = this.$route.query.jiaodiId
    this.image = ''
    this.mousePressed = false
    this.ctx = document.getElementById('myCanvas').getContext('2d')
    this.c = document.getElementById('myCanvas')
    var signWrap = document.getElementById('signWrap')
    this.c.width = signWrap.clientWidth // 设置宽度
    this.c.height = signWrap.clientHeight // 设置高度
    // 监听touchstart事件，touchmove事件，touchend事件等事件
    this.InitThis()
  },
  methods: {
    InitThis() {
      // 触摸屏
      var that = this
      this.c.addEventListener(
        'touchstart',
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault() // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0]
            this.mousePressed = true
            that.Draw(
              touch.pageX - this.offsetLeft,
              touch.pageY - this.offsetTop,
              false
            )
          }
        },
        false
      )
      this.c.addEventListener(
        'touchmove',
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault() // 阻止浏览器默认事件，重要
            var touch = event.targetTouches[0]
            if (this.mousePressed) {
              that.Draw(
                touch.pageX - this.offsetLeft,
                touch.pageY - this.offsetTop,
                true
              )
            }
          }
        },
        false
      )
      this.c.addEventListener(
        'touchend',
        function(event) {
          if (event.targetTouches.length == 1) {
            event.preventDefault() // 阻止浏览器默认事件，防止手写的时候拖动屏幕，重要
            this.mousePressed = false
          }
        },
        false
      )
      // 鼠标
      this.c.onmousedown = function(event) {
        this.mousePressed = true
        that.Draw(
          event.pageX - this.offsetLeft,
          event.pageY - this.offsetTop,
          false
        )
      }
      this.c.onmousemove = function(event) {
        if (this.mousePressed) {
          that.Draw(
            event.pageX - this.offsetLeft,
            event.pageY - this.offsetTop,
            true
          )
        }
      }
      this.c.onmouseup = function() {
        this.mousePressed = false
      }
    },
    Draw(x, y, isDown) {
      if (isDown) {
        this.ctx.beginPath()
        this.ctx.strokeStyle = '#000' // 颜色
        this.ctx.lineWidth = 3 // 线宽
        this.ctx.lineJoin = 'round'
        this.ctx.lineMax = 10 // 设置画笔最大线宽
        this.ctx.lineMin = 3 // 设置画笔最小线宽
        this.ctx.linePressure = 1.2 // 设置画笔笔触压力
        this.ctx.smoothness = 30 // 设置画笔笔触大小变化的平滑度
        this.ctx.moveTo(this.lastX, this.lastY)
        this.ctx.lineTo(x, y)
        this.ctx.closePath()
        this.ctx.stroke()
      }
      this.lastX = x
      this.lastY = y
    },
    // 清空画板
    clearArea() {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
	  this.info.signUrl = ''
	  this.isShowSign = true
    },
    // 提交签名
    saveSign() {
      this.checkEmpty() // 调用 表单非空验证
    },
    checkEmpty() {
		if(!this.isShowSign){
			return
		}
      var c = document.getElementById('myCanvas') // 获取html的canvas对象，我这个id="myCanvas"
				if (this.isCanvasBlank(c)) {
					alert('请在签名区域签名后再次确认')
					return
				} else {
					var image = this.c.toDataURL('image/png') // 得到生成后的签名base64位  url 地址
			const file = base64ToFile(image)
			var formData = new FormData();
			formData.append("file",file)
		axios({
		  method: "post",
		  url:
		    this.$store.state.apiConfiguration.url +
		    this.$store.state.serviceName.jurisdiction +
			"/fs/upload",
		  data:formData,
		}).then(({data:data})=>{
			if(data.code===200){
				this.$message('签名成功')
				this.isShowSign = false
			}
			console.log(data.body.url)
			this.info.signUrl = data.body.url
		});
      }
    },
    // 验证canvas画布是否为空函数
    isCanvasBlank(canvas) {
      var blank = document.createElement('canvas') // 系统获取一个空canvas对象
      blank.width = canvas.width
      blank.height = canvas.height
      return canvas.toDataURL() == blank.toDataURL() // 比较值相等则为空
    },
	submitForm(){
		const {
			info
		}=this
		if(!info.signUrl){
			return alert('请先确认在签名区域签名')
		}
		if(!info.bottonUser){
			return alert('请选择人员名称')
		}
		this.hideBtn = true
		postWorkerSign(info).then(({data:data})=>{
			if(data.code===200){
				this.$message('感谢您配合完成本次技术交底')
				   const ua = window.navigator.userAgent.toLowerCase();
				    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
							setTimeout(()=>{
								WeixinJSBridge.call('closeWindow')
							},8000)
				    } else {
						setTimeout(()=>{
							uni.navigateBack()
						},8000)
						
					}
					
			}else{
				this.hideBtn = false
			}
		}).catch(error=>{
			this.hideBtn = false
		})
	}
  }
}
</script>
<style lang="scss" scoped>
.expertsOne /deep/ {
  background-color: #f0f0f0;
  padding-top: 10px;
  .el-form {
    padding: 0 16px;
    background-color: #fff;
    .qianzi {
      margin: 0;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      color: #606266;
      font-weight: 700;
    }
    .el-input__inner {
      height: 45px;
      line-height: 45px;
      border: none !important;
      width: auto;
    }
    .el-form-item {
      height: 46px;
      line-height: 46px;
      border-bottom: 1px solid #f0f0f0;
      margin: 0 !important;
      text-align: right;
    }
    .submitBtn {
      display: block;
      width: 100%;
      margin: 5vh auto;
      height: 36px !important;
      line-height: 36px !important;
      background-color: #5583fe;
    }
  }

  .page {
    width: 100%;
    .content {
      width: 100%;
      height: 40vh;
      min-height: 200px;
      // background: url(../assets/img/photo_qmq.png) no-repeat;
      background-color: #f0f0f0;
      background-size: 100% 100%;
      background-position: center center;
      .sign-wrap {
        width: 100%;
        height: 100%;
      }
    }
    .con-btn {
      width: 100%;
      display: flex;
      align-content: center;
      justify-content: space-between;
      span {
        font-size: 1.1rem;
        width: 100%;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .staging-btn {
        color: #5583fe;
        background: #fff;
        border: 1px solid #5583fe;
      }
      .submit-btn {
        color: #fff;
        background: #5583fe;
      }
    }
  }
}
</style>
