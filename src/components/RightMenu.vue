<template>
  <div class="demo-right_menu">
    <el-dropdown size="small" trigger="click">
      <el-tooltip content="视图切换" placement="bottom">
        <el-button circle size="small" @click="perspectiveShow = false; layerManagerShow=false;">
          <div class="demo-right_menuItem"
               v-bind:style="{backgroundImage: 'url(' + views[viewIndex].url + ')'}"></div>
        </el-button>
      </el-tooltip>
      <el-dropdown-menu slot="dropdown" :hide-on-click="false">
        <el-dropdown-item v-for="(view, index) in views" :key="index">
          <el-tooltip :content="view.name" placement="left">
            <el-button circle size="small" :type="viewIndex == index ? 'primary' : ''"
                       @click="switchView(index)">
              <div class="demo-right_layerItem" :style="{backgroundImage: 'url(' + view.url + ')'}"></div>
            </el-button>
          </el-tooltip>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tooltip content="视角切换" placement="bottom" v-show="viewIndex == 0">
      <el-button circle size="small" class="demo-right_menuBtn" @click="perspectiveShow = !perspectiveShow; layerManagerShow=false;"
                 :type="perspectiveShow ? 'primary' : ''">
        <div class="demo-right_menuItem"
             v-bind:style="{backgroundImage: 'url(' + require('../assets/icon/perspective.svg') + ')'}"></div>
      </el-button>
    </el-tooltip>
    <el-tooltip content="图层管理" placement="bottom">
      <el-button circle size="small" class="demo-right_menuBtn" @click="layerManagerShow = !layerManagerShow; perspectiveShow=false;"
                 :type="layerManagerShow ? 'primary' : ''">
        <div class="demo-right_menuItem"
             v-bind:style="{backgroundImage: 'url(' + require('../assets/icon/layermanager.svg') + ')'}"></div>
      </el-button>
    </el-tooltip>
    <transition name="el-zoom-in-top" size="mini">
        <div class="demo-perspective_panel" v-show="perspectiveShow || layerManagerShow">
          <i class="el-icon-close" @click="closePanle"></i>
          <div v-show="perspectiveShow">
            <el-radio-group v-model="selPerspective" size="mini" @change="changePerspective">
              <el-radio-button v-for="(perspective, index) in perspectives" :label="perspective"></el-radio-button>
            </el-radio-group>
            <div class="demo-perspective_inputPanle" v-show="selPerspective != '太空' && selPerspective">
              <el-form :model="perspectiveForm" status-icon :rules="rules" label-width="40px" size="mini" ref="perform">
                <el-form-item label="经度" prop="inputLon">
                  <el-input v-model="perspectiveForm.inputLon" placeholder="请输入经度" class="demo-perspective_input">
                    <template slot="append">°</template>
                  </el-input>
                </el-form-item>

                <el-form-item label="纬度" prop="inputLat">

                  <el-input v-model="perspectiveForm.inputLat" placeholder="请输入纬度" class="demo-perspective_input">
                    <template slot="append">°</template>
                  </el-input>

                </el-form-item>

                <el-form-item label="高度" prop="inputHeight" v-if="selPerspective == '参照物'">
                  <el-input v-model="perspectiveForm.inputHeight" size="mini" placeholder="请输入高度"
                            class="demo-perspective_input">
                    <template slot="append">m</template>
                  </el-input>
                </el-form-item>

                <el-button size="mini" @click="changePerspective" style="margin-top: 5px">确认</el-button>
              </el-form>
            </div>
          </div>
          <div class="demo-layerManage_tree" v-show="layerManagerShow">
            <el-tree
                :data="layerDisplayData"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="layerDisplayTree"
                highlight-current
                :props="layerTreeDefaultProps"
                :default-checked-keys="[101]"
                @check="layerChange">
            </el-tree>
          </div>
        </div>
    </transition>
  </div>
</template>

<script>
import * as Cesium from "../../public/Cesium/Cesium";
import {isObject} from "@/utils/plot/utils/Utils";
import mapLayerManage from "@/utils/layerManage.js"

export default {
  name: "RightMenu",
  data() {
    //field
    let checkLon = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入经度'));
      }
      value = Number(value);
      if (isNaN(value)) {
        callback(new Error('请输入正确的经度格式'));
      } else {
        if (value > 180 || value < -180) {
          callback(new Error('请输入正确的经度范围'));
        } else {
          callback();
        }
      }
    };
    let checkLat = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入纬度'));
      }
      value = Number(value);
      if (isNaN(value)) {
        callback(new Error('请输入正确的纬度格式'));
      } else {
        if (value > 90 || value < -90) {
          callback(new Error('请输入正确的纬度范围'));
        } else {
          callback();
        }
      }
    };
    let checkHeight = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入高度'));
      }
      value = Number(value);
      if (isNaN(value)) {
        callback(new Error('请输入正确的高度格式'));
      } else {
        if (value < 0) {
          callback(new Error('请输入正确的高度范围'));
        } else {
          callback();
        }
      }
    };
    return {
      viewer: null,
      layerManagerShow: false,
      views: [{
        name: "三维视图",
        type: "3d",
        url: require('../assets/icon/3Dearth.svg')
      }, {
        name: "二维视图",
        type: "2d",
        url: require('../assets/icon/2Dearth.svg')
      }, {
        name: "逻辑视图",
        type: "logic",
        url: require('../assets/icon/logic.svg')
      }],
      viewIndex: 0,
      perspectiveShow: false,
      selPerspective: null,
      perspectives: ["地面", "参照物", "太空"],
      perspectiveForm: {
        inputLon: null,
        inputLat: null,
        inputHeight: null,
      },
      rules: {
        inputLon: [
          {validator: checkLon, trigger: 'blur'}
        ],
        inputLat: [
          {validator: checkLat, trigger: 'blur'}
        ],
        inputHeight: [
          {validator: checkHeight, trigger: 'blur'}
        ]
      },
      layerDisplayData:[{
        id: 1,
        label: '影像图',
        children: [{
          id: 101,
          label: '基础图层',
          disabled:true
        }, {
          id: 102,
          label: '影像图层1',
        }, {
          id: 103,
          label: '影像图层2',
        }]
      }, {
        id: 2,
        label: '矢量图',
        children: [{
          id: 201,
          label: '矢量图层1',
        }, {
          id: 202,
          label: '矢量图层2',
        }]
      }, {
        id: 3,
        label: '逻辑图',
        // children: [{
        //   id: 301,
        //   label: '逻辑图1'
        // }, {
        //   id: 302,
        //   label: '逻辑图2'
        // }]
      }],
      layerTreeDefaultProps: {
        children: 'children',
        label: 'label'
      },
      layerObj : {
        101:null,
        102:null,
        103:null,
        201:null,
        202:null
      },
      zhujiLayer:null,
    }
  },
  methods: {
    switchView(index) {
      this.viewIndex = index;
      if (index == 0) {
        this.viewer.scene.morphTo3D(0)
      } else {
        this.perspectiveShow = false;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = true
        this.viewer.scene.screenSpaceCameraController.enableZoom = true
        this.viewer.scene.morphTo2D(0);
      }
    },
    closePanle() {
      this.perspectiveShow = false;
      this.layerManagerShow = false;
    },
    changePerspective(e) {
      let option = null;
      if (isObject(e)) {
        this.$refs.perform.validate((valid) => {
          if (valid) {
            option = true;
            return true;
          } else {
            return false;
          }
        });
        if (!option)
          return;
        if (this.selPerspective == '参照物') {
          option = {
            destination: Cesium.Cartesian3.fromDegrees(Number(this.perspectiveForm.inputLon), Number(this.perspectiveForm.inputLat), Number(this.perspectiveForm.inputHeight)),
            orientation: {
              heading: 0.34,
              pitch: -0.3,
              roll: 0
            },
            duration: 2
          }
        }
        if (this.selPerspective == '地面') {
          option = {
            destination: Cesium.Cartesian3.fromDegrees(Number(this.perspectiveForm.inputLon), Number(this.perspectiveForm.inputLat), 1),
            orientation: {
              heading: 0.34,
              pitch: 0,
              roll: 0
            },
            duration: 2
          }
        }
      }
      if (e == '太空') {
        option = {
          destination: Cesium.Cartesian3.fromDegrees(28, 56, 200000000),
          orientation: {
            heading: 7,
            pitch: 5,
            roll: 5
          },
          duration: 2
        }
      }
      if (option) {
        // this.viewer.scene.screenSpaceCameraController.enableTranslate = false
        //
        // this.viewer.scene.screenSpaceCameraController.enableTilt = false;
        this.viewer.scene.screenSpaceCameraController.enableZoom = false
        this.viewer.camera.flyTo(option)
      }
    },
    layerChange(nodeObj,status){
      // console.log("obj:",nodeObj,"status:",status);
      const currentKey = nodeObj.id;
      const checkedKeys = status.checkedKeys;
      if (checkedKeys.includes(currentKey)) {
        const tempLayer = mapLayerManage.layerSelect(this.viewer,currentKey);
        if (tempLayer) this.layerObj[currentKey] = tempLayer;
      } else {
        mapLayerManage.deleteLayer(this.viewer,this.layerObj[currentKey]);
      }
      if (currentKey === 1 || currentKey === 2) {
        const layerObjKeys = Object.keys(this.layerObj);
        const usedKeys = layerObjKeys.filter( ele => {return currentKey === 1 ? ele.startsWith('1') : ele.startsWith('2')});
        if (checkedKeys.includes(currentKey)) {
          usedKeys.forEach(item => {
            this.layerObj[item] = mapLayerManage.layerSelect(this.viewer,Number(item));
          });
        } else {
          usedKeys.forEach(item => {
            mapLayerManage.deleteLayer(this.viewer,this.layerObj[item]);
          });
        }
      }
      if (currentKey === 3) {
        if (checkedKeys.includes(currentKey)){
          this.$emit("logicLayer", true);
        } else {
          this.$emit("logicLayer", false);
        }

      }
    },

  },
  watch: {
    viewer() {
      if (this.viewIndex == 0) {
        this.viewer.scene.morphTo3D(0);
      } else {
        this.viewer.scene.morphTo2D(0);
      }
    }
  }
}
</script>

<style scoped lang="scss">
.demo-right_menu {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0);
  padding: 10px;
  text-align: left;

  button:hover {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
  }

  .demo-right_menuItem {
    cursor: pointer;
    height: 24px;
    width: 24px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .demo-right_menuBtn {
    margin-left: 7px;
  }

  .demo-perspective_panel {
    position: absolute;
    right: 10px;
    z-index: 1;
    background: rgba(255, 255, 255, 0.8);
    padding: 20px;
    border-radius: 5px;
    top: 70px;
    width: 250px;
    text-align: center;

    .demo-perspective_inputPanle {
      width: 180px;
      margin: 5px auto;

      .el-form-item {
        margin-bottom: 12px !important;
      }

      ::v-deep(.el-form-item__label) {
        line-height: 38px;
      }

      .demo-perspective_input {
        margin: 5px 0;

        ::v-deep(.el-input-group__append) {
          padding: 0 10px;
          width: 32px;
        }
      }
    }

    .el-icon-close {
      font-size: 16px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
    .demo-layerManage_tree{
      margin: 6px;
      .el-tree{
        border-radius: 5px;
      }
    }
  }

}

.el-dropdown-menu {
  border: none;
  background: rgba(0, 0, 0, 0);

  .el-dropdown-menu__item {
    padding: 2px 0;

    &:focus, &:not(.is-disabled):hover {
      background-color: rgba(0, 0, 0, 0);
    }

    .el-button {
      &:hover {
        background: #409eff;
      }

      .demo-right_layerItem {
        cursor: pointer;
        height: 24px;
        width: 24px;
        background-repeat: no-repeat;
        background-size: cover;
      }
    }


  }
}

.el-popper[x-placement^=bottom] {
  margin-top: 6px;
  box-shadow: none;
}

.el-dropdown-menu--small {
  padding: 0;
}
</style>
