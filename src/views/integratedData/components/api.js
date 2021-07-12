import axios from "axios";
import Qs from "qs";

// export const postData = (url,data) => {
//     return axios({
//         method: "post",
//         url: url,
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         data: Qs.stringify(data),
//     });
// }
// export const getData = (url,data) => {
//     return axios({
//         method: "get",
//         url: url,
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         data: Qs.stringify(data),
//     });
// }
let http = `http://118.195.232.179:18080/`
//请求摄像头列表
export const getDataList = (page, count) => {
    return axios({
        method: "get",
        url: http+`api/getTree`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
}
//请求单个摄像头
export const getDataSingle = (deviceId) => {
    return axios({
        method: "get",
        url: http+`api/play/${deviceId}/${deviceId}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
}
//控制摄像头
export const postControl = (deviceId,number) => {
    return axios({
        method: "post",
        url: http+`api/ptz/${deviceId}/${deviceId}?control=${number}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
}