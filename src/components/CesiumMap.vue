<template>
  <div id="cesiumContainer" ref="map">
    <div class="demo-map_menu" ref="mapmenu" v-show="mapMenuShow" @click="getLocationInfo">
      <div class="demo-map_menuItem">获取地点信息</div>
    </div>
    <div class="demo-map_location">
      <div class="demo-map_locationItem" v-for="(item, index) in locations" :key="index">
        <span>{{ item }}</span>
        <span>：{{ moveLocation[index] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";
import CesiumPlot from "@/utils/plot";
import {getLocationInfo} from "@/api/map";

export default {
  name: "cesiumMap",
  data() {
    return {
      viewer: null,
      locations: ["经度", "纬度", "高度"],
      moveLocation: [null, null, null],
      mapMenuShow: false,
    }
  },
  methods: {
    onMouseMove(event) {
      const {Cartesian2} = Cesium

      const clientX = event.type === 'mousemove' ? event.clientX : event.changedTouches[0].clientX
      const clientY = event.type === 'mousemove' ? event.clientY : event.changedTouches[0].clientY
      if (clientX === this.lastMouseX && clientY === this.lastMouseY) {
        return
      }
      this.mapMenuShow = false;
      this.lastMouseX = clientX
      this.lastMouseY = clientY

      if (this.viewer) {
        const rect = this.viewer._element.getBoundingClientRect()
        const position = new Cartesian2(clientX - rect.left, clientY - rect.top)
        let ellipsoid = this.viewer.scene.globe.ellipsoid;
        let cartesian = this.viewer.camera.pickEllipsoid(position, ellipsoid);
        if (cartesian) {
          let height = this.viewer.camera.positionCartographic.height.toFixed(2);
          //将笛卡尔坐标转换为地理坐标
          let cartographic = ellipsoid.cartesianToCartographic(cartesian);
          //将弧度转为度的十进制度表示
          let longitude = Cesium.Math.toDegrees(cartographic.longitude);
          let latitude = Cesium.Math.toDegrees(cartographic.latitude);
          this.moveLocation = [longitude.toFixed(5), latitude.toFixed(5), height]
        }

        // this.mouseCoords.updateCoordinatesFromCesium(this.viewer, position)
      }
    },
    onMouseRightClick(e) {
      this.mapMenuShow = true;
      this.$refs.mapmenu.style.left = e.position.x + "px";
      this.$refs.mapmenu.style.top = e.position.y + "px";
    },
    getLocationInfo() {
      this.$notify.closeAll();
      let lon = this.moveLocation[0];
      let lat = this.moveLocation[1];
      this.mapMenuShow = false;
      getLocationInfo(lon, lat).then(response => {
        if (response.code == 200) {
          let data = response.resp;
          let name = response.info;
          if (data) {
            name = [data.cnName, data.prName, data.ctName, data.dtName].join("-")
          }
          this.$notify({
            title: name,
            message: '经度：' + lon + "，纬度：" + lat,
            position: 'bottom-right',
            offset: 20,
            duration: 0
          })
        }
      })
    }
  },
  mounted() {
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 1.2;
    this.lastMouseX = -1
    this.lastMouseY = -1
    document.oncontextmenu = function () {
      return false;
    }
    // const Cesium = this.Cesium
    const viewer = new Cesium.Viewer("cesiumContainer", {
      geocoder: false,
      selectionIndicator: false,
      baseLayerPicker: false,
      animation: false,
      navigationHelpButton: false,
      infoBox: false,
      timeline: false,
      homeButton: false,
      showRenderLoopErrors: false,
      sceneModePicker: false,
      mapMode2D: Cesium.MapMode2D.ROTATE,
      fullscreenButton: false,
      sceneMode: Cesium.SceneMode.SCENE3D,
      // 连接地图服务
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        // url: window.mapUrl + ":9109/map/?z={z}&x={x}&y={y}",
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 7,
        show: false
      }),
    });

    // 将三维球定位到中国区域
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 133934127),
    });

    // this.utils.transformTime(this, window.viewer); //时间转换
    // this.utils.setView(window.viewer);
    viewer.cesiumWidget.creditContainer.style.display = "none";
    //是否开启抗锯齿
    viewer.scene.fxaa = true;
    viewer.scene.debugShowFramesPerSecond = false;
    viewer.scene.postProcessStages.fxaa.enabled = true;
    //
    //
    // plot = new CesiumPlot(viewer, {
    //   zoomToExtent: false
    // });
    let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    let self = this;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    // 左键单击事件：
    handler.setInputAction(function (e) {
      let pick = viewer.scene.pick(e.position);
      if (Cesium.defined(pick)) {
        // && pick.id.plot
        if (pick.id) {
          plot.plotEdit.activate(pick.id);
        } else {
          plot.plotEdit.deactivate();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    handler.setInputAction(this.onMouseRightClick, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    //实时获取坐标
    // handler.setInputAction(function (movement) {
    //   let ellipsoid = viewer.scene.globe.ellipsoid;
    //   let cartesian = viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    //   //获取高度
    //   let height = viewer.camera.positionCartographic.height.toFixed(2);
    //   if (cartesian) {
    //     //将笛卡尔坐标转换为地理坐标
    //     let cartographic = ellipsoid.cartesianToCartographic(cartesian);
    //     //将弧度转为度的十进制度表示
    //     let longitude = Cesium.Math.toDegrees(cartographic.longitude);
    //     let latitude = Cesium.Math.toDegrees(cartographic.latitude);
    //     self.moveLocation = [longitude.toFixed(5), latitude.toFixed(5), height];
    //   } else {
    //     self.moveLocation = [null, null, height];
    //   }
    // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.viewer = viewer
    this.$emit("ready", viewer)
    viewer._element.addEventListener('mousemove', this.onMouseMove, false)
    viewer.dataSources.add(Cesium.CzmlDataSource.load("./data/czml/meo.czml"))
  }
}
</script>

<style scoped lang="scss">
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;

  .demo-map_menu {
    position: absolute;
    z-index: 1;
    left: 1000px;
    padding: 5px;
    background: rgba(5, 5, 65, 0.4);
    font-size: 12px;
    color: #e9eaed;
    cursor: pointer;
  }

  .demo-map_location {
    position: absolute;
    bottom: 2px;
    right: 0;
    display: flex;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 4px;
    z-index: 1;
    font-size: 14px;

    .demo-map_locationItem {
      margin: 0 2px;
      min-width: 120px;
    }
  }
}

</style>
