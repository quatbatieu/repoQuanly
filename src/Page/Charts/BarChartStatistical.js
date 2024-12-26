import React, { useState, useRef, useCallback, useMemo, memo } from "react";
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
import { useTranslation } from 'react-i18next'
import { Bar } from "react-chartjs-2";
import moment from "moment";
import GraphTooltip from "./tooltip";
import * as sc from "./Chart.styled";
import Switcher from "../../assets/icons/switcher.png";

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
const BarChart = (props) => {
  const { t: translation } = useTranslation()
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(null);
  const [enter, setEnter] = useState(false);

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

  const { data: chartData } = props;

  const { data, labels, className } = useMemo(() => {
    let labels = chartData.map(item => moment(item.reportDay, 'DD/MM/YYYY').format('DD/MM'));

    return {
      labels,
      data: {
        labels,
        datasets: [
          {
            label: translation("statisticalAccreditation.successRegistration"),
            data: chartData.map(item => item.totalCustomerCheckingCompleted),
            backgroundColor: "#6DBEBF",
            stack: 'Stack 1',
          },
          {
            label: translation("statisticalAccreditation.failedRegistration"),
            data: chartData.map(item => item.totalCustomerCheckingFailed),
            backgroundColor: "#EC6E85",
            stack: 'Stack 1',
            // maxBarThickness: 18,
          },
          {
            label: translation("statisticalAccreditation.cancelRegistration"),
            data: chartData.map(item => item.totalCustomerCheckingCanceled),
            backgroundColor: "#CEA5EE",
            stack: 'Stack 1',
            // maxBarThickness: 18,
          },
        ],
      }
    }
  }, [chartData])

  const options = {
    responsive: true,
    categoryPercentage: 0.4,
    maintainAspectRatio: false,
    // barPercentage: 0.1,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        maxBarThickness: 1400
      }]
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
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
    barThickness: 14
  };

  const onMouseOut = (e) => {
    e.preventDefault();
    setTooltipVisible(false);
    setEnter(false);
  };

  const onMouseOver = () => {
    setEnter(true);
  };

  if (!props.data) return <></>;

  return (
    <>
      <sc.ChartContent style={{ width: "1400px", maxWidth: "1400px" , height : 500 }} >
        <Bar
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
            },
          ]}
          data={data}
          ref={chartRef}
          style={{ width: "100%", minHeight: "400px", minWidth: "100%", maxWidth: "100%" }}
        />
      </sc.ChartContent>
    </>
  );
};

export default memo(BarChart);