<template>
  <div class="hello">
    <div class="demo-title_panel">
      <span>标绘功能演示</span>
    </div>
    <left-menu ref="leftMenu" @drawPlot="noticeDrawPlot"></left-menu>
    <right-menu ref="rightMenu" @logicLayer="logicLayerCreated"></right-menu>
    <cesium-map ref="cesiumMap" v-show="mapShow" @ready="mapCreated"></cesium-map>
    <logic-map v-if="!mapShow"></logic-map>
  </div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";
import "../../public/Cesium/Widgets/widgets.css";
import CesiumPlot from "../utils/plot/index";
import * as Utils from "../utils/plot/utils/Utils";
import "../utils/plot/utils/PolylineTrailLinkMaterialProperty"
import * as PlotTypes from "@/utils/plot/utils/PlotTypes";
import {MathDistance} from "../utils/plot/utils/Utils";
import CesiumMap from "@/components/CesiumMap";
import LeftMenu from "@/components/LeftMenu";
import RightMenu from "@/components/RightMenu";
// eslint-disable-next-line no-unused-vars
import LogicMap from "@/components/LogicMap";


let viewer = null;
let plot = null;
export default {
  name: 'mapPlot',
  components: {RightMenu, LeftMenu, CesiumMap, LogicMap},
  props: {
    msg: String
  },
  //vue2写法
  data() {
    return {
      mapShow:true,
    }
  },
  mounted() {
    this.$nextTick(() => {
    })
  },
  methods: {
    mapCreated(e) {
      viewer = e;
      this.$refs.leftMenu.viewer = e;
      this.$refs.rightMenu.viewer = e;
    },
    logicLayerCreated(logicLayer){
      // console.log('逻辑视图打开：',logicLayer);
      this.mapShow = !logicLayer;
    },
    noticeDrawPlot(drawPlot){
      this.$refs.cesiumMap.isDraw = drawPlot
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.hello {
  height: 100%;
  width: 100%;

  .demo-title_panel {
    position: absolute;
    top: 0;
    height: 50px;
    width: 100%;
    z-index: 1;
    font-size: 28px;
    text-align: center;
    color: white;
    font-weight: 800;
  }
}

</style>
