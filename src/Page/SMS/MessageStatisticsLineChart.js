import React from "react";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

const ChartContainer = styled.div`
	width: 100%;
	min-width: 1392px;
	overflow-x: auto;
`;

const MessageStatisticsLineChart = ({ chartData }) => {
  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <ChartContainer>
        <Line
          data={data}
          options={options}
          width={null}
          height={350}
        />
      </ChartContainer>
    </div>
  );
};

export default MessageStatisticsLineChart;
