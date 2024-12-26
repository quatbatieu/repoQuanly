import React from "react";
import * as sc from "./Chart.styled";
import { useTranslation } from "react-i18next";
// tooltip.js
const GraphTooltip = ({ data, position, visibility, apiData, labels, labelsWithYear }) => {
  const { t: translation } = useTranslation()

  const left  = (() => {
    if(position?.left && data.xAlign === "right" && data.dataPoints.length === 1) {
      return position.left - 50;
    }

    if(position?.left && data.xAlign === "right") {
      return position.left + 25;
    }

    if(position?.left && data.xAlign === "left") {
      return position.left;
    }

    return 0;
  })();

  const index = labels.findIndex(item => item === data.title[0]) || 0;
  
  return (
    <sc.Container
      className={`bg-white drop-shadow  absolute px-4 py-3.5 rounded-lg transition-all duration-300 hover:!visible
      ${visibility ? "visible" : "invisible"}
        `}
      top={position?.top}
      left={left}
      axis={data.xAlign}
      visibility={visibility}
    >
      <sc.Content>
      {data && (
        <>
          <div>
            {data.dataPoints.map((val, i) => {
              return (
                <sc.Text key={`${val.dataset.label}: ${val.raw}`}>
                  {val.dataset.label}: <b>{val.raw}</b> {" "} - {" "}
                  <sc.UpDown type={i === 0 ? apiData[index].new.lastMonthValueDiff.type : apiData[index].returned.lastMonthValueDiff.type}>
                    {i === 0 ? apiData[index].new.lastMonthValueDiff.value : apiData[index].returned.lastMonthValueDiff.value.toFixed(2)}%
                  </sc.UpDown>
                </sc.Text>
              )
            })}
            <sc.Text>
              {translation('Summarize')} {Number(labels[index]?.replace("T", ""))}/{labelsWithYear[labels[index]]}
            </sc.Text>
          </div>
        </>
      )}
      </sc.Content>
    </sc.Container>
  );
};

export default GraphTooltip;
