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
  const documentStyle = getComputedStyle(document.body);

  return {
    labels: ["images", "scripts", "document", "fontes", "styles", "modules tierce partie"],
    datasets: [
      {
        data: props.values,
        backgroundColor: [
          documentStyle.getPropertyValue("--cyan-500"),
          documentStyle.getPropertyValue("--orange-500"),
          documentStyle.getPropertyValue("--gray-500"),
          documentStyle.getPropertyValue("--purple-500"),
          documentStyle.getPropertyValue("--green-500"),
          documentStyle.getPropertyValue("--pink-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--cyan-400"),
          documentStyle.getPropertyValue("--orange-400"),
          documentStyle.getPropertyValue("--gray-400"),
          documentStyle.getPropertyValue("--purple-400"),
          documentStyle.getPropertyValue("--green-400"),
          documentStyle.getPropertyValue("--pink-400"),
        ],
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
        position:'bottom',
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
