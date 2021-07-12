<template>
  <div>
    <el-input  v-model="keyword" placeholder="请输入详细地址"></el-input>
    <p>
      <b>当前选择位置:</b>
      {{address}}
    </p>
    <baidu-map
      class="bmView"
      @ready="handler"
      :center="location"
      :zoom="zoom"
      @click="getLocationPoint"
      :scroll-wheel-zoom="true"
      ak="urXRrBQqDM0LAwRUxvibmCgzfRQQSYYE"
    >
      <bm-view style="width: 100%; height:600px; flex: 1"></bm-view>
      <bm-local-search :keyword="keyword" :auto-viewport="true" style="display: none"></bm-local-search>
    </baidu-map>
  </div>
</template>
<script>
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmView from "vue-baidu-map/components/map/MapView.vue";
import BmLocalSearch from "vue-baidu-map/components/search/LocalSearch.vue";
export default {
  components: {
    BaiduMap,
    BmView,
    BmLocalSearch
  },
  data() {
    return {
      location: { lng: 112.969436, lat: 28.18839 },
      zoom: 6,
      keyword: "",
      map: null,
      address: "",
      lng: "",
      lat: ""
    };
  },
  methods: {
    // 点击地图事件
    getLocationPoint({ type, target, point, pixel, overlay }) {
      let that = this;
      // 清除画布
      this.map.clearOverlays();
      // 获取点击位置的经纬度，打标到地图上
      let myMarker = new BMap.Marker(new BMap.Point(point.lng, point.lat));
      this.map.addOverlay(myMarker);
      // 根据经纬度获取位置详细信息
      let points = new BMap.Point(point.lng, point.lat);
      let gc = new BMap.Geocoder();
      gc.getLocation(points, function(rs) {
        console.log(rs.address); //地址信息
        that.address = rs.address;
      });
      that.lng = point.lng;
      that.lat = point.lat;
    },
    // 确定
    deter() {
      let data = {
        address: this.address,
        lng: this.lng,
        lat: this.lat
      };
      this.$emit("close", data);
    },
    // 地图加载
    handler({ BMap, map }) {
      console.log(BMap, map);
      let that = this;
      this.map = map;
    }
  }
};
</script>

<style lang="scss" scoped>
/* 隐藏百度图片Logo */
/deep/ .BMap_cpyCtrl {
  display: none;
}
/* 隐藏文字信息 */
/deep/ .anchorBL {
  display: none;
}
</style>
