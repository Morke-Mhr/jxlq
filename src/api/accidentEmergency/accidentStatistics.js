import request from '@/utils/request'
import store from '@/store'

const serviceName = store.state.serviceName.accidentEmergency



//获取图标
export function getStatisticsList(beginTime) {
    return request({
        url: serviceName + `/accident/getAccidentStatistics?beginTime=${beginTime}`,
        method: 'get',
    })
}