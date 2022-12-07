import * as Cesium from "../../../public/Cesium/Cesium";
import "./RadarScanMaterialProperty"

class Radar {
    constructor(point, options) {
        let that = this;
        this.options = options || {};
        // 创建1/4圆形立体墙
        let positionArr = null;
        let viewer = options.viewer;
        // 半径
        let radius = options.radius;
        // 扫描扇形颜色
        let color = options.color;
        let id = options.id;
        const type = options.type ? options.type : 2;
        // 扫描速度
        let speed = options.speed;


        this.entities = [
            new Cesium.Entity({
                id: id,
                position: new Cesium.CallbackProperty(function() {
                    return Cesium.Cartesian3.fromDegrees(point[0], point[1]);
                }),
                name: "立体雷达扫描",
                ellipse: type == 2 ? {
                    semiMajorAxis: radius,
                    semiMinorAxis: radius,
                    material: new Cesium.RadarScanMaterialProperty({
                        color: new Cesium.Color(color.red, color.green, color.blue, 0.7),
                        speed: speed,
                    }),
                    height: 0,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    outline: true,
                    outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                } : null,
                ellipsoid: type == 3 ? {
                    radii: new Cesium.Cartesian3(radius, radius, radius),
                    material: new Cesium.Color(color.red, color.green, color.blue, 0.1),
                    outline: false,
                    maximumCone: Cesium.Math.PI_OVER_TWO,
                } : null,
                wall: type == 3 ? {
                    positions: new Cesium.CallbackProperty(() => {
                        return Cesium.Cartesian3.fromDegreesArrayHeights(positionArr);
                    }, false),
                    material: new Cesium.Color(color.red, color.green, color.blue, 0.2)
                } : null,
                plot:that
            }),
        ];
        let heading = 0;
        // 每一帧刷新时调用
        viewer.clock.onTick.addEventListener(() => {
            heading += speed;
            positionArr = that.calculatePane(point[0], point[1], radius, heading);
        })
    }

    // 计算平面扫描范围
    calculatePane(x1, y1, radius, heading) {
        let m = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(x1, y1));
        let rx = radius * Math.cos(heading * Math.PI / 180.0);
        let ry = radius * Math.sin(heading * Math.PI / 180.0);
        let translation = Cesium.Cartesian3.fromElements(rx, ry, 0);
        let d = Cesium.Matrix4.multiplyByPoint(m, translation, new Cesium.Cartesian3());
        let c = Cesium.Cartographic.fromCartesian(d);
        let x2 = Cesium.Math.toDegrees(c.longitude);
        let y2 = Cesium.Math.toDegrees(c.latitude);
        return this.calculateSector(x1, y1, x2, y2);
    }

    // 计算竖直扇形
    calculateSector(x1, y1, x2, y2) {
        let positionArr = [];
        positionArr.push(x1);
        positionArr.push(y1);
        positionArr.push(0);
        let radius = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(x1, y1), Cesium.Cartesian3.fromDegrees(x2, y2));
        // 扇形是1/4圆，因此角度设置为0-90
        for (let i = 0; i <= 90; i++) {
            let h = radius * Math.sin(i * Math.PI / 180.0);
            let r = Math.cos(i * Math.PI / 180.0);
            let x = (x2 - x1) * r + x1;
            let y = (y2 - y1) * r + y1;
            positionArr.push(x);
            positionArr.push(y);
            positionArr.push(h);
        }
        return positionArr;
    }
}

export default Radar;


