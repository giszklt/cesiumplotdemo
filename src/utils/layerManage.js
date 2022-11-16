import * as Cesium from "../../public/Cesium/Cesium";
import {forEach} from "core-js/stable/dom-collections";

export default {
    layerSelect(viewer, id){
        let layer = null;
        switch (id) {
            case 102:
                layer = this.addTdtImageLayer(viewer);
                break;
            case 103:
                layer = this.addSingleLayer(viewer);
                break;
            case 201:
                layer = this.addOMSVectorLayer(viewer);
                break;
            case 202:
                layer = this.addTdtVectorLayer(viewer);
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
    addTdtImageLayer(viewer){
        let imgLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.WebMapTileServiceImageryProvider({
                url:"http://t0.tianditu.com/img_w/wmts?" +
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
        return [imgLayer, zhujiLayer];
    },
    //添加天地图矢量
    addTdtVectorLayer(viewer){
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
        return [vectorLayer, zhujiLayer];
    },
    //添加单张图片
    addSingleLayer(viewer){
        let singLayer = viewer.imageryLayers.addImageryProvider(
            new Cesium.SingleTileImageryProvider({
              url:"data/images/singleWorld.jpg",
            })
        );
        return [singLayer];
    },
    //添加OMS矢量地图
    addOMSVectorLayer(viewer){
        let omsVector = viewer.imageryLayers.addImageryProvider(
            new Cesium.UrlTemplateImageryProvider({
              url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
              subdomains: ["a", "b", "c", "d"],
            })
        );
        return [omsVector];
    },
}