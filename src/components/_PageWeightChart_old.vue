<script lang="ts">
import { use } from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";
import { ref, defineComponent } from "vue";

use([PieChart, CanvasRenderer, UniversalTransition]);

export default defineComponent({
  // A type helper for defining a Vue component with type inference
  name: "Chart",
  components: {
    VChart,
  },

  props: ["values", "width", "height", "color"],

  setup(props) {
    const option = ref({
      series: [
        {
          type: "pie",
          data: props.values,
        },
      ],
    });
    const init_options = ref({
      width: props.width,
      height: props.height,
    });

    return { option, init_options };
  },
});
</script>

<template>
  <div class="legend">Poids : images, scripts, document, fontes, styles, modules tierce partie</div>
  <v-chart class="chart" :option="option" :init-options="init_options" />
</template>

<style scoped>
.chart {
  height: 100vh;
}

.legend {
  font-size: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 200;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: black;
  margin-top:30px;
  margin-bottom: 5px;
}
</style>
