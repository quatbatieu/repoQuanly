import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: true,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
    tooltip: {
      enabled: false,
      position: 'nearest',
    }

  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: [3, 2, 13, 4, 1, 6, 8],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const VerticalBarChart = () => {
  return <Bar options={options} data={data} />;
};
