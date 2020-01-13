<template>
  <div>
    <!--<button @click="initSearch">搜索</button>-->
    <!--<p>{{address}}</p>-->
    <!--<hr>-->
    <div class="amap-page-container">
      <el-amap-search-box class="search-box" :search-option="searchOption"
                          :on-search-result="onSearchResult"></el-amap-search-box>
      <el-amap vid="amapDemo" :center="mapCenter" :zoom="zoom" :events="events" :style="{height:height+'px'}"
               style="width: 97%">
        <el-amap-marker v-for="marker in markers" :position="marker"></el-amap-marker>
      </el-amap>
    </div>
  </div>
</template>

<script>
  // import VueAMap from 'vue-amap';
  // let amapManager = new VueAMap.AMapManager();
  export default {
    name: "aMap",
    props: {
      height: {
        type: Number,
        default: 300
      },
    },
    data() {
      let self = this
      return {
        zoom: 15,
        markers: [],
        searchOption: {
          citylimit: false
        },
        mapCenter: [121.59996, 31.197646],
        events: {
          click(e) {
            let {lng, lat} = e.lnglat;
            let data = {};
            data.lng = lng;
            data.lat = lat;
            // 这里通过高德 SDK 完成。
            let geocoder = new AMap.Geocoder({
              radius: 1000,
              extensions: "all"
            });
            geocoder.getAddress([lng, lat], function (status, result) {
              if (status === 'complete' && result.info === 'OK') {
                if (result && result.regeocode) {
                  data.address = result.regeocode.formattedAddress;
                  self.$nextTick();
                }
              }
            });
            setTimeout(() => {
              self.$emit('getAddressAndPosition', data)
            }, 50)
          }
        }
      }
    },
    created() {

    },
    methods: {
      // addMarker: function() {
      //   let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
      //   let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
      //   this.markers.push([lng, lat]);
      // },
      onSearchResult(pois) {
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            this.markers.push([poi.lng, poi.lat]);
          });
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          };
          this.mapCenter = [center.lng, center.lat];
          let data = {
            address: pois[0].name,
            lat: pois[0].lat,
            lng: pois[0].lng
          }
          this.$emit('getAddressAndPosition', data)
        } else {
          this.markers = []
        }
      },
      onSetPosition(e) {
        // console.log(e)
        if(e.longitude !== null && e.latitude !== null) this.mapCenter = [e.longitude, e.latitude]
      },
    }
  }
</script>
<style scoped>
  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }

  .amap-page-container {
    position: relative;
  }
</style>
