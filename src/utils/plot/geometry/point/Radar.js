/**
 * Created by leedon1990s on 2020/12/26.
 * @desc 点要素
 */
import * as Cesium from "../../../../../public/Cesium/Cesium";
import Point from "./Point";
import "../../../radar/RadarScanMaterialProperty"
import RaderSolidScan from "../../../radar/RadarSolidScan"

class Radar extends Point {
    constructor(coordinates, point, params) {
        super(coordinates, point, params);
        let that = this;
        this.type = Radar;
        this.single = true;
        this.options = params || {};
        let name = params.name;
        let radarType = params.radarType;
        let radarColor = params.radarColor;
        this.speed = 5;
        this.ads = params.ads;
        let positionArr = [];
        this.radius = 5000
        this.entities = [
            new Cesium.Entity({
                name: name,
                position: new Cesium.CallbackProperty(function () {
                    return that.position;
                }),
                model: {
                    uri: params.modelUrl,
                    scale: params.scale
                },
                ellipse: radarType == 2 ? {
                    semiMajorAxis: this.radius,
                    semiMinorAxis: this.radius,
                    material: new Cesium.RadarScanMaterialProperty({
                        color: new Cesium.Color(radarColor.red, radarColor.green, radarColor.blue, 0.5),
                        speed: this.speed,
                    }),
                    height: 0,
                    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    outline: true,
                    outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
                } : null,
                ellipsoid: radarType == 3 ? {
                    radii: new Cesium.Cartesian3(this.radius, this.radius, this.radius),
                    material: new Cesium.Color(radarColor.red, radarColor.green, radarColor.blue, 0.1),
                    outline: false,
                    maximumCone: Cesium.Math.PI_OVER_TWO,
                } : null,
                wall: radarType == 3 ? {
                    positions: new Cesium.CallbackProperty(() => {
                        return Cesium.Cartesian3.fromDegreesArrayHeights(positionArr);
                    }, false),
                    material: new Cesium.Color(radarColor.red, radarColor.green, radarColor.blue, 0.2)
                } : null,
                plot: that,
            }),
        ];
        if (radarType == 3) {
            const viewer = params.viewer;
            let heading = 0;
            const that = this;
            viewer.clock.onTick.addEventListener(() => {
                heading += that.speed;
                positionArr = RaderSolidScan.prototype.calculatePane(that.points[0][0], that.points[0][1], that.radius, heading);
            })
        }
        if (point && point.length > 0) {
            that.setPoints(point);
        } else if (coordinates && coordinates.length > 0) {
            that.setCoordinates(coordinates);
        }
    }

    setCoordinates(coordinates) {
        if (this.ads) {
            coordinates[2] = this.ads
            this.position = Cesium.Cartesian3.fromDegreesArrayHeights(coordinates)[0];
        } else {
            this.position = Cesium.Cartesian3.fromDegreesArray(coordinates)[0];
        }
    }
}

export default Radar;
