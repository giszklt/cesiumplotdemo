<template>
  <div class="logicContainer">
    <div class="logicTitle">逻辑图</div>
    <svg class="logicTopo">
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3"
import dagreD3 from "dagre-d3"

export default {
  name: "LogicMap",
  data() {
    return {
      dataSet: {
        nodes: [
          {id: 0, label: "节点0", shape: "rect"},
          {id: 1, label: "节点1", shape: "rect"},
          {id: 2, label: "节点2", shape: "rect"},
          {id: 3, label: "节点3", shape: "rect"},
          {id: 4, label: "节点4", shape: "rect"},
          {id: 5, label: "节点5", shape: "rect"},
          {id: 6, label: "节点6", shape: "rect"},
          {id: 7, label: "节点7", shape: "rect"},
          {id: 8, label: "节点8", shape: "rect"},
          {id: 9, label: "节点9", shape: "rect"},
          {id: 10, label: "节点10", shape: "rect"},
          {id: 11, label: "节点11", shape: "rect"},
          {id: 12, label: "节点12", shape: "rect"},
          {id: 13, label: "节点13", shape: "rect"},
          {id: 14, label: "节点14", shape: "rect"},
          {id: 15, label: "节点15", shape: "rect"},
          {id: 16, label: "节点16", shape: "rect"},
          {id: 17, label: "节点17", shape: "rect"},
          {id: 18, label: "节点18", shape: "rect"},
        ],
        edges: [
          {source: 0, target: 1, label: ""},
          {source: 0, target: 5, label: "正常"},
          {source: 0, target: 3, label: "正常"},
          {source: 1, target: 2, label: ""},
          {source: 3, target: 4, label: "不正常"},
          {source: 4, target: 9, label: "不正常"},
          {source: 4, target: 10, label: "不正常"},
          {source: 2, target: 6, label: "正常"},
          {source: 2, target: 6, label: "正常"},
          {source: 2, target: 7, label: "正常"},
          {source: 2, target: 8, label: "正常"},
          {source: 7, target: 11, label: "正常"},
          {source: 7, target: 12, label: "正常"},
          {source: 7, target: 13, label: "正常"},
          {source: 12, target: 14, label: "正常"},
          {source: 14, target: 15, label: "正常"},
          {source: 15, target: 16, label: "正常"},
          {source: 16, target: 17, label: "正常"},
          {source: 16, target: 18, label: "正常"},
        ],
      },
      direction: "LR",
    }
  },
  mounted() {
    this.drawTopo();
  },
  methods: {
    drawTopo() {
      let g = new dagreD3.graphlib.Graph();
      g.setGraph({
        rankdir: this.direction,
        marginx: 50,
        marginy: 80
      });
      this.dataSet.nodes.forEach(item => {
        g.setNode(item.id, {
          label: item.label,
          shape: item.shape,
          style: "fill:#fff;stroke:#000"
        })
      });
      this.dataSet.edges.forEach(item => {
        g.setEdge(item.source, item.target, {
          // label:item.label,
          style: "fill:#fff;stroke:#333;stroke-width:1.5px"
        })
      });
      let render = new dagreD3.render();
      let svgGroup = d3.select('svg').append('g');
      render(svgGroup, g);
    },
  },
}
</script>

<style scoped lang="scss">
.logicContainer {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background: #0f4c81; //3e93ef
  //background: #c0c4cc;
  //background-image: url("../assets/backgroundPic/logicBackground.jpeg");
  //background-size: cover;
  //background-repeat: no-repeat;
  display: flex;

  .logicTitle {
    position: absolute;
    left: 48%;
    top: 100px;
    font-size: 24px;
    text-align: center;
    font-weight: 800;
  }

  .logicTopo {
    width: 68%;
    height: 78%;
    margin: 100px auto;
    background: #FFFFFF;
    border-radius: 10px;
  }
}

</style>