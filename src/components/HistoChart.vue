<script lang="ts">
import { use } from "echarts/core";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { GridComponent,LegendComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import VChart from "vue-echarts";
import { ref, defineComponent } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

use([GridComponent, LegendComponent,LineChart, CanvasRenderer, UniversalTransition]);

export default defineComponent({
  // A type helper for defining a Vue component with type inference
  name: "Chart",
  components: {
    VChart,
  },

  props: ["values", "width", "height"],

  setup(props) {
    const date_x_axis = store.Liste_dates_mesure.map((d: any) => d.date).reverse();

    const option = ref({
      legend: {
    // Try 'horizontal'
    type: 'scroll',
    orient: 'horizontal',
    right: 10,
    top: 0,
    
  },
      grid: {
        left: 50,
        bottom: 20,
        right: 70,
        top:50,

      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: date_x_axis,
      },
      yAxis: {
        type: "value",
        position: "left",
        min: "dataMin",
        max: 400,
      },

      series: props.values,
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
  <v-chart class="chart" :option="option" :init-options="init_options" />
</template>

<style scoped>
.chart {
  height: 100vh;
}
</style>
