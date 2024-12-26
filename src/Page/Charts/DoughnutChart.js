import React from "react";

import { Chart, registerables } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import * as sc from "./Chart.styled";

Chart.register(...registerables);

export const DoughnutChart = (props) => {

  const data = {
    labels: [],
    datasets: [
      {
        label: "My First Dataset",
        data: [props.percent.count, 100 - props.percent.count],
        backgroundColor: [props.percent.type ? "#00877C" : "#FF3D58", "#2E5BFF"],
        hoverOffset: 4,
        cutout: "80%"
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      plugins: {
        lengend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  };

  return (
    <sc.DoughnutContainer style={{ maxWidth: "140px" }}>
      <sc.Percent type={props.percent.type}>{props.percent.count} <span>%</span></sc.Percent>
      <Doughnut
        data={data}
        config={config}
      />
    </sc.DoughnutContainer>
  );
};
