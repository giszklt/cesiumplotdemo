import * as Cesium from "../../public/Cesium/Cesium";
import allMunicipality from "@/assets/vectorData/allMunicipality.json"

export default {
    layerSelect(viewer, id) {
        let layer = null;
        switch (id) {
            case 102:
                layer = this.addTdtImageLayer(viewer);
                break;
            case 103:
                layer = this.addSingleLayer(viewer);
                break;
            case 104:
                layer = this.addAdministrationLayer1(viewer);
                break;
            case 201:
                layer = this.addOMSVectorLayer(viewer);
                break;
            case 202:
                layer = this.addTdtVectorLayer(viewer);
                break;
            case 203:
                layer = this.addMunicipalityvector(viewer);
                break;
        }
        return layer;
    },
    //删除图层
    deleteLayer(viewer, layer) {
        if (Array.isArray(layer)) {
            layer.forEach(ele => {
                viewer.imageryLayers.remove(ele);
            });
        }
    },
    //添加天地图影像
    addTdtImageLayer(viewer) {
        let imgLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.com/img_w/wmts?" +
                    "service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}" +
                    "&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=f2a5db5c57925eef4ef35103984dad2e",
                layer: "tdtImgLayer",
                style: "default",
                tileMatrixSetID: "GoogleMapsCompatible",
                format: "image/jpeg",
                maximumLevel: 18,
            })
        );
        let zhujiLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.gov.cn/cva_w/wmts?tk=f2a5db5c57925eef4ef35103984dad2e",
                layer: "cva",
                style: "default",
                tileMatrixSetID: "w",
                format: "tiles",
                maximumLevel: 18,
            })
        );
        imgLayer.show = false;
        zhujiLayer.show = false;
        return [imgLayer, zhujiLayer];
    },
    //添加天地图矢量
    addTdtVectorLayer(viewer) {
        let vectorLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.gov.cn/vec_w/wmts?tk=f2a5db5c57925eef4ef35103984dad2e",
                layer: "vec",
                style: "default",
                tileMatrixSetID: "w",
                format: "tiles",
                maximumLevel: 18,
            })
        );
        let zhujiLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url: "http://t0.tianditu.gov.cn/cva_w/wmts?tk=f2a5db5c57925eef4ef35103984dad2e",
                layer: "cva",
                style: "default",
                tileMatrixSetID: "w",
                format: "tiles",
                maximumLevel: 18,
            })
        );
        vectorLayer.show = false;
        zhujiLayer.show = false;
        return [vectorLayer, zhujiLayer];
    },
    //添加单张图片
    addSingleLayer(viewer) {
        let singLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
                url: "data/images/singleWorld.jpg",
            })
        );
        singLayer.show = false;
        return [singLayer];
    },
    //添加行政区划图
    addAdministrationLayer1(viewer) {
        const west = 68.96;
        const south = 16.93;
        const east = 143.81;
        const north = 53.64;
        let administrationLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
                url: "data/images/1100w.jpg",
                rectangle:Cesium.Rectangle.fromDegrees(west, south, east, north)
            })
        );
        administrationLayer.show = false;
        return [administrationLayer];
    },
    //添加OMS矢量地图
    addOMSVectorLayer(viewer) {
        let omsVector = viewer.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
                url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                subdomains: ["a", "b", "c", "d"],
            })
        );
        omsVector.show = false;
        return [omsVector];
    },
    //添加自有矢量/市边界
    addMunicipalityvector(viewer,isShow=false) {
        let polygons = allMunicipality.features;
        let polygonsInstances = [];
        polygons.forEach(item => {
            let positions = item.geometry.rings[0];
            // positions.pop();
            positions = Cesium.Cartesian3.fromDegreesArray(this.arrayFlatten(positions));
            polygonsInstances.push(new Cesium.GeometryInstance({
                geometry: new Cesium.PolygonOutlineGeometry({
                    polygonHierarchy: new Cesium.PolygonHierarchy(positions),
                    vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEXT_FORMAT,
                    width: 50.0,
                    height: 10,
                }),
            }))
        })
        const primitive = viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: polygonsInstances,
            appearance: new Cesium.MaterialAppearance({
                material: Cesium.Material.fromType('Color', {
                    color: new Cesium.Color(1.0, 0.0, 0.0, 1),
                })
            }),
            show:isShow,
        }));
        return primitive
    },
    arrayFlatten(array) {
        while (array.some((item) => Array.isArray(item))) {
            array = [].concat(...array);
        }
        return array;
    }
}
