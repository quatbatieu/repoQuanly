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
import { Bar } from "react-chartjs-2";
import moment from "moment";
import GraphTooltip from "./tooltip";
import * as sc from "./Chart.styled";
import Switcher from "../../assets/icons/switcher.png";
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

const BarChart = (props) => {
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

  const { data: chartData } = props;

  const { data, labels, labelsWithYear } = useMemo(() => {
    let currentMonth
    let labels = []
    let labelsWithYear = {}
    for (let month of chartData) {
      currentMonth = moment(month.id, 'YYYY/MM')
      labels.push(`T${currentMonth.format('MM')}`)
      labelsWithYear[`T${currentMonth.format('MM')}`] = currentMonth.format('YYYY')
    }
    return {
      labels,
      labelsWithYear,
      data: {
        labels,
        datasets: [
          {
            label: translation('new-customers'),
            data: chartData.map(item => item.new.value),
            backgroundColor: "#A23FC3",
            borderRadius: 4,
            // maxBarThickness: 18,
          },
          {
            label: translation('back-customers'),
            data: chartData.map(item => item.returned.value),
            backgroundColor: "#00877C",
            borderRadius: 4,
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

  if (!props.data) return <></>;

  return (
    <>

      <sc.ChartContainer onMouseOver={onMouseOver} onMouseLeave={onMouseOut}>
        <sc.Header>
          <span><b>{translation('charts')}</b></span>
        </sc.Header>

        <sc.ChartContent>
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
        </sc.ChartContent>
      </sc.ChartContainer>

      <sc.MainDivider />
    </>
  );
};

export default memo(BarChart);