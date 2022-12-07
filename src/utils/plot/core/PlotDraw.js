/**
 * Created by leedon1990s on 2020/12/26.
 * @desc PlotDraw
 */
import * as Cesium from "../../../../public/Cesium/Cesium";

import { BASE_LAYERNAME } from "../Constants";
import { createDataSource } from "../utils/DataSourceUtil";
// eslint-disable-next-line no-unused-vars
import { getuuid, MathDistance, bindAll } from "../utils/Utils";
import * as Plots from "../geometry";
import * as PlotTypes from "../utils/PlotTypes";

class PlotDraw {
  constructor(viewer, params) {
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
    } else {
      throw new Error("传入的不是地图对象！");
    }
    this.options = params || {};
    /**
     * 交互点
     * @type {null}
     */
    this.points = null;
    /**
     * 当前标绘工具
     * @type {null}
     */
    this.plot = null;
    /**
     * 当前要素
     * @type {null}
     */
    this.feature = null;
    /**
     * 标绘类型
     * @type {null}
     */
    this.plotType = null;
    /**
     * 当前标绘参数
     * @type {null}
     */
    this.plotParams = null;
    /**
     * 当前地图视图
     * @type {Element}
     */
    this.handler = null;
    /**
     * 地图双击交互
     * @type {null}
     */
    this.dblClickZoomInteraction = null;

    /**
     * 第一次交互标记
     * @type {boolean}
     */
    this.first = true;

    /**
     * draw交互工具
     * @type {null}
     * @private
     */
    this.drawInteraction_ = null;

    /**
     * 创建图层名称
     * @type {string}
     */
    this.layerName =
      this.options && this.options["layerName"]
        ? this.options["layerName"]
        : BASE_LAYERNAME;

    /**
     * plot数据源
     * @type {null}
     * @private
     */
    this.plotDataSource = createDataSource(this.viewer, this.layerNamek, {
      create: true,
    });

    // this.viewer.dataSources.add(this.plotDataSource);
  }

  /**
   * 创建Plot
   * @param type
   * @param points
   * @param _params
   * @returns {*}
   */
  createPlot(type, points, _params) {
    let params = _params || {};
    switch (type) {
      case PlotTypes.TEXTAREA:
        return "TextArea";
      case PlotTypes.POINT:
        return new Plots.Point([], points, params);
      case PlotTypes.POLYLINE:
        return new Plots.Polyline([], points, params);
      case PlotTypes.CURVE:
        return new Plots.Curve([], points, params);
      case PlotTypes.ARC:
        return new Plots.Arc([], points, params);
      case PlotTypes.CIRCLE:
        return new Plots.Circle([], points, params);
      case PlotTypes.FREEHANDLINE:
        return new Plots.FreeHandLine([], points, params);
      case PlotTypes.RECTANGLE:
        return new Plots.RectAngle([], points, params);
      case PlotTypes.ELLIPSE:
        return new Plots.Ellipse([], points, params);
      case PlotTypes.LUNE:
        return new Plots.Lune([], points, params);
      case PlotTypes.SECTOR:
        return new Plots.Sector([], points, params);
      case PlotTypes.CLOSED_CURVE:
        return new Plots.ClosedCurve([], points, params);
      case PlotTypes.POLYGON:
        return new Plots.Polygon([], points, params);
      case PlotTypes.FREE_POLYGON:
        return new Plots.FreePolygon([], points, params);
      case PlotTypes.GATHERING_PLACE:
        return new Plots.GatheringPlace([], points, params);
      case PlotTypes.DOUBLE_ARROW:
        return new Plots.DoubleArrow([], points, params);
      case PlotTypes.STRAIGHT_ARROW:
        return new Plots.StraightArrow([], points, params);
      case PlotTypes.FINE_ARROW:
        return new Plots.FineArrow([], points, params);
      case PlotTypes.ATTACK_ARROW:
        return new Plots.AttackArrow([], points, params);
      case PlotTypes.ASSAULT_DIRECTION:
        return new Plots.AssaultDirection([], points, params);
      case PlotTypes.TAILED_ATTACK_ARROW:
        return new Plots.TailedAttackArrow([], points, params);
      case PlotTypes.SQUAD_COMBAT:
        return new Plots.SquadCombat([], points, params);
      case PlotTypes.TAILED_SQUAD_COMBAT:
        return new Plots.TailedSquadCombat([], points, params);
      case PlotTypes.RECTFLAG:
        return new Plots.RectFlag([], points, params);
      case PlotTypes.TRIANGLEFLAG:
        return new Plots.TriangleFlag([], points, params);
      case PlotTypes.CURVEFLAG:
        return new Plots.CurveFlag([], points, params);
      case PlotTypes.RADAR:
        return new Plots.Radar([], points, params);
      case PlotTypes.PICTURE:
        return new Plots.Picture([], points, params);
      /**
      case PlotTypes.PENNANT:
        return new Plots.Pennant([], points, params);
      */
    }
    return null;
  }

  /**
   * 激活工具
   * @param type
   * @param params
   */
  active(type, params = {}, fun) {
    let that = this;
    that.disActive();
    that.plotType = type;
    that.plotParams = params;
    if (!that.handler) {
      that.handler = new Cesium.ScreenSpaceEventHandler(
        that.viewer.scene.canvas
      );
    }
    // 左键单击事件：
    that.handler.setInputAction(function(e) {
      let position = that.viewer.camera.pickEllipsoid(
        e.position,
        that.viewer.scene.globe.ellipsoid
      );
      let cartographic = Cesium.Cartographic.fromCartesian(
        position,
        that.viewer.scene.globe.ellipsoid,
        new Cesium.Cartographic()
      );
      let lat = Cesium.Math.toDegrees(cartographic.latitude);
      let lng = Cesium.Math.toDegrees(cartographic.longitude);
      // first
      if (!that.plot) {
        that.plot = that.createPlot(type, that.points, params);
        let entities = that.plot.getEntities();
        entities.forEach((entity) => {
          that.plotDataSource.entities.add(entity);
        });
        that.points.push([lng, lat]);
        that.plot.setPoints(that.points);
        if (that.plot.getPlotType() === PlotTypes.POINT || that.plot.single) {
          that.handler.destroy();
          fun(1);
        }
      } else {
        if (!that.plot.freehand) {
          if (
            MathDistance([lng, lat], that.points[that.points.length - 1]) <
            0.0001
          ) {
            return false;
          }
        }
        that.points.push([lng, lat]);
        that.plot.setPoints(that.points);
        if (that.plot.fixPointCount === that.plot.getPointCount()) {
          that.handler.destroy();
          fun(1);
        }
        if (that.plot.freehand) {
          that.handler.destroy();
          fun(1);
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 左键按下事件
    // eslint-disable-next-line no-unused-vars
    that.handler.setInputAction(function(e) {},
    Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // 左键弹起事件
    // eslint-disable-next-line no-unused-vars
    that.handler.setInputAction(function(e) {},
    Cesium.ScreenSpaceEventType.LEFT_UP);

    // 左键双击事件：
    // eslint-disable-next-line no-unused-vars
    that.handler.setInputAction(function(e) {
      if (that.handler) {
        that.handler.destroy();
        fun(1);
        // that.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // 右键单击事件
    // eslint-disable-next-line no-unused-vars
    that.handler.setInputAction(function(e) {
      if (that.handler) {
        if (that.plot.points.length <that.plot.fixPointCount) {
          let entities = that.plot.getEntities();
          entities.forEach((entity) => {
            that.plotDataSource.entities.remove(entity);
          });
        }
        that.handler.destroy();
        fun(1);
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    // 右键按下事件
    // eslint-disable-next-line no-unused-vars
    that.handler.setInputAction(function(e) {},
    Cesium.ScreenSpaceEventType.RIGHT_DOWN);

    // 右键弹起事件
    // eslint-disable-next-line no-unused-vars
    that.handler.setInputAction(function(e) {},
    Cesium.ScreenSpaceEventType.RIGHT_UP);

    // 移动事件：
    this.handler.setInputAction(function(e) {
      if (that.plot) {
        let position = that.viewer.camera.pickEllipsoid(
          e.endPosition,
          that.viewer.scene.globe.ellipsoid
        );
        let cartographic = Cesium.Cartographic.fromCartesian(
          position,
          that.viewer.scene.globe.ellipsoid,
          new Cesium.Cartographic()
        );
        let lat = Cesium.Math.toDegrees(cartographic.latitude);
        let lng = Cesium.Math.toDegrees(cartographic.longitude);
        if (
          MathDistance([lng, lat], that.points[that.points.length - 1]) < 0.0001
        ) {
          return false;
        }
        if (!that.plot.freehand) {
          let pnts = that.points.concat([[lng, lat]]);
          that.plot.setPoints(pnts);
        } else {
          that.points.push([lng, lat]);
          that.plot.setPoints(that.points);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }




  /**
   * 取消激活状态
   */
  disActive() {
    if (this.handler) {
      this.handler.destroy();
    }

    this.points = [];
    this.plot = null;
    this.feature = null;
    this.plotType = null;
    this.plotParams = null;
    this.handler = null;
    this.activateMapTools();
  }

  /**
   * 激活交互工具
   */
  activeInteraction() {
    let that = this;
    if (!this.handler) {
      this.handler = new Cesium.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      );
    }
    // 左键单击事件：
    this.handler.setInputAction(function(e) {
      that.plot.setClickHandler(that, e);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 左键双击事件：
    this.handler.setInputAction(function(e) {
      that.plot.setDoubleClickHandler(that, e);
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    // 移动事件：
    this.handler.setInputAction(function(e) {
      that.plot.setMouseMoveHandler(that, e);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  /**
   * 激活已取消的地图工具
   * 还原之前状态
   */
  activateMapTools() {}

  /**
   * 取消激活地图交互工具
   */
  deactiveMapTools() {}
}

export default PlotDraw;
