<template>
  <div class="demo-left_menu">
    <el-button size="small" class="demo-nav_item" v-for="(nav, key) in navs" :key="key" @click="openMenu(key)"
               :type="selIndex === key ? 'primary' : ''">{{ nav }}
    </el-button>
    <transition name="el-zoom-in-top">
      <div class="demo-menu_panel" v-show="selIndex == 0">
        <i class="el-icon-close" @click="closeMenu"></i>
        <el-tooltip v-for="plot in plots" :key="plot.fun" :content="plot.name" placement="top" effect="light">
          <el-button size="mini" @click="drawPlot(plot)"
                     :type="selFun == plot.fun ? 'primary' : 'info'" class="demo-menu_item" circle>
            <div v-bind:style="{backgroundImage: 'url(' + plot.url + ')'}" class="demo-menu_plot"></div>
          </el-button>
        </el-tooltip>
      </div>
    </transition>
    <transition name="el-zoom-in-top">
      <div class="demo-menu_panel demo-update_panel" v-show="selIndex == 1">
        <!--        <el-upload-->
        <!--            class="upload-demo"-->
        <!--            :on-preview="handlePreview"-->
        <!--            :on-remove="handleRemove"-->
        <!--            :before-remove="beforeRemove"-->
        <!--            :on-change="changeFile"-->
        <!--            :file-list="fileList"-->
        <!--            :show-file-list="false"-->
        <!--            :auto-upload="false">-->
        <!--          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>-->
        <!--        </el-upload>-->
      </div>
    </transition>
  </div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";
import CesiumPlot from "@/utils/plot/index";
import * as Utils from "@/utils/plot/utils/Utils";
import {Point} from "@/utils/plot/geometry";

let plotTool = null;
export default {
  name: "LeftMenu",
  data() {
    return {
      navs: ["标绘", "态势导入", "行动推演"],
      viewer: null,
      plots: [
        //     {
        //   name: "点",
        //   fun: "Point",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "线",
        //   fun: "Polyline",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "曲线",
        //   fun: "Curve",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "弓形线",
        //   fun: "Arc",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "圆",
        //   fun: "Circle",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "自由线",
        //   fun: "FreeHandLine",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "矩形",
        //   fun: "RectAngle",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "椭圆",
        //   fun: "Ellipse",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "弓型面",
        //   fun: "Lune",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "扇形",
        //   fun: "Sector",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "闭合曲面",
        //   fun: "ClosedCurve",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "多边形",
        //   fun: "Polygon",
        //   url: require('../assets/icon/arrow.svg')
        // }, {
        //   name: "自由面",
        //   fun: "FreePolygon",
        //   url: require('../assets/icon/arrow.svg')
        // },
        //   {
        //     name: "细直箭头",
        //     fun: "StraightArrow",
        //     url: require('../assets/icon/arrow.svg')
        //   },{
        //     name: "粗单直箭头",
        //     fun: "AssaultDirection",
        //     url: require('../assets/icon/arrow.svg')
        //   }, {
        //     name: "粗单尖头箭头",
        //     fun: "FineArrow",
        //     url: require('../assets/icon/arrow.svg')
        //   },
        //   {
        //     name: "飞行轨迹",
        //     fun: "fly",
        //     custom: true,
        //     url: require('../assets/icon/arrow.svg')
        //   },
        {
          name: "集结地",
          fun: "GatheringPlace",
          url: require('../assets/icon/GatheringPlace.svg')
        }, {
          name: "钳击",
          fun: "DoubleArrow",
          url: require('../assets/icon/DoubleArrow.svg')
        }, {
          name: "进攻方向",
          fun: "AttackArrow",
          url: require('../assets/icon/AttackArrow.svg')
        }, {
          name: "进攻方向(尾)",
          fun: "TailedAttackArrow",
          url: require('../assets/icon/TailedAttackArrow.svg')
        }, {
          name: "分队战斗行动",
          fun: "SquadCombat",
          url: require('../assets/icon/AttackArrow.svg')
        }, {
          name: "分队战斗行动(尾)",
          fun: "TailedSquadCombat",
          url: require('../assets/icon/TailedAttackArrow.svg')
        }, {
          name: "矩形标志旗",
          fun: "RectFlag",
          url: require('../assets/icon/RectFlag.svg')
        }, {
          name: "三角标志旗",
          fun: "TriangleFlag",
          url: require('../assets/icon/TriangleFlag.svg')
        }, {
          name: "曲线标志旗",
          fun: "CurveFlag",
          url: require('../assets/icon/CurveFlag.svg')
        }, {
          name: "坦克",
          fun: "tiger",
          size: 100,
          url: require('../assets/icon/tiger.svg')
        }, {
          name: "战机",
          fun: "fighter",
          size: 100,
          url: require('../assets/icon/fighter.svg')
        }, {
          name: "雷达探测",
          fun: "Radar",
          url: require('../assets/icon/Radar.svg')
        }, {
          name: "雷达扫描",
          fun: "RadarScan",
          url: require('../assets/icon/RadarScan.svg')
        },{
          name: "图片演示",
          fun: "Picture",
          url: require('../assets/icon/Picture.svg')
        },
        //   {
        //   name: "地空目标",
        //   fun: "GroundLinkSky",
        //   custom: true,
        //   url: require('../assets/icon/TailedAttackArrow.svg')
        // },
        {
          name: "清空内容",
          fun: "clearAll",
          custom: true,
          url: require('../assets/icon/clearAll.svg')
        }],
      fileList: [],
      selIndex: null,
      selFun: null,
      importDatas: [
        {
          lon: 80.226887,
          lat: 31.277297,
          height: 0,
          type: "Tiger",
          name: "坦克A",
          angle: 70,
          scale: 1000,
          id: "1"
        },
        {
          lon: 80.393613,
          lat: 31.185404,
          height: 0,
          type: "Tiger",
          name: "坦克B",
          angle: 90,
          scale: 1000,
          id: "2"
        },
        {
          lon: 80.233171,
          lat: 31.280754,
          height: 0,
          type: "Tiger",
          name: "坦克C",
          angle: 40,
          scale: 1000,
          id: "3"
        },
        {
          lon: 80.3769,
          lat: 31.174776,
          height: 5800,
          type: "Fighter",
          name: "战机A",
          angle: 100,
          scale: 100,
          id: "4"
        },
        {
          lon: 80.384661,
          lat: 31.291123,
          height: 8000,
          type: "Fighter",
          name: "战机B",
          angle: 70,
          scale: 100,
          id: "5"
        },
        {
          lon: 80.146071,
          lat: 31.326418,
          height: 7000,
          type: "Fighter",
          name: "战机C",
          angle: 20,
          scale: 100,
          id: "6"
        }
      ],

    }
  },
  watch: {
    viewer() {
      plotTool = new CesiumPlot(this.viewer, {
        zoomToExtent: false
      });
    }
  },
  methods: {
    openMenu(index) {
      this.selIndex = index
    },
    closeMenu() {
      this.selIndex = null
    },
    drawPlot(fun) {
      this.selFun = fun.fun;
      let self = this;
      const viewer = this.viewer
      if (fun.custom) {
        if (fun.fun == 'fly') {
          let points = [
            [80.875854, 35.496456],
            [80.445415, 35.426961],
            [80.364565, 35.620685],
            [80.786978, 35.829093]
          ]
          let curvePath = Utils.getCurvePoints(0.3, points);
          let range = [80.875854, 35.496456, 80.445415, 35.426961, 80.364565, 35.620685, 80.786978, 35.829093];
          range = Cesium.Rectangle.fromCartesianArray(Cesium.Cartesian3.fromDegreesArray(range));
          let boundingSphere = Cesium.BoundingSphere.fromRectangle3D(range);
          viewer.camera.flyToBoundingSphere(boundingSphere, {
            offset: new Cesium.HeadingPitchRange(0, -90, 100000)
          })
          for (let i = 0; i < curvePath.length; i++) {
            curvePath[i] = curvePath[i].concat([5000]);
            // if (i > 10 && i < curvePath.length - 10) {
            //   height = height + 10;
            // }
          }
          const timeStepInSeconds = 30;
          const totalSeconds = timeStepInSeconds * (curvePath.length - 1);
          const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
          const stop = Cesium.JulianDate.addSeconds(
              start,
              totalSeconds,
              new Cesium.JulianDate()
          );

          const positionProperty = new Cesium.SampledPositionProperty();
          for (let i = 0; i < curvePath.length; i++) {
            const dataPoint = curvePath[i];
            const time = Cesium.JulianDate.addSeconds(
                start,
                i * timeStepInSeconds,
                new Cesium.JulianDate()
            );
            const position = Cesium.Cartesian3.fromDegrees(
                dataPoint[0],
                dataPoint[1],
                dataPoint[2]
            );
            positionProperty.addSample(time, position);
          }

          const airplaneEntity = viewer.entities.add({
            availability: new Cesium.TimeIntervalCollection([
              new Cesium.TimeInterval({start: start, stop: stop})
            ]),
            position: positionProperty,
            // Attach the 3D model instead of the green point.
            model: {
              uri: "./model/Fighter.glb",
              scale: 100,
              minimumPixelSize: 100,
              maximumScale: 200,
            },
            // Automatically compute the orientation from the position.
            orientation: new Cesium.VelocityOrientationProperty(positionProperty),
            // orientation: new Cesium.CallbackProperty(function() {
            //   //console.log(this.getValue(viewer.clock.currentTime));
            //   return new Cesium.VelocityOrientationProperty(positionProperty);
            // }),
            path: new Cesium.PathGraphics({width: 1, material: Cesium.Color.YELLOW})
          });

          viewer.clock.startTime = start.clone();
          viewer.clock.stopTime = stop.clone();
          viewer.clock.currentTime = start.clone();
          //viewer.timeline.zoomTo(start, stop);
          // Speed up the playback speed 50x.
          viewer.clock.multiplier = 10;
          // Start playing the scene.
          viewer.clock.shouldAnimate = true;
          // viewer.trackedEntity = airplaneEntity;
          self.selFun = null;
        }
        if (fun.fun == 'GroundLinkSky') {
          const airplaneEntity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(80, 35.1, 5000),
            label: {
              // This callback updates the length to print each frame.
              text: "战机",
              font: "14px sans-serif",
              fillColor: Cesium.Color.fromCssColorString("#ff0"),
              outlineColor: Cesium.Color.RED,
              outlineWidth: 1,
              eyeOffset: new Cesium.Cartesian3(0, 400, 100),
              scaleByDistance: new Cesium.NearFarScalar(15000, 1.2, 5000, 1),
            },
            // Attach the 3D model instead of the green point.
            model: {
              uri: "./model/Fighter.glb",
              scale: 100,
            },
          });
          const tigerEntity = viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(80, 35, 0), label: {
              // This callback updates the length to print each frame.
              text: "坦克",
              font: "14px sans-serif",
              fillColor: Cesium.Color.fromCssColorString("#ff0"),
              outlineColor: Cesium.Color.RED,
              outlineWidth: 1,
              eyeOffset: new Cesium.Cartesian3(0, 200, 100),
              scaleByDistance: new Cesium.NearFarScalar(15000, 1.2, 5000, 1),
            },
            // Attach the 3D model instead of the green point.
            model: {
              uri: "./model/Tiger.glb",
              scale: 1000
            },
          });

          // viewer.trackedEntity = tigerEntity;
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(80.20, 34.95, 16000),
            orientation: {
              heading: -45,
              pitch: -120,
              roll: 0
            },
            duration: 0
          })
          let handler = new Cesium.ScreenSpaceEventHandler(
              viewer.scene.canvas
          );
          let ellipsoid = viewer.scene.globe.ellipsoid;
          //是否开始连线
          let isLink = false
          let linkPosition = []
          let dynamicPositions = new Cesium.CallbackProperty(() => {
            return Cesium.Cartesian3.fromDegreesArrayHeights(linkPosition);
          }, false)
          handler.setInputAction(function (e) {
            let pick = viewer.scene.pick(e.position);
            if (pick && Cesium.defined(pick) && pick.id) {
              const selEntity = pick.id;
              selEntity.model.silhouetteColor = Cesium.Color.yellowBright;
              selEntity.model.silhouetteSize = 2;
              if (!isLink) {
                isLink = true;
                let cartographic = ellipsoid.cartesianToCartographic(pick.id.position.getValue());
                let lat = Cesium.Math.toDegrees(cartographic.latitude);
                let lng = Cesium.Math.toDegrees(cartographic.longitude);
                let alt = cartographic.height;
                linkPosition = [lng, lat, alt];
                viewer.entities.add(
                    new Cesium.Entity({
                      polyline: {
                        positions: dynamicPositions,
                        width: 12,
                        arcType: Cesium.ArcType.RHUMB,
                        // clampToGround: true,
                        // material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
                        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.RED, "./static/rockets_h.svg", 10000)

                      }
                    })
                )
                handler.setInputAction(function (move) {
                  //获取相机射线
                  let ray = viewer.scene.camera.getPickRay(move.endPosition);
                  //根据射线和场景求出在球面中的笛卡尔坐标
                  let movepick = viewer.scene.globe.pick(ray, viewer.scene);
                  //获取该浏览器坐标的顶部数据
                  let feature = viewer.scene.pick(move.endPosition);
                  // console.log(feature);
                  let cartesian = viewer.scene.pickPosition(move.endPosition);
                  if (feature == undefined && movepick) {
                    let cartesian = Cesium.Ellipsoid.WGS84.cartesianToCartographic(movepick);
                    let mlon = Cesium.Math.toDegrees(cartesian.longitude);
                    let mlat = Cesium.Math.toDegrees(cartesian.latitude);
                    let mMouseHeight = Cesium.Math.toDegrees(cartesian.height);
                    linkPosition = [...[linkPosition[0], linkPosition[1], linkPosition[2]], ...[mlon, mlat, mMouseHeight]];
                  } else {
                    if (Cesium.defined(cartesian)) {
                      //如果对象已定义，将度转为经纬度
                      let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                      let mlon = Cesium.Math.toDegrees(cartographic.longitude);
                      let mlat = Cesium.Math.toDegrees(cartographic.latitude);
                      let mMouseHeight = cartographic.height;//模型高度
                      linkPosition = [...[linkPosition[0], linkPosition[1], linkPosition[2]], ...[mlon, mlat, mMouseHeight]];
                    }
                  }
                  //
                  // let movepick = viewer.scene.pick(move.endPosition);
                  // let cartesian = viewer.camera.pickEllipsoid(move.endPosition, ellipsoid);
                  // if (cartesian) {
                  //   //将笛卡尔三维坐标转为地图坐标（弧度）
                  //   let ecartographic = ellipsoid.cartesianToCartographic(cartesian);
                  //   let elat = Cesium.Math.toDegrees(ecartographic.latitude);
                  //   let elng = Cesium.Math.toDegrees(ecartographic.longitude);
                  //   let ealt = ecartographic.height;
                  //   if (movepick && Cesium.defined(movepick) && movepick.id) {
                  //     let targetcartographic = ellipsoid.cartesianToCartographic(movepick.id.position.getValue())
                  //     elat = Cesium.Math.toDegrees(targetcartographic.latitude);
                  //     elng = Cesium.Math.toDegrees(targetcartographic.longitude);
                  //     ealt = targetcartographic.height;
                  //   }
                  //   // linkPosition = [...[linkPosition[0], linkPosition[1], linkPosition[2]], ...[elng, elat, ealt]];
                  //   //将地图坐标（弧度）转为十进制的度数
                  // }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
              } else {
                isLink = false
                handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
              }
            }
          }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
          self.selFun = null;
        }
        if (fun.fun == "clearAll") {
          viewer.dataSources.get(0).entities.removeAll();
          viewer.entities.removeAll();
          self.selFun = null;
        }
      } else {
        this.$emit("drawPlot", true);
        let plotType = fun.fun;
        let params = {};
        if (plotType == 'Radar' || plotType == 'RadarScan') {
          params = {
            name: "ld",
            isRadar: true,
            radarType: plotType == 'Radar' ? 3 : 2,
            modelUrl: "./model/station.glb",
            scale: 0.2,
            viewer: viewer,
            radarColor: new Cesium.Color(1, 0, 0)
          }
          plotType = "Radar"
        }
        if (plotType == 'tiger' || plotType == 'fighter') {
          params = {
            name: plotType,
            isRadar: true,
            modelUrl: "./model/" + plotType + ".glb",
            scale: fun.size,
            ads: plotType == 'fighter' ? 5000 : false
          }
          plotType = "Radar"
        }
        if (plotType == 'Picture'){
          params = {
            name: plotType,
            imgUrl: "./static/img.png",
            scale: 5
          }
        }
        plotTool.plotDraw.active(plotType, params, function (data) {
          if (data == 1) {
            self.selFun = null;
            self.$emit("drawPlot", false);
          }
        })
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    changeFile(file) {
      const datas = this.importDatas;
      let entities = [];
      datas.forEach(data => {
        let position = Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.height)
        entities.push(viewer.entities.add({
          id: data.id,
          name: data.name,
          position: position,
          orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(data.angle - 90), Cesium.Math.toRadians(0),
              Cesium.Math.toRadians(0))),
          // Attach the 3D model instead of the green point.
          label: {
            // This callback updates the length to print each frame.
            text: data.name,
            font: "14px sans-serif",
            fillColor: Cesium.Color.fromCssColorString("#ff0"),
            outlineColor: Cesium.Color.RED,
            outlineWidth: 1,
            eyeOffset: new Cesium.Cartesian3(0, 200, 100),
            scaleByDistance: new Cesium.NearFarScalar(15000, 1.2, 5000, 1),
          },
          model: {
            uri: "./model/" + data.type + ".glb",
            scale: data.scale,
          },
        }))
      })
      viewer.flyTo(entities)
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  },
}
</script>

<style scoped lang="scss">
.demo-left_menu {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 50px;
  text-align: center;
  padding-top: 10px;

  .demo-nav_item {
    margin: 8px 2px;
    width: 80px;
  }

  .demo-menu_panel {
    position: absolute;
    left: 90px;
    z-index: 1;
    background: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 5px;
    top: 20px;
    width: 360px;
    text-align: left;

    .el-icon-close {
      font-size: 16px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }

    .demo-menu_item {
      margin: 10px;

      .demo-menu_plot {
        cursor: pointer;
        height: 16px;
        width: 16px;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }

}
</style>
