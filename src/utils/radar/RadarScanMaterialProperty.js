/*
 * @Description: 雷达扫描效果（参考开源代码）
 * @Version: 1.0
 * @Author: Julian
 * @Date: 2022-03-04 20:02:48
 * @LastEditors: Julian
 * @LastEditTime: 2022-03-05 15:26:47
 */
import * as Cesium from "../../../public/Cesium/Cesium";

class RadarScanMaterialProperty {
    constructor(options) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._speed = undefined;
        this.color = options.color;
        this.speed = options.speed;
    };

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return Cesium.Material.RadarScanMaterialType;
    }

    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
        result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
        return result
    }

    equals(other) {
        return (this === other ||
            (other instanceof RadarScanMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(RadarScanMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed')
})

Cesium.RadarScanMaterialProperty = RadarScanMaterialProperty;
Cesium.Material.RadarScanMaterialProperty = 'RadarScanMaterialProperty';
Cesium.Material.RadarScanMaterialType = 'RadarScanMaterialType';
Cesium.Material.RadarScanMaterialSource =
    `
    uniform vec4 color;
    uniform float speed;

    #define PI 3.14159265359

    czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec2 scrPt = st * 2.0 - 1.0;
    float time = czm_frameNumber * speed / 1000.0 ;
    vec3 col = vec3(0.0);
    mat2 rot;
    float theta = -time * 1.0 * PI - 2.2;
    float cosTheta, sinTheta;
    cosTheta = cos(theta);
    sinTheta = sin(theta);
    rot[0][0] = cosTheta;
    rot[0][1] = -sinTheta;
    rot[1][0] = sinTheta;
    rot[1][1] = cosTheta;
    vec2 scrPtRot = rot * scrPt;
    float angle = 1.0 - (atan(scrPtRot.y, scrPtRot.x) / 6.2831 + 0.5);
    float falloff = length(scrPtRot);
    material.alpha = pow(length(col + vec3(.5)),5.0);
    material.diffuse =  (0.5 +  pow(angle, 2.0) * falloff ) *   color.rgb    ;
    return material;
    }

     `

Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarScanMaterialType, {
    fabric: {
        type: Cesium.Material.RadarScanMaterialType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
            speed: 10.0
        },
        source: Cesium.Material.RadarScanMaterialSource
    },
    translucent: function(material) {
        return true;
    }
})
