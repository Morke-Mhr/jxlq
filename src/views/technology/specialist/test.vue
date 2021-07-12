<template>
     <div>
        <div style="width: 148px;">二维码</div>
        <div>
            <div id="qrcode" ref="qrcode"></div>
            <div>
                <el-button @click="downloadAppCodeImg" class="nowBtn">立即下载</el-button>
            </div>
        </div>
    </div>
  </template>
  <script>
  import QRCode from 'qrcodejs2'  // 引入qrcode
  export default {
      name : 'test',　
      　data(){
  　　　　return{
    //    　　　　link: 'http://test.wx.jia-r.com/temporaryCarIndex.html' //需要生成二维码图片的字符串
                 // 二维码
                qrCode: '',
      　　}
      　},
      components:{QRCode },
      mounted(){
           this.$nextTick(() => {
     that.qrcode(url)
})
      },
   　 methods: {
           downloadAppCodeImg (name) {
      var canvasData = this.$refs.qrcode.getElementsByTagName('canvas')
      var a = document.createElement("a");
      var event = new MouseEvent("click"); // 创建一个单击事件
      a.href = canvasData[0].toDataURL("image/png");;
      a.download = "drcQrcode";
      a.dispatchEvent(event); // 触发a的单击事件
    },
           qrcode (url) {  
      // 一定要加上document.getElementById("qrcode").innerHTML = "";，否则每点击一次按钮就会多一个二维码
      document.getElementById("qrcode").innerHTML = "";
      let qrcode = new QRCode('qrcode', {                          
        width: 100, // 二维码宽度，单位像素                         
        height: 100, // 二维码高度，单位像素                          
        text: url // 生成二维码的链接               
      });   
    },
    }
  }
  </script>