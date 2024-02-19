<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();
const props = defineProps(["values"]);

const setChartData = () => {
  return {
    labels: store.Liste_dates_mesure.map((d: any) => d.date).reverse(), // x-axis = dates des mesures
    datasets: props.values,
  };
};
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
  const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
        position:'bottom',
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};
</script>

<template>
  <div class="card">
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem" :height="550" />
  </div>
</template>
