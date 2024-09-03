<script setup lang="ts">
import { ref, onMounted } from "vue";

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref();
const props = defineProps(["values"]);

const setChartData = () => {
  return {
    labels: ["media", "images", "scripts", "fontes", "autres", "styles", "document", "modules tiers"],
    datasets: [
      {
        data: props.values,
        // Couleurs codées dans \node_modules\@primevue\themes\aura\index.mjs
        backgroundColor: ["#06b6d4", "#f97316", "#6b7280", "#a855f7", "#22c55e", "#ec4899", "#eab308", "#3b82f6"],
        hoverBackgroundColor: ["#22d3ee", "#fb923c", "#9ca3af", "#c084fc", "#4ade80", "#f472b6", "#facc15", "#60a5fa"],
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--text-color");

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
        position: "bottom",
      },
    },
  };
};
</script>

<template>
  <div class="card flex justify-content-center">
    <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-30rem" />
  </div>
</template>
