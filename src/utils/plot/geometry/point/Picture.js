/**
 * Created by leedon1990s on 2020/12/26.
 * @desc 点要素
 */
import * as Cesium from "../../../../../public/Cesium/Cesium";
import Point from "./Point";

class Picture extends Point {
    constructor(coordinates, point, params) {
        super(coordinates, point, params);
        let that = this;
        this.type = Picture;
        this.single = true;
        this.options = params || {};
        let name = params.name;
        this.entities = [
            new Cesium.Entity({
                name: name,
                position: new Cesium.CallbackProperty(function () {
                    return that.position;
                }),
                billboard: {
                    image: params.imgUrl, // default: undefined
                    show:  Cesium.Math.PI_OVER_FOUR, // default
                    pixelOffset: new Cesium.Cartesian2(0, 0), // default: (0, 0)
                    eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
                    verticalOrigin: Cesium.VerticalOrigin.CENTER, // default: CENTER
                    scale:  params.scale ? params.scale : 1, // default: 1.0
                    color: params.color ? params.color : Cesium.Color.WHITE, // default: WHITE
                    rotation: params.rotation ? Cesium.Math.toRadians(params.rotation) : 0, // default: 0.0
                    alignedAxis: Cesium.Cartesian3.ZERO, // default
                    width: params.width ? params.width : undefined, // default: undefined
                    height: params.height ? params.height : undefined, // default: undefined
                },
                plot: that,
            }),
        ];
        if (point && point.length > 0) {
            that.setPoints(point);
        } else if (coordinates && coordinates.length > 0) {
            that.setCoordinates(coordinates);
        }
    }
}

export default Picture;
