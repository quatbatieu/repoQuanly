import React, { useState, useRef, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import GraphTooltip from "./tooltipLine";
import * as sc from "./Chart.styled";
import { formatNumber } from "helper/common";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
);

export const LineChart = (props) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const [enter, setEnter] = useState(false);
  const { t: translation } = useTranslation()

  const chartRef = useRef(null);

  const customTooltip = useCallback((context) => {
    const chart = chartRef.current;
    const canvas = chart.canvas;

    if (canvas && enter) {
      setTooltipData(context.tooltip);
      // enable tooltip visibilty
      setTooltipVisible(true);

      // set position of tooltip
      const left = context.tooltip.x;
      const top = context.tooltip.y;

      // handle tooltip multiple rerender
      if (tooltipPos?.top != top) {
        setTooltipPos({ top: top, left: left });
      }
    }
  });

  if (!props.data) return <></>;
  const { data: chartData } = props;

  let currentMonth = new Date().getMonth() + 1;
  let currentYear = new Date().getFullYear();
  const labels = [`T${currentMonth}`];
  const labelsWithYear = {};
  labelsWithYear[`T${currentMonth}`] = currentYear;

  for (let i = 0; i < 11; i++) {
    if (currentMonth - 1 === 0) {
      currentMonth = 13;
      currentYear = currentYear - 1;
    }
    currentMonth = currentMonth - 1;
    labels.unshift(`T${currentMonth}`);
    labelsWithYear[`T${currentMonth}`] = currentYear;
  }
  const handleSumSMSSucc=(value)=>{
    let sum = []
    let sms= value.sms.data.map(item => item.sent.value)
    let zalo= value.zalo.data.map(item => item.sent.value)
    let email= value.email.data.map(item => item.sent.value)
    for(let i=0;i<sms.length;i++){
      let count=email[i] + sms[i] + zalo[i]
      sum.push(count)
    }
    return(sum)
  }

  const handleSumSMSFail=(value)=>{
    let sum = []
    let sms= value.sms.data.map(item => item.failed.value)
    let zalo= value.zalo.data.map(item => item.failed.value)
    let email= value.email.data.map(item => item.failed.value)
    for(let i=0;i<sms.length;i++){
      let count=email[i] + sms[i] + zalo[i]
      sum.push(count)
    }
    return(sum)
  }

  const data = {
    labels,
    datasets: [
      {
        label: translation('send-success'),
        axis: 'y',
        data: handleSumSMSSucc(chartData) ,
        backgroundColor: "#007BFF",
        borderColor: "#007BFF",
        borderRadius: 4,
        pointBackgroundColor: "white",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#007BFF",
        pointRadius: 7,
        pointHoverRadius: 7,
      },
      {
        label: translation('send-fail'),
        axis: 'y',
        data: handleSumSMSFail(chartData),
        backgroundColor: "#FF3D58",
        borderColor: "#FF3D58",
        borderRadius: 4,
        pointBackgroundColor: "white",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#FF3D58",
        pointRadius: 7,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    categoryPercentage: 0.4,
    maintainAspectRatio: false,
    // indexAxis: 'y',
    scales: {
      y: {
        grid: {
          display: true,
          borderDash: [4, 8],
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        align: "start",
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: "rectRounded",
        },
        title: {
          padding: 300,
        },
      },
      title: {
        display: true,
      },
      tooltip: {
        enabled: false,
        position: "nearest",
        external: customTooltip,
      },
    },
  };

  const onMouseOut = (e) => {
    e.preventDefault();
    setTooltipVisible(false);
    setEnter(false);
  };

  const onMouseOver = () => {
    setEnter(true);
  };

  return (
    <>
      <sc.LineChartContainer
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseOut}
      >
        <sc.Header>
          <span><b>{translation('charts')}</b></span>
        </sc.Header>

        <sc.LineChartContent>
          <Line
            options={{ ...options }}
            plugins={[
              {
                beforeInit: function (chart) {
                  // Get reference to the original fit function
                  const originalFit = chart.legend.fit;

                  // Override the fit function
                  chart.legend.fit = function fit() {
                    // Call original function and bind scope in order to use `this` correctly inside it
                    originalFit.bind(chart.legend)();
                    // Change the height as suggested in another answers
                    this.height += 35;
                  };
                },
                beforeDraw: function (c) {
                  const legends = c.legend.legendItems;
                  legends[0].fillStyle = "#007BFF";
                  legends[1].fillStyle = "#FF3D58";
                },
              },
            ]}
            data={data}
            ref={chartRef}
            style={{ maxWidth: "700px", width: "100%", minHeight: "500px", maxHeight: "700px" }}
          />
          {tooltipVisible && (
            <GraphTooltip
              labelsWithYear={labelsWithYear}
              labels={labels}
              apiData={chartData}
              data={tooltipData}
              position={tooltipPos}
              visibility={tooltipVisible}
            />
          )}
          <sc.RightContent>
            <div>
              <div className="flex-center">
                <sc.Circle bg={"#34AA44"} />
                <sc.LineStatisticTitle>
                  {translation('allExpense')}
                </sc.LineStatisticTitle>
              </div>
              <sc.LineStatisticValue>{formatNumber(chartData.sms.cost.value + chartData.email.cost.value)}</sc.LineStatisticValue>
              <sc.Divider />
            </div>

            {/* <div>
              <div className="flex-center">
                <sc.Circle bg={"#FFB63B"} />
                <sc.LineStatisticTitle>
                  Chi phí SMS
                </sc.LineStatisticTitle>
              </div>
              <sc.LineStatisticValue>{formatNumber(chartData.sms.cost.value)}</sc.LineStatisticValue>
            </div>

            <div className="mt-4">
              <div className="flex-center">
                <sc.Circle bg={"#BD8180"} />
                <sc.LineStatisticTitle>
                  Chi phí Email
                </sc.LineStatisticTitle>
              </div>
              <sc.LineStatisticValue>{formatNumber(chartData.email.cost.value)}</sc.LineStatisticValue>
            </div> */}
          </sc.RightContent>
        </sc.LineChartContent>
      </sc.LineChartContainer>
      <sc.MainDivider />
    </>
  );
};
