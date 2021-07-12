// api接口配制文件
/*
local：本地开发配制
dev：测试环境配制
sit：预发布环境配制
uat：验收环境配制
prod：正式环境配制
url：目标地址
imgFileUrl：图片地址
fileUrl：文件地址
cndUrl：cdn静态文件地址
*/
/*
NOW 服务环境
*/
const NOW = 'dev'
const apiConfiguration = {
    // rap: {
    //   url: 'http://192.168.16.234:9001',
    //   imgFileUrl: 'hdfs://192.168.16.237:9001',
    //   fileUrl: 'http://192.168.16.234:9001/jxlq-system-service',
    //   cdnUrl: ''
    // },
    local: {},
    // 测试
    // dev: {
    //     url: 'http://192.168.16.233:8888/',
    //     imgFileUrl: 'http://192.168.16.233:8888/jxlq-system-service',
    //     fileUrl: 'http://192.168.16.233:8888/jxlq-system-service',
    //     cdnUrl: '',
    //     messageUrl: '192.168.16.233:8888/',
    //     htmlUrl: 'http://192.168.16.233:8888/'
    // },
    // 线上
    // dev: {
    //     url: 'http://192.168.16.233:8888/',
    //     imgFileUrl: 'http://192.168.16.233:8888/jxlq-system-service',
    //     fileUrl: 'http://192.168.16.233:8888/jxlq-system-service',
    //     cdnUrl: '',
    //     messageUrl: '192.168.16.233:8888/',
    //     htmlUrl: 'http://192.168.16.233:8000/'
    // },
    //打包
    dev: {
      url: 'http://111.22.13.139:8999/',
      imgFileUrl: 'http://111.22.13.139:8999',
      fileUrl: 'http://111.22.13.139:8999/jxlq-system-service',
      cdnUrl: '',
      messageUrl: '111.22.13.139:8999/',
      htmlUrl: 'http://111.22.13.139:8000/'
    },
    //阿里云环境
    // dev: {
    //   url: 'http://118.31.39.197:8889/',
    //   imgFileUrl: 'http://118.31.39.197:8889',
    //   fileUrl: 'http://118.31.39.197:8889/jxlq-system-service',
    //   cdnUrl: '',
    //   messageUrl: '118.31.39.197:8889/',
    //   htmlUrl: '118.31.39.197:80/'
    // },
    //测试服务
    test: {},
    sit: {
        url: '',
        imgFileUrl: '',
        fileUrl: '',
        cdnUrl: ''
    },
    uat: {
        url: '',
        imgFileUrl: '',
        fileUrl: '',
        cdnUrl: ''
    },
    prod: {
        url: '',
        imgFileUrl: '',
        fileUrl: '',
        cdnUrl: ''
    }
}
export default apiConfiguration[NOW]
