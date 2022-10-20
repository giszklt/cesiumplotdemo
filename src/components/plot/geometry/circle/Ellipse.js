/**
 * Created by FDD on 2017/5/22.
 * @desc 标绘画圆算法，继承面要素相关方法和属性
 */
import * as Cesium from "../../../../../public/Cesium/Cesium";
import { ELLIPSE } from "../../utils/PlotTypes";
import * as Constants from "../../Constants";
import * as PlotUtils from "../../utils/Utils";
class Ellipse {
  constructor(coordinates, points, params) {
    let that = this;
    this.type = ELLIPSE;
    this.fixPointCount = 2;
    this.options = params || {};
    // 动态绘制点 [[lng,lat],[lng,lat],...]
    this.points = [];
    // 动态绘制点 [Cartesian3,Cartesian3,...]
    this.positions = [];
    this.created = false;
    this.entities = [
      new Cesium.Entity({
        name: "plot-eclipse",
        polygon: {
          hierarchy: new Cesium.CallbackProperty(function() {
            return new Cesium.PolygonHierarchy(that.positions, []);
          }, false),
          material: new Cesium.ColorMaterialProperty(Cesium.Color.GOLD),
          clampToGround: true,
          classificationType: Cesium.ClassificationType.TERRAIN,
        },
      }),
      new Cesium.Entity({
        name: "plot-circle-outline",
        polyline: {
          show: true,
          positions: new Cesium.CallbackProperty(function() {
            return that.positions;
          }),
          material: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.SKYBLUE,
          }),
          depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
            color: Cesium.Color.SKYBLUE,
          }),
          width: 5,
          clampToGround: true,
        },
      }),
    ];
    if (points && points.length > 0) {
      this.setPoints(points);
    } else if (coordinates && coordinates.length > 0) {
      this.setCoordinates(coordinates);
    }
  }

  /**
   * 获取Entity
   */
  getEntities() {
    return this.entities;
  }

  /**
   * 获取标绘类型
   * @returns {*}
   */
  getPlotType() {
    return this.type;
  }

  generate() {
    let coordinates = this.points;
    this.setCoordinates(coordinates);
  }

  setCoordinates(coordinates) {
    if (this.getPointCount() < 2) {
      return false;
    } else {
      let [pnt1, pnt2] = [coordinates[0], coordinates[1]];
      let center = PlotUtils.Mid(pnt1, pnt2);
      let majorRadius = Math.abs((pnt1[0] - pnt2[0]) / 2);
      let minorRadius = Math.abs((pnt1[1] - pnt2[1]) / 2);
      let res = this.generatePoints(center, majorRadius, minorRadius);
      console.log(res);
      let points = res;
      let arr = [];
      for (let i = 0; i < points.length; i++) {
        arr = arr.concat(points[i]);
      }
      this.positions = Cesium.Cartesian3.fromDegreesArray(arr);
    }
  }

  /**
   * 对圆边线进行插值
   * @param center
   * @param majorRadius
   * @param minorRadius
   * @returns {*}
   */
  generatePoints(center, majorRadius, minorRadius) {
    let [x, y, angle, points] = [null, null, null, []];
    for (let i = 0; i <= Constants.FITTING_COUNT; i++) {
      angle = (Math.PI * 2 * i) / Constants.FITTING_COUNT;
      x = center[0] + majorRadius * Math.cos(angle);
      y = center[1] + minorRadius * Math.sin(angle);
      points.push([x, y]);
    }
    return points;
  }

  /**
   * 设置地图对象
   * @param map
   */
  setMap(map) {
    if (map && map instanceof Map) {
      this.map = map;
    } else {
      throw new Error("传入的不是地图对象！");
    }
  }

  /**
   * 获取当前地图对象
   * @returns {{}|*}
   */
  getMap() {
    return this.map;
  }

  /**
   * 判断是否是Plot
   * @returns {boolean}
   */
  isPlot() {
    return true;
  }

  /**
   * 设置坐标点
   * @param value
   */
  setPoints(value) {
    this.points = !value ? [] : value;
    if (this.points.length >= 1) {
      this.generate();
    }
  }

  /**
   * 获取坐标点
   * @returns {Array.<T>}
   */
  getPoints() {
    return this.points.slice(0);
  }

  /**
   * 获取点数量
   * @returns {Number}
   */
  getPointCount() {
    return this.points.length;
  }

  /**
   * 更新当前坐标
   * @param point
   * @param index
   */
  updatePoint(point, index) {
    if (index >= 0 && index < this.points.length) {
      this.points[index] = point;
      this.generate();
    }
  }

  /**
   * 更新最后一个坐标
   * @param point
   */
  updateLastPoint(point) {
    this.updatePoint(point, this.points.length - 1);
  }

  /**
   * 结束绘制
   */
  finishDrawing() {}
}

export default Ellipse;
